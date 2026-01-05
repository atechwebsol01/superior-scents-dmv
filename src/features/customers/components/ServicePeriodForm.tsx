import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { ServicePeriodFormData, DayOfWeek, PeriodFrequency } from '../types/servicePeriod.types';
import { serviceReps } from '../store/servicePeriodStore';

const schema = z.object({
  periodCode: z.enum(['Q1', 'Q2', 'Q3', 'Q4', 'EV', 'DM', 'SO'] as const),
  day: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const),
  serviceRepId: z.string().min(1, 'Service rep is required'),
  dateLast: z.string().min(1, 'Date last is required'),
  frequencyDM: z.number().optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
});

interface ServicePeriodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServicePeriodFormData) => Promise<void>;
  initialData?: Partial<ServicePeriodFormData>;
  isLoading?: boolean;
}

const periodOptions: { value: PeriodFrequency; label: string }[] = [
  { value: 'Q1', label: 'Q1 - Quarterly (Jan, Apr, Jul, Oct)' },
  { value: 'Q2', label: 'Q2 - Quarterly (Feb, May, Aug, Nov)' },
  { value: 'Q3', label: 'Q3 - Quarterly (Mar, Jun, Sep, Dec)' },
  { value: 'Q4', label: 'Q4 - Quarterly (Custom)' },
  { value: 'EV', label: 'EV - Every Visit' },
  { value: 'DM', label: 'DM - Day of Month' },
  { value: 'SO', label: 'SO - Special Order' },
];

const dayOptions: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ServicePeriodForm: React.FC<ServicePeriodFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ServicePeriodFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      periodCode: initialData?.periodCode || 'Q1',
      day: initialData?.day || 'Monday',
      serviceRepId: initialData?.serviceRepId || '',
      dateLast: initialData?.dateLast || new Date().toISOString().split('T')[0],
      frequencyDM: initialData?.frequencyDM,
      dayOfMonth: initialData?.dayOfMonth,
    },
  });

  const periodCode = watch('periodCode');

  React.useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: ServicePeriodFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Service Period" size="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {/* Period Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Period
          </label>
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <label
                key={option.value}
                className={`
                  px-3 py-2 border rounded-lg cursor-pointer transition-all text-sm
                  ${watch('periodCode') === option.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-300'
                  }
                `}
              >
                <input
                  type="radio"
                  {...register('periodCode')}
                  value={option.value}
                  className="sr-only"
                />
                {option.value}
              </label>
            ))}
          </div>
          {errors.periodCode && (
            <p className="mt-1 text-sm text-error-600">{errors.periodCode.message}</p>
          )}
        </div>

        {/* Day Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Day
          </label>
          <div className="space-y-2">
            {dayOptions.map((day) => (
              <label key={day} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register('day')}
                  value={day}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{day}</span>
              </label>
            ))}
          </div>
          {errors.day && (
            <p className="mt-1 text-sm text-error-600">{errors.day.message}</p>
          )}
        </div>

        {/* Service Rep */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Service Rep
          </label>
          <div className="space-y-2">
            {serviceReps.map((rep) => (
              <label key={rep.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register('serviceRepId')}
                  value={rep.id}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{rep.name}</span>
              </label>
            ))}
          </div>
          {errors.serviceRepId && (
            <p className="mt-1 text-sm text-error-600">{errors.serviceRepId.message}</p>
          )}
        </div>

        {/* Date Last */}
        <div>
          <Input
            label="Date Last"
            type="date"
            {...register('dateLast')}
            error={errors.dateLast?.message}
          />
        </div>

        {/* DM-specific fields */}
        {periodCode === 'DM' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Frequency (DM)"
              type="number"
              {...register('frequencyDM', { valueAsNumber: true })}
              placeholder="e.g., 30"
            />
            <Input
              label="Day of Month (DM)"
              type="number"
              min={1}
              max={31}
              {...register('dayOfMonth', { valueAsNumber: true })}
              placeholder="1-31"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ServicePeriodForm;
