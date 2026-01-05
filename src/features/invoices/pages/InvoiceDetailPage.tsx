import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, Send, DollarSign, Printer, Mail, Download } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { useConfirm } from '@/components/common/ConfirmModal';
import { useInvoices } from '../hooks/useInvoices';
import { SendInvoiceModal } from '../components/SendInvoiceModal';
import { InvoicePrintView } from '../components/InvoicePrintView';

export const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const {
    selectedInvoice: invoice, isLoading, fetchInvoiceById, deleteInvoice, sendInvoice, markAsPaid,
    getStatusColor, formatCurrency, formatDate, getStatusLabel, clearSelectedInvoice,
  } = useInvoices();
  const [paymentAmount, setPaymentAmount] = React.useState('');
  const [showPayment, setShowPayment] = React.useState(false);
  const [showSendModal, setShowSendModal] = React.useState(false);
  const [showPrintView, setShowPrintView] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (id) fetchInvoiceById(id);
    return () => clearSelectedInvoice();
  }, [id]);

  const handleDelete = async () => {
    if (!invoice) return;
    
    const confirmed = await confirm({
      title: 'Delete Invoice',
      message: `Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
    });

    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteInvoice(invoice.id);
        toast.success('Invoice deleted successfully');
        navigate('/invoices');
      } catch {
        toast.error('Failed to delete invoice');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSendEmail = async (data: { email: string; message: string }) => {
    if (!invoice) return;
    setIsSending(true);
    try {
      await sendInvoice(invoice.id);
      toast.success(`Invoice sent to ${data.email}`);
    } catch {
      toast.error('Failed to send invoice');
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  };

  const handleDownloadPdf = () => {
    toast.success('PDF download started');
    // In production, this would call an API endpoint to generate PDF
  };

  const handlePayment = async () => {
    if (invoice && paymentAmount) {
      await markAsPaid(invoice.id, parseFloat(paymentAmount));
      setPaymentAmount('');
      setShowPayment(false);
    }
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
      title=""
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Invoices', path: '/invoices' },
        { label: invoice.invoiceNumber },
      ]}
    >
      {/* Header */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/invoices')}>Back</Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{invoice.invoiceNumber}</h1>
                  <Badge variant={getStatusColor(invoice.status) as 'success' | 'error' | 'warning'}>{getStatusLabel(invoice.status)}</Badge>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{invoice.customerName}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {invoice.status === 'draft' && (
                <Button variant="primary" leftIcon={<Send className="w-4 h-4" />} onClick={() => setShowSendModal(true)}>Send</Button>
              )}
              {invoice.status !== 'draft' && (
                <Button variant="outline" leftIcon={<Mail className="w-4 h-4" />} onClick={() => setShowSendModal(true)}>Email</Button>
              )}
              {invoice.balance > 0 && (
                <Button variant="secondary" leftIcon={<DollarSign className="w-4 h-4" />} onClick={() => setShowPayment(!showPayment)}>Record Payment</Button>
              )}
              <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>Print</Button>
              <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={handleDownloadPdf}>PDF</Button>
              <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />} onClick={() => navigate(`/invoices/${invoice.id}/edit`)}>Edit</Button>
              <Button variant="outline" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDelete} loading={isDeleting} className="text-error-600 border-error-300 hover:bg-error-50">Delete</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Payment Form */}
      {showPayment && (
        <Card className="mb-6 border-2 border-secondary-200 dark:border-secondary-700">
          <CardBody>
            <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Record Payment</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1 max-w-xs">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  max={invoice.balance}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  placeholder={`Max: ${formatCurrency(invoice.balance)}`}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <Button variant="primary" onClick={handlePayment} disabled={!paymentAmount}>Apply Payment</Button>
              <Button variant="ghost" onClick={() => setShowPayment(false)}>Cancel</Button>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Line Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Description</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Qty</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Price</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100 dark:border-neutral-800">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900 dark:text-white">{item.description}</div>
                        <div className="text-xs text-neutral-500 capitalize">{item.type}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-600 dark:text-neutral-400">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-neutral-600 dark:text-neutral-400">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-right font-medium text-neutral-900 dark:text-white">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CardBody className="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex justify-between w-48"><span className="text-neutral-600 dark:text-neutral-400">Subtotal:</span><span className="font-medium">{formatCurrency(invoice.subtotal)}</span></div>
                <div className="flex justify-between w-48"><span className="text-neutral-600 dark:text-neutral-400">Tax ({invoice.taxRate}%):</span><span>{formatCurrency(invoice.taxAmount)}</span></div>
                {invoice.discount > 0 && <div className="flex justify-between w-48"><span className="text-neutral-600 dark:text-neutral-400">Discount:</span><span className="text-secondary-600">-{formatCurrency(invoice.discount)}</span></div>}
                <div className="flex justify-between w-48 pt-2 border-t border-neutral-300 dark:border-neutral-600"><span className="font-semibold">Total:</span><span className="font-bold text-lg">{formatCurrency(invoice.total)}</span></div>
                {invoice.amountPaid > 0 && <div className="flex justify-between w-48"><span className="text-secondary-600">Paid:</span><span className="text-secondary-600">-{formatCurrency(invoice.amountPaid)}</span></div>}
                {invoice.balance > 0 && <div className="flex justify-between w-48"><span className="font-semibold text-primary-600">Balance Due:</span><span className="font-bold text-lg text-primary-600">{formatCurrency(invoice.balance)}</span></div>}
              </div>
            </CardBody>
          </Card>

          {invoice.notes && (
            <Card>
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Notes</h3>
              </div>
              <CardBody><p className="text-neutral-600 dark:text-neutral-400">{invoice.notes}</p></CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Customer</h3>
            </div>
            <CardBody className="space-y-3">
              <div><p className="text-xs text-neutral-500">Name</p><p className="font-medium text-neutral-900 dark:text-white">{invoice.customerName}</p></div>
              <div><p className="text-xs text-neutral-500">Email</p><p className="text-sm text-neutral-600 dark:text-neutral-400">{invoice.customerEmail}</p></div>
              <div><p className="text-xs text-neutral-500">Phone</p><p className="text-sm text-neutral-600 dark:text-neutral-400">{invoice.customerPhone}</p></div>
              <div><p className="text-xs text-neutral-500">Address</p><p className="text-sm text-neutral-600 dark:text-neutral-400">{invoice.customerAddress}</p></div>
            </CardBody>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Details</h3>
            </div>
            <CardBody className="space-y-3">
              <div className="flex justify-between"><span className="text-neutral-500">Issue Date</span><span className="font-medium text-neutral-900 dark:text-white">{formatDate(invoice.issueDate)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Due Date</span><span className="font-medium text-neutral-900 dark:text-white">{formatDate(invoice.dueDate)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Created</span><span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(invoice.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Updated</span><span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(invoice.updatedAt)}</span></div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Send Invoice Modal */}
      {invoice && (
        <SendInvoiceModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          onSend={handleSendEmail}
          invoice={invoice}
          isLoading={isSending}
        />
      )}

      {/* Print View (hidden, shown only during print) */}
      {showPrintView && invoice && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto print:static">
          <InvoicePrintView invoice={invoice} />
        </div>
      )}
    </PageContainer>
  );
};

export default InvoiceDetailPage;
