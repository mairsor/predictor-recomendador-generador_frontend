'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import recommenderService, { CourseInfo } from '@/services/recommenderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Search,
  BookOpen,
  Link2,
  Target,
  AlertCircle,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

export default function CourseAnalysisPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allCourses, setAllCourses] = useState<CourseInfo[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseInfo[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
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

    loadCourses();
  }, [mounted, isAuthenticated, user, router]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await recommenderService.courses.list();
      setAllCourses(response.courses);
      setFilteredCourses(response.courses);
    } catch (err: any) {
      console.error('Error cargando cursos:', err);
      setError('Error al cargar la lista de cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredCourses(allCourses);
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = allCourses.filter(
      (course) =>
        course.course_code.toLowerCase().includes(searchLower) ||
        course.course_name.toLowerCase().includes(searchLower)
    );
    setFilteredCourses(filtered);
  };

  const handleSelectCourse = async (courseCode: string) => {
    try {
      setLoading(true);
      setError('');
      const courseInfo = await recommenderService.courses.getInfo(courseCode);
      setSelectedCourse(courseInfo);
    } catch (err: any) {
      console.error('Error cargando información del curso:', err);
      setError('Error al cargar información detallada del curso');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (loading && allCourses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Análisis de Cursos</h1>
        <p className="text-muted-foreground mt-2">
          Explora información detallada de cursos, prerrequisitos y líneas de carrera
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de cursos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Catálogo de Cursos
            </CardTitle>
            <CardDescription>
              {allCourses.length} cursos disponibles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Lista de cursos */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredCourses.map((course) => (
                <button
                  key={course.course_code}
                  onClick={() => handleSelectCourse(course.course_code)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-accent ${
                    selectedCourse?.course_code === course.course_code
                      ? 'bg-accent border-primary'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-medium text-sm">
                        {course.course_code}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {course.course_name}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}

              {filteredCourses.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No se encontraron cursos
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalles del curso seleccionado */}
        <div className="lg:col-span-2">
          {!selectedCourse ? (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Selecciona un curso para ver sus detalles</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Información principal */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedCourse.course_name}
                      </CardTitle>
                      <CardDescription className="text-lg font-mono mt-1">
                        {selectedCourse.course_code}
                      </CardDescription>
                    </div>
                    {loading && <RefreshCw className="h-5 w-5 animate-spin" />}
                  </div>
                </CardHeader>
              </Card>

              {/* Líneas de carrera */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Líneas de Carrera
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCourse.lineas_carrera.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.lineas_carrera.map((linea) => (
                        <Badge key={linea} variant="secondary" className="text-sm">
                          {linea}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No especificado
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Prerrequisitos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Prerrequisitos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCourse.prereq_codes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCourse.prereq_codes.map((prereq) => {
                        const prereqCourse = allCourses.find(
                          (c) => c.course_code === prereq
                        );
                        return (
                          <div
                            key={prereq}
                            className="flex items-center gap-2 p-2 rounded border"
                          >
                            <span className="font-mono font-medium">
                              {prereq}
                            </span>
                            {prereqCourse && (
                              <span className="text-sm text-muted-foreground">
                                - {prereqCourse.course_name}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Este curso no tiene prerrequisitos
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Información adicional */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de prerrequisitos:</span>
                    <span className="font-medium">{selectedCourse.prereq_codes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Líneas asociadas:</span>
                    <span className="font-medium">{selectedCourse.lineas_carrera.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant="outline">No especificado</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
