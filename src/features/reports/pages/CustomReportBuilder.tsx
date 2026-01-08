import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GripVertical, Play, Save, Download, BarChart3, PieChart, LineChart, Table } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Input, Select } from '@/components';
import { cn } from '@/lib/cn';

type ChartType = 'bar' | 'line' | 'pie' | 'table';

interface ReportField {
  id: string;
  name: string;
  type: 'dimension' | 'metric';
  dataType: 'string' | 'number' | 'date' | 'currency';
}

interface SelectedField {
  id: string;
  field: ReportField;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: string;
}

const availableFields: ReportField[] = [
  { id: 'customer_name', name: 'Customer Name', type: 'dimension', dataType: 'string' },
  { id: 'customer_city', name: 'Customer City', type: 'dimension', dataType: 'string' },
  { id: 'customer_state', name: 'Customer State', type: 'dimension', dataType: 'string' },
  { id: 'invoice_date', name: 'Invoice Date', type: 'dimension', dataType: 'date' },
  { id: 'payment_date', name: 'Payment Date', type: 'dimension', dataType: 'date' },
  { id: 'employee_name', name: 'Employee Name', type: 'dimension', dataType: 'string' },
  { id: 'service_type', name: 'Service Type', type: 'dimension', dataType: 'string' },
  { id: 'invoice_amount', name: 'Invoice Amount', type: 'metric', dataType: 'currency' },
  { id: 'payment_amount', name: 'Payment Amount', type: 'metric', dataType: 'currency' },
  { id: 'outstanding_balance', name: 'Outstanding Balance', type: 'metric', dataType: 'currency' },
  { id: 'commission_amount', name: 'Commission Amount', type: 'metric', dataType: 'currency' },
  { id: 'invoice_count', name: 'Invoice Count', type: 'metric', dataType: 'number' },
  { id: 'customer_count', name: 'Customer Count', type: 'metric', dataType: 'number' },
];

