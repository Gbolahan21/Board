// src/routes.tsx
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';

// Lazy-load pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BoardPage = lazy(() => import('./pages/BoardPage'));

export const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  </Suspense>
);