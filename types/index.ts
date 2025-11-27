export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor' | 'admin';
  avatar?: string;
  codigo?: string; // Código de alumno o profesor
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
}
