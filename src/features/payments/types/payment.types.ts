/**
 * Payment Types
 * Superior Scents DMV, LLC
 */

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'other';
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFilters {
  search?: string;
  status?: Payment['status'] | 'all';
  paymentMethod?: Payment['paymentMethod'] | 'all';
  customerId?: string;
  invoiceId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'paymentDate' | 'amount' | 'customerName';
  sortOrder?: 'asc' | 'desc';
}

export interface PaymentFormData {
  invoiceId: string;
  amount: number;
  paymentMethod: Payment['paymentMethod'];
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentState {
  payments: Payment[];
  selectedPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  filters: PaymentFilters;
}

export interface PaymentActions {
  fetchPayments: () => Promise<void>;
  fetchPaymentById: (id: string) => Promise<void>;
  createPayment: (data: PaymentFormData) => Promise<Payment>;
  deletePayment: (id: string) => Promise<void>;
  refundPayment: (id: string) => Promise<void>;
  setFilters: (filters: Partial<PaymentFilters>) => void;
  clearSelectedPayment: () => void;
  clearError: () => void;
}

export type PaymentStore = PaymentState & PaymentActions;
