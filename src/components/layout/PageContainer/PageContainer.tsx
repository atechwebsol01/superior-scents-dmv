import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface PageContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
  className,
  fullWidth = false,
}) => {
  return (
    <div className={cn('w-full', !fullWidth && 'max-w-7xl mx-auto', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm text-neutral-500 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className="hover:text-primary-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-neutral-700 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
