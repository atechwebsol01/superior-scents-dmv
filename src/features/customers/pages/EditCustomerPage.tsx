import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Spinner } from '@/components/common/Spinner';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CustomerForm } from '../components/CustomerForm';
import { useCustomers } from '../hooks/useCustomers';
import type { CustomerFormData } from '../types/customer.types';

export const EditCustomerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedCustomer: customer,
    isLoading,
    fetchCustomerById,
    updateCustomer,
    getFullName,
    clearSelectedCustomer,
  } = useCustomers();

  React.useEffect(() => {
    if (id) {
      fetchCustomerById(id);
    }
    return () => clearSelectedCustomer();
  }, [id]);

  const handleSubmit = async (data: CustomerFormData) => {
    if (!id) return;
    try {
      await updateCustomer(id, data);
      navigate(`/customers/${id}`);
    } catch (error) {
      console.error('Failed to update customer:', error);
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
              The customer you're trying to edit doesn't exist.
            </p>
            <Button variant="primary" onClick={() => navigate('/customers')}>
              Back to Customers
            </Button>
          </CardBody>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Edit ${getFullName(customer)}`}
      subtitle="Update customer information"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Customers', path: '/customers' },
        { label: getFullName(customer), path: `/customers/${id}` },
        { label: 'Edit' },
      ]}
    >
      <CustomerForm
        customer={customer}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/customers/${id}`)}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export default EditCustomerPage;
