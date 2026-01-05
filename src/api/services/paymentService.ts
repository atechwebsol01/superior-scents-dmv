import api from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { Payment, PaymentFormData, PaymentFilters } from '@/features/payments/types/payment.types';
import type { PaginatedResponse } from './customerService';

export const paymentService = {
  /**
   * GET /payments
   * Fetch paginated list of payments with optional filters
   */
  getAll: async (filters?: PaymentFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get(ENDPOINTS.PAYMENTS.LIST, { params: filters });
    return response.data;
  },

  /**
   * GET /payments/:id
   * Fetch single payment by ID
   */
  getById: async (id: string): Promise<Payment> => {
    const response = await api.get(ENDPOINTS.PAYMENTS.DETAIL(id));
    return response.data;
  },

  /**
   * POST /payments
   * Record new payment
   */
  create: async (data: PaymentFormData): Promise<Payment> => {
    const response = await api.post(ENDPOINTS.PAYMENTS.CREATE, data);
    return response.data;
  },

  /**
   * DELETE /payments/:id
   * Delete payment record
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.PAYMENTS.DELETE(id));
  },

  /**
   * POST /payments/:id/refund
   * Process refund for payment
   */
  refund: async (id: string, reason?: string): Promise<Payment> => {
    const response = await api.post(`${ENDPOINTS.PAYMENTS.DETAIL(id)}/refund`, { reason });
    return response.data;
  },

  /**
   * GET /invoices/:invoiceId/payments
   * Get all payments for an invoice
   */
  getByInvoice: async (invoiceId: string): Promise<Payment[]> => {
    const response = await api.get(ENDPOINTS.PAYMENTS.BY_INVOICE(invoiceId));
    return response.data;
  },
};

export default paymentService;
