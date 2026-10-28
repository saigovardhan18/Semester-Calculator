import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const typeConfig = {
  success: {
    icon: CheckCircle2,
    bgClass: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
    iconClass: 'text-emerald-500',
    progressClass: 'bg-emerald-500',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    iconClass: 'text-red-500',
    progressClass: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
    iconClass: 'text-amber-500',
    progressClass: 'bg-amber-500',
  },
  info: {
    icon: Info,
    bgClass: 'bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800',
    iconClass: 'text-sky-500',
    progressClass: 'bg-sky-500',
  },
};

function Toast({ id, message, type = 'info', duration = 4000, onRemove }) {
  const [progress, setProgress] = useState(100);
  const [exiting, setExiting] = useState(false);
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onRemove(id), 200);
  };

  return (
    <div
      className={`relative flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg overflow-hidden transition-all duration-200 ${
        config.bgClass
      } ${
        exiting
          ? 'opacity-0 translate-x-4 scale-95'
          : 'opacity-100 translate-x-0 scale-100 animate-[slideInRight_300ms_ease-out]'
      }`}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconClass}`} />
      <p className="text-sm font-medium text-[var(--text-primary)] flex-1 pr-4">
        {message}
      </p>
      <button
        onClick={handleDismiss}
        className="p-0.5 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5 dark:bg-white/5">
        <div
          className={`h-full transition-all duration-100 ease-linear ${config.progressClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
