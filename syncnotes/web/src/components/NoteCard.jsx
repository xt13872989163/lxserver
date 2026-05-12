import React from 'react';

const NoteCard = ({ note, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getPreview = (content) => {
    const preview = content.replace(/\n/g, ' ').trim();
    return preview.length > 100 ? preview.substring(0, 100) + '...' : preview;
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
        {note.title || 'Untitled'}
      </h3>
      {note.content && (
        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '20px', marginBottom: '8px' }}>
          {getPreview(note.content)}
        </p>
      )}
      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
        {formatDate(note.updatedAt)}
      </span>
    </div>
  );
};

export default NoteCard;
