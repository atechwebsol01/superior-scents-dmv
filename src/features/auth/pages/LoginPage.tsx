import React from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { COMPANY_NAME } from '@/lib/constants';
import { useThemeStore } from '@/store/themeStore';

/**
 * Login Page
 * Superior Scents DMV, LLC
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 shadow-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
        title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-primary-600" />
        )}
      </button>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <img src="/favicon.svg" alt="Superior Scents" className="w-24 h-24" />
          </div>

          {/* Company Name */}
          <h1 className="text-4xl font-bold text-center mb-4">
            {COMPANY_NAME}
          </h1>
          <p className="text-xl text-white/80 text-center max-w-md">
            Business Management System
          </p>

          {/* Features List */}
          <div className="mt-12 space-y-4">
            {[
              'Manage Customers & Employees',
              'Track Invoices & Payments',
              'Generate Comprehensive Reports',
              'Real-time Business Analytics',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/favicon.svg" alt="Superior Scents" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{COMPANY_NAME}</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Welcome Back</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2">Sign in to your account</p>
            </div>

            <LoginForm onSuccess={handleLoginSuccess} />

            {/* Sign Up Link */}
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Sign up
              </Link>
            </p>

            {/* Demo Credentials Notice */}
            <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
              <p className="text-xs text-neutral-500 dark:text-neutral-300 text-center">
                <strong>Demo Mode:</strong> Use any email/password to login
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-8">
            &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
