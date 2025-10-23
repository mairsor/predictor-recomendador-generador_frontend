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
    <div className="flex h-screen overflow-hidden bg-uni-background">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
