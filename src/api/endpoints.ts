/**
 * API Endpoints for Superior Scents DMV, LLC
 * All endpoints are relative to API_BASE_URL
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
    HISTORY: (id: string) => `/customers/${id}/history`,
    SERVICES: (id: string) => `/customers/${id}/services`,
    CONTACTS: (id: string) => `/customers/${id}/contacts`,
    NOTES: (id: string) => `/customers/${id}/notes`,
    SEARCH: '/customers/search',
  },

  // Employees
  EMPLOYEES: {
    LIST: '/employees',
    DETAIL: (id: string) => `/employees/${id}`,
    CREATE: '/employees',
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
    SUMMARY: (id: string) => `/employees/${id}/summary`,
    SCHEDULE: (id: string) => `/employees/${id}/schedule`,
    CUSTOMERS: (id: string) => `/employees/${id}/customers`,
  },

  // Invoices
  INVOICES: {
    LIST: '/invoices',
    DETAIL: (id: string) => `/invoices/${id}`,
    CREATE: '/invoices',
    UPDATE: (id: string) => `/invoices/${id}`,
    DELETE: (id: string) => `/invoices/${id}`,
    SEND_EMAIL: (id: string) => `/invoices/${id}/email`,
    GENERATE_PDF: (id: string) => `/invoices/${id}/pdf`,
    QUICK_CREATE: '/invoices/quick',
    LINE_ITEMS: (id: string) => `/invoices/${id}/line-items`,
  },

  // Payments
  PAYMENTS: {
    LIST: '/payments',
    DETAIL: (id: string) => `/payments/${id}`,
    CREATE: '/payments',
    UPDATE: (id: string) => `/payments/${id}`,
    DELETE: (id: string) => `/payments/${id}`,
    HISTORY: '/payments/history',
    BY_INVOICE: (invoiceId: string) => `/invoices/${invoiceId}/payments`,
  },

  // Services & Products
  SERVICES: {
    LIST: '/services',
    DETAIL: (id: string) => `/services/${id}`,
    CREATE: '/services',
    UPDATE: (id: string) => `/services/${id}`,
    DELETE: (id: string) => `/services/${id}`,
    CATEGORIES: '/services/categories',
  },

  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
  },

  // Reports
  REPORTS: {
    ROYALTY: '/reports/royalty',
    TAX_DUE: '/reports/tax-due',
    PRODUCTS: '/reports/products',
    SERVICES: '/reports/services',
    EMPLOYEES: '/reports/employees',
    CUSTOMERS: '/reports/customers',
    SALES: '/reports/sales',
    COMMISSIONS: '/reports/commissions',
    CUSTOMERS_BY_EMPLOYEE: '/reports/customers-by-employee',
    SERVICE_FREQUENCY: '/reports/service-frequency',
  },

  // Settings
  SETTINGS: {
    GENERAL: '/settings/general',
    COMPANY: '/settings/company',
    NOTIFICATIONS: '/settings/notifications',
  },
} as const;
