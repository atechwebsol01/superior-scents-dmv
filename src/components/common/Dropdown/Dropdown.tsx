import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: React.ReactNode;
  label?: string;
  align?: 'left' | 'right';
  variant?: 'button' | 'icon' | 'custom';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger,
  label = 'Options',
  align = 'right',
  variant = 'button',
  className,
}) => {
  const renderTrigger = () => {
    if (trigger) return trigger;

    if (variant === 'icon') {
      return (
        <Menu.Button
          className={cn(
            'p-2 rounded-lg text-neutral-500',
            'hover:bg-neutral-100 hover:text-neutral-700',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'transition-colors duration-200'
          )}
        >
          <MoreVertical className="w-5 h-5" />
        </Menu.Button>
      );
    }

    return (
      <Menu.Button
        className={cn(
          'inline-flex items-center justify-center gap-2 px-4 py-2.5',
          'text-sm font-medium text-neutral-700 bg-white',
          'border border-neutral-300 rounded-lg',
          'hover:bg-neutral-50',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          'transition-colors duration-200'
        )}
      >
        {label}
        <ChevronDown className="w-4 h-4" />
      </Menu.Button>
    );
  };

  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      {renderTrigger()}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-50 mt-2 w-56 origin-top-right',
            'bg-white rounded-lg shadow-lg border border-neutral-200',
            'focus:outline-none',
            'divide-y divide-neutral-100',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="py-1">
            {items.map((item) => {
              if (item.divider) {
                return <div key={item.id} className="border-t border-neutral-200 my-1" />;
              }

              return (
                <Menu.Item key={item.id} disabled={item.disabled}>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={cn(
                        'flex items-center w-full px-4 py-2 text-sm',
                        'transition-colors duration-150',
                        item.danger
                          ? active
                            ? 'bg-error-50 text-error-700'
                            : 'text-error-600'
                          : active
                            ? 'bg-neutral-100 text-neutral-900'
                            : 'text-neutral-700',
                        item.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {item.icon && (
                        <span className="mr-3 flex-shrink-0">{item.icon}</span>
                      )}
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
