import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { CustomerForm } from '../components/CustomerForm';
import { useCustomers } from '../hooks/useCustomers';
import type { CustomerFormData } from '../types/customer.types';

export const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { createCustomer, isLoading } = useCustomers();

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      const customer = await createCustomer(data);
      navigate(`/customers/${customer.id}`);
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  return (
    <PageContainer
      title="Add New Customer"
      subtitle="Create a new customer profile"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Customers', path: '/customers' },
        { label: 'Add Customer' },
      ]}
    >
      <CustomerForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/customers')}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export default AddCustomerPage;
