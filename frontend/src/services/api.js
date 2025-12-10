import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = {
  // Upload a document
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get all documents
  getDocuments: async () => {
    const response = await axios.get(`${API_BASE_URL}/documents`);
    return response.data;
  },

  // Download a document
  downloadDocument: async (id, filename) => {
    const response = await axios.get(`${API_BASE_URL}/documents/${id}`, {
      responseType: 'blob',
    });

    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Delete a document
  deleteDocument: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/documents/${id}`);
    return response.data;
  },
};

export default api;
