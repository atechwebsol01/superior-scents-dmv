import React from 'react';
import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const colorPalette = [
  'bg-primary-500',
  'bg-secondary-500',
  'bg-accent-500',
  'bg-info-500',
  'bg-error-500',
];

const getColorFromName = (name: string): string => {
  const charCode = name.charCodeAt(0) || 0;
  return colorPalette[charCode % colorPalette.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  className,
}) => {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn(
          'rounded-full object-cover',
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium',
        sizeStyles[size],
        bgColor,
        className
      )}
    >
      {initials || '?'}
    </div>
  );
};

export default Avatar;
