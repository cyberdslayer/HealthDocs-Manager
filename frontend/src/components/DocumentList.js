import React, { useState, useMemo } from 'react';

function DocumentList({ documents, onDownload, onDelete, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

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

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let docs = [...documents];

    // Filter
    if (searchTerm) {
      docs = docs.filter(doc => 
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      docs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return docs;
  }, [documents, searchTerm, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="text-gray-400 ml-1">↕</span>;
    return sortConfig.direction === 'ascending' 
      ? <span className="text-indigo-600 ml-1">↑</span> 
      : <span className="text-indigo-600 ml-1">↓</span>;
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">📋 Your Documents</h2>
        
        {/* Search Bar */}
        <div className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            aria-label="Search documents"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading && documents.length === 0 && (
        <div className="text-center py-10 text-gray-600 text-lg animate-pulse">Loading documents...</div>
      )}

      {!loading && documents.length === 0 && (
        <div className="text-center py-16 px-5 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-8xl mb-5" aria-hidden="true">📭</div>
          <p className="text-gray-600 text-xl my-3 font-medium">No documents uploaded yet</p>
          <p className="text-gray-500 text-base">Upload your first medical document above to get started.</p>
        </div>
      )}

      {documents.length > 0 && filteredDocuments.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">No documents match your search.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium underline"
          >
            Clear search
          </button>
        </div>
      )}

      {filteredDocuments.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('filename')}
                  >
                    Document Name <SortIcon columnKey="filename" />
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('created_at')}
                  >
                    Date Uploaded <SortIcon columnKey="created_at" />
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('filesize')}
                  >
                    Size <SortIcon columnKey="filesize" />
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                          📄
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{doc.filename}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(doc.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {formatFileSize(doc.filesize)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => onDownload(doc.id, doc.filename)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold px-3 py-1 rounded hover:bg-indigo-50 transition-colors"
                          aria-label={`Download ${doc.filename}`}
                        >
                          Download
                        </button>
                        <button
                          onClick={() => onDelete(doc.id, doc.filename)}
                          className="text-red-600 hover:text-red-900 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors"
                          aria-label={`Delete ${doc.filename}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">📄</div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-lg leading-tight break-all">
                        {doc.filename}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 whitespace-nowrap">
                    {formatFileSize(doc.filesize)}
                  </span>
                </div>
                
                <div className="flex gap-3 mt-2 border-t border-gray-100 pt-4">
                  <button
                    className="flex-1 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-base font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    onClick={() => onDownload(doc.id, doc.filename)}
                  >
                    <span>⬇️</span> Download
                  </button>
                  <button
                    className="flex-1 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-base font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    onClick={() => onDelete(doc.id, doc.filename)}
                  >
                    <span>🗑️</span> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center py-5 px-6 bg-indigo-50 rounded-lg mt-6 md:mt-8">
            <p className="text-gray-800 text-lg">
              Showing <strong className="text-indigo-600">{filteredDocuments.length}</strong> of {documents.length} documents
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default DocumentList;
