import { useInvoiceStore } from '../store/invoiceStore';

export const useInvoices = () => {
  const store = useInvoiceStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'sent': return 'info';
      case 'partial': return 'warning';
      case 'overdue': return 'error';
      case 'cancelled': return 'neutral';
      case 'draft': return 'secondary';
      default: return 'neutral';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'partial': return 'Partially Paid';
      case 'overdue': return 'Overdue';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return { ...store, getStatusColor, formatCurrency, formatDate, getStatusLabel };
};

export default useInvoices;
