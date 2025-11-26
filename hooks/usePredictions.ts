'use client';

import { useState } from 'react';
import { predictorService, type PredictionRequest, type PredictionResponse } from '@/services';

export function usePredictions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (request: PredictionRequest): Promise<PredictionResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictorService.predict(request);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al realizar predicción');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictorService.getHistory(limit);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener historial');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const compareModels = async (courseIds?: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictorService.compareModels(courseIds);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al comparar modelos');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    predict,
    getHistory,
    compareModels,
    loading,
    error,
  };
}
