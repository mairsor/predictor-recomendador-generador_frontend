import api from './api';

// ==================== TIPOS ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    rol: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  rol: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  alumno_id?: number;
  profesor_id?: number;
  codigo?: string;
  codigo_profesor?: string;
}

export interface RegisterAdminRequest {
  email: string;
  password: string;
}

export interface RegisterAlumnoRequest {
  email: string;
  password: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  ciclo_relativo: number;
  creditos_aprobados: number;
  promedio: number;
  estado: string;
}

export interface RegisterProfesorRequest {
  email: string;
  password: string;
  nombre: string;
  codigo_profesor: string;
  experiencia_anios: number;
  popularidad: number;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    rol: string;
    alumno?: any;
    profesor?: any;
  };
}

export interface User {
  id: number;
  email: string;
  rol: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  alumno_id?: number;
  profesor_id?: number;
  alumno?: any;
  profesor?: any;
}

export interface UpdateUserDto {
  email?: string;
  rol?: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  alumno_id?: number;
  profesor_id?: number;
}

export interface UpdateProfileDto {
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface DashboardAlumno {
  alumno: any;
  creditos: any;
  estadisticas: any;
  semestre_actual: any;
}

export interface DashboardProfesor {
  profesor: any;
  estadisticas: any;
  semestre_actual: any;
}

export interface DashboardAdmin {
  resumen: any;
  semestre_actual: any;
  estadisticas_matricula: any;
  top_cursos_demanda: any;
  distribucion_ciclos: any;
  rendimiento: any;
}

export interface Alumno {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  facultad: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlumnoDto {
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  facultad: string;
}

export interface UpdateAlumnoDto {
  nombres?: string;
  apellidos?: string;
  email?: string;
  facultad?: string;
}

export interface Profesor {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  departamento: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfesorDto {
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  departamento: string;
}

export interface Curso {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  horasTeoria: number;
  horasPractica: number;
  ciclo: number;
  tipo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCursoDto {
  codigo: string;
  nombre: string;
  creditos: number;
  horasTeoria: number;
  horasPractica: number;
  ciclo: number;
  tipo: string;
}

export interface CursoOfertado {
  id: number;
  cursoId: number;
  profesorId: number;
  semestre: string;
  seccion: string;
  vacantes: number;
  horario: string;
  aula: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCursoOfertadoDto {
  cursoId: number;
  profesorId: number;
  semestre: string;
  seccion: string;
  vacantes: number;
  horario: string;
  aula: string;
}

export interface Matricula {
  id: number;
  alumnoId: number;
  ofertadoId: number;
  semestre: string;
  estado: 'MATRICULADO' | 'RETIRADO' | 'APROBADO' | 'DESAPROBADO';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMatriculaDto {
  alumnoId: number;
  ofertadoId: number;
  semestre: string;
  estado: 'MATRICULADO' | 'RETIRADO' | 'APROBADO' | 'DESAPROBADO';
}

export interface Demanda {
  id: number;
  cursoId: number;
  semestre: string;
  demandaPredicha: number;
  demandaReal?: number;
  modelo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDemandaDto {
  cursoId: number;
  semestre: string;
  demandaPredicha: number;
  demandaReal?: number;
  modelo: string;
}

export interface Credito {
  id: number;
  alumnoId: number;
  semestre: string;
  creditosMatriculados: number;
  creditosAprobados: number;
  createdAt: string;
  updatedAt: string;
}

export interface Requisito {
  id: number;
  cursoId: number;
  requisitoId: number;
  tipo: 'PREREQUISITO' | 'CORREQUISITO';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequisitoDto {
  cursoId: number;
  requisitoId: number;
  tipo: 'PREREQUISITO' | 'CORREQUISITO';
}

// ==================== SERVICIOS ====================

export const backendService = {
  // ========== AUTENTICACIÓN ==========
  auth: {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },

    async logout(): Promise<void> {
      await api.post('/auth/logout');
    },

    // Registrar usuario para alumno/profesor existente
    async register(data: RegisterRequest): Promise<RegisterResponse> {
      const response = await api.post('/auth/register', data);
      return response.data;
    },

    // Registrar admin
    async registerAdmin(data: RegisterAdminRequest): Promise<RegisterResponse> {
      const response = await api.post('/auth/register/admin', data);
      return response.data;
    },

    // Registrar alumno + usuario
    async registerAlumno(data: RegisterAlumnoRequest): Promise<RegisterResponse> {
      const response = await api.post('/auth/register/alumno', data);
      return response.data;
    },

    // Registrar profesor + usuario
    async registerProfesor(data: RegisterProfesorRequest): Promise<RegisterResponse> {
      const response = await api.post('/auth/register/profesor', data);
      return response.data;
    },

    // Obtener perfil del usuario actual
    async getProfile(): Promise<User> {
      const response = await api.get('/auth/profile');
      return response.data;
    },

    // Actualizar perfil del usuario actual
    async updateProfile(data: UpdateProfileDto): Promise<User> {
      const response = await api.patch('/auth/profile', data);
      return response.data;
    },

    // Cambiar contraseña del usuario actual
    async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
      const response = await api.patch('/auth/change-password', data);
      return response.data;
    },
  },

