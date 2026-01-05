import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import type { ServiceDetailFormData } from '../types/servicePeriod.types';
import { serviceReps } from '../store/servicePeriodStore';

const schema = z.object({
  type: z.enum(['service', 'product']),
  serviceId: z.string().optional(),
  productId: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  fragrance: z.string().optional(),
  notes: z.string().optional(),
  isTaxable: z.boolean(),
  isOneTimeItem: z.boolean(),
  salesRepId: z.string().optional(),
  saleDate: z.string().optional(),
  payCommission: z.boolean(),
});

interface ServiceDetailFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceDetailFormData) => Promise<void>;
  type: 'service' | 'product';
  periodId: string; // eslint-disable-line @typescript-eslint/no-unused-vars
  isLoading?: boolean;
}

// Mock services and products for search
const mockServices = [
  { id: 'D93', name: 'Deodorizer Service (Mist Atomizer)', price: 12.00 },
  { id: 'D94', name: 'Deodorizer Service (Standard)', price: 10.00 },
  { id: 'D95', name: 'Deep Clean Service', price: 25.00 },
  { id: 'D96', name: 'Premium Scent Service', price: 35.00 },
];

const mockProducts = [
  { id: 'Curve', name: 'Curve', code: 'Curve :: $6.00 :: 20802', price: 6.00 },
  { id: 'BlackBamboo', name: 'Black Bamboo', code: 'Black Bamboo :: $8.00 :: 86', price: 8.00 },
  { id: 'Lavender', name: 'Lavender Essential', code: 'Lavender :: $12.00 :: 101', price: 12.00 },
];

const mockFragrances = [
  'Black Bamboo :: 86',
  'Lavender :: 101',
  'Ocean Breeze :: 45',
  'Fresh Linen :: 22',
  'Citrus Burst :: 33',
];

export const ServiceDetailForm: React.FC<ServiceDetailFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  periodId: _periodId,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [fragranceSearch, setFragranceSearch] = React.useState('');
  const [showFragranceDropdown, setShowFragranceDropdown] = React.useState(false);

  // Suppress unused variable warning - periodId used for display
  void _periodId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ServiceDetailFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type,
      price: 0,
      quantity: 1,
      isTaxable: true,
      isOneTimeItem: false,
      payCommission: true,
      saleDate: new Date().toISOString().split('T')[0],
    },
  });

  const items = type === 'service' ? mockServices : mockProducts;
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredFragrances = mockFragrances.filter(f => 
    f.toLowerCase().includes(fragranceSearch.toLowerCase())
  );

  const handleSelectItem = (item: typeof items[0]) => {
    if (type === 'service') {
      setValue('serviceId', item.id);
    } else {
      setValue('productId', item.id);
    }
    setValue('price', item.price);
    setSearchTerm(item.name);
  };

  const handleSelectFragrance = (fragrance: string) => {
    setValue('fragrance', fragrance);
    setFragranceSearch(fragrance);
    setShowFragranceDropdown(false);
  };

  const handleFormSubmit = async (data: ServiceDetailFormData) => {
    await onSubmit(data);
    reset();
    setSearchTerm('');
    setFragranceSearch('');
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      reset({
        type,
        price: 0,
        quantity: 1,
        isTaxable: true,
        isOneTimeItem: false,
        payCommission: true,
        saleDate: new Date().toISOString().split('T')[0],
      });
      setSearchTerm('');
      setFragranceSearch('');
    }
  }, [isOpen, type, reset]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`New Customer Service Detail :: ${type === 'service' ? 'Service' : 'Product'}`} 
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {/* Service Period Info */}
        <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-medium">Service Periods:</span> Q2 :: Wed :: Rodney Bush :: 131348
          </p>
        </div>

        {/* Service/Product Search */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {type === 'service' ? 'Service' : 'Product'}
          </label>
          <div className="relative">
            <Input
              placeholder={`Search description or code...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
            {searchTerm && filteredItems.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-48 overflow-auto">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <span className="font-medium">{item.id}</span> :: {item.name} :: ${item.price.toFixed(2)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            error={errors.price?.message}
          />
          <Input
            label="Qty"
            type="number"
            min={1}
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
          />
        </div>

        {/* Fragrance Search */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Fragrance (does not print on invoice)
          </label>
          <div className="relative">
            <Input
              placeholder="Search fragrances..."
              value={fragranceSearch}
              onChange={(e) => {
                setFragranceSearch(e.target.value);
                setShowFragranceDropdown(true);
              }}
              onFocus={() => setShowFragranceDropdown(true)}
            />
            {showFragranceDropdown && fragranceSearch && filteredFragrances.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-32 overflow-auto">
                {filteredFragrances.map((fragrance) => (
                  <button
                    key={fragrance}
                    type="button"
                    onClick={() => handleSelectFragrance(fragrance)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    {fragrance}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <TextArea
          label="Notes"
          {...register('notes')}
          rows={3}
        />

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('isTaxable')}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Taxable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('isOneTimeItem')}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">One Time Item</span>
          </label>
        </div>

        {/* Sales Commission Info */}
        <div className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-lg space-y-4">
          <h4 className="font-semibold text-neutral-900 dark:text-white">Sales Commission Info</h4>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Sales Rep
            </label>
            <div className="space-y-2">
              {serviceReps.map((rep) => (
                <label key={rep.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...register('salesRepId')}
                    value={rep.id}
                    className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{rep.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Sale Date"
            type="date"
            {...register('saleDate')}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('payCommission')}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Pay commission on this sale?</span>
          </label>
        </div>

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

export default ServiceDetailForm;
