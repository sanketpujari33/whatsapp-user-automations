import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/ui';

export default function FilterBar({ filters = [], onFilter, onReset }) {
  const [values, setValues] = useState({});

  const handleChange = (key, value) => {
    const next = { ...values, [key]: value };
    setValues(next);
    onFilter?.(next);
  };

  const handleReset = () => {
    setValues({});
    onReset?.();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600">
      {filters.map(f => (
        <div key={f.key} className="flex items-center gap-2">
          {f.label && <label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{f.label}</label>}
          {f.type === 'select' ? (
            <select
              value={values[f.key] || ''}
              onChange={e => handleChange(f.key, e.target.value)}
              className="text-sm border border-gray-300 dark:border-dark-500 rounded-lg bg-transparent dark:text-dark-100 px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All</option>
              {f.options?.map(o => (
                <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
              ))}
            </select>
          ) : f.type === 'date' ? (
            <input
              type="date"
              value={values[f.key] || ''}
              onChange={e => handleChange(f.key, e.target.value)}
              className="text-sm border border-gray-300 dark:border-dark-500 rounded-lg bg-transparent dark:text-dark-100 px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary-500"
            />
          ) : null}
        </div>
      ))}
      {onReset && Object.keys(values).length > 0 && (
        <Button size="sm" variant="ghost" onClick={handleReset}>Clear</Button>
      )}
    </div>
  );
}

FilterBar.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.oneOf(['select', 'date']),
    options: PropTypes.array,
  })),
  onFilter: PropTypes.func,
  onReset: PropTypes.func,
};
