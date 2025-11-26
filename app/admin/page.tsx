'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import backendService from '@/services/backendService';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, UserCog, TrendingUp, BarChart3, AlertTriangle, Activity, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminDashboard() {
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

    if (user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const data = await backendService.dashboard.getMyDashboard();
        console.log('Admin Dashboard data received:', data);
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
        <p className="text-gray-600">No se encontraron datos del sistema</p>
      </div>
    );
  }

  const { resumen, semestre_actual, estadisticas_matricula, top_cursos_demanda, distribucion_ciclos, rendimiento } = dashboardData;

  const statsGlobales = [
    {
      title: 'Total Alumnos',
      value: resumen.total_alumnos,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Profesores',
      value: resumen.total_profesores,
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Cursos',
      value: resumen.total_cursos,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Usuarios',
      value: resumen.total_usuarios,
      icon: UserCog,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600">Vista general del sistema</p>
      </div>

        {/* Estadísticas Globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsGlobales.map((stat, index) => {
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

        {/* Semestre Actual */}
        <Card>
          <CardHeader>
            <CardTitle>Semestre Actual: {semestre_actual.semestre}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Cursos Ofertados</p>
                <p className="text-3xl font-bold text-blue-600">{semestre_actual.cursos_ofertados}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Matrículas</p>
                <p className="text-3xl font-bold text-green-600">{semestre_actual.total_matriculas}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Promedio por Curso</p>
                <p className="text-3xl font-bold text-purple-600">
                  {semestre_actual.promedio_matriculas_por_curso.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demanda Promedio Global */}
        <Card>
          <CardHeader>
            <CardTitle>Demanda Promedio Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Matrícula Promedio por Curso</p>
              <p className="text-4xl font-bold text-uni-primary">
                {semestre_actual.promedio_matriculas_por_curso.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {semestre_actual.total_matriculas} matrículas en {semestre_actual.cursos_ofertados} cursos
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Cursos con Mayor Demanda (Saturados) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Cursos Más Saturados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {top_cursos_demanda.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hay datos disponibles</p>
              ) : (
                <div className="space-y-3">
                  {top_cursos_demanda.map((curso: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {curso.curso_codigo} - {curso.curso_nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          {curso.profesor} · Sección {curso.seccion}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{curso.matriculados}</p>
                        <p className="text-xs text-gray-500">{curso.vacantes} vacantes</p>
                        <Badge variant="destructive" className="mt-1 text-xs">
                          {curso.vacantes > 0 ? `${((curso.matriculados / (curso.matriculados + curso.vacantes)) * 100).toFixed(0)}%` : '100%'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cursos con Baja Matrícula */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                Cursos con Baja Matrícula
              </CardTitle>
            </CardHeader>
            <CardContent>
              {top_cursos_demanda.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hay datos disponibles</p>
              ) : (
                <div className="space-y-3">
                  {[...top_cursos_demanda]
                    .reverse()
                    .slice(0, 5)
                    .map((curso: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {curso.curso_codigo} - {curso.curso_nombre}
                          </p>
                          <p className="text-xs text-gray-600">
                            {curso.profesor} · Sección {curso.seccion}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">{curso.matriculados}</p>
                          <p className="text-xs text-gray-500">{curso.vacantes} vacantes</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            Baja demanda
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribución por Ciclos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Distribución de Alumnos por Ciclo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {distribucion_ciclos.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hay datos disponibles</p>
              ) : (
                <div className="space-y-2">
                  {distribucion_ciclos.map((item: any, index: number) => {
                    const maxAlumnos = Math.max(...distribucion_ciclos.map((d: any) => d.alumnos));
                    const percentage = (item.alumnos / maxAlumnos) * 100;
                    
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Ciclo {item.ciclo}</span>
                          <span className="text-gray-600">{item.alumnos} alumnos</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-uni-primary h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas de Matrícula */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Matrícula por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            {estadisticas_matricula.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No hay datos disponibles</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {estadisticas_matricula.map((item: any, index: number) => (
                  <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{item.estado}</p>
                    <p className="text-2xl font-bold text-uni-primary">{item.cantidad}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rendimiento General */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Promedio General del Sistema</p>
                <p className="text-5xl font-bold text-uni-primary">
                  {rendimiento.promedio_general.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actividad del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Actividad del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sistema activo</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      En línea
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• Última actualización: {semestre_actual.semestre}</p>
                    <p>• Total de matrículas procesadas: {semestre_actual.total_matriculas}</p>
                    <p>• Cursos activos en el sistema: {semestre_actual.cursos_ofertados}</p>
                    <p>• Base de datos: {resumen.total_alumnos} estudiantes, {resumen.total_profesores} profesores</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Predicciones Disponibles</h4>
              <p className="text-xs text-blue-700">
                El sistema de predicción está disponible para generar proyecciones de demanda 
                para el próximo semestre académico basado en datos históricos y tendencias actuales.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Predictor API Activo
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Recomendador API Activo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
