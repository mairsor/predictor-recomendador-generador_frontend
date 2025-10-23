'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Users,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  role: 'student' | 'tutor' | 'admin';
}

const menuItems = {
  student: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/student',
    },
    {
      label: 'Recomendaciones',
      icon: BookOpen,
      href: '/student/recommendations',
    },
    {
      label: 'Horarios',
      icon: Calendar,
      href: '/student/schedules',
    },
    {
      label: 'Predicciones',
      icon: BarChart3,
      href: '/student/predictions',
    },
  ],
  tutor: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/tutor',
    },
    {
      label: 'Estudiantes',
      icon: Users,
      href: '/tutor/students',
    },
    {
      label: 'Predicciones',
      icon: BarChart3,
      href: '/tutor/predictions',
    },
    {
      label: 'Reportes',
      icon: FileText,
      href: '/tutor/reports',
    },
  ],
  admin: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
    },
    {
      label: 'Usuarios',
      icon: Users,
      href: '/admin/users',
    },
    {
      label: 'Cursos',
      icon: BookOpen,
      href: '/admin/courses',
    },
    {
      label: 'Analíticas',
      icon: BarChart3,
      href: '/admin/analytics',
    },
    {
      label: 'Configuración',
      icon: Settings,
      href: '/admin/settings',
    },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = menuItems[role] || menuItems.student;

  return (
    <aside className="w-64 bg-uni-primary min-h-screen text-white">
      <nav className="p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-uni-secondary text-white'
                  : 'text-white/80 hover:bg-uni-secondary/80 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
