import axios from 'axios';

// Base URL del servicio de recomendación
const RECOMMENDER_API_URL = process.env.NEXT_PUBLIC_RECOMENDADOR_URL || 'http://localhost:8001';

const recommenderApi = axios.create({
  baseURL: RECOMMENDER_API_URL,
  timeout: 30000, // 30 segundos para recomendaciones
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== TIPOS ====================

export interface CourseRecommendation {
  course_code: string;
  course_name: string;
  score: number;
  lineas_carrera: string[];
  is_failed: boolean;
  is_obligatory: boolean;
  priority: number;
  reasons: {
    content_similarity: number;
    collaborative_score: number;
    lineas_performance: number;
    kg_neighbors: [string, string][];
    prerequisites: string[];
    prerequisites_met: boolean;
  };
}

export interface StudentHistory {
  student_id: string;
  all_courses: string[];
  passed_courses: string[];
  grades: Record<string, number>;
  by_cycle: Record<string, Array<{ course_code: string; grade: number }>>;
}

export interface StudentPerformance {
  pass_rate: number;
  avg_grade: number;
  best_linea: [string, number];
  worst_linea: [string, number];
  lineas_performance: Record<string, number>;
}

export interface CurriculumProgress {
  progress_percentage: number;
  obligatory_passed: number;
  obligatory_failed: number;
  obligatory_pending: number;
  failed_list: string[];
}

export interface StudentInfo {
  student_id: string;
  history: {
    total_courses: number;
    passed_courses: number;
    courses: string[];
  };
  performance: StudentPerformance;
  curriculum_progress: CurriculumProgress;
}

export interface CourseInfo {
  course_code: string;
  course_name: string;
  prereq_codes: string[];
  lineas_carrera: string[];
  statistics?: {
    num_students: number;
    avg_grade: number;
    pass_rate: number;
    difficulty: string;
  };
  related_courses?: Array<{
    course_code: string;
    relation: string;
  }>;
}

export interface SystemStats {
  system: {
    total_students: number;
    total_courses: number;
    total_records: number;
    total_lineas: number;
    lineas: string[];
  };
  models: {
    kg_embeddings: number;
    kg_nodes: number;
    kg_edges: number;
    cf_factors: number;
    embedding_dim: number;
  };
  data_quality: {
    valid: boolean;
    issues: string[];
    warnings: string[];
  };
}

export interface LineasInfo {
  lineas: string[];
  total: number;
  courses_per_linea: Record<string, number>;
}

// ==================== SERVICIO ====================

const recommenderService = {
  // Health check
  async health(): Promise<{ status: string; models_loaded: boolean; version: string }> {
    const response = await recommenderApi.get('/api/health');
    return response.data;
  },

  // Estudiantes
  students: {
    async list(page = 1, perPage = 50): Promise<{
      students: string[];
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    }> {
      const response = await recommenderApi.get('/api/students', {
        params: { page, per_page: perPage },
      });
      return response.data;
    },

    async getInfo(studentId: string): Promise<StudentInfo> {
      const response = await recommenderApi.get(`/api/students/${studentId}`);
      return response.data;
    },

    async getHistory(studentId: string): Promise<StudentHistory> {
      const response = await recommenderApi.get(`/api/students/${studentId}/history`);
      return response.data;
    },

    async getRecommendations(studentId: string, topK = 10): Promise<{
      student_id: string;
      top_k: number;
      recommendations: CourseRecommendation[];
    }> {
      const response = await recommenderApi.get(`/api/students/${studentId}/recommendations`, {
        params: { top_k: topK },
      });
      return response.data;
    },
  },

  // Cursos
  courses: {
    async list(params?: { page?: number; per_page?: number; linea?: string }): Promise<{
      courses: CourseInfo[];
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    }> {
      const response = await recommenderApi.get('/api/courses', { params });
      return response.data;
    },

    async getInfo(courseCode: string): Promise<CourseInfo> {
      const response = await recommenderApi.get(`/api/courses/${courseCode}`);
      return response.data;
    },

    async getStudents(courseCode: string): Promise<{
      course_code: string;
      students: string[];
      total: number;
    }> {
      const response = await recommenderApi.get(`/api/courses/${courseCode}/students`);
      return response.data;
    },
  },

  // Recomendación personalizada con POST
  async recommend(studentId: string, topK = 10): Promise<{
    student_id: string;
    recommendations: CourseRecommendation[];
  }> {
    const response = await recommenderApi.post('/api/recommend', {
      student_id: studentId,
      top_k: topK,
    });
    return response.data;
  },

  // Estadísticas
  async getStats(): Promise<SystemStats> {
    const response = await recommenderApi.get('/api/stats');
    return response.data;
  },

  // Líneas de carrera
  async getLineas(): Promise<LineasInfo> {
    const response = await recommenderApi.get('/api/lineas');
    return response.data;
  },
};

export default recommenderService;
