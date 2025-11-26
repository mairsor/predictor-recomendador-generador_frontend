'use client';

import { useState, useEffect } from 'react';
import { backendService, type Alumno, type CreateAlumnoDto, type UpdateAlumnoDto } from '@/services';

export function useAlumnos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async (params?: { page?: number; limit?: number; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await backendService.alumnos.findAll(params);
      // El backend devuelve {data: [], currentPage, totalCount, etc}
      const alumnosData = Array.isArray(response) ? response : (response as any).data || [];
      setAlumnos(alumnosData);
      return alumnosData;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener alumnos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchOne = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await backendService.alumnos.findOne(id);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener alumno');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreateAlumnoDto) => {
    setLoading(true);
    setError(null);
    try {
      const newAlumno = await backendService.alumnos.create(data);
      setAlumnos((prev) => [...prev, newAlumno]);
      return newAlumno;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al crear alumno');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, data: UpdateAlumnoDto) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await backendService.alumnos.update(id, data);
      setAlumnos((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar alumno');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await backendService.alumnos.remove(id);
      setAlumnos((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar alumno');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadBulk = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await backendService.alumnos.uploadBulk(file);
      await fetchAll(); // Recargar lista
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar archivo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    alumnos,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    uploadBulk,
    loading,
    error,
  };
}
