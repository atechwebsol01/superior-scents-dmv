import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { InvoiceStore, Invoice, InvoiceFormData, InvoiceFilters } from '../types/invoice.types';

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'Johnson & Associates',
    customerEmail: 'contact@johnsonassoc.com',
    customerPhone: '(202) 555-0101',
    customerAddress: '123 Business Ave, Washington, DC 20001',
    status: 'paid',
    issueDate: '2024-03-01',
    dueDate: '2024-03-15',
    lineItems: [
      { id: '1', description: 'Monthly Scent Service - Premium', quantity: 1, unitPrice: 299, total: 299, type: 'service' },
      { id: '2', description: 'Essential Oil Refill Pack', quantity: 2, unitPrice: 45, total: 90, type: 'product' },
    ],
    subtotal: 389,
    taxRate: 6,
    taxAmount: 23.34,
    discount: 0,
    total: 412.34,
    amountPaid: 412.34,
    balance: 0,
    notes: 'Thank you for your business!',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerId: '2',
    customerName: 'Metro Medical Center',
    customerEmail: 'facilities@metromedical.com',
    customerPhone: '(301) 555-0202',
    customerAddress: '456 Health Plaza, Bethesda, MD 20814',
    status: 'sent',
    issueDate: '2024-03-10',
    dueDate: '2024-03-25',
    lineItems: [
      { id: '1', description: 'Commercial Scent System Install', quantity: 1, unitPrice: 1500, total: 1500, type: 'service' },
      { id: '2', description: 'Monthly Maintenance - Enterprise', quantity: 1, unitPrice: 499, total: 499, type: 'service' },
    ],
    subtotal: 1999,
    taxRate: 6,
    taxAmount: 119.94,
    discount: 100,
    total: 2018.94,
    amountPaid: 0,
    balance: 2018.94,
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customerId: '3',
    customerName: 'Arlington Auto Group',
    customerEmail: 'service@arlingtonauto.com',
    customerPhone: '(703) 555-0303',
    customerAddress: '789 Dealer Row, Arlington, VA 22201',
    status: 'overdue',
    issueDate: '2024-02-15',
    dueDate: '2024-03-01',
    lineItems: [
      { id: '1', description: 'Showroom Scent Service - Quarterly', quantity: 1, unitPrice: 750, total: 750, type: 'service' },
    ],
    subtotal: 750,
    taxRate: 5.3,
    taxAmount: 39.75,
    discount: 0,
    total: 789.75,
    amountPaid: 0,
    balance: 789.75,
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    customerId: '4',
    customerName: 'Capital City Spa',
    customerEmail: 'manager@capitalcityspa.com',
    customerPhone: '(202) 555-0404',
    customerAddress: '321 Wellness Way, Washington, DC 20002',
    status: 'partial',
    issueDate: '2024-03-05',
    dueDate: '2024-03-20',
    lineItems: [
      { id: '1', description: 'Spa Aromatherapy System', quantity: 3, unitPrice: 350, total: 1050, type: 'service' },
      { id: '2', description: 'Lavender Essential Oil - Bulk', quantity: 5, unitPrice: 65, total: 325, type: 'product' },
    ],
    subtotal: 1375,
    taxRate: 6,
    taxAmount: 82.50,
    discount: 50,
    total: 1407.50,
    amountPaid: 700,
    balance: 707.50,
    createdAt: '2024-03-05T14:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    customerId: '5',
    customerName: 'Silver Spring Fitness',
    customerEmail: 'ops@ssfitness.com',
    customerPhone: '(301) 555-0505',
    customerAddress: '555 Gym Lane, Silver Spring, MD 20910',
    status: 'draft',
    issueDate: '2024-03-18',
    dueDate: '2024-04-02',
    lineItems: [
      { id: '1', description: 'Gym Fresh Scent Service', quantity: 1, unitPrice: 399, total: 399, type: 'service' },
    ],
    subtotal: 399,
    taxRate: 6,
    taxAmount: 23.94,
    discount: 0,
    total: 422.94,
    amountPaid: 0,
    balance: 422.94,
    createdAt: '2024-03-18T08:00:00Z',
    updatedAt: '2024-03-18T08:00:00Z',
  },
];

