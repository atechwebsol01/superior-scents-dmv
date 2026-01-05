import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Spinner } from '@/components/common/Spinner';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { InvoiceForm } from '../components/InvoiceForm';
import type { InvoiceFormSubmitData } from '../components/InvoiceForm';
import { useInvoices } from '../hooks/useInvoices';

export const EditInvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedInvoice: invoice, isLoading, fetchInvoiceById, updateInvoice, clearSelectedInvoice } = useInvoices();

  React.useEffect(() => {
    if (id) fetchInvoiceById(id);
    return () => clearSelectedInvoice();
  }, [id]);

  const handleSubmit = async (data: InvoiceFormSubmitData) => {
    if (!id) return;
    await updateInvoice(id, data);
    navigate(`/invoices/${id}`);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Spinner size="lg" /></div>;

  if (!invoice) {
    return (
      <PageContainer title="Invoice Not Found">
        <Card><CardBody className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Invoice not found.</p>
          <Button variant="primary" onClick={() => navigate('/invoices')}>Back to Invoices</Button>
        </CardBody></Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Edit ${invoice.invoiceNumber}`}
      subtitle="Update invoice details"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Invoices', path: '/invoices' },
        { label: invoice.invoiceNumber, path: `/invoices/${id}` },
        { label: 'Edit' },
      ]}
    >
      <InvoiceForm invoice={invoice} onSubmit={handleSubmit} onCancel={() => navigate(`/invoices/${id}`)} isLoading={isLoading} />
    </PageContainer>
  );
};

export default EditInvoicePage;
