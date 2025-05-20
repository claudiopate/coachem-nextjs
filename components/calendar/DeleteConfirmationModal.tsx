import React from 'react';
import Modal from '../ui/modal/Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lessonTitle: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  lessonTitle
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] p-6"
    >
      <div className="flex flex-col gap-4">
        <div>
          <h5 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Conferma eliminazione
          </h5>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sei sicuro di voler eliminare la lezione "{lessonTitle}"? Questa azione non può essere annullata.
          </p>
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Elimina
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal; 