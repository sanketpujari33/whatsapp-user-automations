import PropTypes from 'prop-types';

export default function SkeletonTable({ rows = 8, cols = 5 }) {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-hidden animate-pulse">
      <div className="px-5 py-3 border-b border-gray-200 dark:border-dark-600">
        <div className="h-5 bg-gray-200 dark:bg-dark-600 rounded w-32" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} className="border-t border-gray-100 dark:border-dark-600">
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 dark:bg-dark-600/50 rounded w-full" style={{ maxWidth: `${60 + Math.random() * 30}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

SkeletonTable.propTypes = { rows: PropTypes.number, cols: PropTypes.number };
