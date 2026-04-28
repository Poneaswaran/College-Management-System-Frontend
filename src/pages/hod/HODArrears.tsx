import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Download, FileText } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import DataTable, { type Column } from '../../components/ui/DataTable';
import SearchInput from '../../components/ui/SearchInput';
import FilterBar from '../../components/ui/FilterBar';
import { fetchHODArrears, type ArrearResult } from '../../services/hodArrears.service';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedValue(value), delay);
        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

const arrearColumns: Column<ArrearResult>[] = [
    {
        key: 'student',
        header: 'Student',
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-medium text-[var(--color-foreground)]">{row.student.full_name}</span>
                <span className="text-xs text-[var(--color-foreground-muted)] font-mono">{row.student.register_number}</span>
            </div>
        ),
    },
    {
        key: 'subject',
        header: 'Subject',
        render: (row) => (
            <div className="flex flex-col">
                <span className="text-sm">{row.subject.name}</span>
                <span className="text-xs text-[var(--color-foreground-muted)] font-mono">{row.subject.code}</span>
            </div>
        ),
    },
    {
        key: 'semester',
        header: 'Sem',
        align: 'center',
        render: (row) => <span className="text-sm font-medium">{row.student.semester}</span>,
    },
    {
        key: 'exam_name',
        header: 'Exam',
        render: (row) => <span className="text-sm">{row.exam_name}</span>,
    },
    {
        key: 'marks',
        header: 'Marks',
        align: 'center',
        render: (row) => (
            <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-[var(--color-error)]">{row.marks_obtained}</span>
                <span className="text-[10px] text-[var(--color-foreground-muted)]">{row.percentage}%</span>
            </div>
        ),
    },
    {
        key: 'grade_letter',
        header: 'Grade',
        align: 'center',
        render: (row) => (
            <span className="px-2 py-0.5 rounded-md bg-[var(--color-error-light)] text-[var(--color-error)] text-xs font-bold">
                {row.grade_letter}
            </span>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (row) => (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-background-secondary)] text-[var(--color-foreground-muted)]">
                {row.status}
            </span>
        ),
    },
];

export default function HODArrears() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState<ArrearResult[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebounce(searchTerm, 350);

    const loadArrears = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchHODArrears({
                search: debouncedSearch || undefined,
                page,
                page_size: pageSize,
            });

            setRows(response.results || []);
            setTotalCount(response.count || 0);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load arrears';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page, pageSize]);

    useEffect(() => {
        loadArrears();
    }, [loadArrears]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <Header 
                    title="Arrear Management" 
                    titleIcon={<AlertCircle size={28} className="text-[var(--color-error)]" />} 
                />

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-[var(--color-foreground-muted)]">
                            Track students with outstanding backlogs in your department
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] transition-colors shadow-sm"
                            data-testid="export-csv-btn"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                <FilterBar className="mb-6">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search student or subject..."
                        wrapperClassName="w-full md:w-[400px]"
                        data-testid="arrears-search-input"
                    />
                </FilterBar>

                {error && (
                    <div className="mb-6 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-light)] p-4 text-sm text-[var(--color-error)] flex items-center gap-3">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
                    <DataTable<ArrearResult>
                        columns={arrearColumns}
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
                        emptyMessage="No arrears found for your department"
                        emptyIcon={<FileText size={40} className="text-[var(--color-foreground-muted)] opacity-20" />}
                    />
                </div>
            </div>
        </PageLayout>
    );
}
