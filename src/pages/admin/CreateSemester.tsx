import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, CalendarPlus2, Filter } from 'lucide-react';
import axios from 'axios';
import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Dropdown } from '../../components/ui/Dropdown';
import FormInput from '../../components/ui/FormInput';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import api from '../../services/api';

interface Semester {
    id: number;
    academic_year_id: number;
    academic_year_code: string;
    number: number;
    number_display: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
}

interface SemestersResponse {
    semesters: Semester[];
}

interface GetSemesterFilters {
    academic_year_id?: number;
    is_current?: boolean;
}

interface CreateSemesterPayload {
    academic_year_id: number;
    number: number;
    start_date: string;
    end_date: string;
    is_current: boolean;
}

interface SemesterFormState {
    academicYearId: string;
    number: string;
    startDate: string;
    endDate: string;
    isCurrent: string;
}

interface AcademicYear {
    id: number;
    year_code: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
}

interface AcademicYearPagination {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
}

interface AcademicYearsResponse {
    academic_years: AcademicYear[];
    pagination: AcademicYearPagination;
}

interface CreateAcademicYearPayload {
    year_code: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
}

interface AcademicYearFormState {
    yearCode: string;
    startDate: string;
    endDate: string;
    isCurrent: string;
}

interface GetAcademicYearFilters {
    page: number;
    page_size: number;
    is_current?: boolean;
}

const defaultFormState: SemesterFormState = {
    academicYearId: '',
    number: '',
    startDate: '',
    endDate: '',
    isCurrent: 'false',
};

const defaultAcademicYearFormState: AcademicYearFormState = {
    yearCode: '',
    startDate: '',
    endDate: '',
    isCurrent: 'false',
};

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const toBoolean = (value: unknown): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
};

const formatDate = (value: string): string => {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString();
};

const parseApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
    if (!axios.isAxiosError(error)) {
        return fallbackMessage;
    }

    const data = error.response?.data;
    if (typeof data === 'string' && data.trim()) {
        return data;
    }

    if (typeof data === 'object' && data !== null) {
        if ('message' in data && typeof data.message === 'string' && data.message.trim()) {
            return data.message;
        }

        const validationParts = Object.entries(data)
            .map(([field, value]) => {
                if (Array.isArray(value)) {
                    const messages = value
                        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
                        .join(', ');
                    return messages ? `${field}: ${messages}` : '';
                }

                if (typeof value === 'string' && value.trim()) {
                    return `${field}: ${value}`;
                }

                return '';
            })
            .filter((item) => item.length > 0);

        if (validationParts.length > 0) {
            return validationParts.join(' | ');
        }
    }

    return fallbackMessage;
};

const parseBooleanLike = (value: string): boolean | null => {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalized)) return true;
    if (['false', '0', 'no'].includes(normalized)) return false;
    return null;
};

const toComparableDate = (dateValue: string): Date => new Date(`${dateValue}T00:00:00`);

const buildAcademicYearFilters = (
    page: number,
    pageSize: number,
    currentFilter: string
): GetAcademicYearFilters => {
    const filters: GetAcademicYearFilters = {
        page,
        page_size: pageSize,
    };

    if (currentFilter === 'true' || currentFilter === 'false') {
        filters.is_current = currentFilter === 'true';
    }

    return filters;
};

