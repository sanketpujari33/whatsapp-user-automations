import { useState, useCallback } from 'react';
import { PhotoIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// ── Field Components ────────────────────────────────────────────────────────

function TextInput({ field, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input type={field.type || 'text'}
        value={value ?? ''}
        onChange={e => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        disabled={field.disabled}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {field.help && <p className="mt-1 text-xs text-gray-400">{field.help}</p>}
    </div>
  );
}

function SelectInput({ field, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select value={value ?? ''} onChange={e => onChange(field.name, e.target.value)}
        disabled={field.disabled}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {field.placeholder && <option value="">{field.placeholder}</option>}
        {field.options?.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function MultiSelect({ field, value = [], onChange, error }) {
  const [open, setOpen] = useState(false);
  const toggle = (opt) => {
    const val = opt.value ?? opt;
    const next = value.includes(val) ? value.filter(v => v !== val) : [...value, val];
    onChange(field.name, next);
  };
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div onClick={() => setOpen(!open)}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-transparent cursor-pointer flex items-center justify-between
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
        <span className={`${value.length ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
          {value.length ? `${value.length} selected` : field.placeholder || 'Select...'}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {field.options?.map(opt => {
            const val = opt.value ?? opt;
            const label = opt.label ?? opt;
            return (
              <label key={val} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-sm">
                <input type="checkbox" checked={value.includes(val)} onChange={() => toggle(opt)}
                  className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                {label}
              </label>
            );
          })}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ToggleInput({ field, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.label}
      </label>
      <button type="button" role="switch" aria-checked={!!value}
        onClick={() => onChange(field.name, !value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${value ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function FileUpload({ field, value, onChange, error }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange(field.name, file);
  };
  const preview = value instanceof File ? URL.createObjectURL(value) : value;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}
      </label>
      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition
        ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-800/50'}`}>
        {preview ? (
          <div className="relative inline-block">
            {field.imagePreview !== false && (
              <img src={preview} alt="preview" className="max-h-32 rounded-lg object-contain" />
            )}
            <button type="button" onClick={() => onChange(field.name, null)}
              className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <PhotoIcon className="w-8 h-8 text-gray-400" />
            <label className="cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">
              <span>Upload {field.label || 'file'}</span>
              <input type="file" accept={field.accept || 'image/*'} onChange={handleFile} className="hidden" />
            </label>
            <p className="text-xs text-gray-400">{field.accept || 'PNG, JPG, SVG up to 5MB'}</p>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function TextareaInput({ field, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea value={value ?? ''} onChange={e => onChange(field.name, e.target.value)}
        rows={field.rows || 3} placeholder={field.placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const FIELD_MAP = {
  text: TextInput,
  number: TextInput,
  email: TextInput,
  password: TextInput,
  select: SelectInput,
  multiselect: MultiSelect,
  toggle: ToggleInput,
  file: FileUpload,
  textarea: TextareaInput,
  date: TextInput,
  time: TextInput,
};

// ── Main PremiumForm Component ──────────────────────────────────────────────

export default function PremiumForm({
  fields = [],
  values = {},
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  title,
  subtitle,
  layout = 'grid', // 'grid' | 'single'
  columns = 2,
  sections,
}) {
  const handleChange = useCallback((name, val) => {
    if (onChange) onChange(name, val);
  }, [onChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  const renderField = (field, idx) => {
    const FieldComponent = FIELD_MAP[field.type || 'text'] || TextInput;
    return (
      <div key={field.name || idx} className={field.fullWidth || layout === 'single' ? 'col-span-full' : ''}>
        <FieldComponent field={field} value={values[field.name]} onChange={handleChange} error={errors[field.name]} />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              {cancelLabel}
            </button>
          )}
        </div>
      )}

      {/* Sections (grouped fields) */}
      {sections ? sections.map((section, si) => (
        <div key={si} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {section.title && (
            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{section.title}</h3>
              {section.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{section.description}</p>}
            </div>
          )}
          <div className="p-5">
            <div className={`grid grid-cols-1 md:grid-cols-${section.columns || columns} gap-5`}
              style={{ gridTemplateColumns: `repeat(${section.columns || columns}, minmax(0, 1fr))` }}>
              {section.fields.map((f, fi) => renderField(f, fi))}
            </div>
          </div>
        </div>
      )) : (
        /* Flat fields */
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-5`}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {fields.map((f, i) => renderField(f, i))}
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            {cancelLabel}
          </button>
        )}
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-sm">
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
