'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import backendService from '@/services/backendService';
import DashboardStats from '@/components/student/DashboardStats';
import ProgressIndicator from '@/components/student/ProgressIndicator';
import CurrentCourses from '@/components/student/CurrentCourses';
import AlertsPanel from '@/components/student/AlertsPanel';
import { Loader2 } from 'lucide-react';

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Esperar a que el componente se monte para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // No verificar autenticación hasta que el componente esté montado
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'student') {
      router.push('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const data = await backendService.dashboard.getMyDashboard();
        console.log('Dashboard data received:', data);
        if (!data) {
          console.error('Dashboard data is null or undefined');
          setError('No se recibieron datos del servidor');
        } else {
          setDashboardData(data);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard:', err);
        setError(err.response?.data?.message || 'Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, isAuthenticated, router, mounted]);

  // Mostrar loading mientras se monta el componente
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-uni-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">No se encontraron datos del alumno</p>
      </div>
    );
  }

  // Generar alertas inteligentes basadas en los datos
  const generateAlerts = () => {
    const alerts: any[] = [];
    const { estadisticas, creditos, alumno, semestre_actual } = dashboardData;

    // Alerta de cursos desaprobados
    if (estadisticas?.desaprobados > 0) {
      alerts.push({
        type: 'warning',
        title: `${estadisticas.desaprobados} curso(s) desaprobado(s)`,
        description: 'Revisa los cursos que necesitas volver a llevar.',
      });
    }

    // Alerta de bajo promedio
    if (creditos?.promedio < 13) {
      alerts.push({
        type: 'warning',
        title: 'Promedio bajo el mínimo',
        description: 'Tu promedio está por debajo de 13. Considera mejorar tu rendimiento.',
      });
    }

    // Alerta de progreso lento
    if (alumno?.ciclo_relativo > 5 && creditos?.aprobados < 100) {
      alerts.push({
        type: 'info',
        title: 'Progreso de créditos',
        description: 'Estás avanzando más lento de lo esperado. Considera tomar más créditos.',
      });
    }

    // Alerta de cursos en progreso
    if (semestre_actual?.cursos?.length > 0) {
      const cursosEnCurso = semestre_actual.cursos.filter((c: any) => 
        c.estado?.toLowerCase().includes('matriculado')
      ).length;
      
      if (cursosEnCurso > 0) {
        alerts.push({
          type: 'info',
          title: `${cursosEnCurso} curso(s) en progreso`,
          description: `Actualmente estás matriculado en ${cursosEnCurso} curso(s) este semestre.`,
        });
      }
    }

    // Alerta de buen rendimiento
    if (estadisticas?.tasa_aprobacion >= 85) {
      alerts.push({
        type: 'success',
        title: '¡Excelente rendimiento!',
        description: `Tu tasa de aprobación es del ${estadisticas.tasa_aprobacion.toFixed(1)}%`,
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <DashboardStats
        creditosAprobados={dashboardData.creditos.aprobados}
        promedioPonderado={dashboardData.creditos.promedio}
        cicloRelativo={dashboardData.alumno.ciclo_relativo}
        tasaAprobacion={dashboardData.estadisticas.tasa_aprobacion}
      />

      {/* Grid de progreso y cursos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProgressIndicator
            creditosAprobados={dashboardData.creditos.aprobados}
            cicloRelativo={dashboardData.alumno.ciclo_relativo}
          />
        </div>
        <div className="lg:col-span-2">
          <CurrentCourses
            courses={dashboardData.semestre_actual.cursos}
            semestre={dashboardData.semestre_actual.semestre}
            totalCreditos={dashboardData.semestre_actual.total_creditos}
          />
        </div>
      </div>

      {/* Panel de alertas */}
      <AlertsPanel alerts={alerts} />
    </div>
  );
}
