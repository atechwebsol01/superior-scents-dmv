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
  <Card className="card-hover">
    <CardBody className="p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-neutral-500 truncate">{title}</p>
          <p className="text-xl font-bold text-neutral-900 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {changeType === 'increase' ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-secondary-500 flex-shrink-0" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-error-500 flex-shrink-0" />
            )}
            <span
              className={cn(
                'text-xs font-semibold',
                changeType === 'increase' ? 'text-secondary-600' : 'text-error-600'
              )}
            >
              {change}
            </span>
            <span className="text-xs text-neutral-400">vs last mo.</span>
          </div>
        </div>
        <div className={cn('p-2.5 rounded-xl flex-shrink-0', iconBgColor)}>
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

  // Format display name - remove "User" if it's just the email prefix
  const displayName = fullName?.trim() || user?.firstName || 'there';

  const stats = [
    {
      title: 'Total Customers',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <Users className="w-5 h-5 text-primary-600" />,
      iconBgColor: 'bg-primary-100',
    },
    {
      title: 'Active Invoices',
      value: '156',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: <FileText className="w-5 h-5 text-secondary-600" />,
      iconBgColor: 'bg-secondary-100',
    },
    {
      title: 'Pending Payments',
      value: '$24,580',
      change: '-3.1%',
      changeType: 'decrease' as const,
      icon: <CreditCard className="w-5 h-5 text-accent-600" />,
      iconBgColor: 'bg-accent-100',
    },
    {
      title: 'Monthly Revenue',
      value: '$89,420',
      change: '+18.7%',
      changeType: 'increase' as const,
      icon: <TrendingUp className="w-5 h-5 text-secondary-600" />,
      iconBgColor: 'bg-secondary-100',
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
      case 'payment': return <DollarSign className="w-4 h-4 text-secondary-500" />;
      case 'invoice': return <FileText className="w-4 h-4 text-primary-500" />;
      case 'employee': return <Users className="w-4 h-4 text-accent-500" />;
      default: return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <PageContainer
      title={`Welcome back, ${displayName}!`}
      subtitle={`Here's what's happening at ${COMPANY_NAME} today.`}
    >
      {/* Stats Grid - Responsive with better breakpoints */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50">
              <h3 className="font-semibold gradient-brand-text">Recent Activity</h3>
            </div>
            <CardBody className="p-0">
              <div className="divide-y divide-neutral-100">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-700 truncate">{activity.message}</p>
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
            <div className="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-secondary-50 to-primary-50">
              <h3 className="font-semibold gradient-brand-text">Quick Actions</h3>
            </div>
            <CardBody>
              <div className="space-y-2">
                {[
                  { label: 'Add Customer', icon: Users, gradient: 'from-primary-500 to-primary-600' },
                  { label: 'Create Invoice', icon: FileText, gradient: 'from-secondary-500 to-secondary-600' },
                  { label: 'Record Payment', icon: CreditCard, gradient: 'from-primary-500 to-secondary-500' },
                  { label: 'View Reports', icon: TrendingUp, gradient: 'from-secondary-500 to-primary-500' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
                      'text-left transition-all duration-200',
                      'hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50',
                      'border border-transparent hover:border-primary-200',
                      'group'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center',
                      action.gradient
                    )}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">{action.label}</span>
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
