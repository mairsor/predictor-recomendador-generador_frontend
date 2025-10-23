"use client";

import React from 'react';
import MainLayout from '@/components/common/MainLayout';
import ScheduleGrid from '@/components/student/ScheduleGrid';
import useUserDataStore from '@/store/useUserDataStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SchedulesPage() {
  const { schedule, setSchedule, recommendations } = useUserDataStore();
  const { toast } = useToast();

  const generateNew = () => {
    const mock = [
      { id: 'm1', courseName: 'Redes I', day: 2, startHour: 8, durationHours: 2 },
      { id: 'm2', courseName: 'Matemáticas Avanzadas', day: 4, startHour: 10, durationHours: 2 },
    ];
    setSchedule(mock);
    toast({ title: 'Horario', description: 'Nuevo horario generado (mock).' });
  };

  const optimize = () => {
    // very simple mock 'optimize' — reverse schedule order
    setSchedule([...schedule].reverse());
    toast({ title: 'Optimizar', description: 'Horario optimizado (mock).' });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-uni-text">Horarios</h1>
          <p className="text-uni-text-secondary mt-2">Genera y ajusta tu horario tentativo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="mb-4 flex gap-2">
              <Button className="bg-uni-primary text-white" onClick={generateNew}>Generar nuevo horario</Button>
              <Button onClick={optimize}>Optimizar horario</Button>
              <Button onClick={() => toast({ title: 'Exportar', description: 'Usa Exportar en el visualizador.' })}>Exportar PDF</Button>
            </div>
            <ScheduleGrid courses={schedule} onExport={() => toast({ title: 'Exportar', description: 'Exportando (mock)...' })} />
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-uni-border">
              <h3 className="text-lg font-semibold">Estadísticas</h3>
              <div className="mt-2 text-sm text-uni-text-secondary">
                <div>Créditos totales: {schedule.reduce((s, c) => s + (c.durationHours * 2), 0)}</div>
                <div>Choques detectados: 0</div>
                <div>Horas libres por día: --</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-uni-border">
              <h3 className="text-lg font-semibold">Cursos aceptados recientemente</h3>
              <ul className="mt-2 text-sm text-uni-text-secondary">
                {recommendations.filter((r:any)=> r.status==='accepted').slice(0,5).map((r:any)=> (
                  <li key={r.id} className="py-1">{r.courseName}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