export const CustomReportBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [reportName, setReportName] = useState('');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const chartIcons = {
    bar: BarChart3,
    line: LineChart,
    pie: PieChart,
    table: Table,
  };

  const addField = (field: ReportField) => {
    if (!selectedFields.find(sf => sf.field.id === field.id)) {
      setSelectedFields([...selectedFields, {
        id: Date.now().toString(),
        field,
        aggregation: field.type === 'metric' ? 'sum' : undefined,
      }]);
    }
  };

  const removeField = (id: string) => {
    setSelectedFields(selectedFields.filter(sf => sf.id !== id));
  };

  const updateFieldAggregation = (id: string, aggregation: string) => {
    setSelectedFields(selectedFields.map(sf => 
      sf.id === id ? { ...sf, aggregation: aggregation as SelectedField['aggregation'] } : sf
    ));
  };

  const addFilter = () => {
    setFilters([...filters, {
      id: Date.now().toString(),
      field: availableFields[0].id,
      operator: 'equals',
      value: '',
    }]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<ReportFilter>) => {
    setFilters(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const generatePreview = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock preview data
    setPreviewData([
      { dimension: 'ABC Corp', metric: 15000 },
      { dimension: 'XYZ Inc', metric: 12500 },
      { dimension: 'Tech Solutions', metric: 9800 },
      { dimension: 'Metro Office', metric: 8200 },
      { dimension: 'City Hall', metric: 6500 },
    ]);
    setGenerating(false);
  };

  const dimensions = availableFields.filter(f => f.type === 'dimension');
  const metrics = availableFields.filter(f => f.type === 'metric');

  return (
    <PageContainer
      title="Custom Report Builder"
      subtitle="Create custom reports with drag-and-drop simplicity"
      breadcrumbs={[
        { label: 'Reports', path: '/reports' },
        { label: 'Custom Report Builder' },
      ]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/reports')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" disabled={!previewData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button disabled={!reportName || selectedFields.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            Save Report
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Field Palette */}
        <Card className="p-4 lg:col-span-1">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Available Fields</h3>
          
          <div className="mb-4">
            <p className="text-xs font-medium text-neutral-500 uppercase mb-2">Dimensions</p>
            <div className="space-y-1">
              {dimensions.map(field => (
                <button
                  key={field.id}
                  onClick={() => addField(field)}
                  disabled={selectedFields.some(sf => sf.field.id === field.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors',
                    selectedFields.some(sf => sf.field.id === field.id)
                      ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800'
                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  )}
                >
                  {field.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase mb-2">Metrics</p>
            <div className="space-y-1">
              {metrics.map(field => (
                <button
                  key={field.id}
                  onClick={() => addField(field)}
                  disabled={selectedFields.some(sf => sf.field.id === field.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors',
                    selectedFields.some(sf => sf.field.id === field.id)
                      ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800'
                      : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400'
                  )}
                >
                  {field.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Report Builder */}
        <div className="lg:col-span-3 space-y-6">
          {/* Report Settings */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Report Name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name..."
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Chart Type
                </label>
                <div className="flex gap-2">
                  {(['bar', 'line', 'pie', 'table'] as ChartType[]).map(type => {
                    const Icon = chartIcons[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={cn(
                          'flex-1 p-3 rounded-lg border-2 transition-all',
                          chartType === type
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                        )}
                      >
                        <Icon className={cn('w-5 h-5 mx-auto', chartType === type ? 'text-primary-500' : 'text-neutral-400')} />
                        <p className="text-xs mt-1 capitalize text-neutral-600 dark:text-neutral-400">{type}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Selected Fields */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Selected Fields</h3>
            {selectedFields.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                <p className="text-neutral-500">Click fields from the palette to add them to your report</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedFields.map((sf) => (
                  <div key={sf.id} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <GripVertical className="w-4 h-4 text-neutral-400 cursor-move" />
                    <span className={cn(
                      'px-2 py-0.5 text-xs rounded',
                      sf.field.type === 'dimension' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    )}>
                      {sf.field.type}
                    </span>
                    <span className="flex-1 text-sm text-neutral-900 dark:text-white">{sf.field.name}</span>
                    {sf.field.type === 'metric' && (
                      <Select
                        value={sf.aggregation || 'sum'}
                        onChange={(value) => updateFieldAggregation(sf.id, value)}
                        options={[
                          { value: 'sum', label: 'Sum' },
                          { value: 'avg', label: 'Average' },
                          { value: 'count', label: 'Count' },
                          { value: 'min', label: 'Min' },
                          { value: 'max', label: 'Max' },
                        ]}
                        className="w-28"
                      />
                    )}
                    <Button variant="ghost" size="sm" onClick={() => removeField(sf.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Filters */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Filters</h3>
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Plus className="w-4 h-4 mr-1" />
                Add Filter
              </Button>
            </div>
            {filters.length === 0 ? (
              <p className="text-sm text-neutral-500">No filters applied. Click "Add Filter" to filter your data.</p>
            ) : (
              <div className="space-y-3">
                {filters.map(filter => (
                  <div key={filter.id} className="flex items-center gap-3">
                    <Select
                      value={filter.field}
                      onChange={(value) => updateFilter(filter.id, { field: value })}
                      options={availableFields.map(f => ({ value: f.id, label: f.name }))}
                      className="flex-1"
                    />
                    <Select
                      value={filter.operator}
                      onChange={(value) => updateFilter(filter.id, { operator: value as ReportFilter['operator'] })}
                      options={[
                        { value: 'equals', label: 'Equals' },
                        { value: 'contains', label: 'Contains' },
                        { value: 'greater', label: 'Greater than' },
                        { value: 'less', label: 'Less than' },
                      ]}
                      className="w-36"
                    />
                    <Input
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                      placeholder="Value..."
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeFilter(filter.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Generate & Preview */}
          <div className="flex justify-end">
            <Button onClick={generatePreview} loading={generating} disabled={selectedFields.length === 0}>
              <Play className="w-4 h-4 mr-2" />
              Generate Preview
            </Button>
          </div>

          {/* Preview Results */}
          {previewData && (
            <Card className="p-6">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Preview Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="text-left py-2 px-4 font-medium text-neutral-500">Dimension</th>
                      <th className="text-right py-2 px-4 font-medium text-neutral-500">Metric</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800">
                        <td className="py-2 px-4 text-neutral-900 dark:text-white">{row.dimension as string}</td>
                        <td className="py-2 px-4 text-right font-medium text-neutral-900 dark:text-white">${(row.metric as number).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default CustomReportBuilder;
