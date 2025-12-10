import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import api from './services/api';

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false
  });

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
      showToast('Error fetching documents. Please try again later.', 'error');
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
      showToast(result.message, 'success');
      fetchDocuments(); // Refresh the list
    } catch (error) {
      showToast(error.message || 'Error uploading file. Please ensure it is a valid PDF.', 'error');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file download
  const handleDownload = async (id, filename) => {
    try {
      await api.downloadDocument(id, filename);
      showToast('File downloaded successfully', 'success');
    } catch (error) {
      showToast('Error downloading file. Please try again.', 'error');
      console.error('Download error:', error);
    }
  };

  // Handle file delete request (opens dialog)
  const handleDeleteRequest = (id, filename) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Document?',
      message: `Are you sure you want to delete "${filename}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Keep File',
      isDestructive: true,
      onConfirm: () => executeDelete(id)
    });
  };

  // Execute the actual delete
  const executeDelete = async (id) => {
    setLoading(true);
    try {
      const result = await api.deleteDocument(id);
      showToast(result.message, 'success');
      fetchDocuments(); // Refresh the list
    } catch (error) {
      showToast('Error deleting file. Please try again.', 'error');
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show toast message
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <span className="text-2xl" role="img" aria-label="Hospital">🏥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-none">Patient Portal</h1>
                <p className="text-sm text-slate-500 font-medium">Secure Document Management</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right mr-2">
                  <p className="text-sm font-bold text-slate-900">Welcome Back</p>
                  <p className="text-xs text-slate-500">Patient ID: #883920</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10 min-h-[600px]">
          <FileUpload onUpload={handleUpload} loading={loading} />
          
          <div className="mt-12">
            <DocumentList 
              documents={documents} 
              onDownload={handleDownload} 
              onDelete={handleDeleteRequest}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isDestructive={confirmDialog.isDestructive}
      />
    </div>
  );
}

export default App;
