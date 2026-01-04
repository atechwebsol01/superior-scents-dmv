import { useCustomerStore } from '../store/customerStore';

/**
 * useCustomers Hook
 * Superior Scents DMV, LLC
 */
export const useCustomers = () => {
  const store = useCustomerStore();

  const getFullName = (customer: { firstName: string; lastName: string }) => {
    return `${customer.firstName} ${customer.lastName}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const formatAddress = (address: { street: string; city: string; state: string; zipCode: string }) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  return {
    ...store,
    getFullName,
    getStatusColor,
    formatAddress,
  };
};

export default useCustomers;
