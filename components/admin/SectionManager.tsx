'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Upload, Search, AlertCircle } from 'lucide-react';
import backendService, { CursoOfertado, Curso, Profesor } from '@/services/backendService';

interface CursoOfertadoWithDetails extends CursoOfertado {
  curso?: Curso;
  profesor?: Profesor;
}

export default function SectionManager() {
  const [sections, setSections] = useState<CursoOfertadoWithDetails[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemestre, setFilterSemestre] = useState<string>('all');
  
  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState<CursoOfertadoWithDetails | null>(null);
  const [formData, setFormData] = useState({
    cursoId: 0,
    profesorId: 0,
    semestre: '',
    seccion: 'M',
    vacantes: 30,
    horario: '',
    aula: '',
  });
  
  // CSV Upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ created: number; errors: any[] } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando carga de datos...');
      
      let sectionsData = [];
      let cursosData = [];
      let profesoresData = [];
      
      // Load sections with curso and profesor included from backend
      try {
        sectionsData = await backendService.ofertado.findAll();
        console.log('Sections data recibida:', sectionsData);
      } catch (err) {
        console.error('Error cargando secciones:', err);
      }
      
      // Load cursos for the form dropdowns
      try {
        const cursosResponse = await backendService.cursos.findAll();
        console.log('Cursos response recibida:', cursosResponse);
        cursosData = Array.isArray(cursosResponse) ? cursosResponse : (cursosResponse.data || []);
      } catch (err) {
        console.error('Error cargando cursos:', err);
      }
      
      // Load profesores for the form dropdowns
      try {
        const profesoresResponse = await backendService.profesores.findAll();
        console.log('Profesores response recibida:', profesoresResponse);
        profesoresData = Array.isArray(profesoresResponse) ? profesoresResponse : (profesoresResponse.data || []);
      } catch (err) {
        console.error('Error cargando profesores:', err);
      }
      
      // Sections already come with curso and profesor included from backend
      setSections(sectionsData);
      setCursos(cursosData);
      setProfesores(profesoresData);
    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError(err.response?.data?.message || err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setCurrentSection(null);
    setFormData({
      cursoId: 0,
      profesorId: 0,
      semestre: '',
      seccion: 'M',
      vacantes: 30,
      horario: '',
      aula: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (section: CursoOfertadoWithDetails) => {
    setIsEditing(true);
    setCurrentSection(section);
    setFormData({
      cursoId: section.cursoId,
      profesorId: section.profesorId,
      semestre: section.semestre,
      seccion: section.seccion,
      vacantes: section.vacantes,
      horario: section.horario,
      aula: section.aula,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && currentSection) {
        await backendService.ofertado.update(currentSection.id, formData);
      } else {
        await backendService.ofertado.create(formData);
      }
      
      setIsDialogOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la sección');
      console.error('Error saving section:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return;
    
    try {
      await backendService.ofertado.remove(id);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar la sección');
      console.error('Error deleting section:', err);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return;
    
    try {
      const result = await backendService.ofertado.uploadCSV(csvFile);
      setUploadResult(result);
      setCsvFile(null);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el archivo CSV');
      console.error('Error uploading CSV:', err);
    }
  };

  const filteredSections = sections.filter((section) => {
    const matchesSearch = 
      section.curso?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.curso?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.profesor?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemestre = filterSemestre === 'all' || section.semestre === filterSemestre;
    
    return matchesSearch && matchesSemestre;
  });

  const semestresList = Array.from(new Set(sections.map((s) => s.semestre))).sort().reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando secciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Cargar CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cargar Secciones desde CSV</DialogTitle>
                <DialogDescription>
                  El archivo CSV debe tener las columnas: codigo_curso, codigo_profesor, semestre, seccion, vacantes, horario, aula
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Archivo CSV</Label>
                  <Input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                </div>
                {uploadResult && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Creados: {uploadResult.created}
                      {uploadResult.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="font-semibold">Errores:</p>
                          {uploadResult.errors.map((err, idx) => (
                            <p key={idx} className="text-sm text-destructive">
                              {JSON.stringify(err)}
                            </p>
                          ))}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleCSVUpload} disabled={!csvFile}>
                  Cargar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Sección
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, nombre de curso o profesor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={filterSemestre} onValueChange={setFilterSemestre}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los semestres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los semestres</SelectItem>
                  {semestresList.map((sem) => (
                    <SelectItem key={sem} value={sem}>
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Secciones ({filteredSections.length})</CardTitle>
          <CardDescription>
            Lista de todas las secciones de cursos ofertados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Vacantes</TableHead>
                <TableHead>Ocupación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No se encontraron secciones
                  </TableCell>
                </TableRow>
              ) : (
                filteredSections.map((section) => {
                  const ocupacion = section.cupos_disponibles > 0 
                    ? Math.round(((section.alumnos_matriculados || 0) / section.cupos_disponibles) * 100)
                    : 0;
                  
                  return (
                    <TableRow key={section.id}>
                      <TableCell className="font-mono">{section.curso?.codigo}</TableCell>
                      <TableCell className="font-medium">{section.curso?.nombre}</TableCell>
                      <TableCell>{section.profesor?.nombre || 'Sin asignar'}</TableCell>
                      <TableCell>{section.semestre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{section.codigo_seccion}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{section.turno}</TableCell>
                      <TableCell>{section.cupos_disponibles}</TableCell>
                      <TableCell>
                        <Badge variant={ocupacion > 80 ? 'destructive' : 'default'}>
                          {ocupacion}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(section)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(section.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Sección' : 'Nueva Sección'}
            </DialogTitle>
            <DialogDescription>
              Completa los datos de la sección del curso
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Curso *</Label>
              <Select
                value={formData.cursoId.toString()}
                onValueChange={(value) => setFormData({ ...formData, cursoId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso.id} value={curso.id.toString()}>
                      {curso.codigo} - {curso.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Profesor *</Label>
              <Select
                value={formData.profesorId.toString()}
                onValueChange={(value) => setFormData({ ...formData, profesorId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un profesor" />
                </SelectTrigger>
                <SelectContent>
                  {profesores.map((profesor) => (
                    <SelectItem key={profesor.id} value={profesor.id.toString()}>
                      {profesor.codigo} - {profesor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Semestre *</Label>
              <Input
                placeholder="Ej: 2024-1"
                value={formData.semestre}
                onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sección *</Label>
              <Input
                placeholder="M"
                maxLength={1}
                value={formData.seccion}
                onChange={(e) => setFormData({ ...formData, seccion: e.target.value.toUpperCase() })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Vacantes *</Label>
              <Input
                type="number"
                min={1}
                value={formData.vacantes}
                onChange={(e) => setFormData({ ...formData, vacantes: parseInt(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Horario *</Label>
              <Input
                placeholder="Ej: Lun-Mie 10:00-12:00"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label>Aula</Label>
              <Input
                placeholder="Ej: A-301"
                value={formData.aula}
                onChange={(e) => setFormData({ ...formData, aula: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Guardar Cambios' : 'Crear Sección'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