export default function CreateSemester() {
    const { addToast } = useToast();

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [filterAcademicYearId, setFilterAcademicYearId] = useState<string>('');
    const [filterIsCurrent, setFilterIsCurrent] = useState<string>('');

    const [formState, setFormState] = useState<SemesterFormState>(defaultFormState);

    const [isAcademicYearModalOpen, setIsAcademicYearModalOpen] = useState<boolean>(false);
    const [isAcademicYearSubmitting, setIsAcademicYearSubmitting] = useState<boolean>(false);
    const [academicYearsLoading, setAcademicYearsLoading] = useState<boolean>(false);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

    const [academicYearFormState, setAcademicYearFormState] = useState<AcademicYearFormState>(defaultAcademicYearFormState);
    const [academicYearCurrentFilter, setAcademicYearCurrentFilter] = useState<string>('');
    const [academicYearAppliedCurrentFilter, setAcademicYearAppliedCurrentFilter] = useState<string>('');
    const [academicYearPage, setAcademicYearPage] = useState<number>(1);
    const [academicYearPageSize, setAcademicYearPageSize] = useState<number>(20);
    const [academicYearTotalItems, setAcademicYearTotalItems] = useState<number>(0);

    const getSemesterFilters = useCallback((): GetSemesterFilters => {
        const filters: GetSemesterFilters = {};

        if (filterAcademicYearId.trim()) {
            filters.academic_year_id = Number(filterAcademicYearId);
        }

        if (filterIsCurrent === 'true' || filterIsCurrent === 'false') {
            filters.is_current = filterIsCurrent === 'true';
        }

        return filters;
    }, [filterAcademicYearId, filterIsCurrent]);

    const fetchSemesters = useCallback(async (filters?: GetSemesterFilters) => {
        try {
            setLoading(true);
            const response = await api.get<SemestersResponse>('/api/core/semesters/', {
                params: filters,
            });
            setSemesters(response.data.semesters ?? []);
        } catch (error: unknown) {
            const message = parseApiErrorMessage(error, 'Failed to load semesters.');
            addToast({ type: 'error', title: message });
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const getAcademicYearFilters = useCallback((): GetAcademicYearFilters => {
        return buildAcademicYearFilters(academicYearPage, academicYearPageSize, academicYearAppliedCurrentFilter);
    }, [academicYearAppliedCurrentFilter, academicYearPage, academicYearPageSize]);

    const fetchAcademicYears = useCallback(async (filters?: GetAcademicYearFilters) => {
        try {
            setAcademicYearsLoading(true);
            const response = await api.get<AcademicYearsResponse>('/api/core/academic-years/', {
                params: filters ?? getAcademicYearFilters(),
            });

            setAcademicYears(response.data.academic_years ?? []);
            setAcademicYearTotalItems(response.data.pagination?.total_items ?? 0);
        } catch (error: unknown) {
            const message = parseApiErrorMessage(error, 'Failed to load academic years.');
            addToast({ type: 'error', title: message });
        } finally {
            setAcademicYearsLoading(false);
        }
    }, [addToast, getAcademicYearFilters]);

    useEffect(() => {
        fetchSemesters();
    }, [fetchSemesters]);

    useEffect(() => {
        if (isAcademicYearModalOpen) {
            fetchAcademicYears();
        }
    }, [fetchAcademicYears, isAcademicYearModalOpen]);

    const onFilterApply = async () => {
        if (filterAcademicYearId.trim() && Number.isNaN(Number(filterAcademicYearId))) {
            addToast({ type: 'error', title: 'Academic year id filter must be a number.' });
            return;
        }

        await fetchSemesters(getSemesterFilters());
    };

    const onFilterReset = async () => {
        setFilterAcademicYearId('');
        setFilterIsCurrent('');
        await fetchSemesters();
    };

    const onChangeFormState = (key: keyof SemesterFormState, value: string) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };

    const onChangeAcademicYearFormState = (key: keyof AcademicYearFormState, value: string) => {
        setAcademicYearFormState((prev) => ({ ...prev, [key]: value }));
    };

    const validateCreateForm = (): CreateSemesterPayload | null => {
        if (!formState.academicYearId || !formState.number || !formState.startDate || !formState.endDate) {
            addToast({ type: 'error', title: 'All semester fields are required.' });
            return null;
        }

        const academicYearId = Number(formState.academicYearId);
        const number = Number(formState.number);

        if (!Number.isInteger(academicYearId) || academicYearId <= 0) {
            addToast({ type: 'error', title: 'Academic year id must be a positive integer.' });
            return null;
        }

        if (!Number.isInteger(number) || number <= 0) {
            addToast({ type: 'error', title: 'Semester number must be a positive integer.' });
            return null;
        }

        const startDate = new Date(formState.startDate);
        const endDate = new Date(formState.endDate);

        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            addToast({ type: 'error', title: 'Start date and end date must be valid dates.' });
            return null;
        }

        if (endDate < startDate) {
            addToast({ type: 'error', title: 'End date cannot be before start date.' });
            return null;
        }

        return {
            academic_year_id: academicYearId,
            number,
            start_date: formState.startDate,
            end_date: formState.endDate,
            is_current: formState.isCurrent === 'true',
        };
    };

    const onCreateSemester = async () => {
        const payload = validateCreateForm();
        if (!payload) return;

        try {
            setIsSubmitting(true);
            await api.post('/api/core/admin/semesters/create/', payload);
            addToast({ type: 'success', title: 'Semester created successfully.' });
            setFormState(defaultFormState);
            await fetchSemesters(getSemesterFilters());
        } catch (error: unknown) {
            const message = parseApiErrorMessage(error, 'Failed to create semester.');
            addToast({ type: 'error', title: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateAcademicYearForm = (): CreateAcademicYearPayload | null => {
        if (!academicYearFormState.yearCode || !academicYearFormState.startDate || !academicYearFormState.endDate) {
            addToast({ type: 'error', title: 'Year code, start date, and end date are required.' });
            return null;
        }

        if (!DATE_REGEX.test(academicYearFormState.startDate) || !DATE_REGEX.test(academicYearFormState.endDate)) {
            addToast({ type: 'error', title: 'Dates must be in YYYY-MM-DD format.' });
            return null;
        }

        const isCurrentBoolean = parseBooleanLike(academicYearFormState.isCurrent);
        if (isCurrentBoolean === null) {
            addToast({ type: 'error', title: 'Is Current must be a boolean-like value.' });
            return null;
        }

        const startDate = toComparableDate(academicYearFormState.startDate);
        const endDate = toComparableDate(academicYearFormState.endDate);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            addToast({ type: 'error', title: 'Start date and end date must be valid dates.' });
            return null;
        }

        if (startDate >= endDate) {
            addToast({ type: 'error', title: 'Start date must be before end date.' });
            return null;
        }

        return {
            year_code: academicYearFormState.yearCode.trim(),
            start_date: academicYearFormState.startDate,
            end_date: academicYearFormState.endDate,
            is_current: isCurrentBoolean,
        };
    };

    const onCreateAcademicYear = async () => {
        const payload = validateAcademicYearForm();
        if (!payload) return;

        try {
            setIsAcademicYearSubmitting(true);
            const response = await api.post('/api/core/admin/academic-years/create/', payload);

            if (response.status === 201) {
                addToast({ type: 'success', title: 'Academic year created successfully.' });
            } else if (response.status === 200) {
                addToast({ type: 'info', title: 'Academic year already exists for this year code.' });
            } else {
                addToast({ type: 'success', title: 'Academic year saved successfully.' });
            }

            setAcademicYearFormState(defaultAcademicYearFormState);
            setAcademicYearPage(1);
            await fetchAcademicYears();
        } catch (error: unknown) {
            const message = parseApiErrorMessage(error, 'Failed to create academic year.');
            addToast({ type: 'error', title: message });
        } finally {
            setIsAcademicYearSubmitting(false);
        }
    };

    const onAcademicYearFilterApply = async () => {
        const filters = buildAcademicYearFilters(1, academicYearPageSize, academicYearCurrentFilter);
        setAcademicYearPage(1);
        setAcademicYearAppliedCurrentFilter(academicYearCurrentFilter);
        await fetchAcademicYears(filters);
    };

    const onAcademicYearFilterReset = async () => {
        const filters = buildAcademicYearFilters(1, academicYearPageSize, '');
        setAcademicYearCurrentFilter('');
        setAcademicYearAppliedCurrentFilter('');
        setAcademicYearPage(1);
        await fetchAcademicYears(filters);
    };

    const openAcademicYearModal = () => {
        setIsAcademicYearModalOpen(true);
    };

    const closeAcademicYearModal = () => {
        setIsAcademicYearModalOpen(false);
        setAcademicYearFormState(defaultAcademicYearFormState);
        setAcademicYearCurrentFilter('');
        setAcademicYearAppliedCurrentFilter('');
        setAcademicYearPage(1);
        setAcademicYearPageSize(20);
    };

    const currentStatusOptions = useMemo(
        () => [
            { label: 'All', value: '' },
            { label: 'Current Only', value: 'true' },
            { label: 'Not Current', value: 'false' },
        ],
        []
    );

    const createCurrentOptions = useMemo(
        () => [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
        ],
        []
    );

    const academicYearCurrentOptions = useMemo(
        () => [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
        ],
        []
    );

    const academicYearFilterOptions = useMemo(
        () => [
            { label: 'All', value: '' },
            { label: 'Current Only', value: 'true' },
            { label: 'Not Current', value: 'false' },
        ],
        []
    );

    const columns: Column<Semester>[] = [
        {
            key: 'id',
            header: 'ID',
            render: (row) => <span className="font-semibold">{row.id}</span>,
        },
        {
            key: 'academicYear',
            header: 'Academic Year',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-[var(--color-foreground)]">{row.academic_year_code}</span>
                    <span className="text-xs text-[var(--color-foreground-muted)]">ID: {row.academic_year_id}</span>
                </div>
            ),
        },
        {
            key: 'number',
            header: 'Semester',
            render: (row) => row.number_display || `Semester ${row.number}`,
        },
        {
            key: 'startDate',
            header: 'Start Date',
            render: (row) => formatDate(row.start_date),
        },
        {
            key: 'endDate',
            header: 'End Date',
            render: (row) => formatDate(row.end_date),
        },
        {
            key: 'isCurrent',
            header: 'Current',
            render: (row) => (
                <span
                    className={[
                        'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border',
                        toBoolean(row.is_current)
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-[var(--color-background-secondary)] text-[var(--color-foreground-muted)] border-[var(--color-border)]',
                    ].join(' ')}
                >
                    {toBoolean(row.is_current) ? 'Yes' : 'No'}
                </span>
            ),
            align: 'center',
        },
    ];

    const academicYearColumns: Column<AcademicYear>[] = [
        {
            key: 'id',
            header: 'ID',
            render: (row) => <span className="font-semibold">{row.id}</span>,
        },
        {
            key: 'yearCode',
            header: 'Year Code',
            render: (row) => <span className="font-semibold text-[var(--color-foreground)]">{row.year_code}</span>,
        },
        {
            key: 'startDate',
            header: 'Start Date',
            render: (row) => row.start_date,
        },
        {
            key: 'endDate',
            header: 'End Date',
            render: (row) => row.end_date,
        },
        {
            key: 'isCurrent',
            header: 'Current',
            render: (row) => (
                <span
                    className={[
                        'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border',
                        row.is_current
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-[var(--color-background-secondary)] text-[var(--color-foreground-muted)] border-[var(--color-border)]',
                    ].join(' ')}
                >
                    {row.is_current ? 'Yes' : 'No'}
                </span>
            ),
            align: 'center',
        },
    ];

    return (
        <PageLayout>
            <div className="space-y-6 pb-8">
                <Header
                    title="Create Semester"
                    className="mb-2"
                    titleIcon={
                        <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                            <CalendarPlus2 size={20} className="text-[var(--color-primary)]" />
                        </span>
                    }
                    actions={
                        <Button
                            type="button"
                            onClick={openAcademicYearModal}
                            className="h-10 px-4 whitespace-nowrap"
                            data-testid="open-academic-year-modal"
                        >
                            Create Academic Year
                        </Button>
                    }
                />

                <div className="px-4 md:px-6 lg:px-8 space-y-6">
                    <div className="p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] space-y-4">
                        <div className="flex items-center gap-2 text-[var(--color-foreground)]">
                            <Filter size={18} />
                            <h2 className="text-base font-semibold">Filter Semesters</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInput
                                id="filter-academic-year-id"
                                type="number"
                                min="1"
                                label="Academic Year Id"
                                value={filterAcademicYearId}
                                onChange={(event) => setFilterAcademicYearId(event.target.value)}
                                placeholder="e.g. 1"
                            />
                            <Dropdown
                                label="Current Status"
                                options={currentStatusOptions}
                                value={filterIsCurrent}
                                onChange={(value) => setFilterIsCurrent(String(value))}
                                placeholder="Select status"
                                dataTestId="semester-current-filter"
                            />
                            <div className="flex items-end gap-3">
                                <Button
                                    type="button"
                                    onClick={onFilterApply}
                                    disabled={loading}
                                    className="h-10"
                                    data-testid="semester-filter-apply"
                                >
                                    Apply
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onFilterReset}
                                    disabled={loading}
                                    className="h-10"
                                    data-testid="semester-filter-reset"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] space-y-4">
                        <h2 className="text-base font-semibold text-[var(--color-foreground)]">New Semester</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                id="create-semester-academic-year-id"
                                type="number"
                                min="1"
                                required
                                label="Academic Year Id"
                                value={formState.academicYearId}
                                onChange={(event) => onChangeFormState('academicYearId', event.target.value)}
                                placeholder="e.g. 1"
                            />
                            <FormInput
                                id="create-semester-number"
                                type="number"
                                min="1"
                                required
                                label="Semester Number"
                                value={formState.number}
                                onChange={(event) => onChangeFormState('number', event.target.value)}
                                placeholder="e.g. 1"
                            />
                            <FormInput
                                id="create-semester-start-date"
                                type="date"
                                required
                                label="Start Date"
                                value={formState.startDate}
                                onChange={(event) => onChangeFormState('startDate', event.target.value)}
                            />
                            <FormInput
                                id="create-semester-end-date"
                                type="date"
                                required
                                label="End Date"
                                value={formState.endDate}
                                onChange={(event) => onChangeFormState('endDate', event.target.value)}
                            />
                            <Dropdown
                                label="Is Current"
                                options={createCurrentOptions}
                                value={formState.isCurrent}
                                onChange={(value) => onChangeFormState('isCurrent', String(value))}
                                placeholder="Select one"
                                dataTestId="create-semester-current"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={onCreateSemester}
                                disabled={isSubmitting}
                                className="h-11 px-6"
                                data-testid="create-semester-submit"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Semester'}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={semesters}
                            loading={loading}
                            emptyMessage="No semesters found for the selected filters."
                        />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isAcademicYearModalOpen}
                onClose={closeAcademicYearModal}
                title="Create Academic Year"
                maxWidth="max-w-6xl"
            >
                <div className="space-y-6">
                    <div className="p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] space-y-4">
                        <div className="flex items-center gap-2 text-[var(--color-foreground)]">
                            <CalendarDays size={18} />
                            <h2 className="text-base font-semibold">New Academic Year</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                id="create-academic-year-code"
                                type="text"
                                required
                                label="Year Code"
                                value={academicYearFormState.yearCode}
                                onChange={(event) => onChangeAcademicYearFormState('yearCode', event.target.value)}
                                placeholder="e.g. 2026-27"
                            />
                            <Dropdown
                                label="Is Current"
                                options={academicYearCurrentOptions}
                                value={academicYearFormState.isCurrent}
                                onChange={(value) => onChangeAcademicYearFormState('isCurrent', String(value))}
                                placeholder="Select one"
                                dataTestId="create-academic-year-current"
                            />
                            <FormInput
                                id="create-academic-year-start-date"
                                type="date"
                                required
                                label="Start Date"
                                value={academicYearFormState.startDate}
                                onChange={(event) => onChangeAcademicYearFormState('startDate', event.target.value)}
                            />
                            <FormInput
                                id="create-academic-year-end-date"
                                type="date"
                                required
                                label="End Date"
                                value={academicYearFormState.endDate}
                                onChange={(event) => onChangeAcademicYearFormState('endDate', event.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={onCreateAcademicYear}
                                disabled={isAcademicYearSubmitting}
                                className="h-11 px-6"
                                data-testid="create-academic-year-submit"
                            >
                                {isAcademicYearSubmitting ? 'Creating...' : 'Create Academic Year'}
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] space-y-4">
                        <div className="flex items-center gap-2 text-[var(--color-foreground)]">
                            <Filter size={18} />
                            <h2 className="text-base font-semibold">Filter Academic Years</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Dropdown
                                label="Current Status"
                                options={academicYearFilterOptions}
                                value={academicYearCurrentFilter}
                                onChange={(value) => setAcademicYearCurrentFilter(String(value))}
                                placeholder="Select status"
                                dataTestId="academic-year-current-filter"
                            />
                            <div className="flex items-end gap-3 md:col-span-2">
                                <Button
                                    type="button"
                                    onClick={onAcademicYearFilterApply}
                                    disabled={academicYearsLoading}
                                    className="h-10"
                                    data-testid="academic-year-filter-apply"
                                >
                                    Apply
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onAcademicYearFilterReset}
                                    disabled={academicYearsLoading}
                                    className="h-10"
                                    data-testid="academic-year-filter-reset"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                        <DataTable
                            columns={academicYearColumns}
                            data={academicYears}
                            loading={academicYearsLoading}
                            emptyMessage="No academic years found for the selected filters."
                            pageSize={academicYearPageSize}
                            totalCount={academicYearTotalItems}
                            currentPage={academicYearPage}
                            onPageChange={(nextPage) => setAcademicYearPage(nextPage)}
                            onPageSizeChange={(nextPageSize) => {
                                setAcademicYearPageSize(nextPageSize);
                                setAcademicYearPage(1);
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
}
