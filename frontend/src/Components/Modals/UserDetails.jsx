import React from 'react';

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
        <div className="p-4">
          <button
            className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
