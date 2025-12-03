'use client';

import { useState, useEffect } from 'react';
import backendService, { Curso, CreateCursoDto } from '@/services/backendService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  Clock,
  Award,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function CourseTable() {
  const [courses, setCourses] = useState<Curso[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<CreateCursoDto>({
    codigo: '',
    nombre: '',
    creditos: 0,
    ht: 0,
    hp: 0,
    hl: 0,
    ciclo: 1,
    tipo: 'O',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = courses.filter(
        (course) =>
          course.codigo.toLowerCase().includes(searchLower) ||
          course.nombre.toLowerCase().includes(searchLower)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Cargando cursos...');
      const response = await backendService.cursos.findAll();
      console.log('Respuesta del servidor:', response);
      
      // El backend devuelve {data: [...], currentPage, pageCount, etc}
      // o directamente un array
      let coursesData: Curso[] = [];
      if (Array.isArray(response)) {
        coursesData = response;
      } else if (response && Array.isArray(response.data)) {
        coursesData = response.data;
      }
      
      console.log('Cursos procesados:', coursesData.length);
      setCourses(coursesData);
      setFilteredCourses(coursesData);
    } catch (err: any) {
      console.error('Error cargando cursos:', err);
      console.error('Detalles del error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      const errorMessage = err.response?.status === 401 
        ? 'No autorizado. Por favor, inicia sesión nuevamente.'
        : err.response?.data?.message || 'Error al cargar los cursos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentCourse(null);
    setFormData({
      codigo: '',
      nombre: '',
      creditos: 0,
      ht: 0,
      hp: 0,
      hl: 0,
      ciclo: 1,
      tipo: 'O',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Curso) => {
    setCurrentCourse(course);
    setFormData({
      codigo: course.codigo,
      nombre: course.nombre,
      creditos: course.creditos,
      ht: course.ht,
      hp: course.hp,
      hl: course.hl,
      ciclo: course.ciclo,
      tipo: course.tipo,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (course: Curso) => {
    setCurrentCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (currentCourse) {
        await backendService.cursos.update(currentCourse.id, formData);
        setSuccess('Curso actualizado exitosamente');
      } else {
        await backendService.cursos.create(formData);
        setSuccess('Curso creado exitosamente');
      }
      setIsModalOpen(false);
      await loadCourses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error guardando curso:', err);
      setError(err.response?.data?.message || 'Error al guardar el curso');
    }
  };

  const handleDelete = async () => {
    if (!currentCourse) return;

    try {
      setError('');
      await backendService.cursos.remove(currentCourse.id);
      setSuccess('Curso eliminado exitosamente');
      setIsDeleteModalOpen(false);
      await loadCourses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error eliminando curso:', err);
      setError(err.response?.data?.message || 'Error al eliminar el curso');
      setIsDeleteModalOpen(false);
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    return tipo === 'O' ? 'default' : 'secondary';
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === 'O' ? 'Obligatorio' : 'Electivo';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  console.log('Estado antes de renderizar:', { courses: courses.length, filteredCourses: filteredCourses.length, loading, error });

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obligatorios</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.tipo === 'O').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Electivos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.tipo === 'E').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + c.creditos, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Cursos</CardTitle>
          <CardDescription>
            Gestiona el catálogo general de cursos de la universidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">Créditos</TableHead>
                <TableHead className="text-center">Ciclo</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center">H. Teoría</TableHead>
                <TableHead className="text-center">H. Práctica</TableHead>
                <TableHead className="text-center">H. Laboratorio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No se encontraron cursos
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.codigo}</TableCell>
                    <TableCell>{course.nombre}</TableCell>
                    <TableCell className="text-center">{course.creditos}</TableCell>
                    <TableCell className="text-center">{course.ciclo}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getTipoBadgeColor(course.tipo)}>
                        {getTipoLabel(course.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{course.ht}</TableCell>
                    <TableCell className="text-center">{course.hp}</TableCell>
                    <TableCell className="text-center">{course.hl}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(course)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDeleteModal(course)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
            </DialogTitle>
            <DialogDescription>
              {currentCourse
                ? 'Modifica los datos del curso'
                : 'Completa los datos para crear un nuevo curso'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) =>
                      setFormData({ ...formData, codigo: e.target.value })
                    }
                    placeholder="CB-111"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciclo">Ciclo *</Label>
                  <Input
                    id="ciclo"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.ciclo}
                    onChange={(e) =>
                      setFormData({ ...formData, ciclo: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Curso *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Introducción a la Programación"
                  required
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditos">Créditos *</Label>
                  <Input
                    id="creditos"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.creditos}
                    onChange={(e) =>
                      setFormData({ ...formData, creditos: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ht">H. Teoría *</Label>
                  <Input
                    id="ht"
                    type="number"
                    min="0"
                    value={formData.ht}
                    onChange={(e) =>
                      setFormData({ ...formData, ht: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hp">H. Práctica *</Label>
                  <Input
                    id="hp"
                    type="number"
                    min="0"
                    value={formData.hp}
                    onChange={(e) =>
                      setFormData({ ...formData, hp: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hl">H. Laboratorio *</Label>
                  <Input
                    id="hl"
                    type="number"
                    min="0"
                    value={formData.hl}
                    onChange={(e) =>
                      setFormData({ ...formData, hl: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Curso *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O">Obligatorio</SelectItem>
                    <SelectItem value="E">Electivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {currentCourse ? 'Guardar Cambios' : 'Crear Curso'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el curso{' '}
              <strong>{currentCourse?.codigo} - {currentCourse?.nombre}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
