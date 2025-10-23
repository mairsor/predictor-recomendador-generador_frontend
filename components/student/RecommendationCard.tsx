import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export type Recommendation = {
  id: string;
  courseName: string;
  credits?: number;
  prerequisites?: string[];
  affinity?: number; // 0-100
  explanation?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  schedules?: Array<{ day: string; start: string; end: string }>;
};

export default function RecommendationCard({
  rec,
  onAction,
}: {
  rec: Recommendation;
  onAction: (id: string, action: 'accept' | 'reject' | 'explain') => void;
}) {
  const { toast } = useToast();

  const handleAccept = () => {
    onAction(rec.id, 'accept');
    toast({ title: 'Curso aceptado', description: rec.courseName });
  };

  const handleReject = () => {
    onAction(rec.id, 'reject');
    toast({ title: 'Curso rechazado', description: rec.courseName });
  };

  const handleExplain = () => {
    onAction(rec.id, 'explain');
  };

  return (
    <Card className="border border-uni-border">
      <CardHeader>
        <CardTitle className="text-lg">{rec.courseName}</CardTitle>
        <div className="text-sm text-uni-text-secondary">
          {rec.credits ? `${rec.credits} créditos • ` : ''}
          {rec.prerequisites && rec.prerequisites.length > 0
            ? `Prerrequistos: ${rec.prerequisites.join(', ')}`
            : 'Sin prerrequisitos'}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-uni-text-secondary">Afinidad</div>
            <div className="mt-1 font-medium">{rec.affinity ?? '—'}%</div>
          </div>
          <div className="text-sm text-uni-text-secondary text-right">
            <div>Estado</div>
            <div className="font-medium mt-1">{rec.status ?? 'pending'}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full">
          <Button
            variant="default"
            className="flex-1 bg-uni-primary text-white"
            onClick={handleAccept}
            disabled={rec.status === 'accepted'}
          >
            Aceptar
          </Button>
          <Button
            variant="ghost"
            className="flex-1"
            onClick={handleReject}
            disabled={rec.status === 'rejected'}
          >
            Rechazar
          </Button>
          <Button variant="outline" onClick={handleExplain} className="flex-1">
            Ver explicación
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
