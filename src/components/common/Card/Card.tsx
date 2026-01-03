import React from 'react';
import { cn } from '@/lib/cn';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'none',
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-neutral-200',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  actions,
}) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-neutral-200 flex items-center justify-between',
        className
      )}
    >
      <div className="font-semibold text-neutral-900">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return <div className={cn('p-6', className)}>{children}</div>;
};

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-xl',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
