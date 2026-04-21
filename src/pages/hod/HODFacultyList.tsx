import { useCallback, useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';

import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import DataTable, { type Column } from '../../components/ui/DataTable';
import SearchInput from '../../components/ui/SearchInput';
import FilterBar from '../../components/ui/FilterBar';
import { Select, type SelectOption } from '../../components/ui/Select';
import {
    fetchHODFacultyList,
    type HODFacultyListItem,
} from '../../services/hodFaculty.service';

type FacultyStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

const STATUS_OPTIONS: SelectOption[] = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedValue(value), delay);
        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

const facultyColumns: Column<HODFacultyListItem>[] = [
    {
        key: 'full_name',
        header: 'Faculty',
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-medium text-[var(--color-foreground)]">{row.full_name}</span>
                <span className="text-xs text-[var(--color-foreground-muted)]">{row.email || 'No email'}</span>
            </div>
        ),
    },
    {
        key: 'designation',
        header: 'Designation',
    },
    {
        key: 'specialization',
        header: 'Specialization',
    },
    {
        key: 'teaching_load',
        header: 'Load (hrs/week)',
        align: 'right',
        render: (row) => <span className="font-medium">{row.teaching_load}</span>,
    },
    {
        key: 'office_hours',
        header: 'Office Hours',
        render: (row) => row.office_hours || 'Not set',
    },
    {
        key: 'is_active',
        header: 'Status',
        align: 'center',
        render: (row) => (
            <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    row.is_active
                        ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                        : 'bg-[var(--color-error-light)] text-[var(--color-error)]'
                }`}
            >
                {row.is_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
        ),
    },
];

export default function HODFacultyList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [designationFilter, setDesignationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<FacultyStatusFilter>('ALL');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [rows, setRows] = useState<HODFacultyListItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebounce(searchTerm, 350);
    const debouncedDesignation = useDebounce(designationFilter, 350);

    const loadFaculty = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchHODFacultyList({
                search: debouncedSearch || undefined,
                designation: debouncedDesignation || undefined,
                is_active:
                    statusFilter === 'ALL'
                        ? undefined
                        : statusFilter === 'ACTIVE',
                page,
                page_size: pageSize,
            });

            setRows(response.results || []);
            setTotalCount(response.count || 0);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Failed to load department faculty list';
            setError(message);
            setRows([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, debouncedDesignation, statusFilter, page, pageSize]);

    useEffect(() => {
        void loadFaculty();
    }, [loadFaculty]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, debouncedDesignation, statusFilter]);

    const subtitle = useMemo(() => {
        if (!rows.length) {
            return 'Faculty members mapped to your department';
        }
        const department = rows[0]?.department_name;
        return department
            ? `${department} Department Faculty`
            : 'Faculty members mapped to your department';
    }, [rows]);

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <Header title="Faculty List" titleIcon={<Users size={28} />} />

                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[var(--color-foreground-muted)]">{subtitle}</p>
                    <span className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                        Total: {totalCount}
                    </span>
                </div>

                <FilterBar className="mb-6">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search by faculty name, email, specialization..."
                        wrapperClassName="w-full md:w-[420px]"
                    />

                    <FilterBar.Actions className="w-full md:w-auto">
                        <SearchInput
                            value={designationFilter}
                            onChange={setDesignationFilter}
                            placeholder="Filter by designation"
                            wrapperClassName="w-full md:w-64"
                        />
                        <Select
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value as FacultyStatusFilter)}
                            options={STATUS_OPTIONS}
                            wrapperClassName="w-full md:w-44"
                        />
                    </FilterBar.Actions>
                </FilterBar>

                {error && (
                    <div className="mb-4 rounded-lg border border-[var(--color-error)] bg-[var(--color-error-light)] p-3 text-sm text-[var(--color-error)]">
                        {error}
                    </div>
                )}

                <DataTable<HODFacultyListItem>
                    columns={facultyColumns}
                    data={rows}
                    loading={loading}
                    totalCount={totalCount}
                    currentPage={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    emptyMessage="No faculty found for the selected filters"
                />
            </div>
        </PageLayout>
    );
}
