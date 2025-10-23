import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Development helper: accept any credentials and set a local user.
      // This disables real authentication and should only be used in dev/testing.
      login: async (email: string, password: string) => {
        try {
          // small delay to simulate network
          await new Promise((res) => setTimeout(res, 150));

          // Infer role from email for convenience: 'admin' or 'tutor' in address -> that role, otherwise student
          const lowered = email?.toLowerCase() || '';
          const role: 'student' | 'tutor' | 'admin' = lowered.includes('admin')
            ? 'admin'
            : lowered.includes('tutor')
            ? 'tutor'
            : 'student';

          const user = {
            id: `local-${Date.now()}`,
            email,
            name: (email && email.split('@')[0]) || 'Usuario',
            role,
          };

          const token = 'local-dev-token';

          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error('Login error (local):', error);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
