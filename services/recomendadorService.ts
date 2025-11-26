import { recomendadorApi } from './api';

export interface RecommendationRequest {
  student_id: string;
  top_n?: number;
  filters?: {
    semester?: number;
    difficulty_level?: string;
    schedule_preference?: string;
  };
}

export interface CourseRecommendation {
  curso_id: string;
  curso_nombre: string;
  score: number;
  reason?: string;
  similarity?: number;
}

export interface RecommendationResponse {
  student_id: string;
  recommendations: CourseRecommendation[];
  metadata?: {
    algorithm: string;
    total_recommendations: number;
    timestamp: string;
  };
}

export const recomendadorService = {
  /**
   * Obtener recomendaciones para un estudiante
   */
  async getRecommendations(
    request: RecommendationRequest
  ): Promise<RecommendationResponse> {
    const response = await recomendadorApi.post('/api/recommend', request);
    return response.data;
  },

  /**
   * Obtener recomendaciones basadas en collaborative filtering
   */
  async getCollaborativeRecommendations(studentId: string, topN = 10) {
    const response = await recomendadorApi.get(
      `/api/recommend/collaborative/${studentId}`,
      {
        params: { top_n: topN },
      }
    );
    return response.data;
  },

  /**
   * Obtener recomendaciones basadas en content-based filtering
   */
  async getContentBasedRecommendations(studentId: string, topN = 10) {
    const response = await recomendadorApi.get(
      `/api/recommend/content/${studentId}`,
      {
        params: { top_n: topN },
      }
    );
    return response.data;
  },

  /**
   * Obtener recomendaciones híbridas
   */
  async getHybridRecommendations(studentId: string, topN = 10) {
    const response = await recomendadorApi.get(
      `/api/recommend/hybrid/${studentId}`,
      {
        params: { top_n: topN },
      }
    );
    return response.data;
  },

  /**
   * Entrenar modelo de recomendaciones
   */
  async trainModel() {
    const response = await recomendadorApi.post('/api/train');
    return response.data;
  },

  /**
   * Obtener cursos similares
   */
  async getSimilarCourses(courseId: string, topN = 5) {
    const response = await recomendadorApi.get(
      `/api/courses/${courseId}/similar`,
      {
        params: { top_n: topN },
      }
    );
    return response.data;
  },

  /**
   * Healthcheck del servicio
   */
  async healthCheck() {
    const response = await recomendadorApi.get('/api/health');
    return response.data;
  },

  /**
   * Obtener estadísticas del recomendador
   */
  async getStats() {
    const response = await recomendadorApi.get('/api/stats');
    return response.data;
  },
};

export default recomendadorService;
