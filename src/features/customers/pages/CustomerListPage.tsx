import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Dropdown } from '@/components/common/Dropdown';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useCustomers } from '../hooks/useCustomers';

export const CustomerListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    customers,
    isLoading,
    filters,
    fetchCustomers,
    setFilters,
    deleteCustomer,
    getFullName,
    getStatusColor,
  } = useCustomers();

  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({ search: value });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({ status: status as 'all' | 'active' | 'inactive' | 'pending' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteCustomer(id);
    }
  };

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ];

  return (
    <PageContainer
      title="Customers"
      subtitle="Manage your customer database"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Customers' },
      ]}
      actions={
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/customers/new')}
        >
          Add Customer
        </Button>
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search customers..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
                value={filters.status || 'all'}
                onChange={(e) => handleStatusFilter(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                More Filters
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Customer List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={searchValue ? 'Try adjusting your search or filters' : 'Get started by adding your first customer'}
          actionLabel={!searchValue ? 'Add Customer' : undefined}
          onAction={!searchValue ? () => navigate('/customers/new') : undefined}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden md:table-cell">
                    Contact
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden lg:table-cell">
                    Company
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={getFullName(customer)} size="md" />
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {getFullName(customer)}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 md:hidden">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                          <Mail className="w-3.5 h-3.5" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                          <Phone className="w-3.5 h-3.5" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {customer.company || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(customer.status) as 'success' | 'error' | 'warning'}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                          variant="icon"
                          align="right"
                          items={[
                            {
                              id: 'view',
                              label: 'View Details',
                              icon: <Eye className="w-4 h-4" />,
                              onClick: () => navigate(`/customers/${customer.id}`),
                            },
                            {
                              id: 'edit',
                              label: 'Edit',
                              icon: <Edit className="w-4 h-4" />,
                              onClick: () => navigate(`/customers/${customer.id}/edit`),
                            },
                            { id: 'divider', label: '', divider: true },
                            {
                              id: 'delete',
                              label: 'Delete',
                              icon: <Trash2 className="w-4 h-4" />,
                              danger: true,
                              onClick: () => handleDelete(customer.id, getFullName(customer)),
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Showing {customers.length} customers
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default CustomerListPage;
