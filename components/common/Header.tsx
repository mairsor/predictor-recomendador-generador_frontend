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
import { LogOut, User, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import backendService from '@/services/backendService';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.role === 'student') {
        try {
          const dashboard = await backendService.dashboard.getMyDashboard();
          setUserData((dashboard as any)?.alumno);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
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

  const displayName = userData 
    ? (userData.nombres && userData.apellidos 
        ? `${userData.nombres} ${userData.apellidos}`.trim()
        : userData.codigo || user?.name || user?.email?.split('@')[0] || 'Usuario')
    : user?.name || user?.email?.split('@')[0] || 'Usuario';

  const displayRole = user?.role === 'student' ? 'Estudiante' 
    : user?.role === 'tutor' ? 'Tutor' 
    : user?.role === 'admin' ? 'Administrador' 
    : 'Usuario';

  return (
    <header className="h-16 bg-white border-b border-uni-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-uni-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">UNI</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-uni-text">
            Sistema de Recomendación
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notificaciones */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-medium text-uni-text">
                  {displayName}
                </p>
                <p className="text-xs text-uni-text-secondary">
                  {userData?.codigo || displayRole}
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
              className="cursor-pointer text-red-600 focus:text-red-600"
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
