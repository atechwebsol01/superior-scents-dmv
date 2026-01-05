import { usePaymentStore } from '../store/paymentStore';

export const usePayments = () => {
  const store = usePaymentStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'neutral';
      default: return 'neutral';
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Credit Card';
      case 'bank_transfer': return 'Bank Transfer';
      default: return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return { ...store, getStatusColor, getMethodLabel, formatCurrency, formatDate };
};

export default usePayments;
