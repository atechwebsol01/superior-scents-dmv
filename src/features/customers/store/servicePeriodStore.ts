import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ServicePeriodStore,
  ServicePeriod,
  ServiceDetail,
  ChangeLogEntry,
  CustomerContact,
  ServicePeriodFormData,
  ServiceDetailFormData,
  ServicePeriodFilters,
} from '../types/servicePeriod.types';

// Mock Service Reps
const serviceReps = [
  { id: '1', name: 'Rodney Bush' },
  { id: '2', name: 'Shamir Dozier' },
  { id: '3', name: 'Anthony Dozier' },
  { id: '4', name: 'Chris Marsh' },
  { id: '5', name: 'MITCH MURRATOHY' },
];

// Mock data
const mockServicePeriods: ServicePeriod[] = [
  {
    id: '131348',
    customerId: '1',
    periodCode: 'Q2',
    day: 'Wednesday',
    serviceRepId: '1',
    serviceRepName: 'R. Bush',
    serviceDate: '2025-10-30',
    dateLast: '2025-10-30',
    freight: 0,
    amount: 72.00,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
];

const mockServiceDetails: ServiceDetail[] = [
  {
    id: '1',
    servicePeriodId: '131348',
    type: 'service',
    serviceId: 'D93',
    serviceName: 'Deodorizer Service (Mist Atomizer)',
    price: 12.00,
    quantity: 5,
    total: 60.00,
    fragrance: 'Black Bamboo :: 86',
    isTaxable: true,
    isOneTimeItem: false,
    salesRepId: '3',
    salesRepName: 'Anthony Dozier',
    saleDate: '2025-10-30',
    payCommission: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
  {
    id: '2',
    servicePeriodId: '131348',
    type: 'product',
    productId: 'Curve',
    productName: 'Curve',
    productCode: 'Curve :: $6.00 :: 20802',
    price: 6.00,
    quantity: 2,
    total: 12.00,
    isTaxable: true,
    isOneTimeItem: false,
    salesRepId: '3',
    salesRepName: 'Anthony Dozier',
    saleDate: '2025-10-30',
    payCommission: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
];

const mockChangeLog: ChangeLogEntry[] = [
  {
    id: '1',
    entityType: 'service_period',
    entityId: '131348',
    action: 'update',
    field: 'amount',
    oldValue: '65.00',
    newValue: '72.00',
    userId: '1',
    userName: 'Admin User',
    timestamp: '2024-03-20T14:30:00Z',
  },
];

const mockContacts: CustomerContact[] = [
  {
    id: '1',
    customerId: '1',
    name: 'John Smith',
    title: 'Owner',
    email: 'john@example.com',
    phone: '(202) 555-0123',
    isPrimary: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    customerId: '1',
    name: 'Jane Smith',
    title: 'Manager',
    email: 'jane@example.com',
    phone: '(202) 555-0124',
    isPrimary: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export const useServicePeriodStore = create<ServicePeriodStore>()(
  devtools(
    (set, get) => ({
      servicePeriods: [],
      serviceDetails: [],
      changeLog: [],
      contacts: [],
      selectedPeriod: null,
      isLoading: false,
      error: null,
      filters: {},

      fetchServicePeriods: async (customerId: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const periods = mockServicePeriods.filter(p => p.customerId === customerId || customerId === '1');
          set({ servicePeriods: periods, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch service periods', isLoading: false });
        }
      },

      fetchServiceDetails: async (periodId: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          const details = mockServiceDetails.filter(d => d.servicePeriodId === periodId);
          set({ serviceDetails: details, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch service details', isLoading: false });
        }
      },

      fetchChangeLog: async (_customerId: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          set({ changeLog: mockChangeLog, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch change log', isLoading: false });
        }
      },

      fetchContacts: async (customerId: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          const contacts = mockContacts.filter(c => c.customerId === customerId || customerId === '1');
          set({ contacts, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch contacts', isLoading: false });
        }
      },

      createServicePeriod: async (customerId: string, data: ServicePeriodFormData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const rep = serviceReps.find(r => r.id === data.serviceRepId);
          const newPeriod: ServicePeriod = {
            id: String(Date.now()),
            customerId,
            periodCode: data.periodCode,
            day: data.day,
            serviceRepId: data.serviceRepId,
            serviceRepName: rep?.name || 'Unknown',
            serviceDate: new Date().toISOString().split('T')[0],
            dateLast: data.dateLast,
            frequencyDM: data.frequencyDM,
            dayOfMonth: data.dayOfMonth,
            freight: 0,
            amount: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockServicePeriods.push(newPeriod);
          set({ servicePeriods: [...get().servicePeriods, newPeriod], isLoading: false });
          return newPeriod;
        } catch {
          set({ error: 'Failed to create service period', isLoading: false });
          throw new Error('Failed to create service period');
        }
      },

      updateServicePeriod: async (id: string, data: Partial<ServicePeriodFormData>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const index = mockServicePeriods.findIndex(p => p.id === id);
          if (index === -1) throw new Error('Period not found');
          
          const updated = { ...mockServicePeriods[index], ...data, updatedAt: new Date().toISOString() };
          mockServicePeriods[index] = updated;
          set({ 
            servicePeriods: get().servicePeriods.map(p => p.id === id ? updated : p),
            isLoading: false 
          });
          return updated;
        } catch {
          set({ error: 'Failed to update service period', isLoading: false });
          throw new Error('Failed to update service period');
        }
      },

      deleteServicePeriod: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const index = mockServicePeriods.findIndex(p => p.id === id);
          if (index !== -1) mockServicePeriods.splice(index, 1);
          set({ 
            servicePeriods: get().servicePeriods.filter(p => p.id !== id),
            isLoading: false 
          });
        } catch {
          set({ error: 'Failed to delete service period', isLoading: false });
          throw new Error('Failed to delete service period');
        }
      },

      copyServicePeriod: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const original = mockServicePeriods.find(p => p.id === id);
          if (!original) throw new Error('Period not found');
          
          const copied: ServicePeriod = {
            ...original,
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockServicePeriods.push(copied);
          set({ servicePeriods: [...get().servicePeriods, copied], isLoading: false });
          return copied;
        } catch {
          set({ error: 'Failed to copy service period', isLoading: false });
          throw new Error('Failed to copy service period');
        }
      },

      createServiceDetail: async (periodId: string, data: ServiceDetailFormData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const rep = serviceReps.find(r => r.id === data.salesRepId);
          const newDetail: ServiceDetail = {
            id: String(Date.now()),
            servicePeriodId: periodId,
            type: data.type,
            serviceId: data.serviceId,
            productId: data.productId,
            price: data.price,
            quantity: data.quantity,
            total: data.price * data.quantity,
            fragrance: data.fragrance,
            notes: data.notes,
            isTaxable: data.isTaxable,
            isOneTimeItem: data.isOneTimeItem,
            salesRepId: data.salesRepId,
            salesRepName: rep?.name,
            saleDate: data.saleDate,
            payCommission: data.payCommission,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockServiceDetails.push(newDetail);
          set({ serviceDetails: [...get().serviceDetails, newDetail], isLoading: false });
          return newDetail;
        } catch {
          set({ error: 'Failed to create service detail', isLoading: false });
          throw new Error('Failed to create service detail');
        }
      },

      updateServiceDetail: async (id: string, data: Partial<ServiceDetailFormData>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const index = mockServiceDetails.findIndex(d => d.id === id);
          if (index === -1) throw new Error('Detail not found');
          
          const updated = { 
            ...mockServiceDetails[index], 
            ...data, 
            total: (data.price || mockServiceDetails[index].price) * (data.quantity || mockServiceDetails[index].quantity),
            updatedAt: new Date().toISOString() 
          };
          mockServiceDetails[index] = updated;
          set({ 
            serviceDetails: get().serviceDetails.map(d => d.id === id ? updated : d),
            isLoading: false 
          });
          return updated;
        } catch {
          set({ error: 'Failed to update service detail', isLoading: false });
          throw new Error('Failed to update service detail');
        }
      },

      deleteServiceDetail: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const index = mockServiceDetails.findIndex(d => d.id === id);
          if (index !== -1) mockServiceDetails.splice(index, 1);
          set({ 
            serviceDetails: get().serviceDetails.filter(d => d.id !== id),
            isLoading: false 
          });
        } catch {
          set({ error: 'Failed to delete service detail', isLoading: false });
          throw new Error('Failed to delete service detail');
        }
      },

      createContact: async (customerId: string, data) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const newContact: CustomerContact = {
            id: String(Date.now()),
            customerId,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockContacts.push(newContact);
          set({ contacts: [...get().contacts, newContact], isLoading: false });
          return newContact;
        } catch {
          set({ error: 'Failed to create contact', isLoading: false });
          throw new Error('Failed to create contact');
        }
      },

      updateContact: async (id: string, data: Partial<CustomerContact>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const index = mockContacts.findIndex(c => c.id === id);
          if (index === -1) throw new Error('Contact not found');
          
          const updated = { ...mockContacts[index], ...data, updatedAt: new Date().toISOString() };
          mockContacts[index] = updated;
          set({ 
            contacts: get().contacts.map(c => c.id === id ? updated : c),
            isLoading: false 
          });
          return updated;
        } catch {
          set({ error: 'Failed to update contact', isLoading: false });
          throw new Error('Failed to update contact');
        }
      },

      deleteContact: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const index = mockContacts.findIndex(c => c.id === id);
          if (index !== -1) mockContacts.splice(index, 1);
          set({ 
            contacts: get().contacts.filter(c => c.id !== id),
            isLoading: false 
          });
        } catch {
          set({ error: 'Failed to delete contact', isLoading: false });
          throw new Error('Failed to delete contact');
        }
      },

      setSelectedPeriod: (period: ServicePeriod | null) => {
        set({ selectedPeriod: period });
      },

      setFilters: (filters: Partial<ServicePeriodFilters>) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'service-period-store' }
  )
);

export { serviceReps };
export default useServicePeriodStore;
