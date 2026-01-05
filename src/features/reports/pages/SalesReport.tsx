import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign, FileText, Users } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const SalesReport: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = React.useState('month');

  const stats = [
    { label: 'Total Revenue', value: '$24,580', change: '+15.3%', positive: true, icon: DollarSign },
    { label: 'Invoices Sent', value: '42', change: '+8', positive: true, icon: FileText },
    { label: 'New Customers', value: '12', change: '+4', positive: true, icon: Users },
    { label: 'Avg Order Value', value: '$585', change: '-2.1%', positive: false, icon: TrendingUp },
  ];

  const topServices = [
    { name: 'Monthly Scent Service - Premium', revenue: 8970, count: 30 },
    { name: 'Commercial Scent System Install', revenue: 6000, count: 4 },
    { name: 'Quarterly Service Package', revenue: 4500, count: 6 },
    { name: 'Essential Oil Products', revenue: 3200, count: 45 },
    { name: 'Emergency Service Call', revenue: 1910, count: 8 },
  ];

  const monthlySales = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 21200 },
    { month: 'Mar', revenue: 24580 },
  ];

  return (
    <PageContainer
      title="Sales Report"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Reports', path: '/reports' },
        { label: 'Sales Report' },
      ]}
    >
      {/* Header */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/reports')}>Back</Button>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Sales Performance</h2>
                <p className="text-sm text-neutral-500">Analyze your sales metrics and trends</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary-500" />
                {stat.positive ? <TrendingUp className="w-4 h-4 text-secondary-500" /> : <TrendingDown className="w-4 h-4 text-error-500" />}
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-neutral-500">{stat.label}</p>
                <p className={`text-xs font-medium ${stat.positive ? 'text-secondary-600' : 'text-error-600'}`}>{stat.change}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Revenue Trend</h3>
          </div>
          <CardBody>
            <div className="h-64 flex items-end justify-around gap-4 pt-4">
              {monthlySales.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-16 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(m.revenue / 25000) * 200}px` }}
                  />
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{m.month}</p>
                  <p className="text-xs text-neutral-500">${(m.revenue / 1000).toFixed(1)}k</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Services */}
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Top Services</h3>
          </div>
          <CardBody>
            <div className="space-y-4">
              {topServices.map((service, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{service.name}</p>
                    <div className="mt-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        style={{ width: `${(service.revenue / topServices[0].revenue) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">${service.revenue.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">{service.count} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SalesReport;
