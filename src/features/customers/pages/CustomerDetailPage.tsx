import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
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
  Printer,
  Archive,
  ChevronDown,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Spinner } from '@/components/common/Spinner';
import { useCustomers } from '../hooks/useCustomers';
import { useServicePeriodStore } from '../store/servicePeriodStore';
import { ServicePeriodTable } from '../components/ServicePeriodTable';
import { ServicePeriodForm } from '../components/ServicePeriodForm';
import { ServiceDetailForm } from '../components/ServiceDetailForm';
import { ContactsTab } from '../components/ContactsTab';
import type { ServicePeriod, ServicePeriodFormData, ServiceDetailFormData } from '../types/servicePeriod.types';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedCustomer: customer,
    customers,
    isLoading,
    fetchCustomerById,
    fetchCustomers,
    deleteCustomer,
    getFullName,
    getStatusColor,
    formatAddress,
    clearSelectedCustomer,
  } = useCustomers();

  const {
    servicePeriods,
    serviceDetails,
    contacts,
    selectedPeriod,
    isLoading: periodsLoading,
    fetchServicePeriods,
    fetchServiceDetails,
    fetchChangeLog,
    fetchContacts,
    createServicePeriod,
    copyServicePeriod,
    createServiceDetail,
    createContact,
    updateContact,
    deleteContact,
    setSelectedPeriod,
  } = useServicePeriodStore();

  const [activeTab, setActiveTab] = React.useState('customer-info');
  const [showPeriodForm, setShowPeriodForm] = React.useState(false);
  const [showServiceForm, setShowServiceForm] = React.useState(false);
  const [showProductForm, setShowProductForm] = React.useState(false);
  const [currentPeriodId, setCurrentPeriodId] = React.useState<string>('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchCustomerById(id);
      fetchServicePeriods(id);
      fetchContacts(id);
      fetchChangeLog(id);
      fetchCustomers();
    }
    return () => clearSelectedCustomer();
  }, [id]);

  React.useEffect(() => {
    if (selectedPeriod) {
      fetchServiceDetails(selectedPeriod.id);
    }
  }, [selectedPeriod]);

  const handleDelete = async () => {
    if (customer) {
      setIsDeleting(true);
      try {
        await deleteCustomer(customer.id);
        toast.success('Customer deleted successfully');
        navigate('/customers');
      } catch {
        toast.error('Failed to delete customer');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handlePrevNext = (direction: 'prev' | 'next') => {
    const currentIndex = customers.findIndex(c => c.id === id);
    if (direction === 'prev' && currentIndex > 0) {
      navigate(`/customers/${customers[currentIndex - 1].id}`);
    } else if (direction === 'next' && currentIndex < customers.length - 1) {
      navigate(`/customers/${customers[currentIndex + 1].id}`);
    }
  };

  const handleCreatePeriod = async (data: ServicePeriodFormData) => {
    if (id) {
      await createServicePeriod(id, data);
      toast.success('Service period created');
      fetchServicePeriods(id);
    }
  };

  const handleCopyPeriod = async (period: ServicePeriod) => {
    await copyServicePeriod(period.id);
    toast.success('Service period copied');
    if (id) fetchServicePeriods(id);
  };

  const handleAddService = (periodId: string) => {
    setCurrentPeriodId(periodId);
    setShowServiceForm(true);
  };

  const handleAddProduct = (periodId: string) => {
    setCurrentPeriodId(periodId);
    setShowProductForm(true);
  };

  const handleCreateServiceDetail = async (data: ServiceDetailFormData) => {
    await createServiceDetail(currentPeriodId, data);
    toast.success('Service detail added');
    fetchServiceDetails(currentPeriodId);
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

  const currentIndex = customers.findIndex(c => c.id === id);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < customers.length - 1;

  const infoItems = [
    { icon: Mail, label: 'Email', value: customer.email },
    { icon: Phone, label: 'Phone', value: customer.phone },
    { icon: MapPin, label: 'Address', value: formatAddress(customer.address) },
    { icon: Building, label: 'Company', value: customer.company || '-' },
    { icon: Calendar, label: 'Customer Since', value: new Date(customer.createdAt).toLocaleDateString() },
    { icon: User, label: 'Assigned To', value: customer.assignedEmployeeId ? `Employee #${customer.assignedEmployeeId}` : 'Unassigned' },
  ];

  const mockHistory = [
    { id: '1', type: 'service', description: 'Completed monthly scent service', date: '2024-03-20', icon: FileText },
    { id: '2', type: 'payment', description: 'Payment received - $250.00', date: '2024-03-18', icon: CreditCard },
    { id: '3', type: 'note', description: 'Customer requested schedule change', date: '2024-03-15', icon: Clock },
    { id: '4', type: 'service', description: 'Completed bi-weekly service', date: '2024-03-06', icon: FileText },
  ];

  const tabs = [
    { id: 'customer-info', label: 'Customer Info' },
    { id: 'type', label: 'Type' },
    { id: 'source', label: 'Source' },
    { id: 'service-products', label: 'Service / Products' },
    { id: 'history', label: 'History' },
    { id: 'notes', label: 'Notes' },
    { id: 'contacts', label: 'Contacts' },
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
      {/* Header with Customer Title & Actions */}
      <Card className="mb-4">
        <CardBody className="py-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                {customer.company || 'All Homes'} :: {customer.id}
              </h1>
              <Badge variant={getStatusColor(customer.status) as 'success' | 'error' | 'warning'}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Navigation Tabs */}
      <Card className="mb-4">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  activeTab === tab.id
                    ? 'text-white bg-primary-500 border-primary-500'
                    : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-primary-500 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePrevNext('prev')}
            disabled={!canGoPrev}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePrevNext('next')}
            disabled={!canGoNext}
          >
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />}>
          Print
        </Button>
        <Button variant="outline" size="sm" leftIcon={<Mail className="w-4 h-4" />}>
          Email
        </Button>
        <Button variant="outline" size="sm" leftIcon={<Archive className="w-4 h-4" />}>
          Archive
        </Button>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit className="w-4 h-4" />}
            onClick={() => navigate(`/customers/${customer.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={handleDelete}
            loading={isDeleting}
            className="text-error-600 border-error-300 hover:bg-error-50"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'customer-info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Contact Information</h3>
            </div>
            <CardBody>
              <div className="flex items-center gap-4 mb-6">
                <Avatar name={getFullName(customer)} size="lg" />
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {getFullName(customer)}
                  </h2>
                  <p className="text-sm text-neutral-500">{customer.company}</p>
                </div>
              </div>
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
      )}

      {activeTab === 'type' && (
        <Card>
          <CardBody>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Customer Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Commercial', 'Residential', 'Industrial', 'Government'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="customerType"
                    defaultChecked={type === 'Commercial'}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{type}</span>
                </label>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'source' && (
        <Card>
          <CardBody>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Lead Source</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Referral', 'Website', 'Cold Call', 'Trade Show', 'Advertisement', 'Social Media'].map((source) => (
                <label key={source} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="leadSource"
                    defaultChecked={source === 'Referral'}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{source}</span>
                </label>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'service-products' && (
        <div className="space-y-4">
          {/* Sales Rep Dropdown */}
          <Card>
            <CardBody className="py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sales Rep:</span>
                <select className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800">
                  <option>A Dozier</option>
                  <option>R Bush</option>
                  <option>S Dozier</option>
                </select>
              </div>
            </CardBody>
          </Card>

          {/* Service Periods */}
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-primary-50 dark:bg-primary-900/20">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Service Periods</h3>
            </div>
            <CardBody>
              <ServicePeriodTable
                periods={servicePeriods}
                details={serviceDetails}
                isLoading={periodsLoading}
                onEdit={(period) => { setSelectedPeriod(period); }}
                onCopy={handleCopyPeriod}
                onQuickInvoice={(period) => toast.success(`Quick invoice for period ${period.id}`)}
                onAddPeriod={() => setShowPeriodForm(true)}
                onAddService={handleAddService}
                onAddProduct={handleAddProduct}
                onAddNote={(periodId) => toast.success(`Add note to period ${periodId}`)}
                onSelectPeriod={setSelectedPeriod}
                selectedPeriodId={selectedPeriod?.id}
              />
            </CardBody>
          </Card>

          {/* Change Log */}
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Change Log</h3>
              <ChevronDown className="w-5 h-5 text-neutral-500" />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Customer History</h3>
          </div>
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
      )}

      {activeTab === 'notes' && (
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Notes</h3>
          </div>
          <CardBody>
            <textarea
              className="w-full p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white min-h-[200px]"
              placeholder="Add notes about this customer..."
              defaultValue={customer.notes}
            />
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={() => toast.success('Notes saved')}>Save Notes</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'contacts' && (
        <ContactsTab
          contacts={contacts}
          isLoading={periodsLoading}
          onAdd={async (data) => { if (id) await createContact(id, data); }}
          onEdit={async (contactId, data) => { await updateContact(contactId, data); }}
          onDelete={deleteContact}
        />
      )}

      {/* Modals */}
      <ServicePeriodForm
        isOpen={showPeriodForm}
        onClose={() => setShowPeriodForm(false)}
        onSubmit={handleCreatePeriod}
        isLoading={periodsLoading}
      />

      <ServiceDetailForm
        isOpen={showServiceForm}
        onClose={() => setShowServiceForm(false)}
        onSubmit={handleCreateServiceDetail}
        type="service"
        periodId={currentPeriodId}
        isLoading={periodsLoading}
      />

      <ServiceDetailForm
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSubmit={handleCreateServiceDetail}
        type="product"
        periodId={currentPeriodId}
        isLoading={periodsLoading}
      />
    </PageContainer>
  );
};

export default CustomerDetailPage;
