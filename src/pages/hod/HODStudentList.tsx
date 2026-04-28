import { useCallback, useEffect, useState } from 'react';
import { GraduationCap, Users, Download, MoreHorizontal } from 'lucide-react';

import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import DataTable, { type Column } from '../../components/ui/DataTable';
import SearchInput from '../../components/ui/SearchInput';
import FilterBar from '../../components/ui/FilterBar';
import { Select, type SelectOption } from '../../components/ui/Select';
import {
    fetchHODStudentList,
    type HODStudentListItem,
} from '../../services/hodStudent.service';

type StudentStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE' | 'ALUMNI';

const STATUS_OPTIONS: SelectOption[] = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'ALUMNI', label: 'Alumni' },
];

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedValue(value), delay);
        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-[var(--color-success)]';
    if (percentage >= 75) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-error)]';
};

const studentColumns: Column<HODStudentListItem>[] = [
    {
        key: 'fullName',
        header: 'Student',
        render: (row) => (
            <div className="flex items-center gap-3">
                {row.profilePhoto ? (
                    <img 
                        src={row.profilePhoto} 
                        alt={row.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center text-[var(--color-foreground-muted)]">
                        <Users size={14} />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-medium text-[var(--color-foreground)]">{row.fullName}</span>
                    <span className="text-xs text-[var(--color-foreground-muted)]">{row.email}</span>
                </div>
            </div>
        ),
    },
    {
        key: 'registerNumber',
        header: 'Reg. Number',
        render: (row) => <span className="font-mono text-sm">{row.registerNumber}</span>,
    },
    {
        key: 'courseName',
        header: 'Course / Year',
        render: (row) => (
            <div className="flex flex-col">
                <span className="text-sm">{row.courseName}</span>
                <span className="text-xs text-[var(--color-foreground-muted)]">Year {row.year} • Sem {row.semester}</span>
            </div>
        ),
    },
    {
        key: 'sectionName',
        header: 'Section',
        align: 'center',
    },
    {
        key: 'attendancePercentage',
        header: 'Attendance',
        render: (row) => {
            const percentage = row.attendancePercentage ?? 0;
            return (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                        <div
                            className={`h-full ${percentage >= 75 ? 'bg-[var(--color-success)]' : 'bg-[var(--color-error)]'}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className={`text-xs font-medium ${getAttendanceColor(percentage)}`}>
                        {percentage}%
                    </span>
                </div>
            );
        },
    },
    {
        key: 'gpa',
        header: 'GPA',
        align: 'center',
        render: (row) => (
            <span className="font-semibold text-sm">
                {row.gpa !== undefined ? row.gpa.toFixed(2) : 'N/A'}
            </span>
        ),
    },
    {
        key: 'academicStatus',
        header: 'Status',
        render: (row) => (
            <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    row.academicStatus === 'ACTIVE'
                        ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                        : 'bg-[var(--color-error-light)] text-[var(--color-error)]'
                }`}
            >
                {row.academicStatus}
            </span>
        ),
    },
    {
        key: 'id',
        header: '',
        align: 'right',
        render: () => (
            <button className="p-1.5 text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors">
                <MoreHorizontal size={16} />
            </button>
        ),
    },
];

export default function HODStudentList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StudentStatusFilter>('ALL');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [rows, setRows] = useState<HODStudentListItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebounce(searchTerm, 350);

    const loadStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchHODStudentList({
                search: debouncedSearch || undefined,
                academic_status: statusFilter === 'ALL' ? undefined : statusFilter,
                page,
                page_size: pageSize,
            });

            setRows(response.results || []);
            setTotalCount(response.count || 0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load student list';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, statusFilter, page, pageSize]);

    useEffect(() => {
        void loadStudents();
    }, [loadStudents]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter]);

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <Header 
                    title="Student Directory" 
                    titleIcon={<GraduationCap size={28} className="text-[var(--color-primary)]" />} 
                />

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-[var(--color-foreground-muted)]">
                            Monitor and manage students within your department
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] transition-colors">
                            <Download size={16} />
                            Export List
                        </button>
                    </div>
                </div>

                <FilterBar className="mb-6">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search by name, register number..."
                        wrapperClassName="w-full md:w-[400px]"
                    />

                    <FilterBar.Actions>
                        <Select
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value as StudentStatusFilter)}
                            options={STATUS_OPTIONS}
                            wrapperClassName="w-full md:w-44"
                        />
                    </FilterBar.Actions>
                </FilterBar>

                {error && (
                    <div className="mb-6 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-light)] p-4 text-sm text-[var(--color-error)] flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)]" />
                        {error}
                    </div>
                )}

                <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
                    <DataTable<HODStudentListItem>
                        columns={studentColumns}
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
                        emptyMessage="No students found matching your search criteria"
                    />
                </div>
            </div>
        </PageLayout>
    );
}
