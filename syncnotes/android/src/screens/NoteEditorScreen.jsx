import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNotes } from '../context/NotesContext';

const NoteEditorScreen = ({ navigation, route }) => {
  const { noteId } = route.params || {};
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const existingNote = notes.find(n => n.id === noteId);

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const saveTimeoutRef = useRef(null);
  const isNewNote = !noteId;

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title || '');
      setContent(existingNote.content || '');
    }
  }, [existingNote]);

  useEffect(() => {
    if (!isNewNote && existingNote) {
      const titleChanged = title !== existingNote.title;
      const contentChanged = content !== existingNote.content;
      setHasChanges(titleChanged || contentChanged);
    } else if (isNewNote) {
      setHasChanges(title.length > 0 || content.length > 0);
    }
  }, [title, content, existingNote, isNewNote]);

  const saveNote = useCallback(async () => {
    if (saving) return;

    try {
      setSaving(true);
      if (isNewNote) {
        await createNote(title, content);
      } else if (noteId) {
        await updateNote(noteId, { title, content });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [isNewNote, noteId, title, content, createNote, updateNote, saving]);

  useEffect(() => {
    if (hasChanges) {
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

  const handleDelete = useCallback(() => {
    if (!noteId) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note.');
            }
          },
        },
      ]
    );
  }, [noteId, deleteNote, navigation]);

  const handleBack = useCallback(() => {
    if (hasChanges) {
      saveNote();
    }
    navigation.goBack();
  }, [hasChanges, saveNote, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {saving && <Text style={styles.savingText}>Saving...</Text>}
          {!isNewNote && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.editor}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
          maxLength={200}
          returnKeyType="next"
        />

        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          placeholderTextColor="#9CA3AF"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          maxLength={10000}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight + 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 16,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingLeft: 16,
  },
  deleteText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
  editor: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    padding: 0,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
    padding: 0,
  },
});

export default NoteEditorScreen;
