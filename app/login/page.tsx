'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);

      const user = useAuthStore.getState().user;

      // Redirigir según el rol
      if (user?.role === 'student') {
        router.push('/student');
      } else if (user?.role === 'tutor') {
        router.push('/tutor/dashboard');
      } else if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      // Mostrar error específico del backend
      const errorMessage = err.message || err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-uni-background">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-uni-primary rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-uni-text">
              Sistema de Recomendación
            </h1>
            <p className="text-uni-text-secondary">
              Universidad Nacional de Ingeniería
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-uni-text">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="estudiante@uni.edu.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-uni-border focus:ring-uni-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-uni-text">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-uni-border focus:ring-uni-primary"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-uni-primary hover:bg-uni-secondary text-white"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="text-center text-sm text-uni-text-secondary">
            <a href="#" className="hover:text-uni-primary transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Usuarios de prueba */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Usuarios de prueba:
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Admin:</span>
                <code className="bg-white px-2 py-0.5 rounded">admin@uni.edu.pe</code>
              </div>
              <div className="flex justify-between">
                <span>Contraseña:</span>
                <code className="bg-white px-2 py-0.5 rounded">admin123</code>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              Nota: Solo usuarios registrados en el sistema pueden acceder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