export const useInvoiceStore = create<InvoiceStore>()(
  devtools(
    (set, get) => ({
      invoices: [],
      selectedInvoice: null,
      isLoading: false,
      error: null,
      filters: { status: 'all', sortBy: 'issueDate', sortOrder: 'desc' },

      fetchInvoices: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 500));
          const { filters } = get();
          let filtered = [...mockInvoices];

          if (filters.search) {
            const s = filters.search.toLowerCase();
            filtered = filtered.filter(i => 
              i.invoiceNumber.toLowerCase().includes(s) ||
              i.customerName.toLowerCase().includes(s)
            );
          }
          if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(i => i.status === filters.status);
          }
          if (filters.customerId) {
            filtered = filtered.filter(i => i.customerId === filters.customerId);
          }

          filtered.sort((a, b) => {
            let aVal: string | number, bVal: string | number;
            switch (filters.sortBy) {
              case 'total': aVal = a.total; bVal = b.total; break;
              case 'dueDate': aVal = a.dueDate; bVal = b.dueDate; break;
              case 'invoiceNumber': aVal = a.invoiceNumber; bVal = b.invoiceNumber; break;
              default: aVal = a.issueDate; bVal = b.issueDate;
            }
            const cmp = typeof aVal === 'number' ? aVal - (bVal as number) : aVal.localeCompare(bVal as string);
            return filters.sortOrder === 'desc' ? -cmp : cmp;
          });

          set({ invoices: filtered, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch invoices', isLoading: false });
        }
      },

      fetchInvoiceById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 300));
          const invoice = mockInvoices.find(i => i.id === id);
          if (!invoice) throw new Error('Not found');
          set({ selectedInvoice: invoice, isLoading: false });
        } catch {
          set({ error: 'Failed to fetch invoice', isLoading: false });
        }
      },

      createInvoice: async (data: InvoiceFormData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 500));
          const customer = { name: 'New Customer', email: 'new@example.com', phone: '(555) 000-0000', address: '123 New St' };
          const lineItems = data.lineItems.map((li, i) => ({ ...li, id: String(i + 1) }));
          const subtotal = lineItems.reduce((sum, li) => sum + li.total, 0);
          const taxAmount = subtotal * (data.taxRate / 100);
          const total = subtotal + taxAmount - data.discount;

          const newInvoice: Invoice = {
            id: String(Date.now()),
            invoiceNumber: `INV-2024-${String(mockInvoices.length + 1).padStart(3, '0')}`,
            customerId: data.customerId,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            customerAddress: customer.address,
            status: 'draft',
            issueDate: data.issueDate,
            dueDate: data.dueDate,
            lineItems,
            subtotal,
            taxRate: data.taxRate,
            taxAmount,
            discount: data.discount,
            total,
            amountPaid: 0,
            balance: total,
            notes: data.notes,
            terms: data.terms,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockInvoices.unshift(newInvoice);
          set({ isLoading: false });
          return newInvoice;
        } catch {
          set({ error: 'Failed to create invoice', isLoading: false });
          throw new Error('Failed');
        }
      },

      updateInvoice: async (id: string, data: Partial<InvoiceFormData>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 500));
          const idx = mockInvoices.findIndex(i => i.id === id);
          if (idx === -1) throw new Error('Not found');
          const updated = { ...mockInvoices[idx], ...data, updatedAt: new Date().toISOString() };
          mockInvoices[idx] = updated as Invoice;
          set({ selectedInvoice: updated as Invoice, isLoading: false });
          return updated as Invoice;
        } catch {
          set({ error: 'Failed to update', isLoading: false });
          throw new Error('Failed');
        }
      },

      deleteInvoice: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(r => setTimeout(r, 500));
          const idx = mockInvoices.findIndex(i => i.id === id);
          if (idx !== -1) mockInvoices.splice(idx, 1);
          set({ isLoading: false });
          get().fetchInvoices();
        } catch {
          set({ error: 'Failed to delete', isLoading: false });
        }
      },

      sendInvoice: async (id: string) => {
        set({ isLoading: true });
        try {
          await new Promise(r => setTimeout(r, 500));
          const idx = mockInvoices.findIndex(i => i.id === id);
          if (idx !== -1) {
            mockInvoices[idx] = { ...mockInvoices[idx], status: 'sent', updatedAt: new Date().toISOString() };
            set({ selectedInvoice: mockInvoices[idx], isLoading: false });
          }
        } catch {
          set({ error: 'Failed to send', isLoading: false });
        }
      },

      markAsPaid: async (id: string, amount: number) => {
        set({ isLoading: true });
        try {
          await new Promise(r => setTimeout(r, 500));
          const idx = mockInvoices.findIndex(i => i.id === id);
          if (idx !== -1) {
            const inv = mockInvoices[idx];
            const newPaid = inv.amountPaid + amount;
            const newBalance = inv.total - newPaid;
            mockInvoices[idx] = {
              ...inv,
              amountPaid: newPaid,
              balance: newBalance,
              status: newBalance <= 0 ? 'paid' : 'partial',
              updatedAt: new Date().toISOString(),
            };
            set({ selectedInvoice: mockInvoices[idx], isLoading: false });
          }
        } catch {
          set({ error: 'Failed', isLoading: false });
        }
      },

      setFilters: (filters: Partial<InvoiceFilters>) => {
        set({ filters: { ...get().filters, ...filters } });
        get().fetchInvoices();
      },

      clearSelectedInvoice: () => set({ selectedInvoice: null }),
      clearError: () => set({ error: null }),
    }),
    { name: 'invoice-store' }
  )
);

export default useInvoiceStore;
