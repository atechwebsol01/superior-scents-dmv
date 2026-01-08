import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download, ArrowLeft, X } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Badge } from '@/components';
import { cn } from '@/lib/cn';

interface ImportPreview {
  total: number;
  valid: number;
  invalid: number;
  data: Array<{
    row: number;
    name: string;
    email: string;
    phone: string;
    status: 'valid' | 'error';
    error?: string;
  }>;
}

export const CustomerImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
      simulatePreview(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      simulatePreview(selectedFile);
    }
  };

  const simulatePreview = (_file: File) => {
    // Simulated preview data
    setPreview({
      total: 25,
      valid: 23,
      invalid: 2,
      data: [
        { row: 1, name: 'John Smith', email: 'john@example.com', phone: '(202) 555-0101', status: 'valid' },
        { row: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '(202) 555-0102', status: 'valid' },
        { row: 3, name: 'Bob Wilson', email: 'invalid-email', phone: '(202) 555-0103', status: 'error', error: 'Invalid email format' },
        { row: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '(202) 555-0104', status: 'valid' },
        { row: 5, name: '', email: 'noname@example.com', phone: '(202) 555-0105', status: 'error', error: 'Name is required' },
      ],
    });
  };

  const handleImport = async () => {
    setImporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setImporting(false);
    setImported(true);
  };

  const downloadTemplate = () => {
    const csvContent = 'Name,Email,Phone,Address,City,State,Zip,Notes\nJohn Doe,john@example.com,(555) 123-4567,123 Main St,Washington,DC,20001,Sample customer';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_import_template.csv';
    a.click();
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setImported(false);
  };

  return (
    <PageContainer
      title="Import Customers"
      subtitle="Upload a CSV or Excel file to import customers in bulk"
      breadcrumbs={[
        { label: 'Customers', path: '/customers' },
        { label: 'Import' },
      ]}
      actions={
        <Button variant="outline" onClick={() => navigate('/customers')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          {!imported ? (
            <>
              {/* Drop Zone */}
              <Card className="p-6">
                <div
                  className={cn(
                    'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                    isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-300 dark:border-neutral-600',
                    file && 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileSpreadsheet className="w-12 h-12 text-green-500" />
                      <div className="text-left">
                        <p className="font-semibold text-neutral-900 dark:text-white">{file.name}</p>
                        <p className="text-sm text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearFile}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                      <p className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                        Drop your file here, or browse
                      </p>
                      <p className="text-sm text-neutral-500 mb-4">Supports CSV and Excel files</p>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileSelect}
                      />
                      <label htmlFor="file-upload">
                        <span className="inline-flex items-center justify-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                          Select File
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </Card>

              {/* Preview Table */}
              {preview && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Preview</h3>
                    <div className="flex gap-2">
                      <Badge variant="success">{preview.valid} Valid</Badge>
                      <Badge variant="error">{preview.invalid} Errors</Badge>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                          <th className="text-left py-2 px-3 font-medium text-neutral-500">Row</th>
                          <th className="text-left py-2 px-3 font-medium text-neutral-500">Name</th>
                          <th className="text-left py-2 px-3 font-medium text-neutral-500">Email</th>
                          <th className="text-left py-2 px-3 font-medium text-neutral-500">Phone</th>
                          <th className="text-left py-2 px-3 font-medium text-neutral-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.data.map((row) => (
                          <tr key={row.row} className={cn('border-b border-neutral-100 dark:border-neutral-800', row.status === 'error' && 'bg-red-50 dark:bg-red-900/10')}>
                            <td className="py-2 px-3 text-neutral-600 dark:text-neutral-400">{row.row}</td>
                            <td className="py-2 px-3 text-neutral-900 dark:text-white">{row.name || '-'}</td>
                            <td className="py-2 px-3 text-neutral-600 dark:text-neutral-400">{row.email}</td>
                            <td className="py-2 px-3 text-neutral-600 dark:text-neutral-400">{row.phone}</td>
                            <td className="py-2 px-3">
                              {row.status === 'valid' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <div className="flex items-center gap-1 text-red-500">
                                  <AlertCircle className="w-4 h-4" />
                                  <span className="text-xs">{row.error}</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleImport} loading={importing} disabled={preview.valid === 0}>
                      Import {preview.valid} Customers
                    </Button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Import Successful!</h3>
              <p className="text-neutral-500 mb-6">{preview?.valid} customers have been imported successfully.</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={clearFile}>Import More</Button>
                <Button onClick={() => navigate('/customers')}>View Customers</Button>
              </div>
            </Card>
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Instructions</h3>
            <ol className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-medium">1</span>
                <span>Download the template file</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-medium">2</span>
                <span>Fill in your customer data</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-medium">3</span>
                <span>Upload the completed file</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-medium">4</span>
                <span>Review and confirm import</span>
              </li>
            </ol>
            <Button variant="outline" className="w-full mt-4" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Required Fields</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Badge variant="error" className="text-xs">Required</Badge>
                <span className="text-neutral-600 dark:text-neutral-400">Name</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="error" className="text-xs">Required</Badge>
                <span className="text-neutral-600 dark:text-neutral-400">Email</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="warning" className="text-xs">Optional</Badge>
                <span className="text-neutral-600 dark:text-neutral-400">Phone, Address, Notes</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default CustomerImportPage;
