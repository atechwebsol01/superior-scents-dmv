import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, UserCog, FileText, CreditCard, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BottomNavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export interface BottomNavProps {
  items?: BottomNavItem[];
  className?: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Users,
  UserCog,
  FileText,
  CreditCard,
  BarChart3,
};

const defaultItems: BottomNavItem[] = [
  { id: 'customers', label: 'Customers', path: '/customers', icon: 'Users' },
  { id: 'employees', label: 'Employees', path: '/employees', icon: 'UserCog' },
  { id: 'invoices', label: 'Invoices', path: '/invoices', icon: 'FileText' },
  { id: 'payments', label: 'Payments', path: '/payments', icon: 'CreditCard' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'BarChart3' },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  items = defaultItems,
  className,
}) => {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-white border-t border-neutral-200',
        'flex items-center justify-around',
        'h-16 px-2',
        'lg:hidden',
        className
      )}
    >
      {items.map((item) => {
        const Icon = iconMap[item.icon] || Users;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 py-2',
                'text-neutral-500 transition-colors duration-200',
                isActive && 'text-primary-500'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    isActive && 'bg-primary-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium mt-0.5">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
