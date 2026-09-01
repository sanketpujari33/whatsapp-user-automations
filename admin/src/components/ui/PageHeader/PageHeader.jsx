import PropTypes from 'prop-types';

export default function PageHeader({ title, subtitle, actions, breadcrumbs }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        {breadcrumbs && (
          <nav className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {b.href ? <a href={b.href} className="hover:text-primary-500">{b.label}</a> : <span>{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-dark-50">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, href: PropTypes.string })),
};
