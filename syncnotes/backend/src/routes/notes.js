const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

const getAllNotes = (req, res) => {
  try {
    const notes = db.all(`
      SELECT id, title, content, createdAt, updatedAt, version
      FROM notes
      WHERE isDeleted = 0
      ORDER BY updatedAt DESC
    `);

    res.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

const getNoteById = (req, res) => {
  try {
    const { id } = req.params;

    const note = db.get(`
      SELECT id, title, content, createdAt, updatedAt, version
      FROM notes
      WHERE id = ? AND isDeleted = 0
    `, [id]);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

const createNote = (req, res) => {
  try {
    const { title = '', content = '' } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    db.run(`
      INSERT INTO notes (id, title, content, createdAt, updatedAt, version)
      VALUES (?, ?, ?, ?, ?, 1)
    `, [id, title, content, now, now]);

    const note = db.get(`
      SELECT id, title, content, createdAt, updatedAt, version
      FROM notes
      WHERE id = ?
    `, [id]);

    req.app.get('io')?.emit('note:created', note);

    res.status(201).json({ note });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

const updateNote = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const existing = db.get(`
      SELECT id, version FROM notes WHERE id = ? AND isDeleted = 0
    `, [id]);

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const now = new Date().toISOString();

    if (title !== undefined) {
      db.run(`
        UPDATE notes SET title = ?, updatedAt = ?, version = version + 1
        WHERE id = ?
      `, [title, now, id]);
    }

    if (content !== undefined) {
      db.run(`
        UPDATE notes SET content = ?, updatedAt = ?, version = version + 1
        WHERE id = ?
      `, [content, now, id]);
    }

    const note = db.get(`
      SELECT id, title, content, createdAt, updatedAt, version
      FROM notes
      WHERE id = ?
    `, [id]);

    req.app.get('io')?.emit('note:updated', note);

    res.json({ note });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

const deleteNote = (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.get(`
      SELECT id FROM notes WHERE id = ? AND isDeleted = 0
    `, [id]);

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    db.run(`
      UPDATE notes SET isDeleted = 1, updatedAt = ?
      WHERE id = ?
    `, [new Date().toISOString(), id]);

    req.app.get('io')?.emit('note:deleted', { id });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

const getSyncStatus = (req, res) => {
  try {
    const lastNote = db.get(`
      SELECT updatedAt FROM notes ORDER BY updatedAt DESC LIMIT 1
    `);

    const noteCount = db.get(`
      SELECT COUNT(*) as count FROM notes WHERE isDeleted = 0
    `);

    res.json({
      lastSync: lastNote?.updatedAt || null,
      noteCount: noteCount?.count || 0
    });
  } catch (error) {
    console.error('Error getting sync status:', error);
    res.status(500).json({ error: 'Failed to get sync status' });
  }
};

const pullChanges = (req, res) => {
  try {
    const { since } = req.body;

    let notes;
    if (since) {
      notes = db.all(`
        SELECT id, title, content, createdAt, updatedAt, version
        FROM notes
        WHERE updatedAt > ?
        ORDER BY updatedAt DESC
      `, [since]);
    } else {
      notes = db.all(`
        SELECT id, title, content, createdAt, updatedAt, version
        FROM notes
        WHERE isDeleted = 0
        ORDER BY updatedAt DESC
      `);
    }

    const deletedIds = db.all(`
      SELECT id FROM notes WHERE isDeleted = 1 AND updatedAt > ?
    `, [since || '']).map(row => row.id);

    res.json({ notes, deletedIds });
  } catch (error) {
    console.error('Error pulling changes:', error);
    res.status(500).json({ error: 'Failed to pull changes' });
  }
};

const pushChanges = (req, res) => {
  try {
    const { notes: clientNotes = [], deletedIds: clientDeletedIds = [] } = req.body;
    const conflicts = [];
    const now = new Date().toISOString();

    for (const clientNote of clientNotes) {
      const serverNote = db.get(`
        SELECT * FROM notes WHERE id = ?
      `, [clientNote.id]);

      if (serverNote) {
        if (clientNote.version > serverNote.version) {
          db.run(`
            UPDATE notes
            SET title = ?, content = ?, updatedAt = ?, version = ?
            WHERE id = ?
          `, [
            clientNote.title,
            clientNote.content,
            now,
            clientNote.version,
            clientNote.id
          ]);
        } else if (clientNote.version < serverNote.version) {
          conflicts.push(serverNote);
        }
      } else {
        db.run(`
          INSERT INTO notes (id, title, content, createdAt, updatedAt, version, isDeleted)
          VALUES (?, ?, ?, ?, ?, ?, 0)
        `, [
          clientNote.id,
          clientNote.title,
          clientNote.content,
          clientNote.createdAt,
          now,
          clientNote.version
        ]);
      }
    }

    for (const id of clientDeletedIds) {
      db.run(`
        UPDATE notes SET isDeleted = 1, updatedAt = ? WHERE id = ?
      `, [now, id]);
    }

    req.app.get('io')?.emit('sync:complete');

    res.json({ success: true, conflicts });
  } catch (error) {
    console.error('Error pushing changes:', error);
    res.status(500).json({ error: 'Failed to push changes' });
  }
};

router.get('/', getAllNotes);
router.get('/status', getSyncStatus);
router.post('/pull', pullChanges);
router.post('/push', pushChanges);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
