import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Select, Badge, Avatar } from '@/components';
import { cn } from '@/lib/cn';

interface CommissionRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  invoiceId: string;
  customer: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  date: string;
  status: 'pending' | 'paid' | 'processing';
}

interface EmployeeSummary {
  id: string;
  name: string;
  avatar?: string;
  totalSales: number;
  totalCommission: number;
  pendingCommission: number;
  invoiceCount: number;
}

export const CommissionReport: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('this_month');
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  // Mock data
  const commissionRecords: CommissionRecord[] = [
    { id: '1', employeeId: '1', employeeName: 'John Smith', invoiceId: 'INV-001', customer: 'ABC Corp', saleAmount: 1500, commissionRate: 10, commissionAmount: 150, date: '2026-01-05', status: 'paid' },
    { id: '2', employeeId: '2', employeeName: 'Sarah Johnson', invoiceId: 'INV-002', customer: 'XYZ Inc', saleAmount: 2400, commissionRate: 12, commissionAmount: 288, date: '2026-01-04', status: 'pending' },
    { id: '3', employeeId: '1', employeeName: 'John Smith', invoiceId: 'INV-003', customer: 'Tech Solutions', saleAmount: 890, commissionRate: 10, commissionAmount: 89, date: '2026-01-03', status: 'processing' },
    { id: '4', employeeId: '3', employeeName: 'Mike Wilson', invoiceId: 'INV-004', customer: 'Metro Office', saleAmount: 3200, commissionRate: 15, commissionAmount: 480, date: '2026-01-02', status: 'paid' },
    { id: '5', employeeId: '2', employeeName: 'Sarah Johnson', invoiceId: 'INV-005', customer: 'City Hall', saleAmount: 1800, commissionRate: 12, commissionAmount: 216, date: '2026-01-01', status: 'pending' },
  ];

  const employeeSummaries: EmployeeSummary[] = [
    { id: '1', name: 'John Smith', totalSales: 12500, totalCommission: 1250, pendingCommission: 89, invoiceCount: 15 },
    { id: '2', name: 'Sarah Johnson', totalSales: 18400, totalCommission: 2208, pendingCommission: 504, invoiceCount: 22 },
    { id: '3', name: 'Mike Wilson', totalSales: 9800, totalCommission: 1470, pendingCommission: 0, invoiceCount: 11 },
  ];

  const totalSales = employeeSummaries.reduce((sum, e) => sum + e.totalSales, 0);
  const totalCommission = employeeSummaries.reduce((sum, e) => sum + e.totalCommission, 0);
  const totalPending = employeeSummaries.reduce((sum, e) => sum + e.pendingCommission, 0);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const filteredRecords = selectedEmployee === 'all' 
    ? commissionRecords 
    : commissionRecords.filter(r => r.employeeId === selectedEmployee);

  return (
    <PageContainer
      title="Commission Report"
      subtitle="Track employee sales commissions and payouts"
      breadcrumbs={[
        { label: 'Reports', path: '/reports' },
        { label: 'Commission Report' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/reports')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Sales</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">${totalSales.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Commission</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">${totalCommission.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Pending Payout</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">${totalPending.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Employees</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{employeeSummaries.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Summary */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Employee Summary</h3>
          <div className="space-y-4">
            {employeeSummaries.map(employee => (
              <div
                key={employee.id}
                onClick={() => setSelectedEmployee(employee.id === selectedEmployee ? 'all' : employee.id)}
                className={cn(
                  'p-4 rounded-lg border cursor-pointer transition-all',
                  selectedEmployee === employee.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={employee.name} size="sm" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{employee.name}</p>
                    <p className="text-xs text-neutral-500">{employee.invoiceCount} invoices</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-neutral-500">Sales</p>
                    <p className="font-semibold text-neutral-900 dark:text-white">${employee.totalSales.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Commission</p>
                    <p className="font-semibold text-green-600">${employee.totalCommission.toLocaleString()}</p>
                  </div>
                </div>
                {employee.pendingCommission > 0 && (
                  <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <p className="text-xs text-yellow-600">Pending: ${employee.pendingCommission}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Commission Details */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Commission Details</h3>
            <div className="flex gap-2">
              <Select
                value={period}
                onChange={(value) => setPeriod(value)}
                options={[
                  { value: 'this_month', label: 'This Month' },
                  { value: 'last_month', label: 'Last Month' },
                  { value: 'this_quarter', label: 'This Quarter' },
                  { value: 'this_year', label: 'This Year' },
                ]}
                className="w-40"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Invoice</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Customer</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Sale</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Commission</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={record.employeeName} size="xs" />
                        <span className="text-sm text-neutral-900 dark:text-white">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-primary-600 font-medium">{record.invoiceId}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">{record.customer}</td>
                    <td className="py-3 px-4 text-sm text-right text-neutral-900 dark:text-white">${record.saleAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-neutral-500">{record.commissionRate}%</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-green-600">${record.commissionAmount}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={statusColors[record.status]}>{record.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              No commission records found for the selected criteria.
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default CommissionReport;
