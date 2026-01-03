import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
  variant?: 'default' | 'bordered' | 'separated';
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className,
  variant = 'default',
}) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(defaultExpanded);

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setExpandedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setExpandedItems((prev) =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  const variantStyles = {
    default: {
      container: 'divide-y divide-neutral-200',
      item: '',
      header: 'hover:bg-neutral-50',
      content: '',
    },
    bordered: {
      container: 'border border-neutral-200 rounded-lg divide-y divide-neutral-200 overflow-hidden',
      item: '',
      header: 'hover:bg-neutral-50',
      content: 'bg-neutral-50',
    },
    separated: {
      container: 'space-y-2',
      item: 'border border-neutral-200 rounded-lg overflow-hidden',
      header: 'hover:bg-neutral-50',
      content: 'bg-neutral-50',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(styles.container, className)}>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <button
            type="button"
            onClick={() => !item.disabled && toggleItem(item.id)}
            disabled={item.disabled}
            className={cn(
              'flex items-center justify-between w-full px-4 py-3',
              'text-left text-sm font-medium text-neutral-700',
              'transition-colors duration-200',
              styles.header,
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-expanded={isExpanded(item.id)}
          >
            <span>{item.title}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-neutral-400 transition-transform duration-200',
                isExpanded(item.id) && 'rotate-180'
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-200',
              isExpanded(item.id) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className={cn('px-4 py-3 text-sm text-neutral-600', styles.content)}>
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
