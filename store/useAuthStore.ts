import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types';
import backendService from '@/services/backendService';
import api from '@/services/api';

// Mapeo de roles del backend al frontend
const mapRoleToFrontend = (backendRole: 'ALUMNO' | 'PROFESOR' | 'ADMIN'): 'student' | 'tutor' | 'admin' => {
  switch (backendRole) {
    case 'ALUMNO':
      return 'student';
    case 'PROFESOR':
      return 'tutor';
    case 'ADMIN':
      return 'admin';
    default:
      return 'student';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // Llamar a la API real del backend
          const response = await backendService.auth.login({ email, password });

          // Mapear la respuesta del backend al formato del frontend
          const user = {
            id: response.user.id.toString(),
            email: response.user.email,
            name: response.user.email.split('@')[0], // Usar email como nombre por ahora
            role: mapRoleToFrontend(response.user.rol),
          };

          const token = response.access_token;

          // Configurar el token en el cliente axios para futuras peticiones
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({ user, token, isAuthenticated: true });
        } catch (error: any) {
          console.error('Login error:', error);
          // Propagar el error con un mensaje más específico
          const errorMessage = error.response?.data?.message || 'Credenciales inválidas';
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        try {
          // Intentar llamar al endpoint de logout del backend
          await backendService.auth.logout();
        } catch (error) {
          console.error('Logout error:', error);
          // Continuar con el logout local aunque falle el backend
        } finally {
          // Limpiar el token del cliente axios
          delete api.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      setUser: (user, token) => {
        // Configurar el token en el cliente axios
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      // Restaurar el token en axios cuando se carga desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.token && state?.user) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          // Asegurarse de que isAuthenticated se actualice después de rehidratar
          state.isAuthenticated = true;
        }
      },
    }
  )
);
