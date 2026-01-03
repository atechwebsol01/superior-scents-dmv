import React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate, id, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const inputId = id || props.name;

    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate]);

    return (
      <div className={cn('flex items-start', className)}>
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              ref={inputRef}
              id={inputId}
              type="checkbox"
              className={cn(
                'peer h-5 w-5 cursor-pointer appearance-none rounded border-2 transition-all duration-200',
                'border-neutral-300 bg-white',
                'checked:border-primary-500 checked:bg-primary-500',
                'hover:border-primary-400',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-error-500'
              )}
              {...props}
            />
            <Check
              className={cn(
                'pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white',
                'opacity-0 transition-opacity peer-checked:opacity-100',
                indeterminate && 'hidden'
              )}
              strokeWidth={3}
            />
            <Minus
              className={cn(
                'pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white',
                'opacity-0 transition-opacity',
                indeterminate && 'opacity-100'
              )}
              strokeWidth={3}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'text-sm font-medium cursor-pointer',
                  props.disabled ? 'text-neutral-400' : 'text-neutral-700'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
            )}
            {error && <p className="text-xs text-error-600 mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
