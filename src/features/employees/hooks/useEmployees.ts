import { useEmployeeStore } from '../store/employeeStore';

export const useEmployees = () => {
  const store = useEmployeeStore();

  const getFullName = (employee: { firstName: string; lastName: string }) => {
    return `${employee.firstName} ${employee.lastName}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on-leave': return 'warning';
      default: return 'neutral';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'primary';
      case 'manager': return 'secondary';
      case 'technician': return 'info';
      case 'sales': return 'accent';
      default: return 'neutral';
    }
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(salary);
  };

  return {
    ...store,
    getFullName,
    getStatusColor,
    getRoleColor,
    formatSalary,
  };
};

export default useEmployees;
