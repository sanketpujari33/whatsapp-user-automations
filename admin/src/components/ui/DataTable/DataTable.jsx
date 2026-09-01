import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import clsx from 'clsx';
import { Table, THead, TBody, Tr, Th, Td, Spinner, Pagination, Button } from 'components/ui';
import { PaginationSection } from 'components/shared/table/PaginationSection';

export default function DataTable({
  columns, data, total, loading, error,
  pageIndex = 0, pageSize = 10,
  onPageChange, onPageSizeChange,
  onRowClick, actions, title, searchable, emptyMessage = 'No data found',
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const tableColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: data || [],
    columns: tableColumns,
    state: { sorting, globalFilter, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((total || 0) / pageSize),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-red-500 dark:text-red-400 text-lg mb-2">⚠️</div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-hidden">
      {(title || searchable) && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-dark-600">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-dark-50">
              {title} {total !== undefined && <span className="text-sm text-gray-400 font-normal">({total})</span>}
            </h3>
          )}
          <div className="flex items-center gap-3 ml-auto">
            {searchable && (
              <input
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="pl-3 pr-3 py-1.5 text-sm border border-gray-300 dark:border-dark-500 rounded-lg bg-transparent dark:text-dark-100 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            )}
            {actions}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table hoverable className="w-full text-left">
          <THead>
            {table.getHeaderGroups().map(hg => (
              <Tr key={hg.id}>
                {hg.headers.map(h => (
                  <Th key={h.id} className="dark:bg-dark-800 bg-gray-100 font-semibold uppercase text-xs py-3 px-4 whitespace-nowrap">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
                  {emptyMessage}
                </Td>
              </Tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <Tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={clsx(
                    'border-b border-gray-100 dark:border-dark-600 last:border-0 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {row.getVisibleCells().map(cell => (
                    <Td key={cell.id} className="py-3 px-4 text-sm text-gray-700 dark:text-dark-200 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </TBody>
        </Table>
      </div>

      {(onPageChange || onPageSizeChange) && total > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-dark-600">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange?.(Number(e.target.value))}
              className="border border-gray-300 dark:border-dark-500 rounded bg-transparent dark:text-dark-100 text-sm py-1 px-2"
            >
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>of {total}</span>
          </div>
          {onPageChange && (
            <div className="flex items-center gap-2 text-sm">
              <Button
                size="sm"
                variant="ghost"
                disabled={pageIndex === 0}
                onClick={() => onPageChange(pageIndex - 1)}
              >
                Prev
              </Button>
              <span className="text-gray-600 dark:text-gray-400 px-2">
                {pageIndex + 1} / {Math.ceil(total / pageSize) || 1}
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={(pageIndex + 1) * pageSize >= total}
                onClick={() => onPageChange(pageIndex + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  total: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onRowClick: PropTypes.func,
  actions: PropTypes.node,
  title: PropTypes.string,
  searchable: PropTypes.bool,
  emptyMessage: PropTypes.string,
};
