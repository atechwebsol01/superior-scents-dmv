import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { Card, CardBody } from '@/components/common/Card';
import type { Customer, CustomerFormData } from '../types/customer.types';

const customerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  company: z.string().optional(),
  street: z.string().min(5, 'Please enter a valid street address'),
  city: z.string().min(2, 'Please enter a valid city'),
  state: z.string().min(2, 'Please enter a valid state'),
  zipCode: z.string().min(5, 'Please enter a valid ZIP code'),
  status: z.enum(['active', 'inactive', 'pending']),
  notes: z.string().optional(),
});

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          company: customer.company || '',
          street: customer.address.street,
          city: customer.address.city,
          state: customer.address.state,
          zipCode: customer.address.zipCode,
          status: customer.status,
          notes: customer.notes || '',
        }
      : {
          status: 'active',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Personal Information</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Smith"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Phone"
                placeholder="(202) 555-0123"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Company"
                placeholder="Company name (optional)"
                error={errors.company?.message}
                {...register('company')}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Status
                </label>
                <select
                  className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  {...register('status')}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Address */}
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Address</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  placeholder="123 Main St"
                  error={errors.street?.message}
                  {...register('street')}
                />
              </div>
              <Input
                label="City"
                placeholder="Washington"
                error={errors.city?.message}
                {...register('city')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State"
                  placeholder="DC"
                  error={errors.state?.message}
                  {...register('state')}
                />
                <Input
                  label="ZIP Code"
                  placeholder="20001"
                  error={errors.zipCode?.message}
                  {...register('zipCode')}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Notes */}
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Additional Notes</h3>
          </div>
          <CardBody>
            <TextArea
              placeholder="Add any additional notes about this customer..."
              rows={4}
              {...register('notes')}
            />
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            {customer ? 'Update Customer' : 'Create Customer'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CustomerForm;
