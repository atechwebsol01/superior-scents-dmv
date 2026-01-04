import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone, Briefcase } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Dropdown } from '@/components/common/Dropdown';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useEmployees } from '../hooks/useEmployees';

export const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    employees,
    isLoading,
    filters,
    fetchEmployees,
    setFilters,
    deleteEmployee,
    getFullName,
    getStatusColor,
    getRoleColor,
    formatSalary,
  } = useEmployees();

  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setFilters({ search: value });
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteEmployee(id);
    }
  };

  const roleOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Technician', value: 'technician' },
    { label: 'Sales', value: 'sales' },
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'On Leave', value: 'on-leave' },
    { label: 'Inactive', value: 'inactive' },
  ];

  return (
    <PageContainer
      title="Employees"
      subtitle="Manage your team members"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Employees' },
      ]}
      actions={
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/employees/new')}
        >
          Add Employee
        </Button>
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search employees..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
                value={filters.role || 'all'}
                onChange={(e) => setFilters({ role: e.target.value as typeof filters.role })}
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
                value={filters.status || 'all'}
                onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Employee List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : employees.length === 0 ? (
        <EmptyState
          title="No employees found"
          description={searchValue ? 'Try adjusting your search or filters' : 'Get started by adding your first employee'}
          actionLabel={!searchValue ? 'Add Employee' : undefined}
          onAction={!searchValue ? () => navigate('/employees/new') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <div key={employee.id} onClick={() => navigate(`/employees/${employee.id}`)} className="cursor-pointer">
            <Card className="card-hover">
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={getFullName(employee)} size="lg" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {getFullName(employee)}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {employee.department}
                      </p>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      variant="icon"
                      align="right"
                      items={[
                        { id: 'view', label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/employees/${employee.id}`) },
                        { id: 'edit', label: 'Edit', icon: <Edit className="w-4 h-4" />, onClick: () => navigate(`/employees/${employee.id}/edit`) },
                        { id: 'divider', label: '', divider: true },
                        { id: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => handleDelete(employee.id, getFullName(employee)) },
                      ]}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={getRoleColor(employee.role) as 'primary' | 'secondary' | 'success'}>
                    {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                  </Badge>
                  <Badge variant={getStatusColor(employee.status) as 'success' | 'error' | 'warning'}>
                    {employee.status === 'on-leave' ? 'On Leave' : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Briefcase className="w-4 h-4" />
                    <span>Salary: {formatSalary(employee.salary)}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default EmployeeListPage;
