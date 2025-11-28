'use client';

import { useState, useEffect } from 'react';
import { predictorService, ResultFile, ResultContent } from '@/services/predictorService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  FileText,
  Eye,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
  X,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function StudentPredictionsPage() {
  const [results, setResults] = useState<ResultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [selectedResult, setSelectedResult] = useState<ResultFile | null>(null);
  const [resultContent, setResultContent] = useState<ResultContent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await predictorService.listResults();
      // Ordenar por fecha más reciente
      const sortedResults = response.files.sort((a, b) => 
        new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
      setResults(sortedResults);
    } catch (err: any) {
      console.error('Error cargando resultados:', err);
      setError(err.response?.data?.detail || 'Error al cargar los resultados');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (result: ResultFile) => {
    setSelectedResult(result);
    setIsViewModalOpen(true);
    setLoadingContent(true);
    
    try {
      const content = await predictorService.getResultContent(result.filename);
      setResultContent(content);
    } catch (err: any) {
      console.error('Error cargando contenido:', err);
      setError('Error al cargar el contenido del archivo');
      setIsViewModalOpen(false);
    } finally {
      setLoadingContent(false);
    }
  };

  const getDemandaBadge = (demanda: number) => {
    if (demanda >= 80) return { variant: 'destructive' as const, label: 'Muy Alta', icon: TrendingUp };
    if (demanda >= 60) return { variant: 'default' as const, label: 'Alta', icon: TrendingUp };
    if (demanda >= 40) return { variant: 'secondary' as const, label: 'Media', icon: Activity };
    if (demanda >= 20) return { variant: 'outline' as const, label: 'Baja', icon: TrendingDown };
    return { variant: 'outline' as const, label: 'Muy Baja', icon: TrendingDown };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtrar predicciones por búsqueda
  const filteredPredictions = resultContent?.data?.filter(pred => 
    pred.codigo_curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pred.nombre_curso.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Predicciones de Demanda</h1>
          <p className="text-muted-foreground mt-2">
            Consulta las predicciones de demanda generadas para los cursos
          </p>
        </div>
        <Button onClick={loadResults} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Información para el estudiante */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Las predicciones de demanda te ayudan a planificar tu matrícula. Consulta la demanda esperada 
          para cada curso y toma mejores decisiones sobre qué cursos matricular.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Predicción más reciente destacada */}
      {!loading && results.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Última Predicción Disponible
            </CardTitle>
            <CardDescription>
              Generada el {formatDate(results[0].created_date)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Archivo</p>
                <p className="font-medium">{results[0].filename}</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm text-muted-foreground">Cursos</p>
                <p className="text-2xl font-bold">{results[0].rows}</p>
              </div>
              <Button onClick={() => handleViewResult(results[0])}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Predicciones
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de todas las predicciones disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Predicciones</CardTitle>
          <CardDescription>
            Todas las predicciones generadas por el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : results?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay predicciones disponibles</p>
              <p className="text-sm mt-2">Las predicciones serán generadas por el sistema periódicamente</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archivo</TableHead>
                  <TableHead className="text-center">Cursos</TableHead>
                  <TableHead>Fecha de Generación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results?.map((result) => (
                  <TableRow key={result.filename}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {result.filename}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{result.rows}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(result.created_date)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewResult(result)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Ver Contenido */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Predicciones de Demanda por Curso</DialogTitle>
            <DialogDescription>
              {selectedResult?.filename} - {formatDate(selectedResult?.created_date || '')}
            </DialogDescription>
          </DialogHeader>
          
          {loadingContent ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : resultContent ? (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  La demanda predicha indica cuántos estudiantes aproximadamente matricularán cada curso. 
                  Usa esta información para planificar tu horario.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  {searchTerm 
                    ? `${filteredPredictions.length} de ${resultContent.rows || 0} cursos encontrados`
                    : `${resultContent.rows || 0} cursos analizados`
                  }
                </span>
                <div className="flex-1 max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por código o nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre del Curso</TableHead>
                      <TableHead className="text-center">Demanda Predicha</TableHead>
                      <TableHead className="text-center">Nivel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPredictions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          {searchTerm 
                            ? `No se encontraron cursos que coincidan con "${searchTerm}"`
                            : 'No hay cursos disponibles'
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPredictions.map((pred, idx) => {
                      const badge = getDemandaBadge(pred.demanda_predicha);
                      const Icon = badge.icon;
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{pred.codigo_curso}</TableCell>
                          <TableCell>{pred.nombre_curso}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-xl font-bold">{pred.demanda_predicha}</span>
                              <span className="text-xs text-muted-foreground">estudiantes</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={badge.variant}>
                              <Icon className="h-3 w-3 mr-1" />
                              {badge.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    }))
                    }
                  </TableBody>
                </Table>
              </div>

              {/* Leyenda */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Interpretación de Niveles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="destructive">Muy Alta (≥80)</Badge>
                    <span className="text-muted-foreground">Curso con alta demanda, inscríbete temprano</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="default">Alta (60-79)</Badge>
                    <span className="text-muted-foreground">Curso popular, considera inscribirte pronto</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">Media (40-59)</Badge>
                    <span className="text-muted-foreground">Curso con demanda moderada</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">Baja (&lt;40)</Badge>
                    <span className="text-muted-foreground">Curso con baja demanda, amplia disponibilidad</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
