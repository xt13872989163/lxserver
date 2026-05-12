import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@syncnotes_notes';
const LAST_SYNC_KEY = '@syncnotes_lastSync';

export const storage = {
  async saveNotes(notes) {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  },

  async getNotes() {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  async saveLastSync(timestamp) {
    try {
      await AsyncStorage.setItem(LAST_SYNC_KEY, timestamp);
    } catch (error) {
      console.error('Error saving last sync:', error);
    }
  },

  async getLastSync() {
    try {
      return await AsyncStorage.getItem(LAST_SYNC_KEY);
    } catch (error) {
      console.error('Error getting last sync:', error);
      return null;
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([NOTES_KEY, LAST_SYNC_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export default storage;
