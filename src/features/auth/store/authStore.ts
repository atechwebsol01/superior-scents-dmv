import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { AuthStore, LoginCredentials, User } from '../types/auth.types';
import { STORAGE_KEYS } from '@/lib/constants';
// import api from '@/api/axios';
// import { ENDPOINTS } from '@/api/endpoints';

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
            // DEMO MODE: Mock login - replace with real API when backend is ready
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock user data
            const mockUser: User = {
              id: '1',
              email: credentials.email,
              firstName: credentials.email.split('@')[0],
              lastName: 'User',
              role: 'admin',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            const mockToken = 'demo-token-' + Date.now();

            // Store token
            localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);

            set({
              user: mockUser,
              token: mockToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // TODO: Replace with real API call when backend is ready
            // const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
            // const { user, token } = response.data;
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
            // DEMO MODE: For now, just validate token exists
            // TODO: Replace with real API call when backend is ready
            // const response = await api.get(ENDPOINTS.AUTH.ME);
            // const user = response.data;
            
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Get stored user from persist
            const storedState = useAuthStore.getState();
            if (storedState.user) {
              set({
                user: storedState.user,
                token,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              throw new Error('No stored user');
            }
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
