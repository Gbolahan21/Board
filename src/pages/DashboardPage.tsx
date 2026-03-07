import { useState } from 'react';
import { useStore } from '../state/store';
import { Link } from 'react-router-dom';
import ConfirmModal from '../components/ConfrimModal';
import CreateModal from '../components/CreateModal';

const DashboardPage = () => {
  const boards = useStore((state) => state.boards);
  const addBoard = useStore((state) => state.addBoard);
  const deleteBoard = useStore((state) => state.deleteBoard);

  const [modalOpen, setModalOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateBoard = (title: string, description: string) => {
    const id = `board-${Date.now()}`;

    addBoard({
        id,
        title,
        description,
        createdDate: new Date().toLocaleDateString(),
        columnIds: [],
    });

    setIsCreateOpen(false);
  };

  const openDeleteModal = (boardId: string) => {
    setBoardToDelete(boardId);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (boardToDelete) deleteBoard(boardToDelete);
    setModalOpen(false);
    setBoardToDelete(null);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setBoardToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Workspace Dashboard</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded cursor-pointer"
        >
          Create Board
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {Object.values(boards).map((board) => (
          <li
            key={board.id}
            className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition"
          >
            <Link
              to={`/board/${board.id}`}
              className="text-blue-400 capitalize font-semibold text-lg"
            >
              {board.title}
            </Link>
            <p className="text-gray-300 mt-1 capitalize">{board.description}</p>
              Created: {board.createdDate}
            <button
              onClick={() => openDeleteModal(board.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-2 cursor-pointer"
            >
              Delete Board
            </button>
          </li>
        ))}
      </ul>

      <ConfirmModal
        isOpen={modalOpen}
        message={`Are you sure you want to delete this board?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <CreateModal
        isOpen={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onCreate={handleCreateBoard}
      />
    </div>
  );
};

export default DashboardPage;