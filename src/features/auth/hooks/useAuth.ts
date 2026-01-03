import { useAuthStore } from '../store/authStore';
import type { LoginCredentials } from '../types/auth.types';

/**
 * useAuth Hook
 * Superior Scents DMV, LLC
 * 
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    clearError,
    setUser,
  } = useAuthStore();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const handleLogout = () => {
    logout();
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  
  // Build full name, filtering out empty lastName
  const fullName = user 
    ? [user.firstName, user.lastName].filter(Boolean).join(' ')
    : '';

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Computed
    isAdmin,
    isManager,
    fullName,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
    clearError,
    setUser,
  };
};

export default useAuth;
