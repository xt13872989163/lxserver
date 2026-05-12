import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { socketService } from '../services/socket';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const handleNoteCreated = useCallback((note) => {
    setNotes(prev => {
      const exists = prev.find(n => n.id === note.id);
      if (!exists) {
        return [note, ...prev];
      }
      return prev;
    });
  }, []);

  const handleNoteUpdated = useCallback((note) => {
    setNotes(prev =>
      prev.map(n => (n.id === note.id ? note : n))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  }, []);

  const handleNoteDeleted = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleSyncComplete = useCallback(() => {
    setSyncing(false);
    const now = new Date().toISOString();
    setLastSync(now);
  }, []);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { notes: serverNotes } = await api.getNotes();
      setNotes(serverNotes);
      setLastSync(new Date().toISOString());
      setIsOnline(true);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Load notes error:', err);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncNotes = useCallback(async () => {
    try {
      setSyncing(true);
      setError(null);
      const { notes: serverNotes } = await api.getNotes();
      setNotes(serverNotes);
      const now = new Date().toISOString();
      setLastSync(now);
      setIsOnline(true);
    } catch (err) {
      setError('Sync failed');
      setIsOnline(false);
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  }, []);

  const createNote = useCallback(async (title, content) => {
    try {
      const { note } = await api.createNote(title, content);
      setNotes(prev => [note, ...prev]);
      return note;
    } catch (err) {
      setError('Failed to create note');
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (id, updates) => {
    try {
      const { note } = await api.updateNote(id, updates);
      setNotes(prev =>
        prev.map(n => (n.id === id ? note : n))
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
      return note;
    } catch (err) {
      setError('Failed to update note');
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      await api.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      setError('Failed to delete note');
      throw err;
    }
  }, []);

  useEffect(() => {
    socketService.connect();

    socketService.on('note:created', handleNoteCreated);
    socketService.on('note:updated', handleNoteUpdated);
    socketService.on('note:deleted', handleNoteDeleted);
    socketService.on('sync:complete', handleSyncComplete);

    return () => {
      socketService.off('note:created', handleNoteCreated);
      socketService.off('note:updated', handleNoteUpdated);
      socketService.off('note:deleted', handleNoteDeleted);
      socketService.off('sync:complete', handleSyncComplete);
      socketService.disconnect();
    };
  }, [handleNoteCreated, handleNoteUpdated, handleNoteDeleted, handleSyncComplete]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const value = {
    notes,
    loading,
    syncing,
    lastSync,
    error,
    isOnline,
    createNote,
    updateNote,
    deleteNote,
    syncNotes,
    loadNotes,
    setError,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};

export default NotesContext;
