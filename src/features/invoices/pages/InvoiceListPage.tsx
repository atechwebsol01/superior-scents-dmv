import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, Send, FileText } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Dropdown } from '@/components/common/Dropdown';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useInvoices } from '../hooks/useInvoices';

export const InvoiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    invoices, isLoading, filters, fetchInvoices, setFilters, deleteInvoice, sendInvoice,
    getStatusColor, formatCurrency, formatDate, getStatusLabel,
  } = useInvoices();
  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => { fetchInvoices(); }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({ search: value });
  };

  const handleDelete = async (id: string, num: string) => {
    if (window.confirm(`Delete invoice ${num}?`)) await deleteInvoice(id);
  };

  const handleSend = async (id: string) => {
    if (window.confirm('Send this invoice to customer?')) await sendInvoice(id);
  };

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Sent', value: 'sent' },
    { label: 'Paid', value: 'paid' },
    { label: 'Partial', value: 'partial' },
    { label: 'Overdue', value: 'overdue' },
  ];

  return (
    <PageContainer
      title="Invoices"
      subtitle="Manage customer invoices"
      breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Invoices' }]}
      actions={
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/invoices/new')}>
          Create Invoice
        </Button>
      }
    >
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search invoices..." leftIcon={<Search className="w-4 h-4" />} value={searchValue} onChange={(e) => handleSearch(e.target.value)} />
            </div>
            <select
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
              value={filters.status || 'all'}
              onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
            >
              {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </CardBody>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8 text-neutral-400" />}
          title="No invoices found"
          description={searchValue ? 'Try adjusting your search' : 'Create your first invoice'}
          actionLabel={!searchValue ? 'Create Invoice' : undefined}
          onAction={!searchValue ? () => navigate('/invoices/new') : undefined}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden md:table-cell">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden lg:table-cell">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900 dark:text-white">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400 md:hidden">{invoice.customerName}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-neutral-900 dark:text-white">{invoice.customerName}</div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(invoice.issueDate)}</div>
                      <div className="text-xs text-neutral-500">Due: {formatDate(invoice.dueDate)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900 dark:text-white">{formatCurrency(invoice.total)}</div>
                      {invoice.balance > 0 && invoice.balance < invoice.total && (
                        <div className="text-xs text-warning-600">Balance: {formatCurrency(invoice.balance)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(invoice.status) as 'success' | 'error' | 'warning' | 'info'}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        variant="icon"
                        align="right"
                        items={[
                          { id: 'view', label: 'View', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/invoices/${invoice.id}`) },
                          { id: 'edit', label: 'Edit', icon: <Edit className="w-4 h-4" />, onClick: () => navigate(`/invoices/${invoice.id}/edit`) },
                          ...(invoice.status === 'draft' ? [{ id: 'send', label: 'Send', icon: <Send className="w-4 h-4" />, onClick: () => handleSend(invoice.id) }] : []),
                          { id: 'divider', label: '', divider: true },
                          { id: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => handleDelete(invoice.id, invoice.invoiceNumber) },
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

export default InvoiceListPage;
