'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  creditosAprobados: number;
  creditosTotales?: number;
  cicloRelativo: number;
  ciclosTotal?: number;
}

export default function ProgressIndicator({
  creditosAprobados,
  creditosTotales = 200, // Total de créditos de la carrera (valor por defecto)
  cicloRelativo,
  ciclosTotal = 10, // Total de ciclos de la carrera (valor por defecto)
}: ProgressIndicatorProps) {
  const creditosProgress = (creditosAprobados / creditosTotales) * 100;
  const cicloProgress = (cicloRelativo / ciclosTotal) * 100;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg dark:text-white">Progreso Académico</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progreso de Créditos */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium dark:text-gray-300">Créditos</span>
            <span className="text-gray-600 dark:text-gray-400">
              {creditosAprobados} / {creditosTotales}
            </span>
          </div>
          <Progress value={creditosProgress} className="h-3" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {creditosProgress.toFixed(1)}% completado
          </p>
        </div>

        {/* Progreso de Ciclos */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium dark:text-gray-300">Avance de Ciclos</span>
            <span className="text-gray-600 dark:text-gray-400">
              Ciclo {cicloRelativo} de {ciclosTotal}
            </span>
          </div>
          <Progress value={cicloProgress} className="h-3" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {cicloProgress.toFixed(1)}% del plan de estudios
          </p>
        </div>

        {/* Gráfico Donut (SVG simple) */}
        <div className="flex justify-center pt-4">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - creditosProgress / 100)}`}
                className="text-uni-primary dark:text-blue-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-uni-primary dark:text-blue-400">
                  {creditosProgress.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Completado</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
