/**
 * Service Period Types
 * Superior Scents DMV, LLC
 * Based on design pages 193-202
 */

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type PeriodFrequency = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'EV' | 'DM' | 'SO';

export interface ServicePeriod {
  id: string;
  customerId: string;
  periodCode: PeriodFrequency;
  day: DayOfWeek;
  serviceRepId: string;
  serviceRepName: string;
  serviceDate: string;
  dateLast: string;
  frequencyDM?: number;
  dayOfMonth?: number;
  freight: number;
  amount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDetail {
  id: string;
  servicePeriodId: string;
  type: 'service' | 'product' | 'note';
  serviceId?: string;
  serviceName?: string;
  productId?: string;
  productName?: string;
  productCode?: string;
  description?: string;
  price: number;
  quantity: number;
  total: number;
  fragrance?: string;
  notes?: string;
  isTaxable: boolean;
  isOneTimeItem: boolean;
  salesRepId?: string;
  salesRepName?: string;
  saleDate?: string;
  payCommission: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeLogEntry {
  id: string;
  entityType: 'service_period' | 'service_detail' | 'customer';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  field?: string;
  oldValue?: string;
  newValue?: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface ServicePeriodFormData {
  periodCode: PeriodFrequency;
  day: DayOfWeek;
  serviceRepId: string;
  dateLast: string;
  frequencyDM?: number;
  dayOfMonth?: number;
}

export interface ServiceDetailFormData {
  type: 'service' | 'product';
  serviceId?: string;
  productId?: string;
  price: number;
  quantity: number;
  fragrance?: string;
  notes?: string;
  isTaxable: boolean;
  isOneTimeItem: boolean;
  salesRepId?: string;
  saleDate?: string;
  payCommission: boolean;
}

export interface CustomerContact {
  id: string;
  customerId: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePeriodFilters {
  serviceRepId?: string;
  day?: DayOfWeek;
  periodCode?: PeriodFrequency;
  isActive?: boolean;
}

export interface ServicePeriodStore {
  servicePeriods: ServicePeriod[];
  serviceDetails: ServiceDetail[];
  changeLog: ChangeLogEntry[];
  contacts: CustomerContact[];
  selectedPeriod: ServicePeriod | null;
  isLoading: boolean;
  error: string | null;
  filters: ServicePeriodFilters;

  fetchServicePeriods: (customerId: string) => Promise<void>;
  fetchServiceDetails: (periodId: string) => Promise<void>;
  fetchChangeLog: (customerId: string) => Promise<void>;
  fetchContacts: (customerId: string) => Promise<void>;
  
  createServicePeriod: (customerId: string, data: ServicePeriodFormData) => Promise<ServicePeriod>;
  updateServicePeriod: (id: string, data: Partial<ServicePeriodFormData>) => Promise<ServicePeriod>;
  deleteServicePeriod: (id: string) => Promise<void>;
  copyServicePeriod: (id: string) => Promise<ServicePeriod>;
  
  createServiceDetail: (periodId: string, data: ServiceDetailFormData) => Promise<ServiceDetail>;
  updateServiceDetail: (id: string, data: Partial<ServiceDetailFormData>) => Promise<ServiceDetail>;
  deleteServiceDetail: (id: string) => Promise<void>;
  
  createContact: (customerId: string, data: Omit<CustomerContact, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>) => Promise<CustomerContact>;
  updateContact: (id: string, data: Partial<CustomerContact>) => Promise<CustomerContact>;
  deleteContact: (id: string) => Promise<void>;
  
  setSelectedPeriod: (period: ServicePeriod | null) => void;
  setFilters: (filters: Partial<ServicePeriodFilters>) => void;
  clearError: () => void;
}
