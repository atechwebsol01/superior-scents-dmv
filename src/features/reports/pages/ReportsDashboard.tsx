import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, TrendingUp, Users, FileText, DollarSign, Package, Briefcase, Calculator } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';

export const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();

  const reports = [
    { id: 'sales', title: 'Sales Report', description: 'Revenue, sales trends, and performance metrics', icon: TrendingUp, color: 'primary' },
    { id: 'revenue', title: 'Revenue Analysis', description: 'Detailed revenue breakdown by period and category', icon: DollarSign, color: 'secondary' },
    { id: 'customers', title: 'Customer Report', description: 'Customer acquisition, retention, and value', icon: Users, color: 'accent' },
    { id: 'invoices', title: 'Invoice Report', description: 'Invoice status, aging, and collection rates', icon: FileText, color: 'info' },
    { id: 'payments', title: 'Payment Report', description: 'Payment methods, timing, and trends', icon: Calculator, color: 'success' },
    { id: 'employees', title: 'Employee Report', description: 'Performance, commissions, and productivity', icon: Briefcase, color: 'warning' },
    { id: 'services', title: 'Service Report', description: 'Service frequency, popularity, and revenue', icon: Package, color: 'error' },
    { id: 'tax', title: 'Tax Report', description: 'Tax collected by period and jurisdiction', icon: PieChart, color: 'neutral' },
  ];

  const quickStats = [
    { label: 'This Month Revenue', value: '$12,450', change: '+12%', positive: true },
    { label: 'Active Customers', value: '48', change: '+5', positive: true },
    { label: 'Pending Invoices', value: '12', change: '-3', positive: true },
    { label: 'Overdue Amount', value: '$2,340', change: '+$890', positive: false },
  ];

  return (
    <PageContainer
      title="Reports"
      subtitle="Business analytics and insights"
      breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports' }]}
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardBody>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.positive ? 'text-secondary-600' : 'text-error-600'}`}>{stat.change} vs last month</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Report Cards */}
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Available Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report) => (
          <div key={report.id} onClick={() => navigate(`/reports/${report.id}`)} className="cursor-pointer">
            <Card className="card-hover h-full">
              <CardBody className="flex flex-col items-center text-center py-6">
                <div className={`w-14 h-14 rounded-xl bg-${report.color}-100 dark:bg-${report.color}-900/30 flex items-center justify-center mb-4`}>
                  <report.icon className={`w-7 h-7 text-${report.color}-600 dark:text-${report.color}-400`} />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{report.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{report.description}</p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Recent Report Activity</h3>
          </div>
          <CardBody>
            <div className="space-y-4">
              {[
                { report: 'Sales Report', date: 'Today, 2:30 PM', user: 'Robert Anderson' },
                { report: 'Customer Report', date: 'Yesterday, 4:15 PM', user: 'Patricia Garcia' },
                { report: 'Invoice Report', date: 'Mar 18, 10:00 AM', user: 'Robert Anderson' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{activity.report}</p>
                      <p className="text-xs text-neutral-500">{activity.date}</p>
                    </div>
                  </div>
                  <span className="text-sm text-neutral-500">{activity.user}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ReportsDashboard;
