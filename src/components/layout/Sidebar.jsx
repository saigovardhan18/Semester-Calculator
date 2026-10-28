import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Target,
  Sliders,
  Calculator,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/semesters', label: 'Semesters', icon: GraduationCap },
  { path: '/subjects', label: 'Subjects', icon: BookOpen },
  { path: '/marks', label: 'Marks & Averages', icon: ClipboardList },
  { path: '/predictor', label: 'Grade Predictor', icon: Target },
  { path: '/simulator', label: 'What-If Simulator', icon: Sliders },
  { path: '/gpa', label: 'SGPA / CGPA', icon: Calculator },
  { path: '/exams', label: 'Upcoming Exams', icon: Calendar },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { activeSemester } = useApp();

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--border-color)]">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
            AcadTracker
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border-l-3 border-primary-600'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Active Semester + Collapse */}
      <div className="border-t border-[var(--border-color)] p-3">
        {!collapsed && activeSemester && (
          <div className="mb-2 px-2 py-1.5 text-xs text-[var(--text-secondary)]">
            <div className="text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">
              Active Semester
            </div>
            <div className="font-medium text-[var(--text-primary)] truncate">
              {activeSemester.name}
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
