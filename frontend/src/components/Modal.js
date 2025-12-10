import React, { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus trap could be implemented here
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[color:var(--color-overlay)] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-slideIn"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="flex justify-between items-center p-6 border-b border-[color:var(--color-gray-400)]">
          <h3 id="modal-title" className="text-h2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-[color:var(--color-gray-400)] hover:text-[color:var(--color-gray-700)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-500)] rounded-full p-1"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
