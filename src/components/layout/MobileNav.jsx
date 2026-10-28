import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Calendar,
  Menu,
  X,
  GraduationCap,
  Target,
  Sliders,
  Calculator,
  Settings,
} from 'lucide-react';

const primaryNavItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/subjects', label: 'Subjects', icon: BookOpen },
  { path: '/marks', label: 'Marks', icon: ClipboardList },
  { path: '/exams', label: 'Exams', icon: Calendar },
];

const allNavItems = [
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

export default function MobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    },
    [drawerOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Check if current route is one of the "More" items (not in primary nav)
  const isMoreActive = !primaryNavItems.some(
    (item) =>
      location.pathname === item.path ||
      (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {primaryNavItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-w-[56px] ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* More button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-w-[56px] ${
              isMoreActive || drawerOpen
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
            aria-label="More navigation options"
          >
            <Menu className="w-5 h-5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Drawer Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          drawerOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Slide-up Drawer */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out max-h-[80vh] overflow-y-auto ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer handle */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">
              AcadTracker
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* All Nav Items */}
        <nav className="p-3 space-y-1">
          {allNavItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom safe area padding */}
        <div className="h-6" />
      </div>
    </>
  );
}
