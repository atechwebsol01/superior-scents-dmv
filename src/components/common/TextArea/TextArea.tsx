import React from 'react';
import { cn } from '@/lib/cn';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  showCount?: boolean;
  containerClassName?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helper,
      showCount = false,
      maxLength,
      id,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(
      props.value?.toString().length || props.defaultValue?.toString().length || 0
    );
    const inputId = id || props.name;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            maxLength={maxLength}
            className={cn(
              'w-full px-3.5 py-2.5 text-sm border rounded-lg resize-y min-h-[100px]',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:bg-neutral-100 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
              className
            )}
            onChange={handleChange}
            {...props}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div>
            {error && <p className="text-xs text-error-600">{error}</p>}
            {helper && !error && <p className="text-xs text-neutral-500">{helper}</p>}
          </div>
          {showCount && maxLength && (
            <p
              className={cn(
                'text-xs',
                charCount >= maxLength ? 'text-error-600' : 'text-neutral-400'
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
