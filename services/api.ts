import axios from 'axios';

// URLs de las APIs
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
const PREDICTOR_URL = process.env.NEXT_PUBLIC_PREDICTOR_URL || 'http://localhost:8000';
const RECOMENDADOR_URL = process.env.NEXT_PUBLIC_RECOMENDADOR_URL || 'http://localhost:8001';

// Cliente API para Backend principal
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente API para Predictor de Demanda
const predictorApi = axios.create({
  baseURL: PREDICTOR_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente API para Recomendador de Cursos
const recomendadorApi = axios.create({
  baseURL: RECOMENDADOR_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // El backend envuelve las respuestas en {message, data}
    // Extraer solo el data para facilitar el uso
    if (response.data && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interceptor para agregar auth token a las APIs de ML (si es necesario)
const addAuthInterceptor = (apiClient: typeof axios) => {
  apiClient.interceptors.request.use(
    (config) => {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Aplicar interceptores a APIs de ML
addAuthInterceptor(predictorApi);
addAuthInterceptor(recomendadorApi);

export default api;
export { predictorApi, recomendadorApi, BACKEND_URL, PREDICTOR_URL, RECOMENDADOR_URL };
