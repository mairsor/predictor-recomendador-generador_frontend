'use client';

import MainLayout from '@/components/common/MainLayout';

export default function StudentDashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-uni-text">Dashboard</h1>
          <p className="text-uni-text-secondary mt-2">
            Bienvenido al sistema de recomendación de cursos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-uni-border">
            <h3 className="text-lg font-semibold text-uni-text mb-2">
              Recomendaciones
            </h3>
            <p className="text-uni-text-secondary text-sm">
              Contenido próximamente
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-uni-border">
            <h3 className="text-lg font-semibold text-uni-text mb-2">
              Horarios
            </h3>
            <p className="text-uni-text-secondary text-sm">
              Contenido próximamente
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-uni-border">
            <h3 className="text-lg font-semibold text-uni-text mb-2">
              Predicciones
            </h3>
            <p className="text-uni-text-secondary text-sm">
              Contenido próximamente
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
