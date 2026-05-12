import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNotes } from '../context/NotesContext';

const NoteEditorModal = ({ isOpen, onClose, note }) => {
  const { createNote, updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef(null);
  const isNewNote = !note;

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const saveNote = useCallback(async () => {
    if (saving) return;

    try {
      setSaving(true);
      if (isNewNote) {
        await createNote(title, content);
      } else if (note) {
        await updateNote(note.id, { title, content });
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setSaving(false);
    }
  }, [isNewNote, note, title, content, createNote, updateNote, saving]);

  useEffect(() => {
    if (title.length > 0 || content.length > 0) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveNote();
      }, 500);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content]);

  const handleClose = useCallback(() => {
    if (title.length > 0 || content.length > 0) {
      saveNote();
    }
    onClose();
  }, [title, content, saveNote, onClose]);

  const handleDelete = useCallback(async () => {
    if (!note) return;
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  }, [note, deleteNote, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '600px',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              color: '#6366F1',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {saving && (
              <span style={{ fontSize: '14px', color: '#6B7280' }}>Saving...</span>
            )}
            {!isNewNote && (
              <button
                onClick={handleDelete}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              border: 'none',
              outline: 'none',
              marginBottom: '16px',
              padding: 0,
              backgroundColor: 'transparent',
            }}
            maxLength={200}
          />
          <textarea
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              flex: 1,
              fontSize: '16px',
              color: '#111827',
              lineHeight: '24px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: 0,
              backgroundColor: 'transparent',
            }}
            maxLength={10000}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditorModal;
