import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search, CreditCard, Banknote, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Input, Select, Badge } from '@/components';
import { cn } from '@/lib/cn';

interface PaymentTransaction {
  id: string;
  transactionId: string;
  invoiceId: string;
  customer: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'check';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  time: string;
  cardLast4?: string;
  bankName?: string;
  reference?: string;
}

export const PaymentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Mock transaction data
  const transactions: PaymentTransaction[] = [
    { id: '1', transactionId: 'TXN-20260105-001', invoiceId: 'INV-001', customer: 'ABC Corporation', amount: 1500, method: 'credit_card', status: 'completed', date: '2026-01-05', time: '14:32:15', cardLast4: '4242' },
    { id: '2', transactionId: 'TXN-20260105-002', invoiceId: 'INV-002', customer: 'XYZ Industries', amount: 2400, method: 'bank_transfer', status: 'pending', date: '2026-01-05', time: '11:15:42', bankName: 'Chase Bank' },
    { id: '3', transactionId: 'TXN-20260104-001', invoiceId: 'INV-003', customer: 'Tech Solutions', amount: 890, method: 'credit_card', status: 'failed', date: '2026-01-04', time: '16:45:33', cardLast4: '1234' },
    { id: '4', transactionId: 'TXN-20260104-002', invoiceId: 'INV-004', customer: 'Metro Office', amount: 3200, method: 'check', status: 'completed', date: '2026-01-04', time: '10:22:08', reference: 'CHK-8834' },
    { id: '5', transactionId: 'TXN-20260103-001', invoiceId: 'INV-005', customer: 'City Hall', amount: 1800, method: 'cash', status: 'completed', date: '2026-01-03', time: '09:18:55' },
    { id: '6', transactionId: 'TXN-20260102-001', invoiceId: 'INV-006', customer: 'ABC Corporation', amount: 500, method: 'credit_card', status: 'refunded', date: '2026-01-02', time: '15:30:12', cardLast4: '4242' },
    { id: '7', transactionId: 'TXN-20260101-001', invoiceId: 'INV-007', customer: 'State Office', amount: 4500, method: 'bank_transfer', status: 'completed', date: '2026-01-01', time: '08:45:00', bankName: 'Bank of America' },
  ];

  const methodIcons = {
    credit_card: CreditCard,
    bank_transfer: Building2,
    cash: Banknote,
    check: CheckCircle,
  };

  const methodLabels = {
    credit_card: 'Credit Card',
    bank_transfer: 'Bank Transfer',
    cash: 'Cash',
    check: 'Check',
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const statusIcons = {
    completed: CheckCircle,
    pending: Clock,
    failed: XCircle,
    refunded: Banknote,
  };

  const filteredTransactions = transactions.filter(t => {
    if (search && !t.customer.toLowerCase().includes(search.toLowerCase()) && !t.transactionId.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (methodFilter !== 'all' && t.method !== methodFilter) return false;
    return true;
  });

  const totalCompleted = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const totalRefunded = transactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageContainer
      title="Payment History"
      subtitle="Detailed transaction history and payment records"
      breadcrumbs={[
        { label: 'Payments', path: '/payments' },
        { label: 'History' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/payments')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-neutral-500 mb-1">Completed Payments</p>
          <p className="text-2xl font-bold text-green-600">${totalCompleted.toLocaleString()}</p>
          <p className="text-xs text-neutral-400 mt-1">{transactions.filter(t => t.status === 'completed').length} transactions</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <p className="text-sm text-neutral-500 mb-1">Pending Payments</p>
          <p className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</p>
          <p className="text-xs text-neutral-400 mt-1">{transactions.filter(t => t.status === 'pending').length} transactions</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <p className="text-sm text-neutral-500 mb-1">Refunded</p>
          <p className="text-2xl font-bold text-purple-600">${totalRefunded.toLocaleString()}</p>
          <p className="text-xs text-neutral-400 mt-1">{transactions.filter(t => t.status === 'refunded').length} transactions</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by customer or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
              { value: 'refunded', label: 'Refunded' },
            ]}
            className="w-40"
          />
          <Select
            value={methodFilter}
            onChange={(value) => setMethodFilter(value)}
            options={[
              { value: 'all', label: 'All Methods' },
              { value: 'credit_card', label: 'Credit Card' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'cash', label: 'Cash' },
              { value: 'check', label: 'Check' },
            ]}
            className="w-40"
          />
          <Select
            value={dateRange}
            onChange={(value) => setDateRange(value)}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
            ]}
            className="w-40"
          />
        </div>
      </Card>

      {/* Transaction List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Transaction ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Method</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Date & Time</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => {
                const MethodIcon = methodIcons[transaction.method];
                const StatusIcon = statusIcons[transaction.status];
                return (
                  <tr key={transaction.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="py-4 px-4">
                      <p className="font-mono text-sm text-neutral-900 dark:text-white">{transaction.transactionId}</p>
                      <p className="text-xs text-primary-600">{transaction.invoiceId}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{transaction.customer}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MethodIcon className="w-4 h-4 text-neutral-400" />
                        <div>
                          <p className="text-sm text-neutral-900 dark:text-white">{methodLabels[transaction.method]}</p>
                          {transaction.cardLast4 && <p className="text-xs text-neutral-500">**** {transaction.cardLast4}</p>}
                          {transaction.bankName && <p className="text-xs text-neutral-500">{transaction.bankName}</p>}
                          {transaction.reference && <p className="text-xs text-neutral-500">{transaction.reference}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-neutral-900 dark:text-white">{transaction.date}</p>
                      <p className="text-xs text-neutral-500">{transaction.time}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className={cn('text-sm font-semibold', transaction.status === 'refunded' ? 'text-purple-600' : 'text-neutral-900 dark:text-white')}>
                        {transaction.status === 'refunded' ? '-' : ''}${transaction.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={cn('inline-flex items-center gap-1', statusColors[transaction.status])}>
                        <StatusIcon className="w-3 h-3" />
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/payments/${transaction.id}`)}>
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No transactions found matching your criteria.
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default PaymentHistoryPage;
