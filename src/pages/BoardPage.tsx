import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../state/store';
import type { Column } from '../types/column';
import type { Card } from '../types/card'

import CreateColumnModal from '../components/CreateColumnModal';
import EditColumnModal from '../components/EditColumnModal';
import ConfirmModal from '../components/ConfrimModal';
import CreateCardModal from '../components/CreateCardModal';
import EditCardModal from "../components/EditCardModal"
import {parseMarkdown} from '../utils/markdown'

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
  const addCard = useStore((state) => state.addCard)
  const deleteCard = useStore((state) => state.deleteCard)
  const editCard = useStore((state) => state.editCard)

  const [cardToDelete, setCardToDelete] = useState<string | null>(null)
  const [cardColumnId, setCardColumnId] = useState<string | null>(null)

  const [cardToEdit, setCardToEdit] = useState<Card | null>(null)
  const [editCardModalOpen, setEditCardModalOpen] = useState(false)

  const [cardModalOpen, setCardModalOpen] = useState(false)
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null)

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
    setColumnToDelete(columnId)

    // clear card delete states
    setCardToDelete(null)
    setCardColumnId(null)

    setModalOpen(true)
  }

  const cancelDelete = () => {
    setModalOpen(false)

    setColumnToDelete(null)
    setCardToDelete(null)
    setCardColumnId(null)
  }

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

  const openCardModal = (columnId: string) => {
    setTargetColumnId(columnId)
    setCardModalOpen(true)
  }

  const handleCreateCard = (
    title: string,
    description: string,
    tags: string[],
    dueDate?: string
  ) => {

    if (!targetColumnId) return

    const newCard = {
      id: `card-${Date.now()}`,
      title,
      description,
      tags,
      dueDate: dueDate ?? null,
      createdDate: new Date().toLocaleDateString(),
    }

    addCard(newCard, targetColumnId)

    setCardModalOpen(false)
    setTargetColumnId(null)
  }

  const openDeleteCardModal = (cardId: string, columnId: string) => {
    setCardToDelete(cardId)
    setCardColumnId(columnId)
    setModalOpen(true)
  }

  const confirmEditDelete = () => {
    if (cardToDelete && cardColumnId) {
      deleteCard(cardToDelete, cardColumnId)
      setCardToDelete(null)
      setCardColumnId(null)
    }

    else if (columnToDelete) {
      deleteColumn(columnToDelete, board.id)
      setColumnToDelete(null)
    }

    setModalOpen(false)
  }

  const openEditCardModal = (card: Card) => {
    setCardToEdit(card)
    setEditCardModalOpen(true)
  }

  const handleEditCardConfirm = (
    title: string,
    description: string,
    tags: string[],
    dueDate?: string
  ) => {

    if (!cardToEdit) return

    const updatedCard = {
      ...cardToEdit,
      title,
      description,
      tags,
      dueDate: dueDate ?? null
    }

    editCard(updatedCard)

    setEditCardModalOpen(false)
    setCardToEdit(null)
  }

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto py-6">

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
                className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition"
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
                        className="bg-gray-500 p-3 rounded shadow"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold capitalize">
                            {card.title}
                          </h4>
                          <button
                            onClick={() => openEditCardModal(card)}
                            className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                        <div
                          className="text-sm text-gray-300 capitalize"
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(card.description)
                          }}
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-blue-600 text-xs px-2 py-1 rounded capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {card.dueDate && (
                          <p className="text-xs text-yellow-400 mt-2 py-2">
                            Due Date: {card.dueDate}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => openDeleteCardModal(card.id, column.id)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs cursor-pointer"
                          >
                            Delete Card
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openCardModal(column.id)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    Add Card
                  </button>

                  <button
                    onClick={() => openDeleteModal(column.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    Delete Column
                  </button>
                </div>
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
        message={`Are you sure you want to delete this ${
          columnToDelete ? 'Column' : 'Card'
        }?`}
        onConfirm={confirmEditDelete}
        onCancel={cancelDelete}
      />
      <EditColumnModal
        isOpen={editModalOpen}
        currentTitle={columnToEdit?.title || ''}
        onConfirm={handleEditConfirm}
        onCancel={handleEditCancel}
      />
      <CreateCardModal
        isOpen={cardModalOpen}
        onConfirm={handleCreateCard}
        onCancel={() => setCardModalOpen(false)}
      />
      {editCardModalOpen && cardToEdit && (
        <EditCardModal
          isOpen={editCardModalOpen}
          card={cardToEdit}
          onConfirm={handleEditCardConfirm}
          onCancel={() => setEditCardModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BoardPage;