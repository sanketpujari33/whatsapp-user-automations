import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'components/ui';

const FIELD_TYPES = {
  text: { tag: 'input', props: { type: 'text' } },
  email: { tag: 'input', props: { type: 'email' } },
  number: { tag: 'input', props: { type: 'number' } },
  password: { tag: 'input', props: { type: 'password' } },
  textarea: { tag: 'textarea', props: {} },
  select: { tag: 'select', props: {} },
  toggle: { tag: 'input', props: { type: 'checkbox' } },
  file: { tag: 'input', props: { type: 'file' } },
  date: { tag: 'input', props: { type: 'date' } },
};

export default function CrudModal({
  open, onClose, title, fields = [], initialValues, onSubmit, loading, size = 'lg',
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    fields.forEach(f => {
      if (f.type === 'toggle') {
        data[f.name] = formData.get(f.name) === 'on';
      } else if (f.type === 'file') {
        const file = formData.get(f.name);
        if (file?.name) data[f.name] = file;
      } else {
        data[f.name] = formData.get(f.name) || '';
      }
    });
    onSubmit(data);
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose} size={size}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-50">{title || (initialValues ? 'Edit' : 'Add')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-100 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              {f.type !== 'toggle' && (
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">
                  {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {f.type === 'textarea' ? (
                <textarea
                  name={f.name}
                  rows={f.rows || 3}
                  defaultValue={initialValues?.[f.name] || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-transparent dark:text-dark-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  required={f.required}
                  placeholder={f.placeholder}
                />
              ) : f.type === 'select' ? (
                <select
                  name={f.name}
                  defaultValue={initialValues?.[f.name] || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-transparent dark:text-dark-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  required={f.required}
                >
                  <option value="">Select...</option>
                  {f.options?.map(opt => (
                    <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                  ))}
                </select>
              ) : f.type === 'toggle' ? (
                <label className="inline-flex items-center gap-3 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    name={f.name}
                    defaultChecked={initialValues?.[f.name] !== false}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">{f.label}</span>
                </label>
              ) : f.type === 'file' ? (
                <input
                  type="file"
                  name={f.name}
                  accept={f.accept || 'image/*'}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100"
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  name={f.name}
                  defaultValue={initialValues?.[f.name] || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg bg-transparent dark:text-dark-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  required={f.required}
                  placeholder={f.placeholder}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-dark-600">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : initialValues ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

CrudModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.array,
    rows: PropTypes.number,
    accept: PropTypes.string,
  })),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  size: PropTypes.string,
};
