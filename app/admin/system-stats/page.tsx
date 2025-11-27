'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import recommenderService, { SystemStats, LineasInfo } from '@/services/recommenderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  BookOpen,
  TrendingUp,
  Target,
  Database,
  Network,
  AlertCircle,
  RefreshCw,
  Activity,
  BarChart3,
} from 'lucide-react';

export default function SystemStatsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [lineasInfo, setLineasInfo] = useState<LineasInfo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    loadData();
  }, [mounted, isAuthenticated, user, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsData, lineasData] = await Promise.all([
        recommenderService.getStats(),
        recommenderService.getLineas(),
      ]);

      setStats(statsData);
      setLineasInfo(lineasData);
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar estadísticas del sistema');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error || 'No se pudo cargar la información'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Estadísticas del Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Métricas generales del sistema de recomendación
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.system.total_students}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Estudiantes en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cursos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.system.total_courses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cursos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registros Totales
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.system.total_records}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Matrículas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Líneas de Carrera
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.system.total_lineas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Líneas disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información de modelos ML */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Modelos de Machine Learning
          </CardTitle>
          <CardDescription>
            Configuración y métricas de los modelos del sistema de recomendación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Knowledge Graph */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold">Knowledge Graph</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nodos:</span>
                  <span className="font-medium">{stats.models.kg_nodes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conexiones:</span>
                  <span className="font-medium">{stats.models.kg_edges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Embeddings:</span>
                  <span className="font-medium">{stats.models.kg_embeddings}</span>
                </div>
              </div>
            </div>

            {/* Collaborative Filtering */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold">Collaborative Filtering</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Factores latentes:</span>
                  <span className="font-medium">{stats.models.cf_factors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Algoritmo:</span>
                  <Badge variant="outline">ALS</Badge>
                </div>
              </div>
            </div>

            {/* Hybrid Model */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold">Modelo Híbrido</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensión:</span>
                  <span className="font-medium">{stats.models.embedding_dim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arquitectura:</span>
                  <Badge variant="outline">MLP</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Líneas de carrera */}
      {lineasInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Distribución por Líneas de Carrera
            </CardTitle>
            <CardDescription>
              Cursos distribuidos en las diferentes líneas de carrera
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lineasInfo.lineas.map((linea) => {
              const coursesCount = lineasInfo.courses_per_linea[linea] || 0;
              const percentage = stats.system.total_courses > 0 
                ? (coursesCount / stats.system.total_courses) * 100 
                : 0;

              return (
                <div key={linea} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{linea}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {coursesCount} cursos
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Promedios del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio Cursos/Estudiante
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.system.total_students > 0 
                ? (stats.system.total_records / stats.system.total_students).toFixed(1)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cursos por estudiante
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Densidad de Datos
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.system.total_records / (stats.system.total_students * stats.system.total_courses)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cobertura de la matriz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cursos por Línea
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lineasInfo && lineasInfo.total > 0
                ? Math.round(stats.system.total_courses / lineasInfo.total)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Promedio por línea
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
