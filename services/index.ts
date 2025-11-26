// Exportar todas las APIs y servicios
export { default as api, predictorApi, recomendadorApi } from './api';
export { default as backendService } from './backendService';
export { default as predictorService } from './predictorService';
export { default as recomendadorService } from './recomendadorService';

// Exportar tipos del backend
export type {
  LoginRequest,
  LoginResponse,
  Alumno,
  CreateAlumnoDto,
  UpdateAlumnoDto,
  Profesor,
  CreateProfesorDto,
  Curso,
  CreateCursoDto,
  CursoOfertado,
  CreateCursoOfertadoDto,
  Matricula,
  CreateMatriculaDto,
  Demanda,
  CreateDemandaDto,
  Credito,
  Requisito,
  CreateRequisitoDto,
} from './backendService';

// Exportar tipos del predictor
export type {
  PredictionRequest,
  PredictionResponse,
  PredictionResult,
} from './predictorService';

// Exportar tipos del recomendador
export type {
  RecommendationRequest,
  RecommendationResponse,
  CourseRecommendation,
} from './recomendadorService';
