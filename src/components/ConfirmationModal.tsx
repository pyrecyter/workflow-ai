
'use client';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Action</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
