// import React from 'react';

// const BoardPage: React.FC = () => {
//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-900">
//       <h1 className="text-4xl font-bold text-white text-center">Board</h1>
//     </div>
//   );
// };

// export default BoardPage;
// src/pages/BoardPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../state/store';

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const board = useStore((state) => boardId ? state.boards[boardId] : undefined);

  if (!board) return <div>Board not found</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{board.title}</h1>
      <p>{board.description}</p>
      <p>Created: {board.createdDate}</p>

      <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Dashboard</Link>
    </div>
  );
};

export default BoardPage;