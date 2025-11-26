'use client';

import { useState } from 'react';
import { backendService, type Matricula, type CreateMatriculaDto } from '@/services';

export function useMatriculas() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await backendService.matriculas.findAll();
      setMatriculas(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener matrículas');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchOne = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await backendService.matriculas.findOne(id);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener matrícula');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreateMatriculaDto) => {
    setLoading(true);
    setError(null);
    try {
      const newMatricula = await backendService.matriculas.create(data);
      setMatriculas((prev) => [...prev, newMatricula]);
      return newMatricula;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al crear matrícula');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, data: Partial<CreateMatriculaDto>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await backendService.matriculas.update(id, data);
      setMatriculas((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar matrícula');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await backendService.matriculas.remove(id);
      setMatriculas((prev) => prev.filter((m) => m.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar matrícula');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    matriculas,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    loading,
    error,
  };
}
