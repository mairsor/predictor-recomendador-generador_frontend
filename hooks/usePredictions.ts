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

  const listResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictorService.listResults();
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener resultados');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictorService.listModels();
      return result;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener modelos');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    predict,
    listResults,
    listModels,
    loading,
    error,
  };
}
