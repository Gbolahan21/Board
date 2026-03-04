// src/components/CreateColumnModal.tsx
import React, { useState } from 'react';

interface CreateColumnModalProps {
  isOpen: boolean;
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

const CreateColumnModal: React.FC<CreateColumnModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (title.trim() === '') return; // optional validation
    onConfirm(title.trim());
    setTitle('');
  };

  const handleCancel = () => {
    setTitle('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Create Column</h2>

        <input
          type="text"
          placeholder="Column Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateColumnModal;