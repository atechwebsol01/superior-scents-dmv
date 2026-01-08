import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helper?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  containerClassName?: string;
  name?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  helper,
  disabled = false,
  required = false,
  className,
  containerClassName,
  name,
}) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <Listbox value={value || ''} onChange={onChange || (() => {})} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              'relative w-full px-3.5 py-2.5 text-left text-sm border rounded-lg',
              'bg-white dark:bg-neutral-800',
              'text-neutral-900 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                : 'border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500/20',
              className
            )}
          >
            <span className={cn('block truncate', !selectedOption && 'text-neutral-400 dark:text-neutral-500')}>
              {selectedOption?.label || placeholder}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={cn(
                'absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg',
                'max-h-60 overflow-auto',
                'focus:outline-none'
              )}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ active, disabled }) =>
                    cn(
                      'relative px-3.5 py-2.5 cursor-pointer select-none text-neutral-900 dark:text-white',
                      active && 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
                      disabled && 'opacity-50 cursor-not-allowed'
                    )
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'block truncate text-sm',
                          selected && 'font-medium'
                        )}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <Check className="w-4 h-4 text-primary-500" />
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1.5 text-xs text-error-600 dark:text-error-400">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">{helper}</p>}
      {name && <input type="hidden" name={name} value={value || ''} />}
    </div>
  );
};

export default Select;
