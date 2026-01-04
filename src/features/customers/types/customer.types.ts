/**
 * Customer Types
 * Superior Scents DMV, LLC
 */

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  assignedEmployeeId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerContact {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

export interface CustomerService {
  id: string;
  customerId: string;
  serviceName: string;
  description: string;
  frequency: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  price: number;
  startDate: string;
  nextServiceDate?: string;
  status: 'active' | 'paused' | 'completed';
}

export interface CustomerHistory {
  id: string;
  customerId: string;
  type: 'service' | 'payment' | 'note' | 'status_change' | 'contact';
  description: string;
  date: string;
  performedBy: string;
  metadata?: Record<string, unknown>;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  search?: string;
  status?: Customer['status'] | 'all';
  assignedEmployeeId?: string;
  tags?: string[];
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'company';
  sortOrder?: 'asc' | 'desc';
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  status: Customer['status'];
  notes?: string;
  assignedEmployeeId?: string;
  tags?: string[];
}

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  filters: CustomerFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CustomerActions {
  fetchCustomers: () => Promise<void>;
  fetchCustomerById: (id: string) => Promise<void>;
  createCustomer: (data: CustomerFormData) => Promise<Customer>;
  updateCustomer: (id: string, data: Partial<CustomerFormData>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  setFilters: (filters: Partial<CustomerFilters>) => void;
  clearSelectedCustomer: () => void;
  clearError: () => void;
}

export type CustomerStore = CustomerState & CustomerActions;
