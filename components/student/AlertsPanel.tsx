'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';

interface AlertItem {
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  description: string;
}

interface AlertsPanelProps {
  alerts: AlertItem[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (type: string): 'default' | 'destructive' => {
    return type === 'error' ? 'destructive' : 'default';
  };

  // Generar alertas automáticas basadas en datos
  const generateDefaultAlerts = (): AlertItem[] => {
    return [
      {
        type: 'info',
        title: 'Próximo ciclo',
        description: 'Recuerda revisar los cursos recomendados para el siguiente semestre.',
      },
      {
        type: 'warning',
        title: 'Matrícula disponible',
        description: 'La matrícula para el próximo ciclo estará disponible próximamente.',
      },
    ];
  };

  const displayAlerts = alerts.length > 0 ? alerts : generateDefaultAlerts();

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2 dark:text-white">
          <Clock className="h-5 w-5" />
          <span>Alertas y Notificaciones</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayAlerts.map((alert, index) => (
          <Alert key={index} variant={getVariant(alert.type)} className="dark:bg-gray-700/50 dark:border-gray-600">
            {getIcon(alert.type)}
            <AlertTitle className="dark:text-gray-200">{alert.title}</AlertTitle>
            <AlertDescription className="dark:text-gray-300">{alert.description}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
