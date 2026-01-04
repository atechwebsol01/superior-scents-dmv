/**
 * Employee Types
 * Superior Scents DMV, LLC
 */

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'technician' | 'sales';
  department: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  salary?: number;
  commissionRate?: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  avatar?: string;
  assignedCustomers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSchedule {
  id: string;
  employeeId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface EmployeeSummary {
  totalCustomers: number;
  totalServices: number;
  totalRevenue: number;
  completedJobs: number;
  pendingJobs: number;
  rating: number;
}

export interface EmployeeFilters {
  search?: string;
  status?: Employee['status'] | 'all';
  role?: Employee['role'] | 'all';
  department?: string;
  sortBy?: 'name' | 'hireDate' | 'role';
  sortOrder?: 'asc' | 'desc';
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Employee['role'];
  department: string;
  hireDate: string;
  status: Employee['status'];
  salary?: number;
  commissionRate?: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  filters: EmployeeFilters;
}

export interface EmployeeActions {
  fetchEmployees: () => Promise<void>;
  fetchEmployeeById: (id: string) => Promise<void>;
  createEmployee: (data: EmployeeFormData) => Promise<Employee>;
  updateEmployee: (id: string, data: Partial<EmployeeFormData>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  setFilters: (filters: Partial<EmployeeFilters>) => void;
  clearSelectedEmployee: () => void;
  clearError: () => void;
}

export type EmployeeStore = EmployeeState & EmployeeActions;
