'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  Lightbulb,
  Target
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import recommenderService, { 
  CourseRecommendation, 
  StudentInfo 
} from '@/services/recommenderService';

export default function RecommendationsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [topK, setTopK] = useState(10);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // El sistema de recomendaciones usa códigos de prueba
      // Intentar con el código del usuario, sino con ALUMNO_REAL como demostración
      let studentCode = user?.codigo || 'ALUMNO_REAL';
      let usingDemo = !user?.codigo;
      
      try {
        // Intentar con el código del usuario o ALUMNO_REAL
        const [info, recs] = await Promise.all([
          recommenderService.students.getInfo(studentCode),
          recommenderService.students.getRecommendations(studentCode, topK),
        ]);
        
        setStudentInfo(info);
        setRecommendations(recs.recommendations);
        
        if (usingDemo) {
          setError('⚠️ Usando datos de demostración (ALUMNO_REAL). Tu código no está registrado en el sistema.');
        }
      } catch (firstError: any) {
        // Si falla, intentar con ALUMNO_REAL como fallback final
        if (firstError.response?.status === 404 && studentCode !== 'ALUMNO_REAL') {
          console.log(`Código ${studentCode} no encontrado, usando ALUMNO_REAL como demo`);
          studentCode = 'ALUMNO_REAL';
          
          const [info, recs] = await Promise.all([
            recommenderService.students.getInfo(studentCode),
            recommenderService.students.getRecommendations(studentCode, topK),
          ]);
          
          setStudentInfo(info);
          setRecommendations(recs.recommendations);
          setError('⚠️ Usando datos de demostración (ALUMNO_REAL). Tu código no está en el sistema de recomendaciones.');
        } else {
          throw firstError;
        }
      }
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err.response?.data?.error || err.message || 'Error al cargar recomendaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, topK]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !studentInfo) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!studentInfo) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No se encontró información del estudiante</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Advertencia si está usando datos de demo */}
      {error && (
        <Alert className="border-yellow-500 bg-yellow-50 text-yellow-900">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Recomendaciones de Cursos</h1>
        <p className="text-muted-foreground mt-2">
          Sistema de recomendación personalizado basado en tu historial académico
        </p>
      </div>

      {/* Resumen del Estudiante */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentInfo.curriculum_progress.progress_percentage.toFixed(1)}%
            </div>
            <Progress 
              value={studentInfo.curriculum_progress.progress_percentage} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              {studentInfo.curriculum_progress.obligatory_passed} de{' '}
              {studentInfo.curriculum_progress.obligatory_passed + 
                studentInfo.curriculum_progress.obligatory_pending} obligatorios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentInfo.performance.avg_grade.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tasa de aprobación: {studentInfo.performance.pass_rate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor Línea</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentInfo.performance.best_linea[1].toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {studentInfo.performance.best_linea[0]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Jalados</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentInfo.curriculum_progress.obligatory_failed}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cursos obligatorios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">
            <Lightbulb className="h-4 w-4 mr-2" />
            Recomendaciones
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Mi Desempeño
          </TabsTrigger>
          <TabsTrigger value="history">
            <BookOpen className="h-4 w-4 mr-2" />
            Mi Historial
          </TabsTrigger>
        </TabsList>

        {/* Recomendaciones */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cursos Recomendados para Ti</CardTitle>
                  <CardDescription>
                    Basado en tu historial, desempeño y malla curricular
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay recomendaciones disponibles en este momento
                  </AlertDescription>
                </Alert>
              ) : (
                recommendations.map((rec, idx) => (
                  <CourseRecommendationCard 
                    key={rec.course_code} 
                    recommendation={rec} 
                    rank={idx + 1}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Desempeño */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Desempeño por Línea</CardTitle>
              <CardDescription>
                Tu rendimiento en diferentes áreas de tu carrera
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(studentInfo.performance.lineas_performance)
                .sort(([, a], [, b]) => b - a)
                .map(([linea, promedio]) => (
                  <div key={linea} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{linea}</span>
                      <span className="text-sm text-muted-foreground">
                        {promedio.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={(promedio / 20) * 100} />
                  </div>
                ))}
            </CardContent>
          </Card>

          {studentInfo.curriculum_progress.failed_list.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cursos Pendientes de Aprobar</CardTitle>
                <CardDescription>
                  Cursos obligatorios que necesitas recuperar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {studentInfo.curriculum_progress.failed_list.map((code) => (
                    <Badge key={code} variant="destructive">
                      {code}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Historial */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Cursos</CardTitle>
              <CardDescription>
                Total de cursos cursados: {studentInfo.history.total_courses}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">
                      Aprobados: {studentInfo.history.passed_courses}
                    </span>
                  </div>
                  <Progress 
                    value={(studentInfo.history.passed_courses / studentInfo.history.total_courses) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">
                      Jalados: {studentInfo.history.total_courses - studentInfo.history.passed_courses}
                    </span>
                  </div>
                  <Progress 
                    value={((studentInfo.history.total_courses - studentInfo.history.passed_courses) / studentInfo.history.total_courses) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para mostrar cada recomendación
function CourseRecommendationCard({ 
  recommendation, 
  rank 
}: { 
  recommendation: CourseRecommendation; 
  rank: number;
}) {
  return (
    <Card className={rank <= 3 ? 'border-primary' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={rank <= 3 ? 'default' : 'secondary'}>
                #{rank}
              </Badge>
              <CardTitle className="text-xl">
                {recommendation.course_code}
              </CardTitle>
              {recommendation.is_failed && (
                <Badge variant="destructive">Jalado</Badge>
              )}
              {recommendation.is_obligatory && (
                <Badge variant="outline">Obligatorio</Badge>
              )}
            </div>
            <CardDescription className="text-base">
              {recommendation.course_name}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {recommendation.score.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Líneas de carrera */}
        <div>
          <div className="text-sm font-medium mb-2">Líneas de carrera:</div>
          <div className="flex flex-wrap gap-2">
            {recommendation.lineas_carrera.map((linea) => (
              <Badge key={linea} variant="secondary">
                {linea}
              </Badge>
            ))}
          </div>
        </div>

        {/* Razones */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Por qué te lo recomendamos:</div>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Similitud de contenido:</span>
              <span className="font-medium">
                {(recommendation.reasons.content_similarity * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Score colaborativo:</span>
              <span className="font-medium">
                {recommendation.reasons.collaborative_score.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Performance en líneas:</span>
              <span className="font-medium">
                {(recommendation.reasons.lineas_performance * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Prerequisitos */}
        {recommendation.reasons.prerequisites.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Prerequisitos:</div>
            <div className="flex items-center gap-2">
              {recommendation.reasons.prerequisites_met ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Cumplidos</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Faltantes</span>
                </>
              )}
              <div className="flex flex-wrap gap-1 ml-2">
                {recommendation.reasons.prerequisites.map((prereq) => (
                  <Badge key={prereq} variant="outline" className="text-xs">
                    {prereq}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
