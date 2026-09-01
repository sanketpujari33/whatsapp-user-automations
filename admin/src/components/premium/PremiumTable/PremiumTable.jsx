import { useState, useMemo, useCallback } from 'react';
import {
  ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon,
  MagnifyingGlassIcon, ArrowDownTrayIcon, FunnelIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

const PAGE_SIZES = [10, 25, 50, 100];

export default function PremiumTable({
  columns = [],
  data = [],
  loading = false,
  total = 0,
  page: controlledPage,
  pageSize: controlledPageSize,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  onBulkAction,
  searchPlaceholder = 'Search...',
  title,
  actions,
  emptyMessage = 'No data found',
  emptyIcon,
  selectable = false,
  exportable = false,
  onExport,
}) {
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(25);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const page = controlledPage ?? internalPage;
  const pageSize = controlledPageSize ?? internalPageSize;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSort = useCallback((key) => {
    const dir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(dir);
    if (onSort) onSort(key, dir);
  }, [sortKey, sortDir, onSort]);

  const handleSearch = useCallback((val) => {
    setSearchTerm(val);
    if (onSearch) onSearch(val);
    if (!controlledPage) setInternalPage(1);
  }, [onSearch, controlledPage]);

  const handlePageChange = useCallback((p) => {
    if (!controlledPage) setInternalPage(p);
    if (onPageChange) onPageChange(p);
  }, [onPageChange, controlledPage]);

  const handlePageSizeChange = useCallback((size) => {
    if (!controlledPageSize) setInternalPageSize(size);
    if (onPageSizeChange) onPageSizeChange(size);
    if (!controlledPage) setInternalPage(1);
  }, [onPageSizeChange, controlledPageSize]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === data.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(data.map(r => r._id || r.id)));
  }, [data, selectedIds]);

  const SortIcon = ({ column }) => {
    if (sortKey !== column) return <ChevronUpDownIcon className="w-4 h-4 ml-1 opacity-40" />;
    return sortDir === 'asc'
      ? <ChevronUpIcon className="w-4 h-4 ml-1 text-indigo-500" />
      : <ChevronDownIcon className="w-4 h-4 ml-1 text-indigo-500" />;
  };

  const Pagination = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={e => handlePageSizeChange(Number(e.target.value))}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
        >
          {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span>{total} total</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => handlePageChange(1)} disabled={page <= 1}
          className="px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30">«</button>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}
          className="px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30">‹</button>
        <span className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {page} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}
          className="px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30">›</button>
        <button onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages}
          className="px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30">»</button>
      </div>
    </div>
  );

  const Skeleton = () => (
    <div className="animate-pulse">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
      {emptyIcon || (
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}
      <p className="text-lg font-medium">{emptyMessage}</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>}
          {onSearch && (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48 lg:w-64"
              />
              {searchTerm && (
                <button onClick={() => handleSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          )}
          <button onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition ${showFilters ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            <FunnelIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {exportable && onExport && (
            <button onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <ArrowDownTrayIcon className="w-4 h-4" /> Export
            </button>
          )}
          {actions}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            {columns.filter(c => c.filterable).map(col => (
              <div key={col.key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{col.label}</label>
                {col.filterType === 'select' ? (
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-transparent">
                    <option value="">All</option>
                    {col.filterOptions?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input placeholder={`Filter ${col.label}`}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-transparent w-40" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectable && selectedIds.size > 0 && onBulkAction && (
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/30 flex items-center gap-3">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{selectedIds.size} selected</span>
          <button onClick={() => onBulkAction('delete', [...selectedIds])}
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100">Delete Selected</button>
          <button onClick={() => setSelectedIds(new Set())}
            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={data.length > 0 && selectedIds.size === data.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                </th>
              )}
              {columns.map(col => (
                <th key={col.key}
                  onClick={() => col.sortable !== false ? handleSort(col.key) : undefined}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.sortable !== false ? 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200' : ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                  style={col.width ? { width: col.width } : undefined}>
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable !== false && <SortIcon column={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? <tr><td colSpan={columns.length + (selectable ? 1 : 0)}><Skeleton /></td></tr> :
             data.length === 0 ? <tr><td colSpan={columns.length + (selectable ? 1 : 0)}><EmptyState /></td></tr> :
             data.map((row, idx) => (
              <tr key={row._id || row.id || idx}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                {selectable && (
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(row._id || row.id)}
                      onChange={() => toggleSelect(row._id || row.id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key}
                    className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} ${col.nowrap ? 'whitespace-nowrap' : ''}`}>
                    {col.render ? col.render(row[col.key], row, idx) : row[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination />
    </div>
  );
}
