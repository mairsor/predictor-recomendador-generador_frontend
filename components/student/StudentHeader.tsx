'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import backendService from '@/services/backendService';

export default function StudentHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [alumnoData, setAlumnoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumnoData = async () => {
      try {
        const dashboard = await backendService.dashboard.getMyDashboard();
        setAlumnoData((dashboard as any)?.alumno);
      } catch (error) {
        console.error('Error fetching alumno data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'student') {
      fetchAlumnoData();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = loading 
    ? 'Cargando...' 
    : alumnoData 
      ? (alumnoData.nombres && alumnoData.apellidos 
          ? `${alumnoData.nombres} ${alumnoData.apellidos}`.trim()
          : alumnoData.codigo || user?.email?.split('@')[0] || 'Alumno')
      : user?.name || user?.email?.split('@')[0] || 'Alumno';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-uni-primary">
            Sistema de Recomendación UNI
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Perfil del usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-uni-primary rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">
                    {alumnoData?.codigo || 'Estudiante'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
