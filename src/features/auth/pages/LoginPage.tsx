import React from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Sparkles } from 'lucide-react';
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

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white dark:bg-neutral-950">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 shadow-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all duration-300"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-neutral-600" />
        )}
      </button>

      {/* Left Panel - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 dark:bg-primary-500 rounded-full filter blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-400 dark:bg-secondary-500 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300 dark:bg-primary-400 rounded-full filter blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Sparkle effects */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-white/30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${8 + Math.random() * 12}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo with glow effect */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <img 
              src="/logo.jpg" 
              alt="Superior Scents" 
              className="relative w-32 h-32 rounded-2xl object-cover shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Company Name with gradient */}
          <h1 className="text-4xl font-bold text-center mb-2 text-white">
            Superior Scents
          </h1>
          <p className="text-lg text-white/70 mb-2">DMV, LLC</p>
          <p className="text-sm text-white/50 text-center max-w-sm mb-8">
            Premium Business Management System
          </p>

          {/* Elegant divider */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mb-8" />

          {/* Features List with icons */}
          <div className="space-y-4">
            {[
              { text: 'Manage Customers & Employees', icon: '👥' },
              { text: 'Track Invoices & Payments', icon: '💰' },
              { text: 'Generate Comprehensive Reports', icon: '📊' },
              { text: 'Real-time Business Analytics', icon: '📈' },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                <span className="text-lg">{feature.icon}</span>
                <span className="text-white/90 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <p className="absolute bottom-8 text-xs text-white/40 tracking-widest uppercase">
            Elevating Spaces with Luxurious Fragrances
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur-lg opacity-30" />
              <img 
                src="/logo.jpg" 
                alt="Superior Scents" 
                className="relative w-20 h-20 rounded-xl object-cover shadow-xl mx-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Superior Scents</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">DMV, LLC</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
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
                className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign up
              </Link>
            </p>

            {/* Demo Credentials Notice */}
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
              <p className="text-xs text-neutral-600 dark:text-neutral-300 text-center">
                <strong className="text-primary-600 dark:text-primary-400">Demo Mode:</strong> Use any email/password to login
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              &copy; {new Date().getFullYear()} {COMPANY_NAME}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
