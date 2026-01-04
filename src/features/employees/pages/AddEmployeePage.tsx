import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployees } from '../hooks/useEmployees';
import type { EmployeeFormData } from '../types/employee.types';

export const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { createEmployee, isLoading } = useEmployees();

  const handleSubmit = async (data: EmployeeFormData) => {
    const employee = await createEmployee(data);
    navigate(`/employees/${employee.id}`);
  };

  return (
    <PageContainer
      title="Add New Employee"
      subtitle="Create a new team member profile"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Employees', path: '/employees' },
        { label: 'Add Employee' },
      ]}
    >
      <EmployeeForm onSubmit={handleSubmit} onCancel={() => navigate('/employees')} isLoading={isLoading} />
    </PageContainer>
  );
};

export default AddEmployeePage;