  // ========== GESTIÓN DE USUARIOS (ADMIN) ==========
  users: {
    async findAll(): Promise<User[]> {
      const response = await api.get('/users');
      return response.data;
    },

    async findOne(id: number): Promise<User> {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },

    async update(id: number, data: UpdateUserDto): Promise<User> {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/users/${id}`);
    },
  },

  // ========== DASHBOARD ==========
  dashboard: {
    async getMyDashboard(): Promise<DashboardAlumno | DashboardProfesor | DashboardAdmin> {
      const response = await api.get('/dashboard/me');
      return response.data;
    },

    async getAlumnoDashboard(): Promise<DashboardAlumno> {
      const response = await api.get('/dashboard/alumno');
      return response.data;
    },

    async getProfesorDashboard(): Promise<DashboardProfesor> {
      const response = await api.get('/dashboard/profesor');
      return response.data;
    },

    async getAdminDashboard(): Promise<DashboardAdmin> {
      const response = await api.get('/dashboard/admin');
      return response.data;
    },
  },

  // ========== ALUMNOS ==========
  alumnos: {
    async create(data: CreateAlumnoDto): Promise<Alumno> {
      const response = await api.post('/alumno', data);
      return response.data;
    },

    async findAll(params?: { page?: number; limit?: number; search?: string }): Promise<Alumno[]> {
      const response = await api.get('/alumno', { params });
      return response.data;
    },

    async searchAdvanced(params: {
      codigo?: string;
      nombres?: string;
      apellidos?: string;
      ciclo_relativo?: number;
      estado?: string;
      promedio_min?: number;
      promedio_max?: number;
    }): Promise<{ total: number; alumnos: Alumno[] }> {
      const response = await api.get('/alumno/search/advanced', { params });
      return response.data;
    },

    async findOne(id: number): Promise<Alumno> {
      const response = await api.get(`/alumno/${id}`);
      return response.data;
    },

    async update(id: number, data: UpdateAlumnoDto): Promise<Alumno> {
      const response = await api.patch(`/alumno/${id}`, data);
      return response.data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/alumno/${id}`);
    },

    async uploadBulk(file: File): Promise<{ created: number; errors: any[] }> {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/alumno/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  },

