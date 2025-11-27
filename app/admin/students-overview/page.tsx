'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import recommenderService from '@/services/recommenderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Search,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Target,
  XCircle,
} from 'lucide-react';

// Interfaz local para estudiantes transformados
interface StudentDisplay {
  student_id: string;
  completed_courses: number;
  failed_courses: number;
  avg_grade: number;
  career_progress: number;
  best_linea: string;
}

export default function StudentsOverviewPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState<StudentDisplay[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentDisplay[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDisplay | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    loadStudents();
  }, [mounted, isAuthenticated, user, router]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(allStudents);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = allStudents.filter(
        (student) => student.student_id.toLowerCase().includes(searchLower)
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, allStudents]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');

      // Primero obtenemos la lista de IDs de estudiantes
      const studentsListResponse = await recommenderService.students.list(1, 200);
      
      // Luego obtenemos la información completa de cada estudiante
      const studentsDetailsPromises = studentsListResponse.students.map(studentId =>
        recommenderService.students.getInfo(studentId)
      );
      
      const studentsInfoData = await Promise.all(studentsDetailsPromises);
      
      // Transformar los datos a la estructura esperada por la UI
      const studentsData = studentsInfoData.map(info => ({
        student_id: info.student_id,
        completed_courses: info.history.passed_courses,
        failed_courses: info.curriculum_progress.obligatory_failed + info.curriculum_progress.failed_list.length,
        avg_grade: info.performance.avg_grade,
        career_progress: info.curriculum_progress.progress_percentage,
        best_linea: info.performance.best_linea?.[0] || 'N/A',
      }));
      
      setAllStudents(studentsData);
      setFilteredStudents(studentsData);
      
      if (studentsData.length > 0) {
        setSelectedStudent(studentsData[0]);
      }
    } catch (err: any) {
      console.error('Error cargando estudiantes:', err);
      setError('Error al cargar la lista de estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (progress: number) => {
    if (progress >= 80) return <TrendingUp className="h-4 w-4" />;
    if (progress >= 60) return <Award className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestión de Estudiantes</h1>
        <p className="text-muted-foreground mt-2">
          Vista general de todos los estudiantes en el sistema
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allStudents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio General
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allStudents.length > 0
                ? (
                    allStudents.reduce((sum, s) => sum + s.avg_grade, 0) /
                    allStudents.length
                  ).toFixed(1)
                : '0.0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nota promedio del sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progreso Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allStudents.length > 0
                ? (
                    allStudents.reduce((sum, s) => sum + s.career_progress, 0) /
                    allStudents.length
                  ).toFixed(0) + '%'
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avance de carrera
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cursos Reprobados
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allStudents.reduce((sum, s) => sum + s.failed_courses, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total en el sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda y lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo - Lista de estudiantes */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Estudiantes
            </CardTitle>
            <CardDescription>
              {filteredStudents.length} estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Lista de estudiantes */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron estudiantes</p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.student_id}
                    onClick={() => setSelectedStudent(student)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStudent?.student_id === student.student_id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{student.student_id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getPerformanceColor(
                              student.career_progress
                            )}`}
                          >
                            {student.career_progress.toFixed(0)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {student.avg_grade.toFixed(1)} ⭐
                          </span>
                        </div>
                      </div>
                      {getPerformanceIcon(student.career_progress)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Panel derecho - Detalles del estudiante */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detalles del Estudiante</CardTitle>
            <CardDescription>
              {selectedStudent
                ? `Información detallada de ${selectedStudent.student_id}`
                : 'Selecciona un estudiante para ver sus detalles'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="text-lg font-semibold">
                      {selectedStudent.student_id}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Nota Promedio
                    </p>
                    <p className="text-lg font-semibold">
                      {selectedStudent.avg_grade.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Progreso de carrera */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Progreso de Carrera
                    </p>
                    <p className="text-sm font-medium">
                      {selectedStudent.career_progress.toFixed(0)}%
                    </p>
                  </div>
                  <Progress
                    value={selectedStudent.career_progress}
                    className="h-2"
                  />
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Cursos Completados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {selectedStudent.completed_courses}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Cursos Reprobados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-red-600">
                        {selectedStudent.failed_courses}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Mejor línea de carrera */}
                {selectedStudent.best_linea && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Mejor Línea de Carrera</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="text-sm">
                        {selectedStudent.best_linea}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Basado en desempeño histórico
                      </span>
                    </div>
                  </div>
                )}

                {/* Información adicional */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Cursos en progreso
                    </span>
                    <span className="font-medium">
                      {selectedStudent.completed_courses > 0
                        ? Math.max(
                            0,
                            Math.round(
                              selectedStudent.completed_courses * 0.2
                            )
                          )
                        : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tasa de aprobación
                    </span>
                    <span className="font-medium">
                      {selectedStudent.completed_courses > 0
                        ? (
                            (selectedStudent.completed_courses /
                              (selectedStudent.completed_courses +
                                selectedStudent.failed_courses)) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mb-4 opacity-50" />
                <p>Selecciona un estudiante de la lista</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
