'use client';

import { useState, useEffect } from 'react';
import { predictorService, PredictionResponse, CoursePrediction } from '@/services/predictorService';
import backendService, { Curso } from '@/services/backendService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Play,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Activity,
  BarChart3,
  Zap,
} from 'lucide-react';

export default function PredictorPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [scope, setScope] = useState<'single' | 'multiple' | 'all'>('all');
  const [modelType, setModelType] = useState<'auto' | 'general' | 'specific'>('auto');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  
  // Results state
  const [predictions, setPredictions] = useState<CoursePrediction[]>([]);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = async () => {
    try {
      const response = await backendService.cursos.findAll();
      console.log('Respuesta de cursos en predictor:', response);
      
      // El backend devuelve {data: [...], currentPage, pageCount, etc}
      // o directamente un array
      let cursosData: Curso[] = [];
      if (Array.isArray(response)) {
        cursosData = response;
      } else if (response && Array.isArray(response.data)) {
        cursosData = response.data;
      }
      
      console.log('Cursos cargados en predictor:', cursosData.length);
      setCursos(cursosData);
    } catch (err: any) {
      console.error('Error cargando cursos:', err);
    }
  };

  const handlePredict = async () => {
    if (scope === 'single' && !selectedCourse) {
      setError('Selecciona un curso para predicción individual');
      return;
    }
    if (scope === 'multiple' && selectedCourses.length === 0) {
      setError('Selecciona al menos un curso para predicción múltiple');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setPredictions([]);
      setMetadata(null);

      let response: PredictionResponse;

      if (scope === 'single') {
        response = await predictorService.quickPredict(selectedCourse);
      } else if (scope === 'multiple') {
        response = await predictorService.predictMultiple(selectedCourses, modelType);
      } else {
        response = await predictorService.predictAll(modelType);
      }

      // Verificar si hay predicciones
      if (!response.predictions || response.predictions.length === 0) {
        setError('No se generaron predicciones. Es posible que los cursos seleccionados no tengan datos históricos.');
        return;
      }

      setPredictions(response.predictions);
      setMetadata(response.metadata);
      setSuccess(`Predicción completada: ${response.courses_processed} cursos procesados`);
    } catch (err: any) {
      console.error('Error en predicción:', err);
      const errorDetail = err.response?.data?.detail || err.message || 'Error al realizar la predicción';
      
      // Mensajes de error más específicos
      if (errorDetail.includes('No columns to parse')) {
        setError('Los cursos seleccionados no tienen datos históricos suficientes para predicción.');
      } else if (errorDetail.includes('no encontrados')) {
        setError('Uno o más cursos seleccionados no existen en el dataset de entrenamiento.');
      } else {
        setError(errorDetail);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDemandaBadge = (demanda: number) => {
    if (demanda >= 80) return { variant: 'destructive' as const, label: 'Muy Alta', icon: TrendingUp };
    if (demanda >= 60) return { variant: 'default' as const, label: 'Alta', icon: TrendingUp };
    if (demanda >= 40) return { variant: 'secondary' as const, label: 'Media', icon: Activity };
    if (demanda >= 20) return { variant: 'outline' as const, label: 'Baja', icon: TrendingDown };
    return { variant: 'outline' as const, label: 'Muy Baja', icon: TrendingDown };
  };

  const handleCourseToggle = (codigo: string) => {
    setSelectedCourses(prev =>
      prev.includes(codigo)
        ? prev.filter(c => c !== codigo)
        : [...prev, codigo]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Predictor de Demanda</h1>
        <p className="text-muted-foreground mt-2">
          Predice la demanda de matrícula usando Machine Learning
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Formulario de Configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Predicción</CardTitle>
          <CardDescription>
            Configura los parámetros para la predicción de demanda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scope">Alcance</Label>
              <Select value={scope} onValueChange={(v: any) => setScope(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Curso Individual</SelectItem>
                  <SelectItem value="multiple">Múltiples Cursos</SelectItem>
                  <SelectItem value="all">Todos los Cursos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Tipo de Modelo</Label>
              <Select value={modelType} onValueChange={(v: any) => setModelType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Automático (Recomendado)
                    </div>
                  </SelectItem>
                  <SelectItem value="general">Modelo General</SelectItem>
                  <SelectItem value="specific">Modelos Específicos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {scope === 'single' && (
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso.id} value={curso.codigo}>
                      {curso.codigo} - {curso.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {scope === 'multiple' && (
            <div className="space-y-2">
              <Label>Cursos Seleccionados ({selectedCourses.length})</Label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                {cursos.map((curso) => (
                  <div key={curso.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`curso-${curso.id}`}
                      checked={selectedCourses.includes(curso.codigo)}
                      onChange={() => handleCourseToggle(curso.codigo)}
                      className="rounded"
                    />
                    <label htmlFor={`curso-${curso.id}`} className="text-sm cursor-pointer flex-1">
                      {curso.codigo} - {curso.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handlePredict} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Ejecutar Predicción
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Metadata */}
      {metadata && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Procesados</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{predictions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Ejecución</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metadata.execution_time_seconds.toFixed(2)}s</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipo de Modelo</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold capitalize">{metadata.model_type}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alcance</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold capitalize">{metadata.scope}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resultados */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Predicción</CardTitle>
            <CardDescription>
              Demanda predicha para cada curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre del Curso</TableHead>
                  <TableHead className="text-center">Demanda Predicha</TableHead>
                  <TableHead className="text-center">Nivel</TableHead>
                  <TableHead className="text-center">Modelo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((pred) => {
                  const badge = getDemandaBadge(pred.demanda_predicha);
                  const Icon = badge.icon;
                  return (
                    <TableRow key={pred.codigo_curso}>
                      <TableCell className="font-medium">{pred.codigo_curso}</TableCell>
                      <TableCell>{pred.nombre_curso}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-2xl font-bold">{pred.demanda_predicha}</span>
                        <span className="text-sm text-muted-foreground"> estudiantes</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={badge.variant}>
                          <Icon className="h-3 w-3 mr-1" />
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{pred.modelo_usado}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
