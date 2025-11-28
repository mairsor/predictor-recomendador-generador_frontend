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
  Download,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Calendar,
  HardDrive,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function ResultsPage() {
  const [results, setResults] = useState<ResultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal state
  const [selectedResult, setSelectedResult] = useState<ResultFile | null>(null);
  const [resultContent, setResultContent] = useState<ResultContent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await predictorService.listResults();
      setResults(response.files);
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

  const handleDeleteClick = (result: ResultFile) => {
    setSelectedResult(result);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedResult) return;

    try {
      setError('');
      await predictorService.deleteResult(selectedResult.filename);
      setSuccess(`Archivo ${selectedResult.filename} eliminado exitosamente`);
      setIsDeleteModalOpen(false);
      await loadResults();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error eliminando archivo:', err);
      setError(err.response?.data?.detail || 'Error al eliminar el archivo');
      setIsDeleteModalOpen(false);
    }
  };

  const handleDownload = (filename: string) => {
    // Descargar archivo desde el servidor
    const predictorUrl = process.env.NEXT_PUBLIC_PREDICTOR_URL || 'http://localhost:8000';
    const url = `${predictorUrl}/api/v1/results/${filename}/download`;
    window.open(url, '_blank');
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
          <h1 className="text-3xl font-bold">Resultados de Predicciones</h1>
          <p className="text-muted-foreground mt-2">
            Historial de archivos CSV de predicciones generados
          </p>
        </div>
        <Button onClick={loadResults} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
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

      {/* Estadísticas */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Archivos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predicciones Totales</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results?.reduce((sum, r) => sum + r.rows, 0) || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espacio Usado</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((results?.reduce((sum, r) => sum + r.size_bytes, 0) || 0) / 1024 / 1024).toFixed(2)} MB
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Archivos de Resultados</CardTitle>
          <CardDescription>
            Lista de todos los archivos CSV generados por el predictor
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
              <p>No hay archivos de resultados disponibles</p>
              <p className="text-sm mt-2">Ejecuta una predicción para generar resultados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archivo</TableHead>
                  <TableHead className="text-center">Registros</TableHead>
                  <TableHead className="text-center">Tamaño</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
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
                    <TableCell className="text-center">{result.size_human}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(result.created_date)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewResult(result)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(result.filename)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(result)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contenido del Archivo</DialogTitle>
            <DialogDescription>
              {selectedResult?.filename}
            </DialogDescription>
          </DialogHeader>
          
          {loadingContent ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : resultContent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{resultContent.rows || 0} registros</span>
                <span>{resultContent.columns?.length || 0} columnas</span>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Demanda</TableHead>
                      <TableHead className="text-center">Modelo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultContent.data?.slice(0, 50).map((pred, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{pred.codigo_curso}</TableCell>
                        <TableCell>{pred.nombre_curso}</TableCell>
                        <TableCell className="text-center font-bold">
                          {pred.demanda_predicha}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{pred.modelo_usado}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {resultContent.rows > 50 && (
                <p className="text-sm text-center text-muted-foreground">
                  Mostrando 50 de {resultContent.rows} registros
                </p>
              )}
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

      {/* Modal Confirmar Eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el archivo{' '}
              <strong>{selectedResult?.filename}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
