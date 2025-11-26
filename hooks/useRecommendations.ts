'use client';

import { useState } from 'react';
import { recomendadorService, type RecommendationRequest, type RecommendationResponse } from '@/services';

export function useRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (
    request: RecommendationRequest
  ): Promise<RecommendationResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await recomendadorService.getRecommendations(request);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener recomendaciones');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCollaborativeRecommendations = async (studentId: string, topN = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recomendadorService.getCollaborativeRecommendations(studentId, topN);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener recomendaciones colaborativas');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getContentBasedRecommendations = async (studentId: string, topN = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recomendadorService.getContentBasedRecommendations(studentId, topN);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener recomendaciones por contenido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getHybridRecommendations = async (studentId: string, topN = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recomendadorService.getHybridRecommendations(studentId, topN);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener recomendaciones híbridas');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSimilarCourses = async (courseId: string, topN = 5) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recomendadorService.getSimilarCourses(courseId, topN);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener cursos similares');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getRecommendations,
    getCollaborativeRecommendations,
    getContentBasedRecommendations,
    getHybridRecommendations,
    getSimilarCourses,
    loading,
    error,
  };
}
