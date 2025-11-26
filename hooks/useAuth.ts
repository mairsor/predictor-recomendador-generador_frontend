'use client';

import { useState } from 'react';
import { backendService, type LoginRequest, type LoginResponse } from '@/services';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await backendService.auth.login(credentials);
      // Guardar token en localStorage
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          token: result.access_token,
          user: result.user,
        }
      }));
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await backendService.auth.logout();
      localStorage.removeItem('auth-storage');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cerrar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logout,
    loading,
    error,
  };
}
