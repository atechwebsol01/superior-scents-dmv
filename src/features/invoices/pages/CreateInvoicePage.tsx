import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { InvoiceForm } from '../components/InvoiceForm';
import type { InvoiceFormSubmitData } from '../components/InvoiceForm';
import { useInvoices } from '../hooks/useInvoices';

export const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { createInvoice, isLoading } = useInvoices();

  const handleSubmit = async (data: InvoiceFormSubmitData) => {
    const invoice = await createInvoice(data);
    navigate(`/invoices/${invoice.id}`);
  };

  return (
    <PageContainer
      title="Create Invoice"
      subtitle="Create a new invoice for a customer"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Invoices', path: '/invoices' },
        { label: 'Create Invoice' },
      ]}
    >
      <InvoiceForm onSubmit={handleSubmit} onCancel={() => navigate('/invoices')} isLoading={isLoading} />
    </PageContainer>
  );
};

export default CreateInvoicePage;
