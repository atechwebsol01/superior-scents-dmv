import React from 'react';
import { Search, Plus, Package, Droplets, DollarSign, Clock } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { useServiceStore } from '../store/serviceStore';

export const ServicesPage: React.FC = () => {
  const { services, products, isLoading, fetchServices, fetchProducts, serviceFilters, productFilters, setServiceFilters, setProductFilters } = useServiceStore();
  const [activeTab, setActiveTab] = React.useState<'services' | 'products'>('services');
  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    fetchServices();
    fetchProducts();
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (activeTab === 'services') setServiceFilters({ search: value });
    else setProductFilters({ search: value });
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'subscription': case 'essential-oil': return 'primary';
      case 'installation': case 'diffuser': return 'secondary';
      case 'maintenance': case 'refill': return 'success';
      default: return 'neutral';
    }
  };

  const serviceCats = [
    { label: 'All Categories', value: 'all' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'Installation', value: 'installation' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'One-time', value: 'one-time' },
  ];

  const productCats = [
    { label: 'All Categories', value: 'all' },
    { label: 'Essential Oils', value: 'essential-oil' },
    { label: 'Diffusers', value: 'diffuser' },
    { label: 'Refills', value: 'refill' },
    { label: 'Accessories', value: 'accessory' },
  ];

  return (
    <PageContainer
      title="Services & Products"
      subtitle="Manage your service offerings and product inventory"
      breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Services & Products' }]}
      actions={<Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Add {activeTab === 'services' ? 'Service' : 'Product'}</Button>}
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button variant={activeTab === 'services' ? 'primary' : 'outline'} onClick={() => { setActiveTab('services'); setSearchValue(''); }}>
          <Package className="w-4 h-4 mr-2" /> Services ({services.length})
        </Button>
        <Button variant={activeTab === 'products' ? 'primary' : 'outline'} onClick={() => { setActiveTab('products'); setSearchValue(''); }}>
          <Droplets className="w-4 h-4 mr-2" /> Products ({products.length})
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder={`Search ${activeTab}...`} leftIcon={<Search className="w-4 h-4" />} value={searchValue} onChange={(e) => handleSearch(e.target.value)} />
            </div>
            <select
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800"
              value={(activeTab === 'services' ? serviceFilters.category : productFilters.category) || 'all'}
              onChange={(e) => activeTab === 'services' ? setServiceFilters({ category: e.target.value as any }) : setProductFilters({ category: e.target.value as any })}
            >
              {(activeTab === 'services' ? serviceCats : productCats).map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {activeTab === 'products' && (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={productFilters.lowStock || false} onChange={(e) => setProductFilters({ lowStock: e.target.checked })} className="rounded" />
                <span className="text-neutral-700 dark:text-neutral-300">Low Stock Only</span>
              </label>
            )}
          </div>
        </CardBody>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
      ) : activeTab === 'services' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="card-hover">
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={getCategoryColor(service.category) as 'primary' | 'secondary' | 'success'}>{service.category}</Badge>
                  <Badge variant={service.isActive ? 'success' : 'neutral'}>{service.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{service.name}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-bold text-lg">{formatCurrency(service.price)}</span>
                  </div>
                  {service.duration && (
                    <div className="flex items-center gap-1 text-neutral-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase hidden md:table-cell">SKU</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Category</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Price</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase hidden lg:table-cell">Cost</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900 dark:text-white">{product.name}</div>
                      <div className="text-sm text-neutral-500 md:hidden">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 hidden md:table-cell">{product.sku}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getCategoryColor(product.category) as 'primary' | 'secondary' | 'success'}>
                        {product.category.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-neutral-900 dark:text-white">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4 text-right text-sm text-neutral-600 dark:text-neutral-400 hidden lg:table-cell">{formatCurrency(product.cost)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${product.stockQuantity <= product.reorderLevel ? 'text-error-600' : 'text-neutral-900 dark:text-white'}`}>
                        {product.stockQuantity}
                      </span>
                      {product.stockQuantity <= product.reorderLevel && (
                        <span className="ml-2 text-xs text-error-600 font-medium">Low</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default ServicesPage;
