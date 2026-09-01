import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function SearchInput({ value, onChange, placeholder = 'Search...', debounceMs = 300 }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => onChange?.(local), debounceMs);
    return () => clearTimeout(timer);
  }, [local, debounceMs]);

  useEffect(() => {
    if (value !== undefined && value !== local) setLocal(value);
  }, [value]);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">🔍</span>
      <input
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-dark-500 rounded-lg bg-transparent dark:text-dark-100 focus:ring-2 focus:ring-primary-500 outline-none"
      />
    </div>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  debounceMs: PropTypes.number,
};
