import React from 'react';
import { Button } from '@/components/ui/button';

export type ScheduledCourse = {
  id: string;
  courseName: string;
  day: number; // 1=Mon .. 6=Sat
  startHour: number; // 24h integer
  durationHours: number;
};

function dayLabel(i: number) {
  return ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'][i - 1] || '—';
}

export default function ScheduleGrid({
  courses,
  onExport,
}: {
  courses: ScheduledCourse[];
  onExport?: () => void;
}) {
  const hours = Array.from({ length: 12 }, (_, i) => 7 + i); // 7am - 18pm

  return (
    <div className="bg-white border border-uni-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-uni-text">Horario Tentativo</h3>
        <Button onClick={onExport} className="bg-uni-primary text-white">
          Exportar Horario
        </Button>
      </div>

      <div className="overflow-auto">
        <div className="grid grid-cols-7 gap-2">
          <div className="text-sm text-uni-text-secondary">Horas</div>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="text-sm text-uni-text-secondary text-center">
              {dayLabel(i + 1)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 mt-2">
          <div>
            {hours.map((h) => (
              <div key={h} className="h-12 text-sm text-uni-text-secondary">
                {h}:00
              </div>
            ))}
          </div>

          {Array.from({ length: 6 }, (_, dayIdx) => (
            <div key={dayIdx} className="min-h-[12rem] border-l border-uni-border/50">
              {hours.map((h) => (
                <div key={h} className="h-12 border-b border-uni-border/50"></div>
              ))}

              {courses
                .filter((c) => c.day === dayIdx + 1)
                .map((c) => (
                  <div
                    key={c.id}
                    className="absolute bg-uni-primary/80 text-white rounded-md p-1 text-xs m-1"
                    style={{
                      transform: `translateY(${(c.startHour - 7) * 3}rem)`,
                      height: `${c.durationHours * 3}rem`,
                      width: '90%',
                    }}
                  >
                    {c.courseName}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
