import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Spinner } from '@/components/common/Spinner';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployees } from '../hooks/useEmployees';
import type { EmployeeFormData } from '../types/employee.types';

export const EditEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedEmployee: employee, isLoading, fetchEmployeeById, updateEmployee, getFullName, clearSelectedEmployee } = useEmployees();

  React.useEffect(() => {
    if (id) fetchEmployeeById(id);
    return () => clearSelectedEmployee();
  }, [id]);

  const handleSubmit = async (data: EmployeeFormData) => {
    if (!id) return;
    await updateEmployee(id, data);
    navigate(`/employees/${id}`);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><Spinner size="lg" /></div>;

  if (!employee) {
    return (
      <PageContainer title="Employee Not Found">
        <Card><CardBody className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Employee not found.</p>
          <Button variant="primary" onClick={() => navigate('/employees')}>Back to Employees</Button>
        </CardBody></Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Edit ${getFullName(employee)}`}
      subtitle="Update employee information"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Employees', path: '/employees' },
        { label: getFullName(employee), path: `/employees/${id}` },
        { label: 'Edit' },
      ]}
    >
      <EmployeeForm employee={employee} onSubmit={handleSubmit} onCancel={() => navigate(`/employees/${id}`)} isLoading={isLoading} />
    </PageContainer>
  );
};

export default EditEmployeePage;
