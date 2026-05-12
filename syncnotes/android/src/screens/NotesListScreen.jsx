import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNotes } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import SyncIndicator from '../components/SyncIndicator';
import FAB from '../components/FAB';

const NotesListScreen = ({ navigation }) => {
  const { notes, loading, syncing, lastSync, isOnline, syncNotes, error } = useNotes();

  const handleRefresh = useCallback(() => {
    syncNotes();
  }, [syncNotes]);

  const handleNotePress = useCallback((note) => {
    navigation.navigate('NoteEditor', { noteId: note.id });
  }, [navigation]);

  const handleCreateNote = useCallback(() => {
    navigation.navigate('NoteEditor', {});
  }, [navigation]);

  const renderNote = useCallback(({ item }) => (
    <NoteCard note={item} onPress={() => handleNotePress(item)} />
  ), [handleNotePress]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>No Notes Yet</Text>
      <Text style={styles.emptyText}>
        Tap the + button to create your first note
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>SyncNotes</Text>
        <SyncIndicator syncing={syncing} lastSync={lastSync} isOnline={isOnline} />
      </View>

      {error && (
        <TouchableOpacity style={styles.errorBanner} onPress={handleRefresh}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorAction}>Tap to retry</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        contentContainerStyle={notes.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={syncing}
            onRefresh={handleRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB onPress={handleCreateNote} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.currentHeight + 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  errorAction: {
    color: '#991B1B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotesListScreen;
