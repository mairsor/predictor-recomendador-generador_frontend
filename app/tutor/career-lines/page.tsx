'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import recommenderService, { LineasInfo, CourseInfo } from '@/services/recommenderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function CareerLinesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lineasData, setLineasData] = useState<LineasInfo | null>(null);
  const [coursesData, setCoursesData] = useState<CourseInfo[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated || user?.role !== 'tutor') {
      router.push('/login');
      return;
    }

    loadData();
  }, [mounted, isAuthenticated, user, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [lineas, coursesResponse] = await Promise.all([
        recommenderService.getLineas(),
        recommenderService.courses.list(),
      ]);

      setLineasData(lineas);
      setCoursesData(coursesResponse.courses);
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar información de líneas de carrera');
    } finally {
      setLoading(false);
    }
  };

  const getCoursesByLinea = (linea: string) => {
    return coursesData.filter((course) =>
      course.lineas_carrera.includes(linea)
    );
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !lineasData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error || 'No se pudo cargar la información'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Líneas de Carrera</h1>
        <p className="text-muted-foreground mt-2">
          Análisis de líneas de carrera y distribución de cursos
        </p>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Líneas
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lineasData.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Líneas de carrera disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cursos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cursos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio por Línea
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lineasData.total > 0
                ? Math.round(coursesData.length / lineasData.total)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cursos por línea
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalle de cada línea */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Detalle por Línea</h2>
        
        {lineasData.lineas.map((linea) => {
          const lineaCourses = getCoursesByLinea(linea);
          const percentage = coursesData.length > 0 
            ? (lineaCourses.length / coursesData.length) * 100 
            : 0;

          return (
            <Card key={linea}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {linea}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {lineaCourses.length} cursos en esta línea
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {percentage.toFixed(1)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barra de progreso */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Distribución de cursos
                    </span>
                    <span className="font-medium">
                      {lineaCourses.length} de {coursesData.length}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{lineaCourses.length}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">-</div>
                    <div className="text-xs text-muted-foreground">Obligatorios</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">-</div>
                    <div className="text-xs text-muted-foreground">Electivos</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {lineaCourses.filter((c) => c.prereq_codes.length > 0).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Con Prereq.</div>
                  </div>
                </div>

                {/* Lista de cursos (primeros 5) */}
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Cursos principales:</p>
                  <div className="space-y-1">
                    {lineaCourses.slice(0, 5).map((course) => (
                      <div
                        key={course.course_code}
                        className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded"
                      >
                        <span className="font-mono font-medium">
                          {course.course_code}
                        </span>
                        <span className="text-muted-foreground flex-1 truncate">
                          {course.course_name}
                        </span>
                      </div>
                    ))}
                    {lineaCourses.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{lineaCourses.length - 5} cursos más
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {lineasData.lineas.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No se encontraron líneas de carrera</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
