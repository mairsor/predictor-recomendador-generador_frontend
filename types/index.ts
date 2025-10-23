export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor' | 'admin';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
}
