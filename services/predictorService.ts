import { predictorApi } from './api';

export interface PredictionRequest {
  scope: 'general' | 'specific' | 'auto';
  model_type?: 'random_forest' | 'linear_regression' | 'gradient_boosting';
  specific_courses?: string[];
  auto_mode_config?: {
    min_students?: number;
    prediction_threshold?: number;
    include_history?: boolean;
  };
}

export interface PredictionResult {
  curso_id: string;
  curso_nombre: string;
  prediccion_demanda: number;
  confidence?: number;
  tendencia?: string;
}

export interface PredictionResponse {
  status: string;
  scope: string;
  model_type: string;
  results: PredictionResult[];
  metadata?: {
    total_courses: number;
    execution_time: number;
    timestamp: string;
  };
}

export const predictorService = {
  /**
   * Realizar predicción de demanda
   */
  async predict(request: PredictionRequest): Promise<PredictionResponse> {
    const response = await predictorApi.post('/api/predict', request);
    return response.data;
  },

  /**
   * Obtener historial de predicciones
   */
  async getHistory(limit = 10) {
    const response = await predictorApi.get('/api/predictions/history', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Obtener estadísticas del predictor
   */
  async getStats() {
    const response = await predictorApi.get('/api/stats');
    return response.data;
  },

  /**
   * Healthcheck del servicio
   */
  async healthCheck() {
    const response = await predictorApi.get('/health');
    return response.data;
  },

  /**
   * Obtener modelos disponibles
   */
  async getModels() {
    const response = await predictorApi.get('/api/models');
    return response.data;
  },

  /**
   * Comparar modelos
   */
  async compareModels(courseIds?: string[]) {
    const response = await predictorApi.post('/api/compare-models', {
      course_ids: courseIds,
    });
    return response.data;
  },
};

export default predictorService;
