import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

const reportConfigs: Record<string, { title: string; description: string; stats: { label: string; value: string; change: string; positive: boolean }[] }> = {
  revenue: {
    title: 'Revenue Analysis',
    description: 'Detailed revenue breakdown by period and category',
    stats: [
      { label: 'Total Revenue', value: '$48,290', change: '+18.5%', positive: true },
      { label: 'Services Revenue', value: '$38,500', change: '+22%', positive: true },
      { label: 'Products Revenue', value: '$9,790', change: '+8%', positive: true },
      { label: 'Avg Monthly', value: '$16,097', change: '+12%', positive: true },
    ],
  },
  customers: {
    title: 'Customer Report',
    description: 'Customer acquisition, retention, and lifetime value',
    stats: [
      { label: 'Total Customers', value: '156', change: '+24', positive: true },
      { label: 'Active Customers', value: '48', change: '+5', positive: true },
      { label: 'New This Month', value: '12', change: '+4', positive: true },
      { label: 'Churn Rate', value: '2.3%', change: '-0.5%', positive: true },
    ],
  },
  invoices: {
    title: 'Invoice Report',
    description: 'Invoice status, aging, and collection metrics',
    stats: [
      { label: 'Total Invoiced', value: '$52,450', change: '+15%', positive: true },
      { label: 'Collected', value: '$48,200', change: '+18%', positive: true },
      { label: 'Outstanding', value: '$4,250', change: '-8%', positive: true },
      { label: 'Overdue', value: '$1,890', change: '+$340', positive: false },
    ],
  },
  payments: {
    title: 'Payment Report',
    description: 'Payment methods, timing, and collection trends',
    stats: [
      { label: 'Total Collected', value: '$48,200', change: '+18%', positive: true },
      { label: 'Credit Card', value: '$28,920', change: '60%', positive: true },
      { label: 'Bank Transfer', value: '$14,460', change: '30%', positive: true },
      { label: 'Avg Days to Pay', value: '12 days', change: '-2 days', positive: true },
    ],
  },
  employees: {
    title: 'Employee Report',
    description: 'Performance, commissions, and productivity metrics',
    stats: [
      { label: 'Total Employees', value: '6', change: '+1', positive: true },
      { label: 'Services Completed', value: '142', change: '+28', positive: true },
      { label: 'Total Commissions', value: '$4,850', change: '+12%', positive: true },
      { label: 'Avg Rating', value: '4.8', change: '+0.2', positive: true },
    ],
  },
  services: {
    title: 'Service Report',
    description: 'Service frequency, popularity, and revenue analysis',
    stats: [
      { label: 'Services Rendered', value: '142', change: '+28', positive: true },
      { label: 'Service Revenue', value: '$38,500', change: '+22%', positive: true },
      { label: 'Avg Service Value', value: '$271', change: '+5%', positive: true },
      { label: 'Repeat Rate', value: '85%', change: '+3%', positive: true },
    ],
  },
  tax: {
    title: 'Tax Report',
    description: 'Tax collected by period and jurisdiction',
    stats: [
      { label: 'Total Tax Collected', value: '$2,897', change: '+15%', positive: true },
      { label: 'DC Tax (6%)', value: '$1,450', change: '+12%', positive: true },
      { label: 'MD Tax (6%)', value: '$920', change: '+18%', positive: true },
      { label: 'VA Tax (5.3%)', value: '$527', change: '+14%', positive: true },
    ],
  },
};

export const GenericReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = React.useState('month');

  const config = reportConfigs[reportId || ''] || {
    title: 'Report',
    description: 'Report details',
    stats: [],
  };

  const sampleData = [
    { period: 'Week 1', value: 5200 },
    { period: 'Week 2', value: 6100 },
    { period: 'Week 3', value: 5800 },
    { period: 'Week 4', value: 7400 },
  ];

  return (
    <PageContainer
      title={config.title}
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Reports', path: '/reports' },
        { label: config.title },
      ]}
    >
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/reports')}>Back</Button>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{config.title}</h2>
                <p className="text-sm text-neutral-500">{config.description}</p>
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
        {config.stats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-neutral-500">{stat.label}</p>
                {stat.positive ? <TrendingUp className="w-4 h-4 text-secondary-500" /> : <TrendingDown className="w-4 h-4 text-error-500" />}
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.positive ? 'text-secondary-600' : 'text-error-600'}`}>{stat.change}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="font-semibold text-neutral-900 dark:text-white">Trend Analysis</h3>
        </div>
        <CardBody>
          <div className="h-64 flex items-end justify-around gap-4 pt-4">
            {sampleData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div 
                  className="w-20 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(d.value / 8000) * 200}px` }}
                />
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{d.period}</p>
                <p className="text-xs text-neutral-500">${(d.value / 1000).toFixed(1)}k</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
};

export default GenericReport;
