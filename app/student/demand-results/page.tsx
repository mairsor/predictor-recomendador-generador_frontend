'use client';

import { useState, useEffect } from 'react';
import { predictorService, ResultFile } from '@/services/predictorService';
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
  FileText,
  Download,
  RefreshCw,
  AlertCircle,
  Calendar,
  HardDrive,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function StudentResultsPage() {
  const [results, setResults] = useState<ResultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDownload = (filename: string) => {
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
          <h1 className="text-3xl font-bold">Archivos de Resultados</h1>
          <p className="text-muted-foreground mt-2">
            Descarga los archivos CSV con las predicciones históricas
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
          Puedes descargar los archivos de predicciones en formato CSV para analizarlos 
          con herramientas externas como Excel o Google Sheets.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
              <CardTitle className="text-sm font-medium">Tamaño Total</CardTitle>
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
          <CardTitle>Archivos Disponibles</CardTitle>
          <CardDescription>
            Lista de archivos CSV con predicciones que puedes descargar
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
              <p className="text-sm mt-2">Los archivos aparecerán cuando se generen predicciones</p>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(result.filename)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Ayuda sobre el formato CSV */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Sobre los archivos CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Los archivos CSV (valores separados por comas) contienen las predicciones de demanda 
            para cada curso. Puedes abrirlos con:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Microsoft Excel</li>
            <li>Google Sheets</li>
            <li>LibreOffice Calc</li>
            <li>Cualquier editor de texto</li>
          </ul>
          <p className="mt-3">
            Cada fila representa un curso con su código, nombre y demanda predicha.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
