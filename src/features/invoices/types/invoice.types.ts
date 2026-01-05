/**
 * Invoice Types
 * Superior Scents DMV, LLC
 */

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'service' | 'product';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFilters {
  search?: string;
  status?: Invoice['status'] | 'all';
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'invoiceNumber' | 'issueDate' | 'dueDate' | 'total';
  sortOrder?: 'asc' | 'desc';
}

export interface InvoiceFormData {
  customerId: string;
  issueDate: string;
  dueDate: string;
  lineItems: Omit<InvoiceLineItem, 'id'>[];
  taxRate: number;
  discount: number;
  notes?: string;
  terms?: string;
}

export interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  filters: InvoiceFilters;
}

export interface InvoiceActions {
  fetchInvoices: () => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  createInvoice: (data: InvoiceFormData) => Promise<Invoice>;
  updateInvoice: (id: string, data: Partial<InvoiceFormData>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  sendInvoice: (id: string) => Promise<void>;
  markAsPaid: (id: string, amount: number) => Promise<void>;
  setFilters: (filters: Partial<InvoiceFilters>) => void;
  clearSelectedInvoice: () => void;
  clearError: () => void;
}

export type InvoiceStore = InvoiceState & InvoiceActions;
