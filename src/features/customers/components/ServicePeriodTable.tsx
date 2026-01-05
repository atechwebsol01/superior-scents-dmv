import React from 'react';
import { Edit, Copy, FileText, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import type { ServicePeriod, ServiceDetail } from '../types/servicePeriod.types';
import { cn } from '@/lib/cn';

interface ServicePeriodTableProps {
  periods: ServicePeriod[];
  details: ServiceDetail[];
  isLoading: boolean;
  onEdit: (period: ServicePeriod) => void;
  onCopy: (period: ServicePeriod) => void;
  onQuickInvoice: (period: ServicePeriod) => void;
  onAddPeriod: () => void;
  onAddService: (periodId: string) => void;
  onAddProduct: (periodId: string) => void;
  onAddNote: (periodId: string) => void;
  onSelectPeriod: (period: ServicePeriod) => void;
  selectedPeriodId?: string;
}

export const ServicePeriodTable: React.FC<ServicePeriodTableProps> = ({
  periods,
  details,
  isLoading,
  onEdit,
  onCopy,
  onQuickInvoice,
  onAddPeriod,
  onAddService,
  onAddProduct,
  onAddNote,
  onSelectPeriod,
  selectedPeriodId,
}) => {
  const [expandedPeriods, setExpandedPeriods] = React.useState<Set<string>>(new Set());

  const toggleExpand = (periodId: string) => {
    const newExpanded = new Set(expandedPeriods);
    if (newExpanded.has(periodId)) {
      newExpanded.delete(periodId);
    } else {
      newExpanded.add(periodId);
    }
    setExpandedPeriods(newExpanded);
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getPeriodDetails = (periodId: string) => 
    details.filter(d => d.servicePeriodId === periodId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Service Periods
        </h3>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onAddPeriod}
        >
          + Period
        </Button>
      </div>

      {/* Table */}
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50 dark:bg-primary-900/20 border-b border-neutral-200 dark:border-neutral-700">
              <th className="w-10 px-2 py-3"></th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Edit</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Copy</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Quick Inv</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Period</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Service Rep</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Day</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Svc Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Freight</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase">Amt</th>
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                  No service periods found. Click "+ Period" to add one.
                </td>
              </tr>
            ) : (
              periods.map((period) => {
                const periodDetails = getPeriodDetails(period.id);
                const isExpanded = expandedPeriods.has(period.id);
                const isSelected = selectedPeriodId === period.id;

                return (
                  <React.Fragment key={period.id}>
                    <tr 
                      className={cn(
                        'border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors',
                        isSelected && 'bg-primary-50 dark:bg-primary-900/20'
                      )}
                      onClick={() => onSelectPeriod(period)}
                    >
                      <td className="px-2 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleExpand(period.id); }}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-neutral-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-500" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(period); }}
                          className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded hover:bg-primary-200 dark:hover:bg-primary-800/50"
                        >
                          <Edit className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onCopy(period); }}
                          className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        >
                          <Copy className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onQuickInvoice(period); }}
                          className="p-1.5 bg-secondary-100 dark:bg-secondary-900/30 rounded hover:bg-secondary-200 dark:hover:bg-secondary-800/50"
                        >
                          <FileText className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">{period.id}</td>
                      <td className="px-4 py-3">
                        <Badge variant="primary">{period.periodCode}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        {period.serviceRepName}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{period.day.substring(0, 3)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{period.serviceDate}</td>
                      <td className="px-4 py-3 text-sm text-right text-neutral-700 dark:text-neutral-300">{formatCurrency(period.freight)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-neutral-900 dark:text-white">{formatCurrency(period.amount)}</td>
                    </tr>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={11} className="bg-neutral-50 dark:bg-neutral-800/30 px-4 py-4">
                          <div className="space-y-4">
                            {/* Details Header */}
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-neutral-900 dark:text-white">Details</h4>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => onAddService(period.id)}>+ Serv</Button>
                                <Button size="sm" variant="outline" onClick={() => onAddProduct(period.id)}>+ Prod</Button>
                                <Button size="sm" variant="outline" onClick={() => onAddNote(period.id)}>+ Note</Button>
                              </div>
                            </div>

                            {/* Services Table */}
                            {periodDetails.filter(d => d.type === 'service').length > 0 && (
                              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                                      <th className="text-left px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Edit</th>
                                      <th className="text-left px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Period</th>
                                      <th className="text-left px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Services</th>
                                      <th className="text-right px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Price</th>
                                      <th className="text-right px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Qty</th>
                                      <th className="text-right px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {periodDetails.filter(d => d.type === 'service').map((detail) => (
                                      <tr key={detail.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                                        <td className="px-4 py-2">
                                          <button className="p-1 bg-primary-100 dark:bg-primary-900/30 rounded">
                                            <Edit className="w-3 h-3 text-primary-600" />
                                          </button>
                                        </td>
                                        <td className="px-4 py-2">
                                          <div className="flex gap-1">
                                            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                                              <span key={q} className={cn(
                                                'text-xs px-1.5 py-0.5 rounded',
                                                period.periodCode === q ? 'bg-primary-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
                                              )}>{q}</span>
                                            ))}
                                          </div>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-neutral-900 dark:text-white">
                                          {detail.serviceId} :: {detail.serviceName}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right text-neutral-700 dark:text-neutral-300">{formatCurrency(detail.price)}</td>
                                        <td className="px-4 py-2 text-sm text-right text-neutral-700 dark:text-neutral-300">{detail.quantity}</td>
                                        <td className="px-4 py-2 text-sm text-right font-medium text-neutral-900 dark:text-white">{formatCurrency(detail.total)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Products Table */}
                            {periodDetails.filter(d => d.type === 'product').length > 0 && (
                              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                                      <th className="text-left px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Edit</th>
                                      <th className="text-left px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Period</th>
                                      <th className="text-left px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Products</th>
                                      <th className="text-right px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Price</th>
                                      <th className="text-right px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Qty</th>
                                      <th className="text-right px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {periodDetails.filter(d => d.type === 'product').map((detail) => (
                                      <tr key={detail.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                                        <td className="px-4 py-2">
                                          <button className="p-1 bg-primary-100 dark:bg-primary-900/30 rounded">
                                            <Edit className="w-3 h-3 text-primary-600" />
                                          </button>
                                        </td>
                                        <td className="px-4 py-2">
                                          <div className="flex gap-1">
                                            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                                              <span key={q} className={cn(
                                                'text-xs px-1.5 py-0.5 rounded',
                                                period.periodCode === q ? 'bg-primary-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
                                              )}>{q}</span>
                                            ))}
                                          </div>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-neutral-900 dark:text-white">
                                          {detail.productName}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right text-neutral-700 dark:text-neutral-300">{formatCurrency(detail.price)}</td>
                                        <td className="px-4 py-2 text-sm text-right text-neutral-700 dark:text-neutral-300">{detail.quantity}</td>
                                        <td className="px-4 py-2 text-sm text-right font-medium text-neutral-900 dark:text-white">{formatCurrency(detail.total)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {periodDetails.length === 0 && (
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                                No details added. Use the buttons above to add services, products, or notes.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicePeriodTable;
