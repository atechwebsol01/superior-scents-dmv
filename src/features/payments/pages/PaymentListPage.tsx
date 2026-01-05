import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Trash2, CreditCard, RotateCcw } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Dropdown } from '@/components/common/Dropdown';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { usePayments } from '../hooks/usePayments';

export const PaymentListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    payments, isLoading, filters, fetchPayments, setFilters, deletePayment, refundPayment,
    getStatusColor, getMethodLabel, formatCurrency, formatDate,
  } = usePayments();
  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => { fetchPayments(); }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({ search: value });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this payment record?')) await deletePayment(id);
  };

  const handleRefund = async (id: string) => {
    if (window.confirm('Mark this payment as refunded?')) await refundPayment(id);
  };

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Refunded', value: 'refunded' },
  ];

  const methodOptions = [
    { label: 'All Methods', value: 'all' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Check', value: 'check' },
    { label: 'Cash', value: 'cash' },
  ];

  return (
    <PageContainer
      title="Payments"
      subtitle="Track payment transactions"
      breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Payments' }]}
      actions={
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/payments/new')}>
          Record Payment
        </Button>
      }
    >
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search payments..." leftIcon={<Search className="w-4 h-4" />} value={searchValue} onChange={(e) => handleSearch(e.target.value)} />
            </div>
            <select
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
              value={filters.status || 'all'}
              onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
            >
              {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
              value={filters.paymentMethod || 'all'}
              onChange={(e) => setFilters({ paymentMethod: e.target.value as typeof filters.paymentMethod })}
            >
              {methodOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </CardBody>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-8 h-8 text-neutral-400" />}
          title="No payments found"
          description={searchValue ? 'Try adjusting your search' : 'Record your first payment'}
          actionLabel={!searchValue ? 'Record Payment' : undefined}
          onAction={!searchValue ? () => navigate('/payments/new') : undefined}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden md:table-cell">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden lg:table-cell">Method</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer" onClick={() => navigate(`/payments/${payment.id}`)}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900 dark:text-white">{formatDate(payment.paymentDate)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900 dark:text-white">{payment.customerName}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-primary-600 dark:text-primary-400">{payment.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">{getMethodLabel(payment.paymentMethod)}</div>
                      {payment.referenceNumber && <div className="text-xs text-neutral-500">Ref: {payment.referenceNumber}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 dark:text-white">{formatCurrency(payment.amount)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(payment.status) as 'success' | 'warning' | 'error' | 'neutral'}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        variant="icon"
                        align="right"
                        items={[
                          { id: 'view', label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/payments/${payment.id}`) },
                          ...(payment.status === 'completed' ? [{ id: 'refund', label: 'Refund', icon: <RotateCcw className="w-4 h-4" />, onClick: () => handleRefund(payment.id) }] : []),
                          { id: 'divider', label: '', divider: true },
                          { id: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => handleDelete(payment.id) },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default PaymentListPage;
