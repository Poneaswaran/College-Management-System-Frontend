/**
 * DataTable — A reusable, themed table component with built-in pagination.
 *
 * Usage:
 *   <DataTable
 *     columns={[{ key: 'name', header: 'Name' }, ...]}
 *     data={rows}
 *     pageSize={10}
 *   />
 *
 * Colors come from CSS variables (theme.tsx / theme.constants.ts).
 */

import { useState, useMemo, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Inbox } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface Column<T> {
    /** Unique key for the column — also used to access `row[key]` when no `render` is provided */
    key: string;
    /** Column header label */
    header: string;
    /** Optional custom renderer. Receives the full row. */
    render?: (row: T, index: number) => ReactNode;
    /** Text alignment, defaults to 'left' */
    align?: 'left' | 'center' | 'right';
    /** Whether the column is sortable. Defaults to false. */
    sortable?: boolean;
    /** Optional min-width for the column */
    minWidth?: string;
    /** Optional className applied to both <th> and <td> */
    className?: string;
}

export interface DataTableProps<T> {
    /** Column definitions */
    columns: Column<T>[];
    /** The full dataset to render */
    data: T[];
    /** Rows per page. Set to 0 or Infinity to disable pagination. Defaults to 10. */
    pageSize?: number;
    /** Options shown in the "rows per page" selector. Defaults to [5, 10, 20, 50] */
    pageSizeOptions?: number[];
    /** Whether to show the page-size selector. Defaults to true. */
    showPageSizeSelector?: boolean;
    /** Text shown when there are no rows */
    emptyMessage?: string;
    /** Optional icon shown when there are no rows */
    emptyIcon?: ReactNode;
    /** Additional className for the outer container */
    className?: string;
    /** Unique key extractor — defaults to `(row as any).id ?? index` */
    rowKey?: (row: T, index: number) => string | number;
    /** Whether the table is in a loading state */
    loading?: boolean;
    /** Optional row click handler */
    onRowClick?: (row: T) => void;
    /** Total count from server for server-side pagination (overrides client-side) */
    totalCount?: number;
    /** Current page (1-based) for server-side pagination  */
    currentPage?: number;
    /** Callback when page changes for server-side pagination */
    onPageChange?: (page: number) => void;
    /** Callback when page size changes for server-side pagination */
    onPageSizeChange?: (pageSize: number) => void;
}

// ============================================
// COMPONENT
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    showPageSizeSelector = true,
    emptyMessage = 'No data found',
    emptyIcon,
    className = '',
    rowKey,
    loading = false,
    onRowClick,
    totalCount,
    currentPage: controlledPage,
    onPageChange,
    onPageSizeChange,
}: DataTableProps<T>) {
    // ---- Internal state (client-side pagination) ----
    const [internalPage, setInternalPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const isServerSide = totalCount !== undefined && onPageChange !== undefined;
    const page = isServerSide && controlledPage ? controlledPage : internalPage;

    const totalItems = isServerSide ? totalCount! : data.length;
    const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

    // Paginated rows (client-side only)
    const paginatedData = useMemo(() => {
        if (isServerSide) return data; // server already returns the correct page
        if (pageSize <= 0) return data;
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, page, pageSize, isServerSide]);

    const goToPage = (p: number) => {
        const target = Math.max(1, Math.min(p, totalPages));
        if (isServerSide && onPageChange) {
            onPageChange(target);
        } else {
            setInternalPage(target);
        }
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        if (isServerSide && onPageSizeChange) {
            onPageSizeChange(newSize);
        }
        goToPage(1);
    };

    const getRowKey = (row: T, index: number): string | number => {
        if (rowKey) return rowKey(row, index);
        if ('id' in row) return row.id as string | number;
        return index;
    };

    // Calculate visible page numbers
    const visiblePages = useMemo(() => {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [page, totalPages]);

    const startRow = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const endRow = Math.min(page * pageSize, totalItems);

    // ---- Render ----
    return (
        <div className={`bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden ${className}`}>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-[var(--color-foreground-muted)] bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-4 font-semibold text-xs uppercase tracking-wider whitespace-nowrap ${col.align === 'center' ? 'text-center' :
                                        col.align === 'right' ? 'text-right' : 'text-left'
                                        } ${col.className || ''}`}
                                    style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {loading ? (
                            /* Loading skeleton rows */
                            Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
                                <tr key={`skeleton-${i}`}>
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4">
                                            <div className="h-4 bg-[var(--color-background-tertiary)] rounded-md animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={getRowKey(row, (page - 1) * pageSize + rowIndex)}
                                    className={`transition-colors hover:bg-[var(--color-background-secondary)]/60 ${onRowClick ? 'cursor-pointer' : ''
                                        }`}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-6 py-4 ${col.align === 'center' ? 'text-center' :
                                                col.align === 'right' ? 'text-right' : 'text-left'
                                                } ${col.className || ''}`}
                                        >
                                            {col.render
                                                ? col.render(row, (page - 1) * pageSize + rowIndex)
                                                : (row[col.key] as ReactNode) ?? '—'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        {emptyIcon || <Inbox size={40} className="text-[var(--color-foreground-muted)] opacity-40" />}
                                        <p className="text-[var(--color-foreground-muted)] text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalItems > 0 && pageSize > 0 && (
                <div className="px-6 py-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left: info + page size */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--color-foreground-muted)]">
                            Showing <span className="font-medium text-[var(--color-foreground)]">{startRow}</span> to{' '}
                            <span className="font-medium text-[var(--color-foreground)]">{endRow}</span> of{' '}
                            <span className="font-medium text-[var(--color-foreground)]">{totalItems}</span> results
                        </span>
                        {showPageSizeSelector && (
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="px-2 py-1 text-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                            >
                                {pageSizeOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt} / page
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Right: page navigation */}
                    <div className="flex items-center gap-1">
                        {/* First page */}
                        <button
                            onClick={() => goToPage(1)}
                            disabled={page === 1}
                            className="p-1.5 rounded-lg text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="First page"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        {/* Prev page */}
                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                            className="p-1.5 rounded-lg text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Previous page"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Page numbers */}
                        {visiblePages.map((p) => (
                            <button
                                key={p}
                                onClick={() => goToPage(p)}
                                className={`min-w-[32px] h-8 text-sm font-medium rounded-lg transition-colors ${p === page
                                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                    : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-foreground)]'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}

                        {/* Next page */}
                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page === totalPages}
                            className="p-1.5 rounded-lg text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Next page"
                        >
                            <ChevronRight size={16} />
                        </button>
                        {/* Last page */}
                        <button
                            onClick={() => goToPage(totalPages)}
                            disabled={page === totalPages}
                            className="p-1.5 rounded-lg text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Last page"
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

DataTable.displayName = 'DataTable';
export default DataTable;
