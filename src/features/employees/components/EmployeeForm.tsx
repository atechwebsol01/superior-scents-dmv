import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardBody } from '@/components/common/Card';
import type { Employee, EmployeeFormData } from '../types/employee.types';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  role: z.enum(['admin', 'manager', 'technician', 'sales']),
  department: z.string().min(2, 'Department required'),
  hireDate: z.string().min(1, 'Hire date required'),
  status: z.enum(['active', 'inactive', 'on-leave']),
  salary: z.coerce.number().optional().or(z.literal('')),
  commissionRate: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  zipCode: z.string().min(5, 'ZIP code required'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
});

type FormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(employeeSchema) as never,
    defaultValues: employee ? {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      department: employee.department,
      hireDate: employee.hireDate,
      status: employee.status,
      salary: employee.salary,
      commissionRate: employee.commissionRate,
      street: employee.address.street,
      city: employee.address.city,
      state: employee.address.state,
      zipCode: employee.address.zipCode,
      emergencyContactName: employee.emergencyContact?.name,
      emergencyContactPhone: employee.emergencyContact?.phone,
      emergencyContactRelationship: employee.emergencyContact?.relationship,
    } : { status: 'active', role: 'technician' },
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data as EmployeeFormData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-6">
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Personal Information</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Last Name" error={errors.lastName?.message} {...register('lastName')} />
              <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
              <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Employment Details</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Role</label>
                <select className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white" {...register('role')}>
                  <option value="technician">Technician</option>
                  <option value="sales">Sales</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Input label="Department" error={errors.department?.message} {...register('department')} />
              <Input label="Hire Date" type="date" error={errors.hireDate?.message} {...register('hireDate')} />
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Status</label>
                <select className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white" {...register('status')}>
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <Input label="Salary" type="number" error={errors.salary?.message} {...register('salary')} />
              <Input label="Commission Rate (%)" type="number" error={errors.commissionRate?.message} {...register('commissionRate')} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Address</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input label="Street Address" error={errors.street?.message} {...register('street')} />
              </div>
              <Input label="City" error={errors.city?.message} {...register('city')} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="State" error={errors.state?.message} {...register('state')} />
                <Input label="ZIP Code" error={errors.zipCode?.message} {...register('zipCode')} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Emergency Contact (Optional)</h3>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Name" {...register('emergencyContactName')} />
              <Input label="Phone" {...register('emergencyContactPhone')} />
              <Input label="Relationship" {...register('emergencyContactRelationship')} />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isLoading}>{employee ? 'Update' : 'Create'} Employee</Button>
        </div>
      </div>
    </form>
  );
};

export default EmployeeForm;
