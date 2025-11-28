'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAlumnos } from '@/hooks/useAlumnos';
import { useCursos } from '@/hooks/useCursos';

export default function TestPage() {
  const { login, loading: authLoading, error: authError } = useAuth();
  const { alumnos, loading: alumnosLoading, error: alumnosError, fetchAll: fetchAlumnos } = useAlumnos();
  const { cursos, loading: cursosLoading, error: cursosError, fetchAll: fetchCursos } = useCursos();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, setLoginResult] = useState<any>(null);

  const handleLogin = async () => {
    try {
      const result = await login({ email, password });
      setLoginResult(result);
      console.log('Login exitoso:', result);
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  const handleFetchAlumnos = async () => {
    try {
      await fetchAlumnos();
      console.log('Alumnos obtenidos:', alumnos);
    } catch (err) {
      console.error('Error al obtener alumnos:', err);
    }
  };

  const handleFetchCursos = async () => {
    try {
      await fetchCursos();
      console.log('Cursos obtenidos:', cursos);
    } catch (err) {
      console.error('Error al obtener cursos:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pruebas de Integración Backend</h1>
        
        {/* Test de Autenticación */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Test de Autenticación</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="usuario@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="contraseña"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={authLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {authLoading ? 'Cargando...' : 'Login'}
            </button>
            {authError && (
              <div className="text-red-500 text-sm mt-2">
                Error: {authError}
              </div>
            )}
            {loginResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-medium">✓ Login exitoso</p>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(loginResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Test de Alumnos */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Test de API Alumnos</h2>
          <button
            onClick={handleFetchAlumnos}
            disabled={alumnosLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {alumnosLoading ? 'Cargando...' : 'Obtener Alumnos'}
          </button>
          {alumnosError && (
            <div className="text-red-500 text-sm mt-2">
              Error: {alumnosError}
            </div>
          )}
          {alumnos.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-2">Total: {alumnos.length} alumnos</p>
              <div className="max-h-60 overflow-auto">
                <pre className="text-xs bg-gray-50 p-4 rounded">
                  {JSON.stringify(alumnos.slice(0, 3), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Test de Cursos */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">3. Test de API Cursos</h2>
          <button
            onClick={handleFetchCursos}
            disabled={cursosLoading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            {cursosLoading ? 'Cargando...' : 'Obtener Cursos'}
          </button>
          {cursosError && (
            <div className="text-red-500 text-sm mt-2">
              Error: {cursosError}
            </div>
          )}
          {cursos.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-2">Total: {cursos.length} cursos</p>
              <div className="max-h-60 overflow-auto">
                <pre className="text-xs bg-gray-50 p-4 rounded">
                  {JSON.stringify(cursos.slice(0, 3), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Información de Conexión */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2">📡 Configuración de Backend</h3>
          <p className="text-sm">URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003'}</p>
          <p className="text-xs text-gray-600 mt-2">
            Abre la consola del navegador (F12) para ver más detalles de las peticiones.
          </p>
        </div>
      </div>
    </div>
  );
}
