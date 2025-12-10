import React from 'react';

function DocumentList({ documents, onDownload, onDelete, loading }) {
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Your Documents</h2>

      {loading && documents.length === 0 && (
        <div className="text-center py-10 text-gray-600 text-lg">Loading documents...</div>
      )}

      {!loading && documents.length === 0 && (
        <div className="text-center py-16 px-5 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-8xl mb-5">📭</div>
          <p className="text-gray-600 text-xl my-3">No documents uploaded yet</p>
          <p className="text-gray-500 text-base">Upload your first medical document above</p>
        </div>
      )}

      {documents.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white border-2 border-gray-200 rounded-xl p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-500 flex flex-col gap-4"
              >
                <div className="text-5xl text-center">📄</div>
                <div className="flex-1">
                  <h3 className="text-gray-800 text-lg font-semibold mb-3 break-words leading-tight">
                    {doc.filename}
                  </h3>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600 text-sm">
                      <strong className="text-gray-800">Size:</strong> {formatFileSize(doc.filesize)}
                    </span>
                    <span className="text-gray-600 text-sm">
                      <strong className="text-gray-800">Uploaded:</strong> {formatDate(doc.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
                    onClick={() => onDownload(doc.id, doc.filename)}
                    title="Download"
                  >
                    ⬇️ Download
                  </button>
                  <button
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none active:translate-y-0"
                    onClick={() => onDelete(doc.id)}
                    title="Delete"
                    disabled={loading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center py-5 px-6 bg-indigo-50 rounded-lg mt-6">
            <p className="text-gray-800 text-lg">
              Total Documents: <strong className="text-indigo-600 text-xl">{documents.length}</strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default DocumentList;
