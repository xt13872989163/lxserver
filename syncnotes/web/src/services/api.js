import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  async getNotes() {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes`);
      return response.data;
    } catch (error) {
      console.error('API getNotes error:', error);
      throw error;
    }
  },

  async getNote(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error('API getNote error:', error);
      throw error;
    }
  },

  async createNote(title, content) {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes`, { title, content });
      return response.data;
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

      const response = await axios.put(`${API_BASE_URL}/notes/${id}`, body);
      return response.data;
    } catch (error) {
      console.error('API updateNote error:', error);
      throw error;
    }
  },

  async deleteNote(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error('API deleteNote error:', error);
      throw error;
    }
  },

  async getSyncStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes/status`);
      return response.data;
    } catch (error) {
      console.error('API getSyncStatus error:', error);
      throw error;
    }
  },

  async pullChanges(since) {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes/pull`, { since });
      return response.data;
    } catch (error) {
      console.error('API pullChanges error:', error);
      throw error;
    }
  },

  async pushChanges(notes, deletedIds) {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes/push`, { notes, deletedIds });
      return response.data;
    } catch (error) {
      console.error('API pushChanges error:', error);
      throw error;
    }
  },
};

export default api;
