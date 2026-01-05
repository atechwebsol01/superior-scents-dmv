import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { usePayments } from '../hooks/usePayments';
import type { PaymentFormData } from '../types/payment.types';

export const RecordPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createPayment, isLoading } = usePayments();

  const [formData, setFormData] = React.useState<PaymentFormData>({
    invoiceId: searchParams.get('invoiceId') || '',
    amount: 0,
    paymentMethod: 'credit_card',
    paymentDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payment = await createPayment(formData);
    navigate(`/payments/${payment.id}`);
  };

  const invoices = [
    { id: '2', number: 'INV-2024-002', customer: 'Metro Medical Center', balance: 2018.94 },
    { id: '3', number: 'INV-2024-003', customer: 'Arlington Auto Group', balance: 789.75 },
    { id: '4', number: 'INV-2024-004', customer: 'Capital City Spa', balance: 707.50 },
    { id: '5', number: 'INV-2024-005', customer: 'Silver Spring Fitness', balance: 422.94 },
  ];

  const methods = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <PageContainer
      title="Record Payment"
      subtitle="Record a new payment transaction"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Payments', path: '/payments' },
        { label: 'Record Payment' },
      ]}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 max-w-2xl">
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Payment Information</h3>
            </div>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Invoice</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    value={formData.invoiceId}
                    onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                    required
                  >
                    <option value="">Select an invoice...</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>{inv.number} - {inv.customer} (Balance: ${inv.balance.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    required
                  />
                  <Input
                    label="Payment Date"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Payment Method</label>
                    <select
                      className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentFormData['paymentMethod'] })}
                    >
                      {methods.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <Input
                    label="Reference Number (Optional)"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    placeholder="e.g., Check #, Transaction ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Notes (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any notes..."
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/payments')}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isLoading}>Record Payment</Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};

export default RecordPaymentPage;
