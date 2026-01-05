import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  X,
  ChevronLeft,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
  items?: SidebarItem[];
  className?: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Package,
};

const defaultItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { id: 'customers', label: 'Customers', path: '/customers', icon: 'Users' },
  { id: 'employees', label: 'Employees', path: '/employees', icon: 'UserCog' },
  { id: 'invoices', label: 'Invoices', path: '/invoices', icon: 'FileText' },
  { id: 'payments', label: 'Payments', path: '/payments', icon: 'CreditCard' },
  { id: 'services', label: 'Services', path: '/services', icon: 'Package' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'BarChart3' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
  items = defaultItems,
  className,
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 top-16',
          'bg-neutral-900 text-white',
          'transform transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20' : 'w-64',
          className
        )}
      >
        {/* Header with gradient accent */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800 relative">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500" />
          
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Superior Scents" className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex flex-col">
                <span className="text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Superior Scents
                </span>
                <span className="text-[10px] text-neutral-400 -mt-0.5">DMV, LLC</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <img src="/logo.jpg" alt="Superior Scents" className="w-10 h-10 rounded-lg object-cover" />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          {!isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 hover:bg-neutral-800 rounded-lg hidden lg:block"
            >
              <ChevronLeft className="w-5 h-5 transition-transform" />
            </button>
          )}
        </div>

        {/* Collapsed toggle button */}
        {isCollapsed && (
          <div className="flex justify-center py-2">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 hover:bg-neutral-800 rounded-lg hidden lg:block"
            >
              <ChevronLeft className="w-5 h-5 transition-transform rotate-180" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg',
                    'text-neutral-300 hover:bg-neutral-800 hover:text-white',
                    'transition-all duration-200',
                    isActive && 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border-l-2 border-primary-500',
                    isCollapsed && 'justify-center px-2'
                  )
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 opacity-50" />
      </aside>
    </>
  );
};

export default Sidebar;
