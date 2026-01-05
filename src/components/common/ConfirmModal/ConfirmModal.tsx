import React from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle } from 'lucide-react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { cn } from '@/lib/cn';

export type ConfirmModalVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmModalVariant;
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-error-100 dark:bg-error-900/30',
    iconColor: 'text-error-600 dark:text-error-400',
    buttonVariant: 'primary' as const,
    buttonClass: 'bg-error-600 hover:bg-error-700 focus:ring-error-500',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-warning-100 dark:bg-warning-900/30',
    iconColor: 'text-warning-600 dark:text-warning-400',
    buttonVariant: 'primary' as const,
    buttonClass: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500',
  },
  info: {
    icon: Info,
    iconBg: 'bg-info-100 dark:bg-info-900/30',
    iconColor: 'text-info-600 dark:text-info-400',
    buttonVariant: 'primary' as const,
    buttonClass: '',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-success-100 dark:bg-success-900/30',
    iconColor: 'text-success-600 dark:text-success-400',
    buttonVariant: 'secondary' as const,
    buttonClass: '',
  },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-full flex-shrink-0', config.iconBg)}>
            <Icon className={cn('w-6 h-6', config.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {title}
            </h3>
            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {message}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            loading={isLoading}
            className={config.buttonClass}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
