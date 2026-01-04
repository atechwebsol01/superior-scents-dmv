import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrivateRoute } from './PrivateRoute';

// Pages
import { LoginPage, SignUpPage } from '@/features/auth';
import { DashboardPage } from '@/pages/DashboardPage';
import {
  CustomerListPage,
  CustomerDetailPage,
  AddCustomerPage,
  EditCustomerPage,
} from '@/features/customers';
import {
  EmployeeListPage,
  EmployeeDetailPage,
  AddEmployeePage,
  EditEmployeePage,
} from '@/features/employees';

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
  {
    path: '/signup',
    element: <SignUpPage />,
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
      // Customer Routes
      {
        path: 'customers',
        element: <CustomerListPage />,
      },
      {
        path: 'customers/new',
        element: <AddCustomerPage />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />,
      },
      {
        path: 'customers/:id/edit',
        element: <EditCustomerPage />,
      },
      // Employee Routes
      {
        path: 'employees',
        element: <EmployeeListPage />,
      },
      {
        path: 'employees/new',
        element: <AddEmployeePage />,
      },
      {
        path: 'employees/:id',
        element: <EmployeeDetailPage />,
      },
      {
        path: 'employees/:id/edit',
        element: <EditEmployeePage />,
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
