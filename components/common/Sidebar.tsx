'use client';

import { useState } from 'react';
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
  Lightbulb,
  Target,
  ChevronDown,
  ChevronRight,
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
      icon: Lightbulb,
      href: '/student/recommendations',
    },
    {
      label: 'Predictor de Demanda',
      icon: Target,
      submenu: [
        {
          label: 'Ver Predicciones',
          icon: BarChart3,
          href: '/student/demand-predictions',
        },
        {
          label: 'Resultados',
          icon: FileText,
          href: '/student/demand-results',
        },
      ],
    },
    {
      label: 'Configuración',
      icon: Settings,
      href: '/student/settings',
    },
  ],
  tutor: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/tutor',
    },
    {
      label: 'Recomendador de Horarios',
      icon: Lightbulb,
      submenu: [
        {
          label: 'Análisis de Cursos',
          icon: BookOpen,
          href: '/tutor/course-analysis',
        },
        {
          label: 'Líneas de Carrera',
          icon: Target,
          href: '/tutor/career-lines',
        },
      ],
    },
    {
      label: 'Predictor de Demanda',
      icon: Target,
      submenu: [
        {
          label: 'Predicciones',
          icon: BarChart3,
          href: '/tutor/demand-predictor',
        },
        {
          label: 'Resultados',
          icon: FileText,
          href: '/tutor/demand-results',
        },
        {
          label: 'Modelos ML',
          icon: Settings,
          href: '/tutor/demand-models',
        },
      ],
    },
    {
      label: 'Configuración',
      icon: Settings,
      href: '/tutor/settings',
    },
  ],
  admin: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
    },
    {
      label: 'Gestión de Matrícula',
      icon: BookOpen,
      submenu: [
        {
          label: 'Cursos',
          icon: BookOpen,
          href: '/admin/courses',
        },
        {
          label: 'Secciones',
          icon: Calendar,
          href: '/admin/sections',
        },
      ],
    },
    {
      label: 'Recomendador de Horarios',
      icon: Lightbulb,
      submenu: [
        {
          label: 'Estadísticas del Sistema',
          icon: BarChart3,
          href: '/admin/system-stats',
        },
        {
          label: 'Gestión de Estudiantes',
          icon: Users,
          href: '/admin/students-overview',
        },
      ],
    },
    {
      label: 'Predictor de Demanda',
      icon: Target,
      submenu: [
        {
          label: 'Predicciones',
          icon: BarChart3,
          href: '/admin/demand-predictor',
        },
        {
          label: 'Resultados',
          icon: FileText,
          href: '/admin/demand-results',
        },
        {
          label: 'Modelos ML',
          icon: Settings,
          href: '/admin/demand-models',
        },
      ],
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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <aside className="w-64 bg-uni-primary dark:bg-gray-800 min-h-screen text-white transition-colors">
      <nav className="p-4 space-y-2">
        {items.map((item: any) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isSubmenuOpen = openSubmenu === item.label;
          const isSubmenuItemActive = hasSubmenu && item.submenu.some((sub: any) => pathname === sub.href);

          // Item con submenú
          if (hasSubmenu) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left',
                    isSubmenuItemActive || isSubmenuOpen
                      ? 'bg-uni-secondary text-white'
                      : 'text-white/80 hover:bg-uni-secondary/80 hover:text-white'
                  )}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm leading-tight">{item.label}</span>
                  </div>
                  {isSubmenuOpen ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0 ml-2" />
                  )}
                </button>
                
                {isSubmenuOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem: any) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = pathname === subItem.href;
                      
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            'flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors',
                            isSubActive
                              ? 'bg-uni-secondary/60 text-white'
                              : 'text-white/70 hover:bg-uni-secondary/40 hover:text-white'
                          )}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span className="text-sm">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Item normal sin submenú
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
