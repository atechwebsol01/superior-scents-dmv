import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EmployeeStore, Employee, EmployeeFormData, EmployeeFilters } from '../types/employee.types';

// Mock data for demo
const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Robert',
    lastName: 'Anderson',
    email: 'robert.a@superiorscents.com',
    phone: '(202) 555-1001',
    role: 'manager',
    department: 'Operations',
    hireDate: '2022-03-15',
    status: 'active',
    salary: 65000,
    commissionRate: 5,
    address: { street: '100 Manager Lane', city: 'Washington', state: 'DC', zipCode: '20001' },
    emergencyContact: { name: 'Mary Anderson', phone: '(202) 555-1002', relationship: 'Spouse' },
    assignedCustomers: ['1', '2', '6'],
    createdAt: '2022-03-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
  {
    id: '2',
    firstName: 'Lisa',
    lastName: 'Martinez',
    email: 'lisa.m@superiorscents.com',
    phone: '(301) 555-2001',
    role: 'technician',
    department: 'Field Services',
    hireDate: '2023-01-10',
    status: 'active',
    salary: 45000,
    commissionRate: 8,
    address: { street: '200 Tech Ave', city: 'Bethesda', state: 'MD', zipCode: '20814' },
    assignedCustomers: ['3', '4'],
    createdAt: '2023-01-10T09:00:00Z',
    updatedAt: '2024-03-18T11:00:00Z',
  },
  {
    id: '3',
    firstName: 'James',
    lastName: 'Thompson',
    email: 'james.t@superiorscents.com',
    phone: '(703) 555-3001',
    role: 'technician',
    department: 'Field Services',
    hireDate: '2023-06-01',
    status: 'active',
    salary: 42000,
    commissionRate: 8,
    address: { street: '300 Service Rd', city: 'Arlington', state: 'VA', zipCode: '22201' },
    assignedCustomers: ['5'],
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2024-03-15T16:00:00Z',
  },
  {
    id: '4',
    firstName: 'Amanda',
    lastName: 'Wilson',
    email: 'amanda.w@superiorscents.com',
    phone: '(202) 555-4001',
    role: 'sales',
    department: 'Sales',
    hireDate: '2023-09-15',
    status: 'active',
    salary: 40000,
    commissionRate: 12,
    address: { street: '400 Sales Blvd', city: 'Washington', state: 'DC', zipCode: '20002' },
    createdAt: '2023-09-15T10:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
  },
  {
    id: '5',
    firstName: 'Kevin',
    lastName: 'Brown',
    email: 'kevin.b@superiorscents.com',
    phone: '(301) 555-5001',
    role: 'technician',
    department: 'Field Services',
    hireDate: '2022-11-20',
    status: 'on-leave',
    salary: 44000,
    commissionRate: 8,
    address: { street: '500 Field Way', city: 'Silver Spring', state: 'MD', zipCode: '20910' },
    createdAt: '2022-11-20T11:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
  },
  {
    id: '6',
    firstName: 'Patricia',
    lastName: 'Garcia',
    email: 'patricia.g@superiorscents.com',
    phone: '(703) 555-6001',
    role: 'admin',
    department: 'Administration',
    hireDate: '2021-08-01',
    status: 'active',
    salary: 55000,
    address: { street: '600 Admin Circle', city: 'Alexandria', state: 'VA', zipCode: '22301' },
    emergencyContact: { name: 'Carlos Garcia', phone: '(703) 555-6002', relationship: 'Spouse' },
    createdAt: '2021-08-01T09:00:00Z',
    updatedAt: '2024-03-22T14:00:00Z',
  },
];

export const useEmployeeStore = create<EmployeeStore>()(
  devtools(
    (set, get) => ({
      employees: [],
      selectedEmployee: null,
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        role: 'all',
        sortBy: 'name',
        sortOrder: 'asc',
      },

      fetchEmployees: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { filters } = get();
          let filtered = [...mockEmployees];

          if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(e => 
              e.firstName.toLowerCase().includes(search) ||
              e.lastName.toLowerCase().includes(search) ||
              e.email.toLowerCase().includes(search) ||
              e.department.toLowerCase().includes(search)
            );
          }

          if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(e => e.status === filters.status);
          }

          if (filters.role && filters.role !== 'all') {
            filtered = filtered.filter(e => e.role === filters.role);
          }

          filtered.sort((a, b) => {
            let aVal: string, bVal: string;
            switch (filters.sortBy) {
              case 'hireDate':
                aVal = a.hireDate;
                bVal = b.hireDate;
                break;
              case 'role':
                aVal = a.role;
                bVal = b.role;
                break;
              default:
                aVal = `${a.firstName} ${a.lastName}`;
                bVal = `${b.firstName} ${b.lastName}`;
            }
            const cmp = aVal.localeCompare(bVal);
            return filters.sortOrder === 'desc' ? -cmp : cmp;
          });

          set({ employees: filtered, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch employees', isLoading: false });
        }
      },

      fetchEmployeeById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const employee = mockEmployees.find(e => e.id === id);
          if (!employee) throw new Error('Employee not found');
          set({ selectedEmployee: employee, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch employee', isLoading: false });
        }
      },

      createEmployee: async (data: EmployeeFormData) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newEmployee: Employee = {
            id: String(Date.now()),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            role: data.role,
            department: data.department,
            hireDate: data.hireDate,
            status: data.status,
            salary: data.salary,
            commissionRate: data.commissionRate,
            address: {
              street: data.street,
              city: data.city,
              state: data.state,
              zipCode: data.zipCode,
            },
            emergencyContact: data.emergencyContactName ? {
              name: data.emergencyContactName,
              phone: data.emergencyContactPhone || '',
              relationship: data.emergencyContactRelationship || '',
            } : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          mockEmployees.unshift(newEmployee);
          set({ isLoading: false });
          return newEmployee;
        } catch {
          set({ error: 'Failed to create employee', isLoading: false });
          throw new Error('Failed to create employee');
        }
      },

      updateEmployee: async (id: string, data: Partial<EmployeeFormData>) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const index = mockEmployees.findIndex(e => e.id === id);
          if (index === -1) throw new Error('Employee not found');
          
          const updated: Employee = {
            ...mockEmployees[index],
            ...data,
            address: data.street ? {
              street: data.street,
              city: data.city || mockEmployees[index].address.city,
              state: data.state || mockEmployees[index].address.state,
              zipCode: data.zipCode || mockEmployees[index].address.zipCode,
            } : mockEmployees[index].address,
            updatedAt: new Date().toISOString(),
          };
          
          mockEmployees[index] = updated;
          set({ selectedEmployee: updated, isLoading: false });
          return updated;
        } catch {
          set({ error: 'Failed to update employee', isLoading: false });
          throw new Error('Failed to update employee');
        }
      },

      deleteEmployee: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const index = mockEmployees.findIndex(e => e.id === id);
          if (index !== -1) mockEmployees.splice(index, 1);
          set({ isLoading: false });
          get().fetchEmployees();
        } catch {
          set({ error: 'Failed to delete employee', isLoading: false });
        }
      },

      setFilters: (filters: Partial<EmployeeFilters>) => {
        set({ filters: { ...get().filters, ...filters } });
        get().fetchEmployees();
      },

      clearSelectedEmployee: () => set({ selectedEmployee: null }),
      clearError: () => set({ error: null }),
    }),
    { name: 'employee-store' }
  )
);

export default useEmployeeStore;
