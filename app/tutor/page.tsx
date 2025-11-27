'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import backendService from '@/services/backendService';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TutorDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'tutor') {
      router.push('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const data = await backendService.dashboard.getMyDashboard();
        console.log('Professor Dashboard data received:', data);
        if (!data) {
          console.error('Dashboard data is null or undefined');
          setError('No se recibieron datos del servidor');
        } else {
          setDashboardData(data);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard:', err);
        setError(err.response?.data?.message || 'Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, isAuthenticated, router, mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-uni-primary mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No se encontraron datos del profesor</p>
      </div>
    );
  }

  const { profesor, estadisticas, semestre_actual } = dashboardData;

  const stats = [
    {
      title: 'Cursos Ofertados',
      value: estadisticas.total_cursos_ofertados,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Cursos Distintos',
      value: estadisticas.cursos_distintos,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Alumnos',
      value: estadisticas.total_alumnos,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Promedio por Curso',
      value: estadisticas.promedio_alumnos_por_curso.toFixed(1),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Información del Profesor */}
      <Card>
          <CardHeader>
            <CardTitle>Perfil del Profesor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Código</p>
                <p className="text-lg font-semibold">{profesor.codigo_profesor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="text-lg font-semibold">{profesor.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experiencia</p>
                <p className="text-lg font-semibold">{profesor.experiencia_anios} años</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Popularidad</p>
                <p className="text-lg font-semibold">{(profesor.popularidad * 100).toFixed(0)}% ⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cursos del Semestre Actual */}
        <Card>
          <CardHeader>
            <CardTitle>
              Cursos - Semestre {semestre_actual.semestre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {semestre_actual.cursos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay cursos asignados en este semestre</p>
              </div>
            ) : (
              <div className="space-y-4">
                {semestre_actual.cursos.map((curso: any, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {curso.curso_codigo} - {curso.curso_nombre}
                        </h3>
                        <p className="text-sm text-gray-500">Sección: {curso.seccion}</p>
                      </div>
                      <Badge variant={curso.turno === 'M' ? 'default' : curso.turno === 'T' ? 'secondary' : 'outline'}>
                        {curso.turno === 'M' ? 'Mañana' : curso.turno === 'T' ? 'Tarde' : 'Noche'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Alumnos Matriculados</p>
                        <p className="font-semibold">{curso.alumnos_matriculados}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cupos Disponibles</p>
                        <p className="font-semibold">{curso.cupos_disponibles}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Ocupación</p>
                        <p className="font-semibold">{curso.ocupacion.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Lista de alumnos */}
                    {curso.alumnos && curso.alumnos.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Alumnos ({curso.alumnos.length}):
                        </p>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {curso.alumnos.map((alumno: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm py-1 px-2 hover:bg-gray-50 rounded"
                            >
                              <span>
                                {alumno.codigo} - {alumno.nombre || 'Sin nombre'}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {alumno.estado}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
