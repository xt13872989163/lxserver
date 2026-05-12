const API_BASE_URL = 'http://10.0.2.2:3000/api';

export const api = {
  async getNotes() {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      return await response.json();
    } catch (error) {
      console.error('API getNotes error:', error);
      throw error;
    }
  },

  async getNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch note');
      return await response.json();
    } catch (error) {
      console.error('API getNote error:', error);
      throw error;
    }
  },

  async createNote(title, content) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error('Failed to create note');
      return await response.json();
    } catch (error) {
      console.error('API createNote error:', error);
      throw error;
    }
  },

  async updateNote(id, { title, content }) {
    try {
      const body = {};
      if (title !== undefined) body.title = title;
      if (content !== undefined) body.content = content;

      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to update note');
      return await response.json();
    } catch (error) {
      console.error('API updateNote error:', error);
      throw error;
    }
  },

  async deleteNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete note');
      return await response.json();
    } catch (error) {
      console.error('API deleteNote error:', error);
      throw error;
    }
  },

  async getSyncStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/status`);
      if (!response.ok) throw new Error('Failed to get sync status');
      return await response.json();
    } catch (error) {
      console.error('API getSyncStatus error:', error);
      throw error;
    }
  },

  async pullChanges(since) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ since }),
      });
      if (!response.ok) throw new Error('Failed to pull changes');
      return await response.json();
    } catch (error) {
      console.error('API pullChanges error:', error);
      throw error;
    }
  },

  async pushChanges(notes, deletedIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, deletedIds }),
      });
      if (!response.ok) throw new Error('Failed to push changes');
      return await response.json();
    } catch (error) {
      console.error('API pushChanges error:', error);
      throw error;
    }
  },
};

export default api;
