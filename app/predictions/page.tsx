"use client";

import React from 'react';
import MainLayout from '@/components/common/MainLayout';
import { ChartContainer } from '@/components/ui/chart';
import { Card } from '@/components/ui/card';
import useUserDataStore from '@/store/useUserDataStore';
import { useToast } from '@/hooks/use-toast';

export default function PredictionsPage() {
  const [data, setData] = React.useState<any[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    // mock predictions
    setData([
      { course: 'Redes I', section: 'A', capacity: 50, demand: 85 },
      { course: 'Algoritmos II', section: 'B', capacity: 40, demand: 95 },
      { course: 'Bases de Datos', section: 'A', capacity: 60, demand: 45 },
    ]);
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-uni-text">Predicciones</h1>
          <p className="text-uni-text-secondary mt-2">Visualiza la demanda esperada y la ocupación estimada</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-uni-border">
            <h3 className="text-lg font-semibold mb-2">Demanda esperada por curso</h3>
            <ChartContainer id="predictions-main" config={{ demand: { color: '#7A161A' } }}>
              <div className="h-64 flex items-center justify-center text-uni-text-secondary">Gráfico de barras (mock)</div>
            </ChartContainer>
          </div>

          <aside>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">KPI</h3>
              <div className="text-sm text-uni-text-secondary">
                <div>Cursos con alta demanda: 2</div>
                <div>Cursos con baja inscripción: 1</div>
              </div>
            </Card>
          </aside>
        </div>

        <div className="bg-white rounded-xl p-4 border border-uni-border">
          <h3 className="text-lg font-semibold mb-2">Detalle por sección</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th>Curso</th>
                  <th>Sección</th>
                  <th>Capacidad</th>
                  <th>Demanda estimada (%)</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.course + d.section} className="border-t">
                    <td className="py-2">{d.course}</td>
                    <td>{d.section}</td>
                    <td>{d.capacity}</td>
                    <td>{d.demand}%</td>
                    <td>{d.demand > 80 ? 'Alta demanda' : 'Normal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
