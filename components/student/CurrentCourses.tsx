'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User } from 'lucide-react';

interface Course {
  curso_codigo: string;
  curso_nombre: string;
  creditos: number;
  profesor: string;
  seccion: string;
  turno: string;
  estado: string;
}

interface CurrentCoursesProps {
  courses: Course[];
  semestre: string;
  totalCreditos: number;
}

export default function CurrentCourses({
  courses,
  semestre,
  totalCreditos,
}: CurrentCoursesProps) {
  const getEstadoBadge = (estado: string) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower.includes('matriculado')) {
      return <Badge variant="default">En Curso</Badge>;
    } else if (estadoLower.includes('aprobado')) {
      return <Badge className="bg-green-600">Aprobado</Badge>;
    } else if (estadoLower.includes('desaprobado')) {
      return <Badge variant="destructive">Desaprobado</Badge>;
    }
    return <Badge variant="secondary">{estado}</Badge>;
  };

  const getTurnoLabel = (turno: string) => {
    const turnoMap: Record<string, string> = {
      M: 'Mañana',
      T: 'Tarde',
      N: 'Noche',
    };
    return turnoMap[turno] || turno;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Cursos Actuales - {semestre}
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {totalCreditos} créditos
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No hay cursos matriculados en este semestre</p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {course.curso_codigo}
                      </h3>
                      {getEstadoBadge(course.estado)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.curso_nombre}
                    </p>
                  </div>
                  <Badge variant="secondary">{course.creditos} créditos</Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{course.profesor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{getTurnoLabel(course.turno)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>Sección {course.seccion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
