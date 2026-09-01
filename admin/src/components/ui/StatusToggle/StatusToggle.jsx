import { useState } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'components/ui';

export default function StatusToggle({ checked, onChange, loading = false, size = 'sm', label }) {
  const [internalChecked, setInternalChecked] = useState(!!checked);

  const handleChange = () => {
    if (loading) return;
    setInternalChecked(!internalChecked);
    onChange?.(!internalChecked);
  };

  const displayChecked = checked !== undefined ? checked : internalChecked;

  return (
    <div className="flex items-center gap-2">
      <Switch checked={displayChecked} onChange={handleChange} size={size} disabled={loading} />
      {label && (
        <span className={`text-xs font-medium ${displayChecked ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {displayChecked ? 'Active' : 'Inactive'}
        </span>
      )}
    </div>
  );
}

StatusToggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md']),
  label: PropTypes.string,
};
