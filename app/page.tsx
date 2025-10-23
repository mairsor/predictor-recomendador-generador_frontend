'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role === 'student') {
      router.push('/student');
    } else if (user?.role === 'tutor') {
      router.push('/tutor');
    } else if (user?.role === 'admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-uni-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uni-primary mx-auto"></div>
        <p className="mt-4 text-uni-text-secondary">Cargando...</p>
      </div>
    </div>
  );
}
