import React from 'react';
import { cn } from '@/lib/cn';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  orientation = 'vertical',
  className,
  disabled = false,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-start cursor-pointer group',
              (disabled || option.disabled) && 'cursor-not-allowed opacity-50'
            )}
          >
            <div className="flex items-center h-5">
              <div className="relative">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={disabled || option.disabled}
                  className={cn(
                    'peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 transition-all duration-200',
                    'border-neutral-300 bg-white',
                    'checked:border-primary-500',
                    'hover:border-primary-400 group-hover:border-primary-400',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0',
                    'disabled:cursor-not-allowed',
                    error && 'border-error-500'
                  )}
                />
                <div
                  className={cn(
                    'pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500',
                    'scale-0 transition-transform peer-checked:scale-100'
                  )}
                />
              </div>
            </div>
            <div className="ml-3">
              <span
                className={cn(
                  'text-sm font-medium',
                  disabled || option.disabled ? 'text-neutral-400' : 'text-neutral-700'
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <p className="text-xs text-neutral-500 mt-0.5">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-error-600 mt-2">{error}</p>}
    </div>
  );
};

export default RadioGroup;
