import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, Users } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Spinner } from '@/components/common/Spinner';
import { useEmployees } from '../hooks/useEmployees';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedEmployee: employee,
    isLoading,
    fetchEmployeeById,
    deleteEmployee,
    getFullName,
    getStatusColor,
    getRoleColor,
    formatSalary,
    clearSelectedEmployee,
  } = useEmployees();

  React.useEffect(() => {
    if (id) fetchEmployeeById(id);
    return () => clearSelectedEmployee();
  }, [id]);

  const handleDelete = async () => {
    if (employee && window.confirm(`Are you sure you want to delete ${getFullName(employee)}?`)) {
      await deleteEmployee(employee.id);
      navigate('/employees');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!employee) {
    return (
      <PageContainer title="Employee Not Found">
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">The employee you're looking for doesn't exist.</p>
            <Button variant="primary" onClick={() => navigate('/employees')}>Back to Employees</Button>
          </CardBody>
        </Card>
      </PageContainer>
    );
  }

  const stats = [
    { label: 'Assigned Customers', value: employee.assignedCustomers?.length || 0, icon: Users },
    { label: 'Commission Rate', value: `${employee.commissionRate || 0}%`, icon: DollarSign },
    { label: 'Hire Date', value: new Date(employee.hireDate).toLocaleDateString(), icon: Calendar },
  ];

  return (
    <PageContainer
      title=""
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Employees', path: '/employees' },
        { label: getFullName(employee) },
      ]}
    >
      {/* Header */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/employees')}>
                Back
              </Button>
              <div className="flex items-center gap-4">
                <Avatar name={getFullName(employee)} size="lg" />
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{getFullName(employee)}</h1>
                    <Badge variant={getRoleColor(employee.role) as 'primary' | 'secondary'}>
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </Badge>
                    <Badge variant={getStatusColor(employee.status) as 'success' | 'error' | 'warning'}>
                      {employee.status === 'on-leave' ? 'On Leave' : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{employee.department} • {employee.email}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-auto sm:ml-0">
              <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />} onClick={() => navigate(`/employees/${employee.id}/edit`)}>Edit</Button>
              <Button variant="outline" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDelete} className="text-error-600 border-error-300 hover:bg-error-50">Delete</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardBody className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Contact Information</h3>
          </div>
          <CardBody>
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: employee.email },
                { icon: Phone, label: 'Phone', value: employee.phone },
                { icon: MapPin, label: 'Address', value: `${employee.address.street}, ${employee.address.city}, ${employee.address.state} ${employee.address.zipCode}` },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Employment Details</h3>
          </div>
          <CardBody>
            <div className="space-y-4">
              {[
                { icon: Briefcase, label: 'Department', value: employee.department },
                { icon: DollarSign, label: 'Salary', value: formatSalary(employee.salary) },
                { icon: Calendar, label: 'Hire Date', value: new Date(employee.hireDate).toLocaleDateString() },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {employee.emergencyContact && (
          <Card className="lg:col-span-2">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Emergency Contact</h3>
            </div>
            <CardBody>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Name</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{employee.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Phone</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{employee.emergencyContact.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Relationship</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{employee.emergencyContact.relationship}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default EmployeeDetailPage;
