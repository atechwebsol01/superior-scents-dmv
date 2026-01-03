import React from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'boxed';
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  fullWidth = false,
  className,
}) => {
  const baseTabStyles = 'flex items-center justify-center gap-2 font-medium transition-all duration-200';
  
  const variantStyles = {
    underline: {
      container: 'border-b border-neutral-200',
      tab: cn(
        baseTabStyles,
        'px-4 py-3 text-sm border-b-2 -mb-px',
        'text-neutral-600 border-transparent',
        'hover:text-primary-500 hover:border-primary-300'
      ),
      active: 'text-primary-600 border-primary-500',
    },
    pills: {
      container: 'bg-neutral-100 p-1 rounded-lg',
      tab: cn(
        baseTabStyles,
        'px-4 py-2 text-sm rounded-md',
        'text-neutral-600',
        'hover:text-neutral-900'
      ),
      active: 'bg-white text-neutral-900 shadow-sm',
    },
    boxed: {
      container: 'border border-neutral-200 rounded-lg p-1',
      tab: cn(
        baseTabStyles,
        'px-4 py-2 text-sm rounded-md',
        'text-neutral-600',
        'hover:bg-neutral-50'
      ),
      active: 'bg-primary-500 text-white',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn('flex', styles.container, fullWidth && 'w-full', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            styles.tab,
            activeTab === tab.id && styles.active,
            fullWidth && 'flex-1',
            tab.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
          {tab.label}
          {tab.badge !== undefined && (
            <span
              className={cn(
                'ml-1.5 px-1.5 py-0.5 text-xs rounded-full',
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-neutral-200 text-neutral-600'
              )}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
