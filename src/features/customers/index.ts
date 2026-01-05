// Customer Feature Exports
export { CustomerListPage } from './pages/CustomerListPage';
export { CustomerDetailPage } from './pages/CustomerDetailPage';
export { AddCustomerPage } from './pages/AddCustomerPage';
export { EditCustomerPage } from './pages/EditCustomerPage';
export { CustomerForm } from './components/CustomerForm';
export { ServicePeriodTable } from './components/ServicePeriodTable';
export { ServicePeriodForm } from './components/ServicePeriodForm';
export { ServiceDetailForm } from './components/ServiceDetailForm';
export { ContactsTab } from './components/ContactsTab';
export { ChangeLogTab } from './components/ChangeLogTab';
export { useCustomers } from './hooks/useCustomers';
export { useCustomerStore } from './store/customerStore';
export { useServicePeriodStore } from './store/servicePeriodStore';
export type * from './types/customer.types';
export type { 
  ServicePeriod, 
  ServiceDetail, 
  ChangeLogEntry, 
  ServicePeriodFormData, 
  ServiceDetailFormData,
  DayOfWeek,
  PeriodFrequency,
  ServicePeriodFilters,
  ServicePeriodStore
} from './types/servicePeriod.types';
