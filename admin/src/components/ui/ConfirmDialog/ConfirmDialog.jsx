import PropTypes from 'prop-types';
import { Button, Modal } from 'components/ui';

const VARIANT_ICONS = {
  danger: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const VARIANT_COLORS = {
  danger: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-500', btn: 'bg-red-600 hover:bg-red-700' },
  warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'text-yellow-500', btn: 'bg-yellow-600 hover:bg-yellow-700' },
  info: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-500', btn: 'bg-primary-600 hover:bg-primary-700' },
};

export default function ConfirmDialog({
  open, onClose, onConfirm, title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm', cancelText = 'Cancel',
  variant = 'danger', loading = false,
}) {
  if (!open) return null;
  const colors = VARIANT_COLORS[variant] || VARIANT_COLORS.danger;

  return (
    <Modal isOpen={open} onClose={onClose} size="sm">
      <div className="p-6 text-center">
        <div className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
          <span className={`text-2xl ${colors.icon}`}>{VARIANT_ICONS[variant]}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-50 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>{cancelText}</Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${colors.btn} disabled:opacity-50 transition`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'warning', 'info']),
  loading: PropTypes.bool,
};
