export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-primary-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-[var(--text-secondary)] max-w-md mb-6 text-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
        >
          {actionLabel || 'Get Started'}
        </button>
      )}
    </div>
  );
}
