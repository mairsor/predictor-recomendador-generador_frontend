'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from 'next-themes';
import axios from 'axios';

interface UserProfile {
  id: number;
  email: string;
  rol: 'ADMIN' | 'ALUMNO' | 'PROFESOR';
  alumno?: {
    codigo: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
  };
  profesor?: {
    codigo: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const { token, logout } = useAuthStore();

  // Estado del perfil
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para información personal
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Estados para cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Estados para preferencias
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [mounted, setMounted] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003';

  // Cargar perfil del usuario
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      setEmail(response.data.email);
    } catch (error: any) {
      console.error('Error al cargar perfil:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre completo
  const getFullName = () => {
    if (!profile) return '';
    
    if (profile.alumno) {
      return `${profile.alumno.nombre} ${profile.alumno.apellido_paterno} ${profile.alumno.apellido_materno}`;
    }
    
    if (profile.profesor) {
      return `${profile.profesor.nombre} ${profile.profesor.apellido_paterno} ${profile.profesor.apellido_materno}`;
    }
    
    return 'Administrador';
  };

  // Obtener código universitario
  const getCode = () => {
    if (!profile) return '-';
    return profile.alumno?.codigo || profile.profesor?.codigo || '-';
  };

  // Guardar cambios de perfil (email)
  const handleSaveProfile = async () => {
    setEmailError('');
    setEmailSuccess('');

    // Validación básica
    if (!email) {
      setEmailError('El email es obligatorio');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Ingrese un email válido');
      return;
    }

    try {
      setSavingProfile(true);
      await axios.patch(
        `${backendUrl}/auth/profile`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmailSuccess('Email actualizado correctamente');
      await loadProfile();
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      setEmailError(
        error.response?.data?.message || 'Error al actualizar el perfil'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    try {
      setChangingPassword(true);
      await axios.patch(
        `${backendUrl}/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPasswordSuccess('Contraseña cambiada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      setPasswordError(
        error.response?.data?.message || 'Error al cambiar la contraseña'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // Guardar preferencias
  const handleSavePreferences = async () => {
    try {
      setSavingPreferences(true);
      // Guardar notificaciones en localStorage
      localStorage.setItem('notifications', notifications.toString());
      
      // El tema ya se guarda automáticamente con next-themes
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert('Preferencias guardadas correctamente');
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      alert('Error al guardar preferencias');
    } finally {
      setSavingPreferences(false);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Cargar preferencias desde localStorage
  useEffect(() => {
    setMounted(true);
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) setNotifications(savedNotifications === 'true');
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-gray-600 mt-1">Gestiona tu información personal y preferencias</p>
      </div>

      {/* Sección 1: Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Actualiza tu información de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre completo (readonly) */}
            <div className="space-y-2">
              <Label>Nombre Completo</Label>
              <Input 
                value={getFullName()} 
                disabled 
                className="bg-gray-50"
              />
            </div>

            {/* Código universitario (readonly) */}
            <div className="space-y-2">
              <Label>Código Universitario</Label>
              <Input 
                value={getCode()} 
                disabled 
                className="bg-gray-50"
              />
            </div>

            {/* Email (editable) */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Rol (readonly) */}
            <div className="space-y-2">
              <Label>Rol</Label>
              <div className="flex items-center h-10">
                <Badge 
                  variant={
                    profile?.rol === 'ADMIN' 
                      ? 'default' 
                      : profile?.rol === 'PROFESOR' 
                      ? 'secondary' 
                      : 'outline'
                  }
                >
                  {profile?.rol}
                </Badge>
              </div>
            </div>
          </div>

          {/* Mensajes de error/éxito */}
          {emailError && (
            <Alert variant="destructive">
              <AlertDescription>{emailError}</AlertDescription>
            </Alert>
          )}
          {emailSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{emailSuccess}</AlertDescription>
            </Alert>
          )}

          {/* Botón guardar */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveProfile}
              disabled={savingProfile || email === profile?.email}
            >
              {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sección 2: Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>
            Gestiona tu contraseña y sesión
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cambiar contraseña */}
          <div className="space-y-4">
            <h3 className="font-semibold">Cambiar Contraseña</h3>
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingrese su contraseña actual"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita la nueva contraseña"
              />
            </div>

            {/* Mensajes de error/éxito */}
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            {passwordSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{passwordSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Sesión</h3>
                <p className="text-sm text-gray-600">Cierra tu sesión actual</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección 3: Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>
            Personaliza tu experiencia en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tema */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-semibold">Tema</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Selecciona el tema de la interfaz</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                disabled={!mounted}
              >
                Claro
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                disabled={!mounted}
              >
                Oscuro
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                disabled={!mounted}
              >
                Sistema
              </Button>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-semibold">Notificaciones</Label>
              <p className="text-sm text-gray-600">Recibe alertas del sistema</p>
            </div>
            <Button
              variant={notifications ? 'default' : 'outline'}
              size="sm"
              onClick={() => setNotifications(!notifications)}
            >
              {notifications ? 'Activadas' : 'Desactivadas'}
            </Button>
          </div>

          {/* Información sobre preferencias */}
          <Alert>
            <AlertDescription>
              Las preferencias se guardan localmente en tu navegador
            </AlertDescription>
          </Alert>

          {/* Botón guardar */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSavePreferences}
              disabled={savingPreferences}
            >
              {savingPreferences ? 'Guardando...' : 'Guardar Preferencias'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
