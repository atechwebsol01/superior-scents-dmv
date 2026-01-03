/**
 * Application Constants
 * Superior Scents DMV, LLC - Webbase Client
 */

// Company Information
export const COMPANY_NAME = 'Superior Scents DMV, LLC';
export const COMPANY_SHORT_NAME = 'Superior Scents';
export const APP_NAME = 'Webbase';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'MMM d, yyyy';
export const DATE_TIME_FORMAT = 'MMM d, yyyy h:mm a';
export const TIME_FORMAT = 'h:mm a';
export const DATE_INPUT_FORMAT = 'yyyy-MM-dd';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'webbase_token',
  USER: 'webbase_user',
  THEME: 'webbase_theme',
  SIDEBAR_COLLAPSED: 'webbase_sidebar_collapsed',
} as const;

// Navigation Items
export const NAV_ITEMS = [
  { id: 'customers', label: 'Customers', path: '/customers', icon: 'Users' },
  { id: 'employees', label: 'Employees', path: '/employees', icon: 'UserCog' },
  { id: 'invoices', label: 'Invoices', path: '/invoices', icon: 'FileText' },
  { id: 'payments', label: 'Payments', path: '/payments', icon: 'CreditCard' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'BarChart3' },
] as const;

// Menu Items
export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { id: 'customers', label: 'Customers', path: '/customers', icon: 'Users' },
  { id: 'employees', label: 'Employees', path: '/employees', icon: 'UserCog' },
  { id: 'invoices', label: 'Invoices', path: '/invoices', icon: 'FileText' },
  { id: 'payments', label: 'Payments', path: '/payments', icon: 'CreditCard' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'BarChart3' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'Settings' },
] as const;

// Customer Types
export const CUSTOMER_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
] as const;

// Customer Sources
export const CUSTOMER_SOURCES = [
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'advertising', label: 'Advertising' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'other', label: 'Other' },
] as const;

// Service Periods
export const SERVICE_PERIODS = [
  { value: 'Q1', label: 'Q1 (Jan-Mar)' },
  { value: 'Q2', label: 'Q2 (Apr-Jun)' },
  { value: 'Q3', label: 'Q3 (Jul-Sep)' },
  { value: 'Q4', label: 'Q4 (Oct-Dec)' },
] as const;

// Days of Week
export const DAYS_OF_WEEK = [
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
] as const;

// Frequency Options
export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
  { value: 'one_time', label: 'One Time' },
] as const;

// Invoice Status
export const INVOICE_STATUS = [
  { value: 'draft', label: 'Draft', color: 'neutral' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'sent', label: 'Sent', color: 'info' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'overdue', label: 'Overdue', color: 'error' },
  { value: 'cancelled', label: 'Cancelled', color: 'neutral' },
] as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
] as const;

// Payment Status
export const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' },
  { value: 'refunded', label: 'Refunded', color: 'info' },
] as const;

// Report Types
export const REPORT_TYPES = [
  { value: 'royalty', label: 'Royalty Report', path: '/reports/royalty' },
  { value: 'tax_due', label: 'Tax Due Report', path: '/reports/tax-due' },
  { value: 'products', label: 'Products Report', path: '/reports/products' },
  { value: 'services', label: 'Services Summary', path: '/reports/services' },
  { value: 'employees', label: 'Employees Report', path: '/reports/employees' },
  { value: 'customers', label: 'Customers Report', path: '/reports/customers' },
  { value: 'sales', label: 'Sales Report', path: '/reports/sales' },
  { value: 'commissions', label: 'Commission Report', path: '/reports/commissions' },
] as const;

// Date Range Presets
export const DATE_RANGE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'last_quarter', label: 'Last Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'last_year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
] as const;

// US States
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  SAVED: 'Successfully saved.',
  SENT: 'Successfully sent.',
} as const;
