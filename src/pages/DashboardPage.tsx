import React from 'react';
import { 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp,
  UserCheck,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { useAuth } from '@/features/auth';
import { COMPANY_NAME } from '@/lib/constants';
import { cn } from '@/lib/cn';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  iconBgColor,
}) => (
  <Card>
    <CardBody>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {changeType === 'increase' ? (
              <ArrowUpRight className="w-4 h-4 text-success-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-error-500" />
            )}
            <span
              className={cn(
                'text-sm font-medium ml-1',
                changeType === 'increase' ? 'text-success-600' : 'text-error-600'
              )}
            >
              {change}
            </span>
            <span className="text-sm text-neutral-400 ml-1">vs last month</span>
          </div>
        </div>
        <div className={cn('p-3 rounded-xl', iconBgColor)}>
          {icon}
        </div>
      </div>
    </CardBody>
  </Card>
);

/**
 * Dashboard Page
 * Superior Scents DMV, LLC
 */
export const DashboardPage: React.FC = () => {
  const { user, fullName } = useAuth();

  const stats = [
    {
      title: 'Total Customers',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6 text-primary-600" />,
      iconBgColor: 'bg-primary-100',
    },
    {
      title: 'Active Invoices',
      value: '156',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: <FileText className="w-6 h-6 text-secondary-600" />,
      iconBgColor: 'bg-secondary-100',
    },
    {
      title: 'Pending Payments',
      value: '$24,580',
      change: '-3.1%',
      changeType: 'decrease' as const,
      icon: <CreditCard className="w-6 h-6 text-accent-600" />,
      iconBgColor: 'bg-accent-100',
    },
    {
      title: 'Monthly Revenue',
      value: '$89,420',
      change: '+18.7%',
      changeType: 'increase' as const,
      icon: <TrendingUp className="w-6 h-6 text-success-600" />,
      iconBgColor: 'bg-success-100',
    },
  ];

  const recentActivity = [
    { id: 1, type: 'customer', message: 'New customer registered: ABC Corp', time: '5 mins ago' },
    { id: 2, type: 'payment', message: 'Payment received: $1,250 from XYZ LLC', time: '12 mins ago' },
    { id: 3, type: 'invoice', message: 'Invoice #1234 sent to John Smith', time: '1 hour ago' },
    { id: 4, type: 'employee', message: 'Employee schedule updated', time: '2 hours ago' },
    { id: 5, type: 'payment', message: 'Payment received: $3,500 from Acme Inc', time: '3 hours ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer': return <UserCheck className="w-4 h-4 text-primary-500" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-success-500" />;
      case 'invoice': return <FileText className="w-4 h-4 text-secondary-500" />;
      case 'employee': return <Users className="w-4 h-4 text-accent-500" />;
      default: return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <PageContainer
      title={`Welcome back, ${fullName || user?.firstName || 'User'}!`}
      subtitle={`Here's what's happening at ${COMPANY_NAME} today.`}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900">Recent Activity</h3>
            </div>
            <CardBody className="p-0">
              <div className="divide-y divide-neutral-100">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-700">{activity.message}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900">Quick Actions</h3>
            </div>
            <CardBody>
              <div className="space-y-3">
                {[
                  { label: 'Add New Customer', icon: Users, color: 'primary' },
                  { label: 'Create Invoice', icon: FileText, color: 'secondary' },
                  { label: 'Record Payment', icon: CreditCard, color: 'accent' },
                  { label: 'View Reports', icon: TrendingUp, color: 'success' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
                      'text-left transition-colors',
                      'hover:bg-neutral-100'
                    )}
                  >
                    <action.icon className={cn('w-5 h-5', `text-${action.color}-500`)} />
                    <span className="text-sm font-medium text-neutral-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
