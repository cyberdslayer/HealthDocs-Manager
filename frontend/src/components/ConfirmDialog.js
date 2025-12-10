import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-gray-600 text-lg">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors text-lg"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-3 font-bold text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors text-lg ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
