'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Bell, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import backendService from '@/services/backendService';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const dashboard = await backendService.dashboard.getMyDashboard();
        
        if (user?.role === 'student') {
          setUserData((dashboard as any)?.alumno);
        } else if (user?.role === 'tutor') {
          setUserData((dashboard as any)?.profesor);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user?.role === 'student' || user?.role === 'tutor') {
      fetchUserData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    if (!userData) {
      return user?.name || user?.email?.split('@')[0] || 'Usuario';
    }

    // Para estudiantes
    if (user?.role === 'student') {
      if (userData.nombres && userData.apellidos) {
        return `${userData.nombres} ${userData.apellidos}`.trim();
      }
      return userData.codigo || user?.name || user?.email?.split('@')[0] || 'Usuario';
    }

    // Para profesores
    if (user?.role === 'tutor') {
      const parts = [];
      if (userData.nombre) parts.push(userData.nombre);
      if (userData.apellido_paterno) parts.push(userData.apellido_paterno);
      if (userData.apellido_materno) parts.push(userData.apellido_materno);
      
      if (parts.length > 0) {
        return parts.join(' ');
      }
      return userData.codigo_profesor || user?.name || user?.email?.split('@')[0] || 'Usuario';
    }

    return user?.name || user?.email?.split('@')[0] || 'Usuario';
  };

  const displayName = getDisplayName();

  const getDisplayCode = () => {
    if (userData) {
      if (user?.role === 'student') {
        return userData.codigo;
      } else if (user?.role === 'tutor') {
        return userData.codigo_profesor;
      }
    }
    return null;
  };

  const displayRole = user?.role === 'student' ? 'Estudiante' 
    : user?.role === 'tutor' ? 'Tutor' 
    : user?.role === 'admin' ? 'Administrador' 
    : 'Usuario';

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-uni-border dark:border-gray-700 flex items-center justify-between px-6 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-uni-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">UNI</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-uni-text dark:text-white">
            Sistema de Recomendación
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Botón de tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          disabled={!mounted}
        >
          {mounted && theme === 'dark' ? (
            <Sun className="h-5 w-5 text-gray-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </Button>

        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <div className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No tienes notificaciones nuevas
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-medium text-uni-text dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs text-uni-text-secondary dark:text-gray-400">
                  {getDisplayCode() || displayRole}
                </p>
              </div>
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-uni-primary text-white">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
