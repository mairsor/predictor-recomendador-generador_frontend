'use client';

import { useState, useEffect } from 'react';
import { predictorService, ModelInfo } from '@/services/predictorService';
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
  Brain,
  Trash2,
  RefreshCw,
  AlertCircle,
  Calendar,
  HardDrive,
  CheckCircle2,
  Zap,
  Package,
} from 'lucide-react';

export default function ModelsPage() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [breakdown, setBreakdown] = useState({ general: 0, specific: 0 });
  const [totalSize, setTotalSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal state
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'single' | 'type' | 'all'>('single');
  const [modelTypeToDelete, setModelTypeToDelete] = useState<'general' | 'specific'>('general');

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await predictorService.listModels();
      setModels(response.models);
      setBreakdown(response.breakdown);
      setTotalSize(response.total_size_human);
    } catch (err: any) {
      console.error('Error cargando modelos:', err);
      setError(err.response?.data?.detail || 'Error al cargar los modelos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (model: ModelInfo) => {
    setSelectedModel(model);
    setDeleteType('single');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTypeClick = (type: 'general' | 'specific') => {
    setModelTypeToDelete(type);
    setDeleteType('type');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAllClick = () => {
    setDeleteType('all');
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setError('');
      let response;

      if (deleteType === 'single' && selectedModel) {
        response = await predictorService.deleteModel(selectedModel.filename);
        setSuccess(`Modelo ${selectedModel.filename} eliminado exitosamente`);
      } else if (deleteType === 'type') {
        response = await predictorService.deleteModelsByType(modelTypeToDelete);
        setSuccess(`Modelos ${modelTypeToDelete === 'general' ? 'generales' : 'específicos'} eliminados exitosamente`);
      } else if (deleteType === 'all') {
        response = await predictorService.deleteAllModels();
        setSuccess('Todos los modelos eliminados exitosamente');
      }

      setIsDeleteModalOpen(false);
      await loadModels();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error eliminando modelos:', err);
      setError(err.response?.data?.detail || 'Error al eliminar modelos');
      setIsDeleteModalOpen(false);
    }
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

  const getModelTypeBadge = (type: string) => {
    return type === 'general' 
      ? { variant: 'default' as const, label: 'General', icon: Zap }
      : { variant: 'secondary' as const, label: 'Específico', icon: Package };
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
          <h1 className="text-3xl font-bold">Modelos de Machine Learning</h1>
          <p className="text-muted-foreground mt-2">
            Gestión de modelos entrenados para predicción de demanda
          </p>
        </div>
        <Button onClick={loadModels} variant="outline">
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
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Modelos</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{models?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modelos Generales</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breakdown?.general || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modelos Específicos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breakdown?.specific || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espacio Usado</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSize || '0 B'}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Acciones Masivas */}
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={() => handleDeleteTypeClick('general')}
          disabled={!breakdown || breakdown.general === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar Generales
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDeleteTypeClick('specific')}
          disabled={!breakdown || breakdown.specific === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar Específicos
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteAllClick}
          disabled={models.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar Todos
        </Button>
      </div>

      {/* Tabla de Modelos */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos Entrenados</CardTitle>
          <CardDescription>
            Lista de todos los modelos ML disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : models?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay modelos entrenados disponibles</p>
              <p className="text-sm mt-2">Ejecuta una predicción para entrenar modelos</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archivo</TableHead>
                  <TableHead className="text-center">Tipo</TableHead>
                  <TableHead>Código de Curso</TableHead>
                  <TableHead className="text-center">Tamaño</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models?.map((model) => {
                  const badge = getModelTypeBadge(model.type);
                  const Icon = badge.icon;
                  return (
                    <TableRow key={model.filename}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          {model.filename}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={badge.variant}>
                          <Icon className="h-3 w-3 mr-1" />
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {model.course_code || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{model.size_human}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(model.created_date)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(model)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Confirmar Eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              {deleteType === 'single' && selectedModel && (
                <>
                  ¿Estás seguro de que deseas eliminar el modelo{' '}
                  <strong>{selectedModel.filename}</strong>?
                </>
              )}
              {deleteType === 'type' && (
                <>
                  ¿Estás seguro de que deseas eliminar todos los modelos{' '}
                  <strong>{modelTypeToDelete === 'general' ? 'generales' : 'específicos'}</strong>?
                  {modelTypeToDelete === 'general' 
                    ? ` (${breakdown.general} modelos)`
                    : ` (${breakdown.specific} modelos)`}
                </>
              )}
              {deleteType === 'all' && (
                <>
                  ¿Estás seguro de que deseas eliminar{' '}
                  <strong>TODOS los modelos</strong>? ({models.length} modelos en total)
                </>
              )}
              <br />
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
