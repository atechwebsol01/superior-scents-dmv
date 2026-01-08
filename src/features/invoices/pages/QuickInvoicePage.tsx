import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Plus, Trash2, Send, Save, ArrowLeft, Search } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Input, Select } from '@/components';


interface LineItem {
  id: string;
  service: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface QuickCustomer {
  id: string;
  name: string;
  email: string;
}

const mockCustomers: QuickCustomer[] = [
  { id: '1', name: 'ABC Corporation', email: 'billing@abc.com' },
  { id: '2', name: 'XYZ Industries', email: 'accounts@xyz.com' },
  { id: '3', name: 'Tech Solutions Inc', email: 'finance@techsol.com' },
  { id: '4', name: 'Metro Office Group', email: 'ap@metrooffice.com' },
];

const quickServices = [
  { id: '1', name: 'Monthly Service', rate: 150 },
  { id: '2', name: 'Quarterly Service', rate: 400 },
  { id: '3', name: 'Installation', rate: 250 },
  { id: '4', name: 'Maintenance', rate: 100 },
  { id: '5', name: 'Consultation', rate: 75 },
  { id: '6', name: 'Product - Diffuser', rate: 199 },
  { id: '7', name: 'Product - Scent Refill', rate: 45 },
];

export const QuickInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<QuickCustomer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', service: '', description: '', quantity: 1, rate: 0, amount: 0 },
  ]);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      service: '',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'service') {
          const service = quickServices.find(s => s.id === value);
          if (service) {
            updated.description = service.name;
            updated.rate = service.rate;
          }
        }
        updated.amount = updated.quantity * updated.rate;
        return updated;
      }
      return item;
    }));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.06; // 6% tax
  const total = subtotal + tax;

  const handleQuickService = (service: typeof quickServices[0]) => {
    const existingEmpty = lineItems.find(item => !item.service);
    if (existingEmpty) {
      updateLineItem(existingEmpty.id, 'service', service.id);
    } else {
      const newItem: LineItem = {
        id: Date.now().toString(),
        service: service.id,
        description: service.name,
        quantity: 1,
        rate: service.rate,
        amount: service.rate,
      };
      setLineItems([...lineItems, newItem]);
    }
  };

  const handleSave = async (send: boolean) => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    navigate('/invoices', { state: { message: send ? 'Invoice sent successfully!' : 'Invoice saved as draft!' } });
  };

  return (
    <PageContainer
      title="Quick Invoice"
      subtitle="Create and send an invoice in seconds"
      breadcrumbs={[
        { label: 'Invoices', path: '/invoices' },
        { label: 'Quick Invoice' },
      ]}
      actions={
        <Button variant="outline" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Customer</h3>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={selectedCustomer ? selectedCustomer.name : customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setSelectedCustomer(null);
                    setShowCustomerDropdown(true);
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {showCustomerDropdown && !selectedCustomer && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredCustomers.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCustomerDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                    >
                      <p className="font-medium text-neutral-900 dark:text-white">{customer.name}</p>
                      <p className="text-sm text-neutral-500">{customer.email}</p>
                    </button>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <p className="px-4 py-3 text-neutral-500">No customers found</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Quick Add Services */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Add
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleQuickService(service)}
                  className="px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  {service.name} <span className="text-neutral-500">${service.rate}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Line Items */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Line Items</h3>
              <Button variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {lineItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-4">
                    <Select
                      value={item.service}
                      onChange={(value) => updateLineItem(item.id, 'service', value)}
                      options={[
                        { value: '', label: 'Select service...' },
                        ...quickServices.map(s => ({ value: s.id, label: `${s.name} ($${s.rate})` })),
                      ]}
                      placeholder="Service"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      min={1}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      leftIcon={<span className="text-neutral-400">$</span>}
                    />
                  </div>
                  <div className="col-span-1 text-right pt-2">
                    <span className="font-medium text-neutral-900 dark:text-white">${item.amount.toFixed(2)}</span>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm" onClick={() => removeLineItem(item.id)} disabled={lineItems.length === 1}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or payment instructions..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white resize-none"
            />
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Invoice Details</h3>
            <div className="space-y-4">
              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <Select
                label="Payment Terms"
                options={[
                  { value: 'due_on_receipt', label: 'Due on Receipt' },
                  { value: 'net_15', label: 'Net 15' },
                  { value: 'net_30', label: 'Net 30' },
                  { value: 'net_60', label: 'Net 60' },
                ]}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-neutral-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Tax (6%)</span>
                <span className="text-neutral-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => handleSave(true)} loading={saving} disabled={!selectedCustomer || lineItems.every(i => !i.service)}>
              <Send className="w-4 h-4 mr-2" />
              Send Invoice
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSave(false)} loading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default QuickInvoicePage;
