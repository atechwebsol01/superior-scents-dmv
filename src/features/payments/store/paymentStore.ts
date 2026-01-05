import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PaymentStore, Payment, PaymentFormData, PaymentFilters } from '../types/payment.types';

const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'Johnson & Associates',
    amount: 412.34,
    paymentMethod: 'credit_card',
    paymentDate: '2024-03-15',
    referenceNumber: 'CC-4521',
    status: 'completed',
    createdAt: '2024-03-15T14:30:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: '2',
    invoiceId: '4',
    invoiceNumber: 'INV-2024-004',
    customerId: '4',
    customerName: 'Capital City Spa',
    amount: 700,
    paymentMethod: 'bank_transfer',
    paymentDate: '2024-03-12',
    referenceNumber: 'BT-78542',
    notes: 'Partial payment',
    status: 'completed',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
  },
  {
    id: '3',
    invoiceId: '6',
    invoiceNumber: 'INV-2024-006',
    customerId: '2',
    customerName: 'Metro Medical Center',
    amount: 1500,
    paymentMethod: 'check',
    paymentDate: '2024-03-08',
    referenceNumber: 'CHK-1234',
    status: 'completed',
    createdAt: '2024-03-08T09:00:00Z',
    updatedAt: '2024-03-08T09:00:00Z',
  },
  {
    id: '4',
    invoiceId: '7',
    invoiceNumber: 'INV-2024-007',
    customerId: '3',
    customerName: 'Arlington Auto Group',
    amount: 250,
    paymentMethod: 'cash',
    paymentDate: '2024-03-05',
    status: 'completed',
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-05T11:00:00Z',
  },
  {
    id: '5',
    invoiceId: '8',
    invoiceNumber: 'INV-2024-008',
    customerId: '5',
    customerName: 'Silver Spring Fitness',
    amount: 399,
    paymentMethod: 'credit_card',
    paymentDate: '2024-03-01',
    referenceNumber: 'CC-9876',
    status: 'refunded',
    notes: 'Customer cancelled service',
    createdAt: '2024-03-01T15:00:00Z',
    updatedAt: '2024-03-03T10:00:00Z',
  },
];

export const usePaymentStore = create<PaymentStore>()(
  devtools(
    (set, get) => ({
      payments: [],
      selectedPayment: null,
      isLoading: false,
      error: null,
      filters: { status: 'all', paymentMethod: 'all', sortBy: 'paymentDate', sortOrder: 'desc' },

      fetchPayments: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 500));
          const { filters } = get();
          let filtered = [...mockPayments];

          if (filters.search) {
            const s = filters.search.toLowerCase();
            filtered = filtered.filter(p =>
              p.invoiceNumber.toLowerCase().includes(s) ||
              p.customerName.toLowerCase().includes(s) ||
              p.referenceNumber?.toLowerCase().includes(s)
            );
          }
          if (filters.status && filters.status !== 'all') filtered = filtered.filter(p => p.status === filters.status);
          if (filters.paymentMethod && filters.paymentMethod !== 'all') filtered = filtered.filter(p => p.paymentMethod === filters.paymentMethod);
          if (filters.customerId) filtered = filtered.filter(p => p.customerId === filters.customerId);

          filtered.sort((a, b) => {
            let aVal: string | number, bVal: string | number;
            switch (filters.sortBy) {
              case 'amount': aVal = a.amount; bVal = b.amount; break;
              case 'customerName': aVal = a.customerName; bVal = b.customerName; break;
              default: aVal = a.paymentDate; bVal = b.paymentDate;
            }
            const cmp = typeof aVal === 'number' ? aVal - (bVal as number) : aVal.localeCompare(bVal as string);
            return filters.sortOrder === 'desc' ? -cmp : cmp;
          });

          set({ payments: filtered, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch payments', isLoading: false });
        }
      },

      fetchPaymentById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 300));
          const payment = mockPayments.find(p => p.id === id);
          if (!payment) throw new Error('Not found');
          set({ selectedPayment: payment, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch payment', isLoading: false });
        }
      },

      createPayment: async (data: PaymentFormData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 500));
          const newPayment: Payment = {
            id: String(Date.now()),
            invoiceId: data.invoiceId,
            invoiceNumber: 'INV-2024-XXX',
            customerId: '1',
            customerName: 'Customer',
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            paymentDate: data.paymentDate,
            referenceNumber: data.referenceNumber,
            notes: data.notes,
            status: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockPayments.unshift(newPayment);
          set({ isLoading: false });
          return newPayment;
        } catch {
          set({ error: 'Failed to create payment', isLoading: false });
          throw new Error('Failed');
        }
      },

      deletePayment: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 500));
          const idx = mockPayments.findIndex(p => p.id === id);
          if (idx !== -1) mockPayments.splice(idx, 1);
          set({ isLoading: false });
          get().fetchPayments();
        } catch {
          set({ error: 'Failed to delete', isLoading: false });
        }
      },

      refundPayment: async (id: string) => {
        set({ isLoading: true });
        try {
          await new Promise(r => setTimeout(r, 500));
          const idx = mockPayments.findIndex(p => p.id === id);
          if (idx !== -1) {
            mockPayments[idx] = { ...mockPayments[idx], status: 'refunded', updatedAt: new Date().toISOString() };
            set({ selectedPayment: mockPayments[idx], isLoading: false });
          }
        } catch {
          set({ error: 'Failed to refund', isLoading: false });
        }
      },

      setFilters: (filters: Partial<PaymentFilters>) => {
        set({ filters: { ...get().filters, ...filters } });
        get().fetchPayments();
      },

      clearSelectedPayment: () => set({ selectedPayment: null }),
      clearError: () => set({ error: null }),
    }),
    { name: 'payment-store' }
  )
);

export default usePaymentStore;
