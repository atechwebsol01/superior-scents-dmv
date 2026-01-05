import api from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { Employee, EmployeeFormData, EmployeeFilters, EmployeeSummary, EmployeeSchedule } from '@/features/employees/types/employee.types';
import type { PaginatedResponse } from './customerService';

export const employeeService = {
  /**
   * GET /employees
   * Fetch paginated list of employees with optional filters
   */
  getAll: async (filters?: EmployeeFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Employee>> => {
    const response = await api.get(ENDPOINTS.EMPLOYEES.LIST, { params: filters });
    return response.data;
  },

  /**
   * GET /employees/:id
   * Fetch single employee by ID
   */
  getById: async (id: string): Promise<Employee> => {
    const response = await api.get(ENDPOINTS.EMPLOYEES.DETAIL(id));
    return response.data;
  },

  /**
   * POST /employees
   * Create new employee
   */
  create: async (data: EmployeeFormData): Promise<Employee> => {
    const response = await api.post(ENDPOINTS.EMPLOYEES.CREATE, data);
    return response.data;
  },

  /**
   * PUT /employees/:id
   * Update existing employee
   */
  update: async (id: string, data: Partial<EmployeeFormData>): Promise<Employee> => {
    const response = await api.put(ENDPOINTS.EMPLOYEES.UPDATE(id), data);
    return response.data;
  },

  /**
   * DELETE /employees/:id
   * Delete employee
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.EMPLOYEES.DELETE(id));
  },

  /**
   * GET /employees/:id/summary
   * Get employee performance summary
   */
  getSummary: async (id: string): Promise<EmployeeSummary> => {
    const response = await api.get(ENDPOINTS.EMPLOYEES.SUMMARY(id));
    return response.data;
  },

  /**
   * GET /employees/:id/schedule
   * Get employee schedule
   */
  getSchedule: async (id: string): Promise<EmployeeSchedule[]> => {
    const response = await api.get(ENDPOINTS.EMPLOYEES.SCHEDULE(id));
    return response.data;
  },

  /**
   * PUT /employees/:id/schedule
   * Update employee schedule
   */
  updateSchedule: async (id: string, schedule: EmployeeSchedule[]): Promise<EmployeeSchedule[]> => {
    const response = await api.put(ENDPOINTS.EMPLOYEES.SCHEDULE(id), { schedule });
    return response.data;
  },
};

export default employeeService;
