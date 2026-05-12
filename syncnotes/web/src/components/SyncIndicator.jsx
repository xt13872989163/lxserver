import React from 'react';

const SyncIndicator = ({ syncing, lastSync, isOnline }) => {
  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never synced';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusText = () => {
    if (syncing) return 'Syncing...';
    if (!isOnline) return 'Offline';
    return `Synced ${formatLastSync(lastSync)}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {syncing ? (
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#6366F1',
            marginRight: '6px',
            animation: 'spin 1s linear infinite',
          }}
        />
      ) : (
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isOnline ? '#10B981' : '#EF4444',
            marginRight: '6px',
          }}
        />
      )}
      <span style={{ fontSize: '12px', color: '#6B7280' }}>{getStatusText()}</span>
    </div>
  );
};

export default SyncIndicator;
