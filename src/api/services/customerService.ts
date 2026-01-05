import api from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { Customer, CustomerFormData, CustomerFilters, CustomerHistory, CustomerNote } from '@/features/customers/types/customer.types';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const customerService = {
  /**
   * GET /customers
   * Fetch paginated list of customers with optional filters
   */
  getAll: async (filters?: CustomerFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get(ENDPOINTS.CUSTOMERS.LIST, { params: filters });
    return response.data;
  },

  /**
   * GET /customers/:id
   * Fetch single customer by ID
   */
  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(ENDPOINTS.CUSTOMERS.DETAIL(id));
    return response.data;
  },

  /**
   * POST /customers
   * Create new customer
   */
  create: async (data: CustomerFormData): Promise<Customer> => {
    const response = await api.post(ENDPOINTS.CUSTOMERS.CREATE, data);
    return response.data;
  },

  /**
   * PUT /customers/:id
   * Update existing customer
   */
  update: async (id: string, data: Partial<CustomerFormData>): Promise<Customer> => {
    const response = await api.put(ENDPOINTS.CUSTOMERS.UPDATE(id), data);
    return response.data;
  },

  /**
   * DELETE /customers/:id
   * Delete customer
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.CUSTOMERS.DELETE(id));
  },

  /**
   * GET /customers/:id/history
   * Fetch customer service history
   */
  getHistory: async (id: string): Promise<CustomerHistory[]> => {
    const response = await api.get(ENDPOINTS.CUSTOMERS.HISTORY(id));
    return response.data;
  },

  /**
   * GET /customers/:id/notes
   * Fetch customer notes
   */
  getNotes: async (id: string): Promise<CustomerNote[]> => {
    const response = await api.get(ENDPOINTS.CUSTOMERS.NOTES(id));
    return response.data;
  },

  /**
   * POST /customers/:id/notes
   * Add note to customer
   */
  addNote: async (id: string, note: { content: string }): Promise<CustomerNote> => {
    const response = await api.post(ENDPOINTS.CUSTOMERS.NOTES(id), note);
    return response.data;
  },

  /**
   * GET /customers/search?q=query
   * Search customers
   */
  search: async (query: string): Promise<Customer[]> => {
    const response = await api.get(ENDPOINTS.CUSTOMERS.SEARCH, { params: { q: query } });
    return response.data;
  },
};

export default customerService;
