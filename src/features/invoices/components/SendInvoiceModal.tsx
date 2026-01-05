import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Mail, FileText } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import type { Invoice } from '../types/invoice.types';
import { COMPANY_NAME } from '@/lib/constants';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  attachPdf: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { email: string; message: string }) => Promise<void>;
  invoice: Invoice;
  isLoading?: boolean;
}

export const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSend,
  invoice,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: invoice.customerEmail,
      subject: `Invoice ${invoice.invoiceNumber} from ${COMPANY_NAME}`,
      message: `Dear ${invoice.customerName},\n\nPlease find attached invoice ${invoice.invoiceNumber} for the amount of $${invoice.total.toFixed(2)}.\n\nDue Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n\nThank you for your business!\n\nBest regards,\n${COMPANY_NAME}`,
      attachPdf: true,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        email: invoice.customerEmail,
        subject: `Invoice ${invoice.invoiceNumber} from ${COMPANY_NAME}`,
        message: `Dear ${invoice.customerName},\n\nPlease find attached invoice ${invoice.invoiceNumber} for the amount of $${invoice.total.toFixed(2)}.\n\nDue Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n\nThank you for your business!\n\nBest regards,\n${COMPANY_NAME}`,
        attachPdf: true,
      });
    }
  }, [isOpen, invoice, reset]);

  const handleFormSubmit = async (data: FormData) => {
    await onSend({ email: data.email, message: data.message });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Invoice" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {/* Invoice Preview */}
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg flex items-start gap-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-neutral-900 dark:text-white">{invoice.invoiceNumber}</h4>
            <p className="text-sm text-neutral-500">{invoice.customerName}</p>
            <p className="text-lg font-bold text-primary-600 mt-1">${invoice.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Email Form */}
        <Input
          label="Recipient Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Subject"
          {...register('subject')}
          error={errors.subject?.message}
        />

        <TextArea
          label="Message"
          {...register('message')}
          error={errors.message?.message}
          rows={8}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('attachPdf')}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Attach PDF invoice</span>
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send Invoice
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SendInvoiceModal;
