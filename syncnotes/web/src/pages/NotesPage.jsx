import React, { useCallback, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import SyncIndicator from '../components/SyncIndicator';
import NoteEditorModal from './NoteEditorModal';

const NotesPage = () => {
  const { notes, loading, syncing, lastSync, isOnline, error, syncNotes } = useNotes();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleNoteClick = useCallback((note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  }, []);

  const handleCreateNote = useCallback(() => {
    setSelectedNote(null);
    setIsEditorOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
    setSelectedNote(null);
  }, []);

  const renderEmpty = () => (
    <div style={{ textAlign: 'center', padding: '64px 32px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
        No Notes Yet
      </h2>
      <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '20px' }}>
        Click the "New Note" button to create your first note
      </p>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '18px', color: '#6B7280' }}>Loading notes...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>SyncNotes</h1>
          <SyncIndicator syncing={syncing} lastSync={lastSync} isOnline={isOnline} />
        </div>
        <button
          onClick={handleCreateNote}
          style={{
            backgroundColor: '#6366F1',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>+</span> New Note
        </button>
      </header>

      {error && (
        <div
          onClick={syncNotes}
          style={{
            backgroundColor: '#FEE2E2',
            padding: '12px 24px',
            borderBottom: '1px solid #FECACA',
            cursor: 'pointer',
          }}
        >
          <p style={{ color: '#DC2626', fontSize: '14px', textAlign: 'center' }}>{error}</p>
          <p style={{ color: '#991B1B', fontSize: '12px', textAlign: 'center', marginTop: '4px' }}>
            Click to retry
          </p>
        </div>
      )}

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
        {notes.length === 0 ? (
          renderEmpty()
        ) : (
          <div>
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onClick={() => handleNoteClick(note)} />
            ))}
          </div>
        )}
      </main>

      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        note={selectedNote}
      />
    </div>
  );
};

export default NotesPage;
