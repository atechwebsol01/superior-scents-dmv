import React from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { SignUpForm } from '../components/SignUpForm';
import { useAuth } from '../hooks/useAuth';
import { COMPANY_NAME } from '@/lib/constants';

/**
 * Sign Up Page
 * Superior Scents DMV, LLC
 */
export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignUpSuccess = () => {
    // Redirect to login after successful sign up
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-600 via-secondary-700 to-primary-600 relative overflow-hidden">
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
            Join Our Business Management Platform
          </p>

          {/* Benefits List */}
          <div className="mt-12 space-y-4">
            {[
              'Streamline Your Operations',
              'Track Everything in One Place',
              'Generate Reports Instantly',
              'Secure & Reliable Platform',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/favicon.svg" alt="Superior Scents" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900">{COMPANY_NAME}</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Create Account</h2>
              <p className="text-neutral-500 mt-2">Get started with your free account</p>
            </div>

            <SignUpForm onSuccess={handleSignUpSuccess} />

            {/* Sign In Link */}
            <p className="text-center text-sm text-neutral-600 mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-neutral-500 mt-8">
            &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
