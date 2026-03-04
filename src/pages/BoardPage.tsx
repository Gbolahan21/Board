import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../state/store';
import type { Column } from '../types/column';

import CreateColumnModal from '../components/CreateColumnModal';
import EditColumnModal from '../components/EditColumnModal';
import ConfirmModal from '../components/ConfrimModal';

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();

  const board = useStore((state) =>
    boardId ? state.boards[boardId] : undefined
  );

  const columns = useStore((state) => state.columns);
  const cards = useStore((state) => state.cards);
  const addColumn = useStore((state) => state.addColumn);
  const deleteColumn = useStore((state) => state.deleteColumn);
  const editColumn = useStore((state) => state.editColumn);

  const [modalOpen, setModalOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState<Column | null>(null);

  const [columnModalOpen, setColumnModalOpen] = useState(false);

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Board not found</h2>
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateColumn = (title: string) => {
    const newColumn: Column = {
        id: `column-${Date.now()}`,
        title,
        createdDate: new Date().toLocaleDateString(),
        cardIds: [],
    };

    addColumn(newColumn, board.id);
    setColumnModalOpen(false);
  };

  const handleCancelColumn = () => {
    setColumnModalOpen(false);
  };

    
  const openDeleteModal = (columnId: string) => {
    setColumnToDelete(columnId);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (columnToDelete) deleteColumn(columnToDelete, board.id);
    setModalOpen(false);
    setColumnToDelete(null);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setColumnToDelete(null);
  };

  const openEditModal = (column: Column) => {
    setColumnToEdit(column);
    setEditModalOpen(true);
  };

  const handleEditConfirm = (newTitle: string) => {
    if (columnToEdit) {
        const updatedColumn: Column = {
        ...columnToEdit,
        title: newTitle,
        };
        editColumn(updatedColumn); // call store action
    }
    setEditModalOpen(false);
    setColumnToEdit(null);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setColumnToEdit(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <Link
          to="/"
          className="text-blue-400 hover:text-blue-300 mb-6 inline-block"
        >
          Back to Dashboard
        </Link>

        {/* Board Info */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <h1 className="text-4xl font-bold capitalize mb-2">
            {board.title}
          </h1>
          <p className="text-gray-300 mb-2 capitalize">
            {board.description}
          </p>
          <p className="text-gray-400 text-sm">
            Created: {board.createdDate}
          </p>
        </div>

        {/* Add Column Button */}
        <button
            onClick={() => setColumnModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded cursor-pointer"
            >
            Add Column
        </button>

        {/* Columns Row */}
        <div className="flex gap-6 overflow-x-auto py-6">

          {board.columnIds.length === 0 && (
            <div className="text-gray-400">
              No columns yet. Start by creating one.
            </div>
          )}

          {board.columnIds.map((columnId) => {
            const column = columns[columnId];
            if (!column) return null;

            return (
              <div
                key={column.id}
                className="bg-gray-800 p-4 rounded-lg w-72 flex-shrink-0"
              >
                {/* Column Title */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg capitalize">{column.title}</h3>
                    <button
                        onClick={() => openEditModal(column)}
                        className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                    >
                        Edit
                    </button>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {column.cardIds.map((cardId) => {
                    const card = cards[cardId];
                    if (!card) return null;

                    return (
                      <div
                        key={card.id}
                        className="bg-gray-700 p-3 rounded"
                      >
                        <h4 className="font-semibold capitalize">
                          {card.title}
                        </h4>
                        <p className="text-sm text-gray-300 capitalize">
                          {card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <button
                    onClick={() => openDeleteModal(column.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-2 cursor-pointer"
                >
                    Delete Column
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <CreateColumnModal
        isOpen={columnModalOpen}
        onConfirm={handleCreateColumn}
        onCancel={handleCancelColumn}
      />
      <ConfirmModal
        isOpen={modalOpen}
        message={`Are you sure you want to delete this column?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <EditColumnModal
        isOpen={editModalOpen}
        currentTitle={columnToEdit?.title || ''}
        onConfirm={handleEditConfirm}
        onCancel={handleEditCancel}
      />
    </div>
  );
};

export default BoardPage;