import React, { useState } from 'react';

function FileUpload({ onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  // Validate file and set state
  const validateAndSetFile = (file) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    onUpload(selectedFile);
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mb-10 pb-10 border-b-2 border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📤 Upload Medical Document</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={`border-3 border-dashed rounded-xl p-10 text-center bg-indigo-50 transition-all duration-300 cursor-pointer ${
            dragActive 
              ? 'border-purple-600 bg-indigo-100 scale-105' 
              : 'border-indigo-500 hover:bg-indigo-100 hover:border-purple-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-6xl mb-4">📄</div>
          <p className="text-xl text-gray-800 mb-3 font-medium">
            {selectedFile ? selectedFile.name : 'Drag and drop your PDF here'}
          </p>
          <p className="text-gray-600 my-4 text-lg">or</p>
          <label htmlFor="fileInput" className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg cursor-pointer font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg mb-3">
            Choose File
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
          <p className="text-gray-500 text-sm mt-3">PDF files only, max 10MB</p>
        </div>

        {selectedFile && (
          <div className="bg-green-50 border border-green-400 rounded-lg p-4 mt-6 text-left">
            <p className="text-green-800 my-1">
              <strong>Selected:</strong> {selectedFile.name}
            </p>
            <p className="text-green-800 my-1">
              <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-6 py-4 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none active:translate-y-0"
          disabled={!selectedFile || loading}
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
