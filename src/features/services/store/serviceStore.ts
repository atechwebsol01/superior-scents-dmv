import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Service, Product, ServiceFilters, ProductFilters } from '../types/service.types';

const mockServices: Service[] = [
  { id: '1', name: 'Monthly Scent Service - Basic', description: 'Basic monthly scent maintenance for small spaces', category: 'subscription', price: 149, duration: 'Monthly', isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '2', name: 'Monthly Scent Service - Premium', description: 'Premium monthly service with custom scent blends', category: 'subscription', price: 299, duration: 'Monthly', isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '3', name: 'Monthly Scent Service - Enterprise', description: 'Full-service enterprise package for large facilities', category: 'subscription', price: 499, duration: 'Monthly', isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '4', name: 'Commercial Scent System Install', description: 'Full installation of commercial-grade scent diffusion system', category: 'installation', price: 1500, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '5', name: 'Residential System Install', description: 'Installation for home scent systems', category: 'installation', price: 350, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '6', name: 'Quarterly Service Package', description: 'Deep clean and maintenance every 3 months', category: 'maintenance', price: 750, duration: 'Quarterly', isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '7', name: 'Emergency Service Call', description: 'Same-day emergency service', category: 'one-time', price: 199, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '8', name: 'Scent Consultation', description: 'Professional scent selection consultation', category: 'one-time', price: 75, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
];

const mockProducts: Product[] = [
  { id: '1', name: 'Lavender Essential Oil - 100ml', description: 'Pure lavender essential oil', sku: 'EO-LAV-100', category: 'essential-oil', price: 45, cost: 18, stockQuantity: 50, reorderLevel: 10, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '2', name: 'Eucalyptus Essential Oil - 100ml', description: 'Pure eucalyptus essential oil', sku: 'EO-EUC-100', category: 'essential-oil', price: 38, cost: 15, stockQuantity: 45, reorderLevel: 10, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '3', name: 'Citrus Blend - 100ml', description: 'Refreshing citrus blend', sku: 'EO-CIT-100', category: 'essential-oil', price: 42, cost: 16, stockQuantity: 8, reorderLevel: 10, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '4', name: 'Commercial HVAC Diffuser', description: 'Industrial-grade HVAC scent diffuser', sku: 'DIF-HVAC-01', category: 'diffuser', price: 850, cost: 420, stockQuantity: 12, reorderLevel: 3, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '5', name: 'Portable Room Diffuser', description: 'Compact portable diffuser', sku: 'DIF-PORT-01', category: 'diffuser', price: 129, cost: 52, stockQuantity: 35, reorderLevel: 10, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '6', name: 'Refill Pack - Lavender', description: 'Monthly refill pack', sku: 'REF-LAV-01', category: 'refill', price: 28, cost: 10, stockQuantity: 75, reorderLevel: 20, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
  { id: '7', name: 'Diffuser Cleaning Kit', description: 'Complete cleaning supplies', sku: 'ACC-CLEAN-01', category: 'accessory', price: 24, cost: 8, stockQuantity: 40, reorderLevel: 15, isActive: true, createdAt: '2023-01-01', updatedAt: '2024-03-01' },
];

interface ServiceState {
  services: Service[];
  products: Product[];
  selectedService: Service | null;
  selectedProduct: Product | null;
  isLoading: boolean;
  serviceFilters: ServiceFilters;
  productFilters: ProductFilters;
  fetchServices: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  setServiceFilters: (f: Partial<ServiceFilters>) => void;
  setProductFilters: (f: Partial<ProductFilters>) => void;
}

export const useServiceStore = create<ServiceState>()(
  devtools(
    (set, get) => ({
      services: [],
      products: [],
      selectedService: null,
      selectedProduct: null,
      isLoading: false,
      serviceFilters: { category: 'all', isActive: 'all' },
      productFilters: { category: 'all', isActive: 'all', lowStock: false },

      fetchServices: async () => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 300));
        const { serviceFilters } = get();
        let filtered = [...mockServices];
        if (serviceFilters.search) {
          const s = serviceFilters.search.toLowerCase();
          filtered = filtered.filter(svc => svc.name.toLowerCase().includes(s) || svc.description.toLowerCase().includes(s));
        }
        if (serviceFilters.category && serviceFilters.category !== 'all') filtered = filtered.filter(svc => svc.category === serviceFilters.category);
        if (serviceFilters.isActive !== 'all') filtered = filtered.filter(svc => svc.isActive === serviceFilters.isActive);
        set({ services: filtered, isLoading: false });
      },

      fetchProducts: async () => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 300));
        const { productFilters } = get();
        let filtered = [...mockProducts];
        if (productFilters.search) {
          const s = productFilters.search.toLowerCase();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
        }
        if (productFilters.category && productFilters.category !== 'all') filtered = filtered.filter(p => p.category === productFilters.category);
        if (productFilters.lowStock) filtered = filtered.filter(p => p.stockQuantity <= p.reorderLevel);
        set({ products: filtered, isLoading: false });
      },

      setServiceFilters: (f) => { set({ serviceFilters: { ...get().serviceFilters, ...f } }); get().fetchServices(); },
      setProductFilters: (f) => { set({ productFilters: { ...get().productFilters, ...f } }); get().fetchProducts(); },
    }),
    { name: 'service-store' }
  )
);

export default useServiceStore;
