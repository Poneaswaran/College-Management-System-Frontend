import { useEffect, useState } from 'react';
import {
    Users,
    BookOpen,
    AlertTriangle,
    CheckCircle,
    TrendingDown,
    Search,
    ChevronDown,
    ChevronRight,
    Clock,
    ClipboardCheck,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { useFacultyWorkload } from '../../features/faculty/hooks/workload';
import type { FacultyWorkloadItem, WorkloadStatus } from '../../features/faculty/types/workload';

type FilterValue = WorkloadStatus | 'ALL';

// ─── Workload Status Badge ────────────────────────────────────────────────────

interface StatusBadgeProps {
    status: WorkloadStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
    const config: Record<WorkloadStatus, { label: string; className: string; icon: React.ReactNode }> = {
        OVERLOADED: {
            label: 'Overloaded',
            className: 'bg-[var(--color-error-light)] text-[var(--color-error)] border border-[var(--color-error)]',
            icon: <AlertTriangle size={12} />,
        },
        OPTIMAL: {
            label: 'Optimal',
            className: 'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]',
            icon: <CheckCircle size={12} />,
        },
        UNDERLOADED: {
            label: 'Underloaded',
            className: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]',
            icon: <TrendingDown size={12} />,
        },
    };

    const { label, className, icon } = config[status];

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
            {icon}
            {label}
        </span>
    );
}

// ─── Workload Bar ─────────────────────────────────────────────────────────────

interface WorkloadBarProps {
    current: number;
    max: number;
    status: WorkloadStatus;
}

