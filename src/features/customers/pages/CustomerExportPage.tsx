import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileSpreadsheet, FileText, ArrowLeft, CheckCircle, Filter } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Checkbox, Select } from '@/components';
import { cn } from '@/lib/cn';

type ExportFormat = 'csv' | 'xlsx' | 'pdf';

interface ExportField {
  id: string;
  label: string;
  checked: boolean;
}

export const CustomerExportPage: React.FC = () => {
  const navigate = useNavigate();
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [fields, setFields] = useState<ExportField[]>([
    { id: 'name', label: 'Customer Name', checked: true },
    { id: 'email', label: 'Email Address', checked: true },
    { id: 'phone', label: 'Phone Number', checked: true },
    { id: 'address', label: 'Address', checked: true },
    { id: 'city', label: 'City', checked: true },
    { id: 'state', label: 'State', checked: true },
    { id: 'zip', label: 'ZIP Code', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'created', label: 'Created Date', checked: false },
    { id: 'balance', label: 'Outstanding Balance', checked: false },
    { id: 'totalSpent', label: 'Total Spent', checked: false },
    { id: 'lastInvoice', label: 'Last Invoice Date', checked: false },
    { id: 'notes', label: 'Notes', checked: false },
  ]);

  const toggleField = (id: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, checked: !f.checked } : f));
  };

  const selectAll = () => setFields(fields.map(f => ({ ...f, checked: true })));
  const deselectAll = () => setFields(fields.map(f => ({ ...f, checked: false })));

  const handleExport = async () => {
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate file download
    const selectedFields = fields.filter(f => f.checked).map(f => f.label);
    const content = selectedFields.join(',') + '\nJohn Doe,john@example.com,(555) 123-4567,...';
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_export.${format}`;
    a.click();
    
    setExporting(false);
    setExported(true);
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, desc: 'Comma-separated values' },
    { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, desc: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', icon: FileText, desc: 'Portable Document Format' },
  ];

  const selectedCount = fields.filter(f => f.checked).length;

  return (
    <PageContainer
      title="Export Customers"
      subtitle="Download your customer data in various formats"
      breadcrumbs={[
        { label: 'Customers', path: '/customers' },
        { label: 'Export' },
      ]}
      actions={
        <Button variant="outline" onClick={() => navigate('/customers')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Button>
      }
    >
      {!exported ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Export Format</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {formatOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFormat(opt.value as ExportFormat)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      format === opt.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                    )}
                  >
                    <opt.icon className={cn('w-8 h-8 mb-2', format === opt.value ? 'text-primary-500' : 'text-neutral-400')} />
                    <p className="font-semibold text-neutral-900 dark:text-white">{opt.label}</p>
                    <p className="text-xs text-neutral-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Field Selection */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Select Fields</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={selectAll}>Select All</Button>
                  <Button variant="ghost" size="sm" onClick={deselectAll}>Deselect All</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map(field => (
                  <label
                    key={field.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      field.checked
                        ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    )}
                  >
                    <Checkbox checked={field.checked} onChange={() => toggleField(field.id)} />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{field.label}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Customer Status"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  options={[
                    { value: 'all', label: 'All Customers' },
                    { value: 'active', label: 'Active Only' },
                    { value: 'inactive', label: 'Inactive Only' },
                  ]}
                />
                <Select
                  label="Date Range"
                  options={[
                    { value: 'all', label: 'All Time' },
                    { value: '30', label: 'Last 30 Days' },
                    { value: '90', label: 'Last 90 Days' },
                    { value: 'year', label: 'This Year' },
                  ]}
                />
              </div>
            </Card>
          </div>

          {/* Summary & Export */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Export Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Format</span>
                  <span className="font-medium text-neutral-900 dark:text-white uppercase">{format}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Fields Selected</span>
                  <span className="font-medium text-neutral-900 dark:text-white">{selectedCount} of {fields.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Customers</span>
                  <span className="font-medium text-neutral-900 dark:text-white">~156</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-500">Est. File Size</span>
                  <span className="font-medium text-neutral-900 dark:text-white">~45 KB</span>
                </div>
              </div>
              <Button className="w-full mt-6" onClick={handleExport} loading={exporting} disabled={selectedCount === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Now
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Pro Tip</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Use CSV format for importing into other systems, or Excel for advanced filtering and analysis.
              </p>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Export Complete!</h3>
          <p className="text-neutral-500 mb-6">Your file has been downloaded successfully.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setExported(false)}>Export Again</Button>
            <Button onClick={() => navigate('/customers')}>Back to Customers</Button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default CustomerExportPage;
