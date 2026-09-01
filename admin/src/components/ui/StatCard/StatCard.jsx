import PropTypes from 'prop-types';
import clsx from 'clsx';

export default function StatCard({ label, value, icon, trend, color = 'primary' }) {
  const iconColors = {
    primary: 'from-purple-500 to-indigo-600',
    success: 'from-emerald-400 to-teal-500',
    warning: 'from-amber-400 to-orange-500',
    danger: 'from-rose-400 to-red-500',
    info: 'from-sky-400 to-blue-500',
  };

  return (
    <div className={clsx(
      'group relative bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-600 p-6',
      'hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300',
      'hover:-translate-y-0.5 overflow-hidden'
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      <div className="relative flex items-start gap-4">
        {icon && (
          <div className={clsx(
            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl shrink-0 shadow-lg',
            iconColors[color] || iconColors.primary
          )}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-1">{label}</p>
          <p className="text-[28px] font-bold text-gray-900 dark:text-dark-50 tracking-tight">{value ?? '—'}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={clsx(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                trend >= 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}>
                <span>{trend >= 0 ? '▲' : '▼'}</span>
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  trend: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info']),
};
