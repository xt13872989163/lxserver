import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

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
    <View style={styles.container}>
      {syncing ? (
        <ActivityIndicator size="small" color="#6366F1" style={styles.spinner} />
      ) : (
        <View
          style={[
            styles.dot,
            { backgroundColor: isOnline ? '#10B981' : '#EF4444' }
          ]}
        />
      )}
      <Text style={styles.text}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  spinner: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default SyncIndicator;
