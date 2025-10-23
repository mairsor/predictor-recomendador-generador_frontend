"use client";

import React from 'react';
import MainLayout from '@/components/common/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import useUserDataStore from '@/store/useUserDataStore';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, recommendations, schedule, stats } = useUserDataStore();

  const pending = recommendations.filter((r) => r.status === 'pending').length;
  const accepted = schedule.length;
  const avgAffinity = stats.avgAffinity || (recommendations.length ? Math.round(recommendations.reduce((s, r) => s + (r.affinity || 0), 0) / recommendations.length) : 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-uni-text">Bienvenido, {user?.name || 'Estudiante'} 👋</h1>
          <p className="text-uni-text-secondary mt-2">Resumen rápido del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Recomendaciones Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{pending}</div>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle>Afinidad Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{avgAffinity}%</div>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle>Cursos en Horario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{accepted}</div>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle>Predicciones Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.predictionsActive}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-uni-border">
            <h3 className="text-lg font-semibold mb-2">Distribución de Afinidad</h3>
            <ChartContainer id="affinity-mini" config={{ affinity: { color: '#7A161A' } }}>
              {/* Placeholder: small bar or radar chart can be implemented here using recharts */}
              <div className="h-48 flex items-center justify-center text-uni-text-secondary">Mini gráfico</div>
            </ChartContainer>
          </div>

          <div className="bg-white rounded-xl p-4 border border-uni-border">
            <h3 className="text-lg font-semibold mb-2">Atajos Rápidos</h3>
            <div className="flex flex-col gap-2">
              <Link href="/recommendations" className="px-3 py-2 bg-uni-primary text-white rounded">Ir a mis recomendaciones</Link>
              <Link href="/schedules" className="px-3 py-2 border border-uni-border rounded">Ver horario tentativo</Link>
              <Link href="/predictions" className="px-3 py-2 border border-uni-border rounded">Ver predicciones de demanda</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
