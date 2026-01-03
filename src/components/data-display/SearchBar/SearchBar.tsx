import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  className,
  size = 'md',
  showClearButton = true,
}) => {
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (onSearch) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    }
  };

  const handleClear = () => {
    onChange('');
    onSearch?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onSearch(value);
    }
  };

  const sizeStyles = {
    sm: 'h-8 text-xs pl-8 pr-8',
    md: 'h-10 text-sm pl-10 pr-10',
    lg: 'h-12 text-base pl-12 pr-12',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconLeftPosition = {
    sm: 'left-2.5',
    md: 'left-3',
    lg: 'left-4',
  };

  const iconRightPosition = {
    sm: 'right-2.5',
    md: 'right-3',
    lg: 'right-4',
  };

  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute top-1/2 -translate-y-1/2 text-neutral-400',
          iconSizes[size],
          iconLeftPosition[size]
        )}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full border border-neutral-300 rounded-lg',
          'placeholder:text-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
          'transition-colors duration-200',
          sizeStyles[size]
        )}
      />
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600',
            'transition-colors duration-200',
            iconRightPosition[size]
          )}
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
