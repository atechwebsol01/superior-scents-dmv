import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardBody } from '@/components/common/Card';
import type { Invoice, InvoiceLineItem } from '../types/invoice.types';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (data: InvoiceFormSubmitData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface InvoiceFormSubmitData {
  customerId: string;
  issueDate: string;
  dueDate: string;
  lineItems: Omit<InvoiceLineItem, 'id'>[];
  taxRate: number;
  discount: number;
  notes?: string;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSubmit, onCancel, isLoading }) => {
  const [customerId, setCustomerId] = React.useState(invoice?.customerId || '1');
  const [issueDate, setIssueDate] = React.useState(invoice?.issueDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = React.useState(invoice?.dueDate || '');
  const [taxRate, setTaxRate] = React.useState(invoice?.taxRate || 6);
  const [discount, setDiscount] = React.useState(invoice?.discount || 0);
  const [notes, setNotes] = React.useState(invoice?.notes || '');
  const [lineItems, setLineItems] = React.useState<Omit<InvoiceLineItem, 'id'>[]>(
    invoice?.lineItems.map(({ description, quantity, unitPrice, total, type }) => ({ description, quantity, unitPrice, total, type })) ||
    [{ description: '', quantity: 1, unitPrice: 0, total: 0, type: 'service' }]
  );

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0, type: 'service' }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    setLineItems(updated);
  };

  const subtotal = lineItems.reduce((sum, li) => sum + li.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ customerId, issueDate, dueDate, lineItems, taxRate, discount, notes: notes || undefined });
  };

  const customers = [
    { id: '1', name: 'Johnson & Associates' },
    { id: '2', name: 'Metro Medical Center' },
    { id: '3', name: 'Arlington Auto Group' },
    { id: '4', name: 'Capital City Spa' },
    { id: '5', name: 'Silver Spring Fitness' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Invoice Details</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Customer</label>
                <select
                  className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                >
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <Input label="Issue Date" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
              <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              <Input label="Tax Rate (%)" type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Line Items</h3>
            <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addLineItem}>Add Item</Button>
          </div>
          <CardBody>
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-neutral-500 mb-1">Description</label>
                      <input
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        placeholder="Service or product"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Type</label>
                      <select
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        value={item.type}
                        onChange={(e) => updateLineItem(index, 'type', e.target.value)}
                      >
                        <option value="service">Service</option>
                        <option value="product">Product</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Total</label>
                        <p className="px-3 py-2 font-semibold text-neutral-900 dark:text-white">${item.total.toFixed(2)}</p>
                      </div>
                      {lineItems.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeLineItem(index)}>
                          <Trash2 className="w-4 h-4 text-error-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
          <CardBody className="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
            <div className="flex flex-col items-end space-y-2">
              <div className="flex justify-between w-48"><span className="text-neutral-600 dark:text-neutral-400">Subtotal:</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between w-48"><span className="text-neutral-600 dark:text-neutral-400">Tax ({taxRate}%):</span><span>${taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between w-48 items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Discount:</span>
                <input type="number" min="0" step="0.01" className="w-20 px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded text-sm text-right bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="flex justify-between w-48 pt-2 border-t border-neutral-300 dark:border-neutral-600"><span className="font-semibold">Total:</span><span className="font-bold text-lg">${total.toFixed(2)}</span></div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Notes (Optional)</h3>
          </div>
          <CardBody>
            <textarea
              rows={3}
              className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              placeholder="Add any notes for the customer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isLoading}>{invoice ? 'Update' : 'Create'} Invoice</Button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
