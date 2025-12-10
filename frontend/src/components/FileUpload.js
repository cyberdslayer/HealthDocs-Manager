import React, { useState, useRef } from 'react';

function FileUpload({ onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  // Validate file and set state
  const validateAndSetFile = (file) => {
    setError('');
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed. Please select a valid PDF document.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit. Please choose a smaller file.');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    onUpload(selectedFile);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const clearSelection = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mb-10 pb-10 border-b-2 border-gray-200">
      <h2 className="text-h2 mb-6">📤 Upload Medical Document</h2>
      
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={`relative border-3 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-[color:var(--color-primary-500)] bg-[color:var(--color-primary-50)] scale-[1.02]' 
              : 'border-[color:var(--color-primary-100)] bg-[color:var(--color-gray-50)] hover:bg-[color:var(--color-primary-50)] hover:border-[color:var(--color-primary-500)]'
          } ${error ? 'border-[color:var(--color-error)] bg-[color:var(--color-error-bg)]' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          role="region"
          aria-label="File upload drop zone"
        >
          <div className="text-6xl mb-4" aria-hidden="true">
            {selectedFile ? '📄' : '📂'}
          </div>
          
          <p className="text-body mb-3 font-medium">
            {selectedFile ? (
              <span className="text-[color:var(--color-primary-700)] font-bold">{selectedFile.name}</span>
            ) : (
              'Drag and drop your PDF here'
            )}
          </p>
          
          {!selectedFile && (
            <>
              <p className="text-body my-4">or</p>
              <label 
                htmlFor="fileInput" 
                className="btn bg-[color:var(--color-primary-500)] text-white hover:bg-[color:var(--color-primary-700)]"
              >
                Choose File
              </label>
            </>
          )}

          <input
            id="fileInput"
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="sr-only"
            disabled={loading}
            aria-describedby="file-help"
          />
          
          <p id="file-help" className="text-caption mt-4 font-medium">
            PDF files only, max 10MB
          </p>

          {/* Inline Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-[color:var(--color-error-bg)] text-[color:var(--color-error)] rounded-lg border border-[color:var(--color-error)] flex items-center justify-center gap-2 animate-slideIn" role="alert">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              {error}
            </div>
          )}
        </div>

        {/* File Preview & Actions */}
        {selectedFile && !error && (
          <div className="mt-6 bg-white border border-[color:var(--color-gray-400)] rounded-xl p-6 shadow-sm animate-slideIn">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-[color:var(--color-primary-50)] p-3 rounded-lg">
                  <span className="text-2xl">📄</span>
                </div>
                <div>
                  <p className="font-bold text-[color:var(--color-gray-900)] text-lg">{selectedFile.name}</p>
                  <p className="text-caption">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="btn bg-[color:var(--color-gray-100)] text-[color:var(--color-gray-700)] hover:bg-[color:var(--color-gray-400)]"
                  disabled={loading}
                >
                  Change File
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn bg-[color:var(--color-primary-500)] text-white hover:bg-[color:var(--color-primary-700)] ${
                    loading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Upload Document'
                  )}
                </button>
              </div>
            </div>
            
            {loading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 overflow-hidden">
                <div className="bg-[color:var(--color-primary-500)] h-2.5 rounded-full animate-pulse w-full"></div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default FileUpload;
