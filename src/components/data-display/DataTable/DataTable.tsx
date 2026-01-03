import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  className?: string;
  stickyHeader?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data found',
  emptyDescription = 'There are no records to display.',
  onRowClick,
  enableSorting = true,
  enablePagination = true,
  pageSize = 10,
  className,
  stickyHeader = false,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className={cn('bg-neutral-50', stickyHeader && 'sticky top-0 z-10')}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider',
                      header.column.getCanSort() && 'cursor-pointer select-none hover:bg-neutral-100'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {enableSorting && header.column.getCanSort() && (
                        <span className="text-neutral-400">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronsUpDown className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'hover:bg-neutral-50 transition-colors duration-150',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3.5 text-sm text-neutral-700 whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && data.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-white rounded-b-lg">
          <div className="text-sm text-neutral-500">
            Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * pageSize,
              data.length
            )}{' '}
            of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg border',
                'transition-colors duration-200',
                table.getCanPreviousPage()
                  ? 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  : 'border-neutral-200 text-neutral-400 cursor-not-allowed'
              )}
            >
              Previous
            </button>
            <span className="text-sm text-neutral-600">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg border',
                'transition-colors duration-200',
                table.getCanNextPage()
                  ? 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  : 'border-neutral-200 text-neutral-400 cursor-not-allowed'
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
