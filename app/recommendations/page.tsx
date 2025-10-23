"use client";

import React from 'react';
import MainLayout from '@/components/common/MainLayout';
import RecommendationCard, { Recommendation } from '@/components/student/RecommendationCard';
import useUserDataStore from '@/store/useUserDataStore';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

export default function RecommendationsPage() {
  const { recommendations, setRecommendations } = useUserDataStore();
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'accepted' | 'rejected' | 'pending'>('all');
  const { toast } = useToast();

  React.useEffect(() => {
    // If store is empty, try fetch
    (async () => {
      try {
        if (!recommendations.length) {
          const resp = await api.get('/api/recommendations');
          setRecommendations(resp.data || []);
        }
      } catch (e) {
        // nothing
      }
    })();
  }, []);

  const filtered = (recommendations as any[]).filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (query && !r.courseName.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const handleAction = async (id: string, action: 'accept' | 'reject' | 'explain') => {
    const newRecs = recommendations.map((r: any) => (r.id === id ? { ...r, status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : r.status } : r));
    setRecommendations(newRecs as any);
    try {
      await api.patch(`/api/recommendations/${id}`, { action });
    } catch (e) {
      toast({ title: 'Atención', description: 'No se pudo actualizar en el servidor (modo dev).' });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-uni-text">Recomendaciones</h1>
          <p className="text-uni-text-secondary mt-2">Interactúa con tus recomendaciones aquí</p>
        </div>

        <div className="flex items-center gap-4">
          <Input placeholder="Buscar curso..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border border-uni-border rounded px-2 py-1">
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="accepted">Aceptados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((r: any) => (
            <RecommendationCard key={r.id} rec={r} onAction={handleAction} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
