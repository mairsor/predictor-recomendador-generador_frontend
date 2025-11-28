'use client';

import { useAuthStore } from '@/store/useAuthStore';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-uni-background dark:bg-gray-950 transition-colors">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
