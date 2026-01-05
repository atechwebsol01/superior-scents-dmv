/**
 * Service & Product Types
 * Superior Scents DMV, LLC
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'installation' | 'maintenance' | 'subscription' | 'one-time';
  price: number;
  duration?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: 'essential-oil' | 'diffuser' | 'accessory' | 'refill';
  price: number;
  cost: number;
  stockQuantity: number;
  reorderLevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  search?: string;
  category?: Service['category'] | 'all';
  isActive?: boolean | 'all';
}

export interface ProductFilters {
  search?: string;
  category?: Product['category'] | 'all';
  isActive?: boolean | 'all';
  lowStock?: boolean;
}
