import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Package, AlertTriangle, TrendingDown, TrendingUp, Edit2, BarChart3 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Input, Select, Badge, Modal } from '@/components';
import { cn } from '@/lib/cn';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'diffuser' | 'scent' | 'accessory' | 'consumable';
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  location: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
}

interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  user: string;
}

export const ProductInventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [_showAddModal, setShowAddModal] = useState(false);

  // Mock inventory data
  const inventory: InventoryItem[] = [
    { id: '1', sku: 'DIF-001', name: 'Premium Diffuser - Large', category: 'diffuser', quantity: 45, minStock: 20, maxStock: 100, unitPrice: 199, costPrice: 85, location: 'Warehouse A', lastRestocked: '2026-01-02', status: 'in-stock' },
    { id: '2', sku: 'DIF-002', name: 'Premium Diffuser - Small', category: 'diffuser', quantity: 12, minStock: 15, maxStock: 80, unitPrice: 149, costPrice: 65, location: 'Warehouse A', lastRestocked: '2025-12-28', status: 'low-stock' },
    { id: '3', sku: 'SCT-001', name: 'Lavender Scent Refill', category: 'scent', quantity: 150, minStock: 50, maxStock: 200, unitPrice: 45, costPrice: 18, location: 'Warehouse B', lastRestocked: '2026-01-05', status: 'in-stock' },
    { id: '4', sku: 'SCT-002', name: 'Ocean Breeze Scent Refill', category: 'scent', quantity: 8, minStock: 50, maxStock: 200, unitPrice: 45, costPrice: 18, location: 'Warehouse B', lastRestocked: '2025-12-15', status: 'low-stock' },
    { id: '5', sku: 'SCT-003', name: 'Fresh Linen Scent Refill', category: 'scent', quantity: 0, minStock: 50, maxStock: 200, unitPrice: 45, costPrice: 18, location: 'Warehouse B', lastRestocked: '2025-12-01', status: 'out-of-stock' },
    { id: '6', sku: 'ACC-001', name: 'Wall Mount Bracket', category: 'accessory', quantity: 220, minStock: 30, maxStock: 150, unitPrice: 25, costPrice: 8, location: 'Warehouse A', lastRestocked: '2026-01-03', status: 'overstock' },
    { id: '7', sku: 'CON-001', name: 'Filter Replacement Pack', category: 'consumable', quantity: 85, minStock: 40, maxStock: 200, unitPrice: 15, costPrice: 5, location: 'Warehouse B', lastRestocked: '2026-01-01', status: 'in-stock' },
  ];

  const recentMovements: StockMovement[] = [
    { id: '1', itemId: '3', itemName: 'Lavender Scent Refill', type: 'in', quantity: 50, reason: 'Purchase Order #PO-2026-015', date: '2026-01-05', user: 'Admin' },
    { id: '2', itemId: '1', itemName: 'Premium Diffuser - Large', type: 'out', quantity: 5, reason: 'Invoice #INV-001', date: '2026-01-04', user: 'John Smith' },
    { id: '3', itemId: '6', itemName: 'Wall Mount Bracket', type: 'in', quantity: 100, reason: 'Purchase Order #PO-2026-014', date: '2026-01-03', user: 'Admin' },
    { id: '4', itemId: '2', itemName: 'Premium Diffuser - Small', type: 'out', quantity: 3, reason: 'Invoice #INV-002', date: '2026-01-02', user: 'Sarah Johnson' },
  ];

  const categoryLabels = {
    diffuser: 'Diffusers',
    scent: 'Scents',
    accessory: 'Accessories',
    consumable: 'Consumables',
  };

  const statusColors = {
    'in-stock': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'low-stock': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'overstock': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const filteredInventory = inventory.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  const lowStockCount = inventory.filter(i => i.status === 'low-stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'out-of-stock').length;

  return (
    <PageContainer
      title="Product Inventory"
      subtitle="Track and manage product stock levels"
      breadcrumbs={[
        { label: 'Services', path: '/services' },
        { label: 'Inventory' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/services')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Products</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{inventory.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Inventory Value</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <TrendingDown className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Low Stock</p>
              <p className="text-xl font-bold text-yellow-600">{lowStockCount} items</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Out of Stock</p>
              <p className="text-xl font-bold text-red-600">{outOfStockCount} items</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <Card className="p-4 mb-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search by name or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Select
                value={categoryFilter}
                onChange={(value) => setCategoryFilter(value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'diffuser', label: 'Diffusers' },
                  { value: 'scent', label: 'Scents' },
                  { value: 'accessory', label: 'Accessories' },
                  { value: 'consumable', label: 'Consumables' },
                ]}
                className="w-40"
              />
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'in-stock', label: 'In Stock' },
                  { value: 'low-stock', label: 'Low Stock' },
                  { value: 'out-of-stock', label: 'Out of Stock' },
                  { value: 'overstock', label: 'Overstock' },
                ]}
                className="w-40"
              />
            </div>
          </Card>

          {/* Inventory Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Product</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-neutral-500">Stock</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Price</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-neutral-500">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map(item => (
                    <tr key={item.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-neutral-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-neutral-500">{item.sku} · {categoryLabels[item.category]}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <p className="font-semibold text-neutral-900 dark:text-white">{item.quantity}</p>
                        <p className="text-xs text-neutral-500">Min: {item.minStock}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="font-medium text-neutral-900 dark:text-white">${item.unitPrice}</p>
                        <p className="text-xs text-neutral-500">Cost: ${item.costPrice}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={statusColors[item.status]}>{item.status.replace('-', ' ')}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Recent Stock Movements</h3>
            <div className="space-y-4">
              {recentMovements.map(movement => (
                <div key={movement.id} className="flex items-start gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0">
                  <div className={cn(
                    'p-1.5 rounded-full',
                    movement.type === 'in' ? 'bg-green-100 dark:bg-green-900/30' : movement.type === 'out' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                  )}>
                    {movement.type === 'in' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : movement.type === 'out' ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{movement.itemName}</p>
                    <p className="text-xs text-neutral-500">{movement.reason}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        'text-xs font-medium',
                        movement.type === 'in' ? 'text-green-600' : movement.type === 'out' ? 'text-red-600' : 'text-blue-600'
                      )}>
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}{movement.quantity} units
                      </span>
                      <span className="text-xs text-neutral-400">· {movement.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">View All Activity</Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Record Stock In
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingDown className="w-4 h-4 mr-2" />
                Record Stock Out
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Stock Adjustment
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Item Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Edit Product" size="md">
        {selectedItem && (
          <div className="space-y-4">
            <Input label="Product Name" defaultValue={selectedItem.name} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="SKU" defaultValue={selectedItem.sku} />
              <Select
                label="Category"
                value={selectedItem.category}
                options={[
                  { value: 'diffuser', label: 'Diffusers' },
                  { value: 'scent', label: 'Scents' },
                  { value: 'accessory', label: 'Accessories' },
                  { value: 'consumable', label: 'Consumables' },
                ]}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Quantity" type="number" defaultValue={selectedItem.quantity} />
              <Input label="Min Stock" type="number" defaultValue={selectedItem.minStock} />
              <Input label="Max Stock" type="number" defaultValue={selectedItem.maxStock} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Unit Price" type="number" defaultValue={selectedItem.unitPrice} leftIcon={<span>$</span>} />
              <Input label="Cost Price" type="number" defaultValue={selectedItem.costPrice} leftIcon={<span>$</span>} />
            </div>
            <Input label="Location" defaultValue={selectedItem.location} />
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedItem(null)}>Cancel</Button>
              <Button className="flex-1">Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ProductInventoryPage;