  // ========== PROFESORES ==========
  profesores: {
    async create(data: CreateProfesorDto): Promise<Profesor> {
      const response = await api.post('/profesor', data);
      return response.data;
    },

    async findAll(): Promise<Profesor[]> {
      const response = await api.get('/profesor');
      return response.data;
    },

    async searchAdvanced(params: {
      codigo_profesor?: string;
      nombre?: string;
      experiencia_min?: number;
      experiencia_max?: number;
      popularidad_min?: number;
    }): Promise<{ total: number; profesores: Profesor[] }> {
      const response = await api.get('/profesor/search/advanced', { params });
      return response.data;
    },

    async findOne(id: number): Promise<Profesor> {
      const response = await api.get(`/profesor/${id}`);
      return response.data;
    },

    async update(id: number, data: Partial<CreateProfesorDto>): Promise<Profesor> {
      const response = await api.patch(`/profesor/${id}`, data);
      return response.data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/profesor/${id}`);
    },
  },

  // ========== CURSOS ==========
  cursos: {
    async create(data: CreateCursoDto): Promise<Curso> {
      const response = await api.post('/curso', data);
      return response.data;
    },

    async findAll(): Promise<Curso[]> {
      const response = await api.get('/curso');
      return response.data;
    },

    async findOne(id: number): Promise<Curso> {
      const response = await api.get(`/curso/${id}`);
      return response.data;
    },

    async update(id: number, data: Partial<CreateCursoDto>): Promise<Curso> {
      const response = await api.patch(`/curso/${id}`, data);
      return response.data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/curso/${id}`);
    },
  },

  // ========== CURSOS OFERTADOS ==========
  ofertados: {
    async create(data: CreateCursoOfertadoDto): Promise<CursoOfertado> {
      const response = await api.post('/ofertado', data);
      return response.data;
    },

    async findAll(): Promise<CursoOfertado[]> {
      const response = await api.get('/ofertado');
      return response.data;
    },

    async findOne(id: number): Promise<CursoOfertado> {
      const response = await api.get(`/ofertado/${id}`);
      return response.data;
    },

    async update(id: number, data: Partial<CreateCursoOfertadoDto>): Promise<CursoOfertado> {
      const response = await api.patch(`/ofertado/${id}`, data);
      return response.data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/ofertado/${id}`);
    },

    async uploadBulk(file: File): Promise<{ message: string; created: number; errors: number; details: any }> {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/ofertado/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  },

  // ========== MATRÍCULAS ==========
  matriculas: {
    async create(data: CreateMatriculaDto): Promise<Matricula> {
      const response = await api.post('/matricula', data);
      return response.data;
    },

    async findAll(): Promise<Matricula[]> {
      const response = await api.get('/matricula');
      return response.data;
    },

    async findOne(id: number): Promise<Matricula> {
      const response = await api.get(`/matricula/${id}`);
      return response.data;
    },

    async update(id: number, data: Partial<CreateMatriculaDto>): Promise<Matricula> {
      const response = await api.patch(`/matricula/${id}`, data);
      return response.data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/matricula/${id}`);
    },
  },

  // ========== DEMANDA ==========
  demanda: {
    async create(data: CreateDemandaDto): Promise<Demanda> {
      const response = await api.post('/demanda', data);
      return response.data;
    },

    async findAll(): Promise<Demanda[]> {
      const response = await api.get('/demanda');
      return response.data;
    },

    async findOne(id: number): Promise<Demanda> {
      const response = await api.get(`/demanda/${id}`);
      return response.data;
    },

    async update(id: number, data: Partial<CreateDemandaDto>): Promise<Demanda> {
      const response = await api.patch(`/demanda/${id}`, data);
      return response.data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/demanda/${id}`);
    },
  },

  // ========== CRÉDITOS ==========
  creditos: {
    async findAll(): Promise<Credito[]> {
      const response = await api.get('/credito');
      return response.data;
    },

    async findOne(id: number): Promise<Credito> {
      const response = await api.get(`/credito/${id}`);
      return response.data;
    },
  },

  // ========== REQUISITOS ==========
  requisitos: {
    async create(data: CreateRequisitoDto): Promise<Requisito> {
      const response = await api.post('/requisito', data);
      return response.data;
    },

    async findAll(): Promise<Requisito[]> {
      const response = await api.get('/requisito');
      return response.data;
    },

    async findOne(id: number): Promise<Requisito> {
      const response = await api.get(`/requisito/${id}`);
      return response.data;
    },

    async remove(id: number): Promise<void> {
      await api.delete(`/requisito/${id}`);
    },
  },
};

export default backendService;
