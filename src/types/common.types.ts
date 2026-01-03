/**
 * Common Type Definitions
 */

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Sorting
export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Filter
export interface FilterParams {
  search?: string;
  [key: string]: unknown;
}

// Combined query params
export interface QueryParams extends PaginationParams, Partial<SortParams>, FilterParams {}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

// Select Option
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Address
export interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

// Contact Info
export interface ContactInfo {
  phone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  website?: string;
}

// Date Range
export interface DateRange {
  startDate: Date | string | null;
  endDate: Date | string | null;
}

// Key Value Pair
export interface KeyValue<K = string, V = string> {
  key: K;
  value: V;
}

// Status with color
export interface StatusOption {
  value: string;
  label: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

// Table Column Definition
export interface TableColumn<T = unknown> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

// Tab Definition
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

// Menu Item
export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: MenuItem[];
}

// Breadcrumb
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

// Modal/Dialog Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Form Field
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helper?: string;
}

// Action Button
export interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

// Notification
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

// File Upload
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

// Search Result
export interface SearchResult<T = unknown> {
  type: string;
  item: T;
  matchedFields: string[];
}

// Activity Log
export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Note
export interface Note {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

// Attachment
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}
