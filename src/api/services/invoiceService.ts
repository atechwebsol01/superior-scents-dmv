import api from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { Invoice, InvoiceFormData, InvoiceFilters } from '@/features/invoices/types/invoice.types';
import type { PaginatedResponse } from './customerService';

export const invoiceService = {
  /**
   * GET /invoices
   * Fetch paginated list of invoices with optional filters
   */
  getAll: async (filters?: InvoiceFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Invoice>> => {
    const response = await api.get(ENDPOINTS.INVOICES.LIST, { params: filters });
    return response.data;
  },

  /**
   * GET /invoices/:id
   * Fetch single invoice by ID
   */
  getById: async (id: string): Promise<Invoice> => {
    const response = await api.get(ENDPOINTS.INVOICES.DETAIL(id));
    return response.data;
  },

  /**
   * POST /invoices
   * Create new invoice
   */
  create: async (data: InvoiceFormData): Promise<Invoice> => {
    const response = await api.post(ENDPOINTS.INVOICES.CREATE, data);
    return response.data;
  },

  /**
   * PUT /invoices/:id
   * Update existing invoice
   */
  update: async (id: string, data: Partial<InvoiceFormData>): Promise<Invoice> => {
    const response = await api.put(ENDPOINTS.INVOICES.UPDATE(id), data);
    return response.data;
  },

  /**
   * DELETE /invoices/:id
   * Delete invoice
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.INVOICES.DELETE(id));
  },

  /**
   * POST /invoices/:id/email
   * Send invoice via email
   */
  sendEmail: async (id: string, email?: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(ENDPOINTS.INVOICES.SEND_EMAIL(id), { email });
    return response.data;
  },

  /**
   * GET /invoices/:id/pdf
   * Generate PDF for invoice
   */
  generatePdf: async (id: string): Promise<Blob> => {
    const response = await api.get(ENDPOINTS.INVOICES.GENERATE_PDF(id), { responseType: 'blob' });
    return response.data;
  },

  /**
   * POST /invoices/quick
   * Quick create invoice with minimal data
   */
  quickCreate: async (data: { customerId: string; items: { description: string; amount: number }[] }): Promise<Invoice> => {
    const response = await api.post(ENDPOINTS.INVOICES.QUICK_CREATE, data);
    return response.data;
  },
};

export default invoiceService;
