import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrivateRoute } from './PrivateRoute';

// Pages
import { LoginPage } from '@/features/auth';
import { DashboardPage } from '@/pages/DashboardPage';

/**
 * Application Routes
 * Superior Scents DMV, LLC
 */
export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Protected Routes
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Customer Routes (Phase 4)
      {
        path: 'customers',
        element: <div className="p-8 text-center text-neutral-500">Customers Module - Coming in Phase 4</div>,
      },
      // Employee Routes (Phase 5)
      {
        path: 'employees',
        element: <div className="p-8 text-center text-neutral-500">Employees Module - Coming in Phase 5</div>,
      },
      // Invoice Routes (Phase 6)
      {
        path: 'invoices',
        element: <div className="p-8 text-center text-neutral-500">Invoices Module - Coming in Phase 6</div>,
      },
      // Payment Routes (Phase 7)
      {
        path: 'payments',
        element: <div className="p-8 text-center text-neutral-500">Payments Module - Coming in Phase 7</div>,
      },
      // Report Routes (Phase 8)
      {
        path: 'reports',
        element: <div className="p-8 text-center text-neutral-500">Reports Module - Coming in Phase 8</div>,
      },
      // Settings
      {
        path: 'settings',
        element: <div className="p-8 text-center text-neutral-500">Settings - Coming Soon</div>,
      },
    ],
  },

  // 404 Fallback
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