function WorkloadBar({ current, max, status }: WorkloadBarProps) {
    const pct = Math.min((current / max) * 100, 100);
    const colorClass =
        status === 'OVERLOADED'
            ? 'bg-[var(--color-error)]'
            : status === 'UNDERLOADED'
              ? 'bg-[var(--color-warning)]'
              : 'bg-[var(--color-success)]';

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs text-[var(--color-foreground-muted)] mb-1">
                <span>{current}h / week</span>
                <span>Max {max}h</span>
            </div>
            <div className="h-2 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ─── Faculty Workload Card ────────────────────────────────────────────────────

interface FacultyWorkloadCardProps {
    faculty: FacultyWorkloadItem;
}

function FacultyWorkloadCard({ faculty }: FacultyWorkloadCardProps) {
    const [expanded, setExpanded] = useState(false);

    const initials = faculty.facultyName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden hover:border-[var(--color-primary-light)] transition-colors">
            {/* Card Header */}
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-[var(--color-foreground)] truncate">
                                {faculty.facultyName}
                            </h3>
                            <StatusBadge status={faculty.status} />
                        </div>
                        <p className="text-sm text-[var(--color-foreground-secondary)]">{faculty.designation}</p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">ID: {faculty.employeeId}</p>
                    </div>
                </div>

                {/* Workload Bar */}
                <div className="mt-4">
                    <WorkloadBar
                        current={faculty.totalHoursPerWeek}
                        max={faculty.maxHoursPerWeek}
                        status={faculty.status}
                    />
                </div>

                {/* Quick Stats Row */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[var(--color-background-secondary)] rounded-lg p-2">
                        <p className="text-lg font-bold text-[var(--color-foreground)]">
                            {faculty.courseAssignments.length}
                        </p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Sections</p>
                    </div>
                    <div className="bg-[var(--color-background-secondary)] rounded-lg p-2">
                        <p className="text-lg font-bold text-[var(--color-foreground)]">
                            {faculty.attendanceAvg.toFixed(1)}%
                        </p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Attendance</p>
                    </div>
                    <div className="bg-[var(--color-background-secondary)] rounded-lg p-2">
                        <p className={`text-lg font-bold ${faculty.pendingGradingCount > 0 ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'}`}>
                            {faculty.pendingGradingCount}
                        </p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Pending</p>
                    </div>
                </div>
            </div>

            {/* Expandable Course List */}
            <button
                onClick={() => setExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between px-5 py-3 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)] text-sm font-medium text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-tertiary)] transition-colors"
            >
                <span className="flex items-center gap-2">
                    <BookOpen size={14} />
                    {faculty.courseAssignments.length} Course{faculty.courseAssignments.length !== 1 ? 's' : ''} Assigned
                </span>
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {expanded && (
                <div className="divide-y divide-[var(--color-border)]">
                    {faculty.courseAssignments.map((course) => (
                        <div key={course.id} className="px-5 py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[var(--color-foreground)] truncate">
                                    {course.subjectName}
                                </p>
                                <p className="text-xs text-[var(--color-foreground-muted)]">
                                    {course.subjectCode} · {course.sectionName} · Sem {course.semester}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-semibold text-[var(--color-foreground)]">
                                    {course.hoursPerWeek}h/wk
                                </p>
                                <p className="text-xs text-[var(--color-foreground-muted)]">
                                    {course.studentCount} students
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Status Filter Tabs ───────────────────────────────────────────────────────

interface StatusTabsProps {
    active: FilterValue;
    onSelect: (v: FilterValue) => void;
    counts: Record<FilterValue, number>;
}

function StatusTabs({ active, onSelect, counts }: StatusTabsProps) {
    const tabs: { value: FilterValue; label: string; colorClass: string }[] = [
        { value: 'ALL', label: 'All', colorClass: 'text-[var(--color-primary)]' },
        { value: 'OVERLOADED', label: 'Overloaded', colorClass: 'text-[var(--color-error)]' },
        { value: 'OPTIMAL', label: 'Optimal', colorClass: 'text-[var(--color-success)]' },
        { value: 'UNDERLOADED', label: 'Underloaded', colorClass: 'text-[var(--color-warning)]' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map(({ value, label, colorClass }) => (
                <button
                    key={value}
                    onClick={() => onSelect(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        active === value
                            ? `bg-[var(--color-primary)] text-white border-[var(--color-primary)]`
                            : `bg-[var(--color-card)] border-[var(--color-border)] ${colorClass} hover:border-[var(--color-primary-light)]`
                    }`}
                >
                    {label}
                    <span className={`ml-2 text-xs font-bold ${active === value ? 'text-white' : ''}`}>
                        {counts[value]}
                    </span>
                </button>
            ))}
        </div>
    );
}

// ─── Summary Stats Bar ────────────────────────────────────────────────────────

function SummaryStatsBar({ data }: { data: { totalFaculty: number; overloadedCount: number; optimalCount: number; underloadedCount: number; avgHoursPerWeek: number; totalCourseSections: number } }) {
    const stats = [
        {
            icon: <Users size={20} />,
            label: 'Total Faculty',
            value: data.totalFaculty,
            color: 'text-[var(--color-primary)]',
            bg: 'bg-[var(--color-primary-light)]/10',
        },
        {
            icon: <AlertTriangle size={20} />,
            label: 'Overloaded',
            value: data.overloadedCount,
            color: 'text-[var(--color-error)]',
            bg: 'bg-[var(--color-error-light)]',
        },
        {
            icon: <CheckCircle size={20} />,
            label: 'Optimal',
            value: data.optimalCount,
            color: 'text-[var(--color-success)]',
            bg: 'bg-[var(--color-success-light)]',
        },
        {
            icon: <TrendingDown size={20} />,
            label: 'Underloaded',
            value: data.underloadedCount,
            color: 'text-[var(--color-warning)]',
            bg: 'bg-[var(--color-warning-light)]',
        },
        {
            icon: <Clock size={20} />,
            label: 'Avg Hrs / Week',
            value: `${data.avgHoursPerWeek}h`,
            color: 'text-[var(--color-foreground)]',
            bg: 'bg-[var(--color-background-secondary)]',
        },
        {
            icon: <ClipboardCheck size={20} />,
            label: 'Total Sections',
            value: data.totalCourseSections,
            color: 'text-[var(--color-foreground)]',
            bg: 'bg-[var(--color-background-secondary)]',
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map(({ icon, label, value, color, bg }) => (
                <div
                    key={label}
                    className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col items-center text-center gap-2 shadow-sm"
                >
                    <div className={`p-2 rounded-lg ${bg} ${color}`}>{icon}</div>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-[var(--color-foreground-muted)]">{label}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HODFacultyWorkload() {
    const {
        workloadData,
        loading,
        error,
        loadWorkload,
        filterByStatus,
        activeStatusFilter,
        searchTerm,
        setSearchTerm,
    } = useFacultyWorkload();

    useEffect(() => {
        loadWorkload();
    }, [loadWorkload]);

    // Derived filtered list
    const filteredFaculty = (workloadData?.facultyWorkloads ?? []).filter((f) => {
        const matchesStatus = activeStatusFilter === 'ALL' || f.status === activeStatusFilter;
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            !term ||
            f.facultyName.toLowerCase().includes(term) ||
            f.employeeId.toLowerCase().includes(term) ||
            f.designation.toLowerCase().includes(term) ||
            f.courseAssignments.some(
                (c) =>
                    c.subjectName.toLowerCase().includes(term) ||
                    c.subjectCode.toLowerCase().includes(term),
            );
        return matchesStatus && matchesSearch;
    });

    const counts: Record<FilterValue, number> = {
        ALL: workloadData?.facultyWorkloads.length ?? 0,
        OVERLOADED: workloadData?.summaryStats.overloadedCount ?? 0,
        OPTIMAL: workloadData?.summaryStats.optimalCount ?? 0,
        UNDERLOADED: workloadData?.summaryStats.underloadedCount ?? 0,
    };

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Faculty Workload</h1>
                    {workloadData && (
                        <p className="text-[var(--color-foreground-muted)] mt-1">
                            {workloadData.departmentName} · {workloadData.semesterLabel}
                        </p>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="p-5 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)]">
                        <p className="font-semibold">Failed to load workload data</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Data */}
                {!loading && workloadData && (
                    <>
                        {/* Summary Stats */}
                        <SummaryStatsBar data={workloadData.summaryStats} />

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            <StatusTabs
                                active={activeStatusFilter}
                                onSelect={filterByStatus}
                                counts={counts}
                            />
                            <div className="flex-1 min-w-[220px] relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]"
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search faculty, subject, ID…"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Faculty Grid */}
                        {filteredFaculty.length === 0 ? (
                            <div className="text-center py-16 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
                                <Users size={48} className="mx-auto text-[var(--color-foreground-muted)] mb-4" />
                                <h3 className="text-lg font-medium text-[var(--color-foreground)]">No faculty found</h3>
                                <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
                                    Try adjusting your filters or search term.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredFaculty.map((faculty) => (
                                    <FacultyWorkloadCard key={faculty.id} faculty={faculty} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
}
