import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, RotateCcw, FileText, User, CreditCard, Calendar, Hash } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { usePayments } from '../hooks/usePayments';

export const PaymentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedPayment: payment, isLoading, fetchPaymentById, deletePayment, refundPayment,
    getStatusColor, getMethodLabel, formatCurrency, formatDate, clearSelectedPayment,
  } = usePayments();

  React.useEffect(() => {
    if (id) fetchPaymentById(id);
    return () => clearSelectedPayment();
  }, [id]);

  const handleDelete = async () => {
    if (payment && window.confirm('Delete this payment record?')) {
      await deletePayment(payment.id);
      navigate('/payments');
    }
  };

  const handleRefund = async () => {
    if (payment && window.confirm('Mark as refunded?')) await refundPayment(payment.id);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Spinner size="lg" /></div>;

  if (!payment) {
    return (
      <PageContainer title="Payment Not Found">
        <Card><CardBody className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Payment not found.</p>
          <Button variant="primary" onClick={() => navigate('/payments')}>Back to Payments</Button>
        </CardBody></Card>
      </PageContainer>
    );
  }

  const details = [
    { icon: Calendar, label: 'Payment Date', value: formatDate(payment.paymentDate) },
    { icon: CreditCard, label: 'Payment Method', value: getMethodLabel(payment.paymentMethod) },
    { icon: Hash, label: 'Reference Number', value: payment.referenceNumber || '-' },
    { icon: FileText, label: 'Invoice', value: payment.invoiceNumber },
    { icon: User, label: 'Customer', value: payment.customerName },
  ];

  return (
    <PageContainer
      title=""
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Payments', path: '/payments' },
        { label: `Payment #${payment.id}` },
      ]}
    >
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/payments')}>Back</Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Payment #{payment.id}</h1>
                  <Badge variant={getStatusColor(payment.status) as 'success' | 'warning' | 'error'}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{payment.invoiceNumber} • {payment.customerName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {payment.status === 'completed' && (
                <Button variant="outline" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={handleRefund}>Refund</Button>
              )}
              <Button variant="outline" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDelete} className="text-error-600 border-error-300 hover:bg-error-50">Delete</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Payment Details</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {details.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
                    <p className="font-medium text-neutral-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {payment.notes && (
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Notes</p>
                <p className="text-neutral-600 dark:text-neutral-400">{payment.notes}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Amount</h3>
          </div>
          <CardBody className="text-center py-8">
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{formatCurrency(payment.amount)}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {payment.status === 'refunded' ? 'Refunded' : 'Payment received'}
            </p>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PaymentDetailPage;
