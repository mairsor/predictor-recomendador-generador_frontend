'use client';

import { useState } from 'react';
import { backendService, type Curso, type CreateCursoDto } from '@/services';

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await backendService.cursos.findAll();
      // El backend devuelve {data: [], currentPage, totalCount, etc}
      const cursosData = Array.isArray(response) ? response : (response as any).data || [];
      setCursos(cursosData);
      return cursosData;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener cursos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchOne = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await backendService.cursos.findOne(id);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener curso');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreateCursoDto) => {
    setLoading(true);
    setError(null);
    try {
      const newCurso = await backendService.cursos.create(data);
      setCursos((prev) => [...prev, newCurso]);
      return newCurso;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al crear curso');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, data: Partial<CreateCursoDto>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await backendService.cursos.update(id, data);
      setCursos((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar curso');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await backendService.cursos.remove(id);
      setCursos((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar curso');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    cursos,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    loading,
    error,
  };
}
