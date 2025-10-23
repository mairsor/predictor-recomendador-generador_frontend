import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  avatar?: string;
};

export type RecommendationLite = {
  id: string;
  courseName: string;
  affinity?: number;
  status?: 'pending' | 'accepted' | 'rejected';
};

export type ScheduledLite = {
  id: string;
  courseName: string;
  day: number;
  startHour: number;
  durationHours: number;
};

export type Stats = {
  totalRecommendations: number;
  avgAffinity: number;
  creditsAccepted: number;
  predictionsActive: number;
};

type State = {
  user: User | null;
  recommendations: RecommendationLite[];
  schedule: ScheduledLite[];
  stats: Stats;
  setUser: (u: User) => void;
  setRecommendations: (r: RecommendationLite[]) => void;
  setSchedule: (s: ScheduledLite[]) => void;
  setStats: (s: Partial<Stats>) => void;
};

export const useUserDataStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      recommendations: [],
      schedule: [],
      stats: { totalRecommendations: 0, avgAffinity: 0, creditsAccepted: 0, predictionsActive: 0 },
      setUser: (u) => set({ user: u }),
      setRecommendations: (r) => set({ recommendations: r }),
      setSchedule: (s) => set({ schedule: s }),
      setStats: (s) => set({ stats: { ...get().stats, ...s } }),
    }),
    { name: 'user-data' }
  )
);

export default useUserDataStore;
