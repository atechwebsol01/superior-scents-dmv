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
  CustomerImportPage,
  CustomerExportPage,
} from '@/features/customers';
import {
  EmployeeListPage,
  EmployeeDetailPage,
  AddEmployeePage,
  EditEmployeePage,
  EmployeeSchedulePage,
} from '@/features/employees';
import {
  InvoiceListPage,
  InvoiceDetailPage,
  CreateInvoicePage,
  EditInvoicePage,
  QuickInvoicePage,
} from '@/features/invoices';
import {
  PaymentListPage,
  PaymentDetailPage,
  RecordPaymentPage,
  PaymentHistoryPage,
} from '@/features/payments';
import {
  ReportsDashboard,
  SalesReport,
  GenericReport,
  CommissionReport,
  CustomReportBuilder,
} from '@/features/reports';
import { ServicesPage, ServiceSchedulingPage, ProductInventoryPage } from '@/features/services';
import { SettingsPage } from '@/features/settings';
import { NotificationsPage } from '@/features/notifications';

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
        path: 'customers/import',
        element: <CustomerImportPage />,
      },
      {
        path: 'customers/export',
        element: <CustomerExportPage />,
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
        path: 'employees/schedule',
        element: <EmployeeSchedulePage />,
      },
      {
        path: 'employees/:id',
        element: <EmployeeDetailPage />,
      },
      {
        path: 'employees/:id/edit',
        element: <EditEmployeePage />,
      },
      // Invoice Routes
      {
        path: 'invoices',
        element: <InvoiceListPage />,
      },
      {
        path: 'invoices/new',
        element: <CreateInvoicePage />,
      },
      {
        path: 'invoices/quick',
        element: <QuickInvoicePage />,
      },
      {
        path: 'invoices/:id',
        element: <InvoiceDetailPage />,
      },
      {
        path: 'invoices/:id/edit',
        element: <EditInvoicePage />,
      },
      // Payment Routes
      {
        path: 'payments',
        element: <PaymentListPage />,
      },
      {
        path: 'payments/new',
        element: <RecordPaymentPage />,
      },
      {
        path: 'payments/history',
        element: <PaymentHistoryPage />,
      },
      {
        path: 'payments/:id',
        element: <PaymentDetailPage />,
      },
      // Report Routes
      {
        path: 'reports',
        element: <ReportsDashboard />,
      },
      {
        path: 'reports/sales',
        element: <SalesReport />,
      },
      {
        path: 'reports/commission',
        element: <CommissionReport />,
      },
      {
        path: 'reports/builder',
        element: <CustomReportBuilder />,
      },
      {
        path: 'reports/:reportId',
        element: <GenericReport />,
      },
      // Services & Products
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'services/scheduling',
        element: <ServiceSchedulingPage />,
      },
      {
        path: 'services/inventory',
        element: <ProductInventoryPage />,
      },
      // Notifications
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      // Settings
      {
        path: 'settings',
        element: <SettingsPage />,
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
