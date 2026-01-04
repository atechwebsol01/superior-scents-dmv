import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CustomerStore, Customer, CustomerFormData, CustomerFilters } from '../types/customer.types';

// Mock data for demo
const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '(202) 555-0123',
    company: 'ABC Corporation',
    address: { street: '123 Main St', city: 'Washington', state: 'DC', zipCode: '20001' },
    status: 'active',
    assignedEmployeeId: '1',
    tags: ['premium', 'commercial'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '(301) 555-0456',
    company: 'XYZ Industries',
    address: { street: '456 Oak Ave', city: 'Bethesda', state: 'MD', zipCode: '20814' },
    status: 'active',
    assignedEmployeeId: '2',
    tags: ['commercial'],
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-03-18T11:00:00Z',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'mwilliams@example.com',
    phone: '(703) 555-0789',
    address: { street: '789 Pine Rd', city: 'Arlington', state: 'VA', zipCode: '22201' },
    status: 'active',
    tags: ['residential'],
    createdAt: '2024-02-20T15:00:00Z',
    updatedAt: '2024-03-15T16:00:00Z',
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily.brown@example.com',
    phone: '(202) 555-1234',
    company: 'Brown & Associates',
    address: { street: '321 Elm St', city: 'Washington', state: 'DC', zipCode: '20002' },
    status: 'pending',
    assignedEmployeeId: '1',
    tags: ['new', 'commercial'],
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Miller',
    email: 'dmiller@example.com',
    phone: '(301) 555-5678',
    address: { street: '654 Maple Dr', city: 'Silver Spring', state: 'MD', zipCode: '20910' },
    status: 'inactive',
    notes: 'Relocated to another state',
    createdAt: '2023-11-05T12:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
  },
  {
    id: '6',
    firstName: 'Jessica',
    lastName: 'Davis',
    email: 'jdavis@example.com',
    phone: '(703) 555-9012',
    company: 'Davis Enterprises',
    address: { street: '987 Cedar Ln', city: 'Alexandria', state: 'VA', zipCode: '22301' },
    status: 'active',
    assignedEmployeeId: '3',
    tags: ['premium', 'commercial'],
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-03-22T09:00:00Z',
  },
];

export const useCustomerStore = create<CustomerStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      customers: [],
      selectedCustomer: null,
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        sortBy: 'name',
        sortOrder: 'asc',
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },

      // Actions
      fetchCustomers: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { filters } = get();
          let filtered = [...mockCustomers];

          // Apply search filter
          if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(c => 
              c.firstName.toLowerCase().includes(search) ||
              c.lastName.toLowerCase().includes(search) ||
              c.email.toLowerCase().includes(search) ||
              c.company?.toLowerCase().includes(search)
            );
          }

          // Apply status filter
          if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(c => c.status === filters.status);
          }

          // Apply sorting
          filtered.sort((a, b) => {
            let aVal: string, bVal: string;
            switch (filters.sortBy) {
              case 'company':
                aVal = a.company || '';
                bVal = b.company || '';
                break;
              case 'createdAt':
                aVal = a.createdAt;
                bVal = b.createdAt;
                break;
              case 'updatedAt':
                aVal = a.updatedAt;
                bVal = b.updatedAt;
                break;
              default:
                aVal = `${a.firstName} ${a.lastName}`;
                bVal = `${b.firstName} ${b.lastName}`;
            }
            const cmp = aVal.localeCompare(bVal);
            return filters.sortOrder === 'desc' ? -cmp : cmp;
          });

          set({
            customers: filtered,
            isLoading: false,
            pagination: { ...get().pagination, total: filtered.length },
          });
        } catch (error) {
          set({
            error: 'Failed to fetch customers',
            isLoading: false,
          });
        }
      },

      fetchCustomerById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const customer = mockCustomers.find(c => c.id === id);
          if (!customer) {
            throw new Error('Customer not found');
          }
          
          set({ selectedCustomer: customer, isLoading: false });
        } catch (error) {
          set({
            error: 'Failed to fetch customer',
            isLoading: false,
          });
        }
      },

      createCustomer: async (data: CustomerFormData) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newCustomer: Customer = {
            id: String(Date.now()),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
            address: {
              street: data.street,
              city: data.city,
              state: data.state,
              zipCode: data.zipCode,
            },
            status: data.status,
            notes: data.notes,
            assignedEmployeeId: data.assignedEmployeeId,
            tags: data.tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          mockCustomers.unshift(newCustomer);
          set({ isLoading: false });
          
          return newCustomer;
        } catch (error) {
          set({ error: 'Failed to create customer', isLoading: false });
          throw error;
        }
      },

      updateCustomer: async (id: string, data: Partial<CustomerFormData>) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const index = mockCustomers.findIndex(c => c.id === id);
          if (index === -1) throw new Error('Customer not found');
          
          const updated: Customer = {
            ...mockCustomers[index],
            ...data,
            address: data.street ? {
              street: data.street,
              city: data.city || mockCustomers[index].address.city,
              state: data.state || mockCustomers[index].address.state,
              zipCode: data.zipCode || mockCustomers[index].address.zipCode,
            } : mockCustomers[index].address,
            updatedAt: new Date().toISOString(),
          };
          
          mockCustomers[index] = updated;
          set({ selectedCustomer: updated, isLoading: false });
          
          return updated;
        } catch (error) {
          set({ error: 'Failed to update customer', isLoading: false });
          throw error;
        }
      },

      deleteCustomer: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const index = mockCustomers.findIndex(c => c.id === id);
          if (index !== -1) {
            mockCustomers.splice(index, 1);
          }
          
          set({ isLoading: false });
          get().fetchCustomers();
        } catch (error) {
          set({ error: 'Failed to delete customer', isLoading: false });
          throw error;
        }
      },

      setFilters: (filters: Partial<CustomerFilters>) => {
        set({ filters: { ...get().filters, ...filters } });
        get().fetchCustomers();
      },

      clearSelectedCustomer: () => {
        set({ selectedCustomer: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'customer-store' }
  )
);

export default useCustomerStore;
