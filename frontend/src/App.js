import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import api from './services/api';

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all documents from API
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data.documents);
    } catch (error) {
      showMessage('Error fetching documents', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const result = await api.uploadDocument(file);
      showMessage(result.message, 'success');
      fetchDocuments(); // Refresh the list
    } catch (error) {
      showMessage(error.message || 'Error uploading file', 'error');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file download
  const handleDownload = async (id, filename) => {
    try {
      await api.downloadDocument(id, filename);
      showMessage('File downloaded successfully', 'success');
    } catch (error) {
      showMessage('Error downloading file', 'error');
      console.error('Download error:', error);
    }
  };

  // Handle file delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.deleteDocument(id);
      showMessage(result.message, 'success');
      fetchDocuments(); // Refresh the list
    } catch (error) {
      showMessage('Error deleting file', 'error');
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show message to user
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center text-white mb-10 p-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-3">🏥 Patient Portal</h1>
        <p className="text-xl md:text-2xl opacity-90">Manage Your Medical Documents</p>
      </header>

      <main className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl mb-8">
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 font-medium animate-slideIn ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <FileUpload onUpload={handleUpload} loading={loading} />

        <DocumentList
          documents={documents}
          onDownload={handleDownload}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>

      <footer className="text-center text-white py-6 opacity-80">
        <p>© 2025 Patient Portal - Secure Medical Document Management</p>
      </footer>
    </div>
  );
}

export default App;
