import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-body">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-6">
          <button
            onClick={onClose}
            className="btn bg-[color:var(--color-gray-100)] text-[color:var(--color-gray-700)] hover:bg-[color:var(--color-gray-400)]"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${
              isDestructive 
                ? 'btn-danger' 
                : 'bg-[color:var(--color-primary-500)] text-white hover:bg-[color:var(--color-primary-700)]'
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
