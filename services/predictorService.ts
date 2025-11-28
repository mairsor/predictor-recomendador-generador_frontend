/**
 * Servicio para comunicación con la API del Predictor de Demanda
 * Puerto: 8000
 * Base URL: Configurable via NEXT_PUBLIC_PREDICTOR_URL
 */

import axios from 'axios';

const PREDICTOR_API_URL = process.env.NEXT_PUBLIC_PREDICTOR_URL || 'http://localhost:8000';

const predictorApi = axios.create({
  baseURL: PREDICTOR_API_URL,
  timeout: 60000, // 60 segundos para operaciones ML
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== INTERFACES ====================

export interface PredictionRequest {
  scope: 'single' | 'multiple' | 'all';
  model_type: 'auto' | 'general' | 'specific';
  course_code?: string;
  course_codes?: string[];
}

export interface CoursePrediction {
  codigo_curso: string;
  nombre_curso: string;
  demanda_predicha: number;
  modelo_usado: string;
  confianza?: number;
}

export interface PredictionResponse {
  success: boolean;
  message: string;
  output_file: string;
  courses_processed: number;
  predictions: CoursePrediction[];
  metadata: {
    timestamp: string;
    execution_time_seconds: number;
    model_type: string;
    scope: string;
  };
}

export interface ResultFile {
  filename: string;
  size_bytes: number;
  size_human: string;
  created_date: string;
  modified_date: string;
  rows: number;
}

export interface ResultsListResponse {
  success: boolean;
  count: number;
  files: ResultFile[];
  total_size_bytes: number;
  total_size_human: string;
}

export interface ResultContent {
  success: boolean;
  filename: string;
  rows: number;
  columns: string[];
  data: CoursePrediction[];
}

export interface ModelInfo {
  filename: string;
  type: string;
  course_code?: string;
  size_bytes: number;
  size_human: string;
  created_date: string;
  modified_date: string;
}

export interface ModelsListResponse {
  success: boolean;
  count: number;
  models: ModelInfo[];
  breakdown: {
    general: number;
    specific: number;
  };
  total_size_bytes: number;
  total_size_human: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  deleted_count?: number;
}

// ==================== SERVICIO ====================

export const predictorService = {
  // ========== PREDICCIONES ==========
  
  /**
   * Realizar predicción de demanda
   */
  async predict(request: PredictionRequest): Promise<PredictionResponse> {
    const response = await predictorApi.post('/api/v1/predictions', request);
    return response.data;
  },

  /**
   * Predicción rápida para un solo curso
   */
  async quickPredict(courseCode: string): Promise<PredictionResponse> {
    const response = await predictorApi.post(`/api/v1/predictions/quick/${courseCode}`);
    return response.data;
  },

  /**
   * Predicción para todos los cursos
   */
  async predictAll(modelType: 'auto' | 'general' | 'specific' = 'auto'): Promise<PredictionResponse> {
    return this.predict({
      scope: 'all',
      model_type: modelType,
    });
  },

  /**
   * Predicción para múltiples cursos
   */
  async predictMultiple(
    courseCodes: string[],
    modelType: 'auto' | 'general' | 'specific' = 'auto'
  ): Promise<PredictionResponse> {
    return this.predict({
      scope: 'multiple',
      model_type: modelType,
      course_codes: courseCodes,
    });
  },

  // ========== RESULTADOS ==========

  /**
   * Listar todos los archivos de resultados
   */
  async listResults(): Promise<ResultsListResponse> {
    const response = await predictorApi.get('/api/v1/results');
    return response.data;
  },

  /**
   * Obtener contenido de un archivo de resultados
   */
  async getResultContent(filename: string): Promise<ResultContent> {
    const response = await predictorApi.get(`/api/v1/results/${filename}`);
    return response.data;
  },

  /**
   * Eliminar un archivo de resultados
   */
  async deleteResult(filename: string): Promise<DeleteResponse> {
    const response = await predictorApi.delete(`/api/v1/results/${filename}`);
    return response.data;
  },

  /**
   * Eliminar múltiples archivos de resultados
   */
  async deleteMultipleResults(filenames: string[]): Promise<DeleteResponse> {
    const response = await predictorApi.delete('/api/v1/results', {
      data: { filenames }
    });
    return response.data;
  },

  /**
   * Eliminar todos los archivos de resultados
   */
  async deleteAllResults(): Promise<DeleteResponse> {
    const response = await predictorApi.delete('/api/v1/results/all');
    return response.data;
  },

  // ========== MODELOS ==========

  /**
   * Listar todos los modelos entrenados
   */
  async listModels(): Promise<ModelsListResponse> {
    const response = await predictorApi.get('/api/v1/models');
    return response.data;
  },

  /**
   * Eliminar un modelo específico
   */
  async deleteModel(filename: string): Promise<DeleteResponse> {
    const response = await predictorApi.delete(`/api/v1/models/${filename}`);
    return response.data;
  },

  /**
   * Eliminar modelos por tipo
   */
  async deleteModelsByType(modelType: 'general' | 'specific'): Promise<DeleteResponse> {
    const response = await predictorApi.delete('/api/v1/models', {
      params: { model_type: modelType }
    });
    return response.data;
  },

  /**
   * Eliminar todos los modelos
   */
  async deleteAllModels(): Promise<DeleteResponse> {
    const response = await predictorApi.delete('/api/v1/models/all');
    return response.data;
  },

  // ========== SALUD ==========

  /**
   * Verificar estado del servicio
   */
  async healthCheck(): Promise<any> {
    const response = await predictorApi.get('/health');
    return response.data;
  },
};

export default predictorService;
