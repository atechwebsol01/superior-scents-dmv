import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { AuthStore, LoginCredentials, User } from '../types/auth.types';
import { STORAGE_KEYS } from '@/lib/constants';
import api from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';

/**
 * Authentication Store
 * Superior Scents DMV, LLC
 * 
 * Handles user authentication state and actions
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, _get) => ({
        // Initial State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });
          
          try {
            // API call to login endpoint
            const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
            const { user, token } = response.data;

            // Store token
            localStorage.setItem(STORAGE_KEYS.TOKEN, token);

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Login failed. Please check your credentials.';
            
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        logout: () => {
          // Clear storage
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);

          // Reset state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Redirect to login
          window.location.href = '/login';
        },

        checkAuth: async () => {
          const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
          
          if (!token) {
            set({ isAuthenticated: false, user: null, token: null });
            return;
          }

          set({ isLoading: true });

          try {
            // Verify token with backend
            const response = await api.get(ENDPOINTS.AUTH.ME);
            const user = response.data;

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch {
            // Token invalid or expired
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setUser: (user: User) => {
          set({ user });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);

export default useAuthStore;
