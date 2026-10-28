import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

export default function Header() {
  const { theme, setTheme, isDark } = useTheme();
  const { activeSemester } = useApp();

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(theme);
    const nextTheme = order[(currentIndex + 1) % order.length];
    setTheme(nextTheme);
  };

  const themeIcon = () => {
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const themeLabel = () => {
    if (theme === 'dark') return 'Dark mode';
    if (theme === 'light') return 'Light mode';
    return 'System theme';
  };

  return (
    <header className="lg:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
      {/* App Title */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">
          AcadTracker
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Active Semester Badge */}
        {activeSemester && (
          <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 max-w-[140px] truncate">
            {activeSemester.name}
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={cycleTheme}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label={themeLabel()}
          title={themeLabel()}
        >
          {themeIcon()}
        </button>
      </div>
    </header>
  );
}
