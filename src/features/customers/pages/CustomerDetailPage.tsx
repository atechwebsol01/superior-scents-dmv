import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  User,
  FileText,
  CreditCard,
  Clock,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';

import { Spinner } from '@/components/common/Spinner';
import { useCustomers } from '../hooks/useCustomers';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedCustomer: customer,
    isLoading,
    fetchCustomerById,
    deleteCustomer,
    getFullName,
    getStatusColor,
    formatAddress,
    clearSelectedCustomer,
  } = useCustomers();

  React.useEffect(() => {
    if (id) {
      fetchCustomerById(id);
    }
    return () => clearSelectedCustomer();
  }, [id]);

  const handleDelete = async () => {
    if (customer && window.confirm(`Are you sure you want to delete ${getFullName(customer)}?`)) {
      await deleteCustomer(customer.id);
      navigate('/customers');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <PageContainer title="Customer Not Found">
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              The customer you're looking for doesn't exist.
            </p>
            <Button variant="primary" onClick={() => navigate('/customers')}>
              Back to Customers
            </Button>
          </CardBody>
        </Card>
      </PageContainer>
    );
  }

  const infoItems = [
    { icon: Mail, label: 'Email', value: customer.email },
    { icon: Phone, label: 'Phone', value: customer.phone },
    { icon: MapPin, label: 'Address', value: formatAddress(customer.address) },
    { icon: Building, label: 'Company', value: customer.company || '-' },
    { icon: Calendar, label: 'Customer Since', value: new Date(customer.createdAt).toLocaleDateString() },
    { icon: User, label: 'Assigned To', value: customer.assignedEmployeeId ? `Employee #${customer.assignedEmployeeId}` : 'Unassigned' },
  ];

  const mockHistory = [
    { id: '1', type: 'service', description: 'Completed monthly cleaning service', date: '2024-03-20', icon: FileText },
    { id: '2', type: 'payment', description: 'Payment received - $250.00', date: '2024-03-18', icon: CreditCard },
    { id: '3', type: 'note', description: 'Customer requested schedule change', date: '2024-03-15', icon: Clock },
    { id: '4', type: 'service', description: 'Completed bi-weekly service', date: '2024-03-06', icon: FileText },
  ];

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Contact Information</h3>
            </div>
            <CardBody>
              <div className="space-y-4">
                {infoItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Tags & Notes */}
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Tags & Notes</h3>
            </div>
            <CardBody>
              <div className="mb-4">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {customer.tags?.length ? (
                    customer.tags.map((tag) => (
                      <Badge key={tag} variant="primary">{tag}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-neutral-400">No tags</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Notes</p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {customer.notes || 'No notes added'}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      ),
    },
    {
      id: 'history',
      label: 'History',
      content: (
        <Card>
          <CardBody>
            <div className="space-y-4">
              {mockHistory.map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.description}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ),
    },
    {
      id: 'services',
      label: 'Services',
      content: (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">Services will be displayed here</p>
          </CardBody>
        </Card>
      ),
    },
    {
      id: 'invoices',
      label: 'Invoices',
      content: (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">Invoices will be displayed here</p>
          </CardBody>
        </Card>
      ),
    },
  ];

  return (
    <PageContainer
      title=""
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Customers', path: '/customers' },
        { label: getFullName(customer) },
      ]}
    >
      {/* Header */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/customers')}
              >
                Back
              </Button>
              <div className="flex items-center gap-4">
                <Avatar name={getFullName(customer)} size="lg" />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {getFullName(customer)}
                    </h1>
                    <Badge variant={getStatusColor(customer.status) as 'success' | 'error' | 'warning'}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {customer.company || customer.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-auto sm:ml-0">
              <Button
                variant="outline"
                leftIcon={<Edit className="w-4 h-4" />}
                onClick={() => navigate(`/customers/${customer.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={handleDelete}
                className="text-error-600 border-error-300 hover:bg-error-50"
              >
                Delete
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <CustomerTabs tabs={tabs} />
    </PageContainer>
  );
};

// Simple tabs component for this page
const CustomerTabs: React.FC<{ tabs: { id: string; label: string; content: React.ReactNode }[] }> = ({ tabs }) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id || '');
  
  return (
    <div>
      <div className="flex border-b border-neutral-200 dark:border-neutral-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'text-primary-600 border-primary-500'
                : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-primary-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default CustomerDetailPage;
