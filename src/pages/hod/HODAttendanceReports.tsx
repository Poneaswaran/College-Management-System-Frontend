import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    LayoutGrid,
    Building2,
    AlertTriangle,
    CheckCircle,
    Clock,
    Search,
    ChevronRight,
    BookOpen,
    TrendingDown,
    Filter,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { useHODAttendanceReports } from '../../features/hod/hooks/attendanceReports';
import type {
    StudentAttendanceSummary,
    ClassAttendanceSummary,
    DepartmentAttendanceSummary,
    AttendanceRiskLevel,
    ViewMode,
} from '../../features/hod/types/attendanceReports';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const riskConfig: Record<AttendanceRiskLevel, { label: string; badgeCls: string; barCls: string }> = {
    CRITICAL: { label: 'Critical',  badgeCls: 'bg-[var(--color-error-light)] text-[var(--color-error)] border border-[var(--color-error)]',       barCls: 'bg-[var(--color-error)]'   },
    WARNING:  { label: 'Warning',   badgeCls: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]', barCls: 'bg-[var(--color-warning)]' },
    GOOD:     { label: 'Good',      badgeCls: 'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]', barCls: 'bg-[var(--color-success)]' },
};

function RiskBadge({ level }: { level: AttendanceRiskLevel }) {
    const { label, badgeCls } = riskConfig[level];
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeCls}`}>
            {label}
        </span>
    );
}

function PctBar({ pct, level }: { pct: number; level: AttendanceRiskLevel }) {
    return (
        <div className="flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 h-1.5 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${riskConfig[level].barCls}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                />
            </div>
            <span className={`text-sm font-bold w-10 text-right ${riskConfig[level].badgeCls.split(' ')[1]}`}>
                {pct}%
            </span>
        </div>
    );
}

// ─── Summary Stats Bar ────────────────────────────────────────────────────────

function SummaryBar({ stats }: { stats: { totalStudents: number; overallAvgPercentage: number; criticalCount: number; warningCount: number; goodCount: number; totalClassesConducted: number; periodFilter: string } }) {
    const items = [
        { icon: <Users size={18} />,        label: 'Total Students',    value: stats.totalStudents,          cls: 'text-[var(--color-primary)]'  },
        { icon: <Clock size={18} />,         label: 'Classes Conducted', value: stats.totalClassesConducted,  cls: 'text-[var(--color-foreground)]'},
        { icon: <CheckCircle size={18} />,   label: 'Good (≥75%)',       value: stats.goodCount,              cls: 'text-[var(--color-success)]'  },
        { icon: <TrendingDown size={18} />,  label: 'Warning (60–74%)',  value: stats.warningCount,           cls: 'text-[var(--color-warning)]'  },
        { icon: <AlertTriangle size={18} />, label: 'Critical (<60%)',   value: stats.criticalCount,          cls: 'text-[var(--color-error)]'    },
        { icon: <BookOpen size={18} />,      label: 'Dept. Avg',         value: `${stats.overallAvgPercentage}%`, cls: 'text-[var(--color-foreground)]'},
    ];
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="attendance-summary-bar">
            {items.map(({ icon, label, value, cls }) => (
                <div key={label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col items-center text-center gap-1.5 shadow-sm" data-testid={`summary-item-${label.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className={`${cls}`} data-testid="summary-icon">{icon}</span>
                    <p className={`text-2xl font-bold ${cls}`} data-testid="summary-value">{value}</p>
                    <p className="text-xs text-[var(--color-foreground-muted)]" data-testid="summary-label">{label}</p>
                </div>
            ))}
        </div>
    );
}

// ─── View Toggle ──────────────────────────────────────────────────────────────

interface ViewToggleProps {
    current: ViewMode;
    onChange: (v: ViewMode) => void;
}

function ViewToggle({ current, onChange }: ViewToggleProps) {
    const tabs: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
        { value: 'STUDENTS',    label: 'Students',    icon: <Users size={15} />      },
        { value: 'CLASSES',     label: 'Classes',     icon: <LayoutGrid size={15} /> },
        { value: 'DEPARTMENTS', label: 'Departments', icon: <Building2 size={15} />  },
    ];
    return (
        <div className="flex gap-1 bg-[var(--color-background-secondary)] p-1 rounded-lg" data-testid="view-toggle">
            {tabs.map(({ value, label, icon }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    data-testid={`view-toggle-${value.toLowerCase()}`}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        current === value
                            ? 'bg-[var(--color-primary)] text-white shadow-sm'
                            : 'text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-tertiary)]'
                    }`}
                >
                    {icon}
                    {label}
                </button>
            ))}
        </div>
    );
}

// ─── Students Table ───────────────────────────────────────────────────────────

interface StudentsTableProps {
    students: StudentAttendanceSummary[];
    searchTerm: string;
    riskFilter: AttendanceRiskLevel | 'ALL';
    onDrillDown: (studentId: number) => void;
}

function StudentsTable({ students, searchTerm, riskFilter, onDrillDown }: StudentsTableProps) {
    const filtered = students.filter((s) => {
        const matchRisk   = riskFilter === 'ALL' || s.riskLevel === riskFilter;
        const term        = searchTerm.toLowerCase();
        const matchSearch = !term ||
            s.studentName.toLowerCase().includes(term) ||
            s.registerNumber.toLowerCase().includes(term) ||
            s.rollNumber.toLowerCase().includes(term) ||
            s.className.toLowerCase().includes(term);
        return matchRisk && matchSearch;
    });

    if (filtered.length === 0) {
        return (
            <div className="text-center py-16 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]" data-testid="no-students-message">
                <Users size={40} className="mx-auto mb-3 text-[var(--color-foreground-muted)]" />
                <p className="text-[var(--color-foreground-muted)]">No students match the current filters.</p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm" data-testid="students-table-container">
            <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="students-table">
                    <thead>
                        <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                            <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Student</th>
                            <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Reg. No.</th>
                            <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Class</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Total</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Present</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Absent</th>
                            <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)] min-w-[160px]">Attendance</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Status</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]" data-testid="students-table-body">
                        {filtered.map((s) => (
                            <tr key={s.studentId} className="hover:bg-[var(--color-background-secondary)] transition-colors" data-testid={`student-row-${s.studentId}`}>
                                <td className="px-4 py-3 font-medium text-[var(--color-foreground)]" data-testid="student-name">{s.studentName}</td>
                                <td className="px-4 py-3 text-[var(--color-foreground-muted)]" data-testid="student-reg-no">{s.registerNumber}</td>
                                <td className="px-4 py-3 text-[var(--color-foreground-secondary)]" data-testid="student-class">{s.className}</td>
                                <td className="px-4 py-3 text-center text-[var(--color-foreground-muted)]" data-testid="student-total">{s.totalClasses}</td>
                                <td className="px-4 py-3 text-center text-[var(--color-success)] font-medium" data-testid="student-attended">{s.attended}</td>
                                <td className="px-4 py-3 text-center text-[var(--color-error)] font-medium" data-testid="student-absent">{s.absent}</td>
                                <td className="px-4 py-3" data-testid="student-pct">
                                    <PctBar pct={s.percentage} level={s.riskLevel} />
                                </td>
                                <td className="px-4 py-3 text-center" data-testid="student-status">
                                    <RiskBadge level={s.riskLevel} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onDrillDown(s.studentId)}
                                        data-testid={`drilldown-student-${s.studentId}`}
                                        className="flex items-center gap-1 text-[var(--color-primary)] hover:underline text-xs font-medium ml-auto"
                                    >
                                        Details <ChevronRight size={13} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-2 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)] text-xs text-[var(--color-foreground-muted)]" data-testid="table-footer">
                Showing {filtered.length} of {students.length} students
            </div>
        </div>
    );
}

// ─── Classes Table ────────────────────────────────────────────────────────────

interface ClassesTableProps {
    classes: ClassAttendanceSummary[];
    searchTerm: string;
    onDrillDown: (sectionId: number) => void;
}

function ClassesTable({ classes, searchTerm, onDrillDown }: ClassesTableProps) {
    const filtered = classes.filter((c) => {
        const term = searchTerm.toLowerCase();
        return !term || c.className.toLowerCase().includes(term) || `sem ${c.semester}`.includes(term);
    });

    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm" data-testid="classes-table-container">
            <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="classes-table">
                    <thead>
                        <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                            <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Class</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Semester</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Students</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)] text-[var(--color-success)]">Good</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-warning)]">Warning</th>
                            <th className="text-center px-4 py-3 font-semibold text-[var(--color-error)]">Critical</th>
                            <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)] min-w-[160px]">Avg Attendance</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]" data-testid="classes-table-body">
                        {filtered.map((c) => (
                            <tr key={c.sectionId} className="hover:bg-[var(--color-background-secondary)] transition-colors" data-testid={`class-row-${c.sectionId}`}>
                                <td className="px-4 py-3 font-medium text-[var(--color-foreground)]" data-testid="class-name">{c.className}</td>
                                <td className="px-4 py-3 text-center text-[var(--color-foreground-muted)]" data-testid="class-sem">Sem {c.semester}</td>
                                <td className="px-4 py-3 text-center text-[var(--color-foreground-muted)]" data-testid="class-students">{c.totalStudents}</td>
                                <td className="px-4 py-3 text-center text-[var(--color-success)] font-semibold" data-testid="class-good">{c.goodCount}</td>
                                <td className="px-4 py-3 text-center text-[var(--color-warning)] font-semibold" data-testid="class-warning">{c.warningCount}</td>
                                <td className="px-4 py-3 text-center text-[var(--color-error)] font-semibold" data-testid="class-critical">{c.criticalCount}</td>
                                <td className="px-4 py-3" data-testid="class-pct">
                                    <PctBar pct={c.avgPercentage} level={c.avgPercentage >= 75 ? 'GOOD' : c.avgPercentage >= 60 ? 'WARNING' : 'CRITICAL'} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onDrillDown(c.sectionId)}
                                        data-testid={`drilldown-class-${c.sectionId}`}
                                        className="flex items-center gap-1 text-[var(--color-primary)] hover:underline text-xs font-medium ml-auto"
                                    >
                                        Drill Down <ChevronRight size={13} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Departments Table ────────────────────────────────────────────────────────

interface DepartmentsTableProps {
    departments: DepartmentAttendanceSummary[];
    onDrillDown: (deptId: number) => void;
}

function DepartmentsTable({ departments, onDrillDown }: DepartmentsTableProps) {
    return (
        <div className="space-y-4" data-testid="departments-container">
            {departments.map((dept) => (
                <div key={dept.departmentId} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm" data-testid={`dept-card-${dept.departmentId}`}>
                    {/* Dept header row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]" data-testid="dept-header">
                        <div>
                            <h3 className="font-bold text-[var(--color-foreground)]" data-testid="dept-name">{dept.departmentName}</h3>
                            <p className="text-xs text-[var(--color-foreground-muted)]" data-testid="dept-info">{dept.departmentCode} · {dept.totalStudents} students</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm" data-testid="dept-stats">
                            <span className="text-[var(--color-success)] font-semibold" data-testid="dept-good">{dept.goodCount} good</span>
                            <span className="text-[var(--color-warning)] font-semibold" data-testid="dept-warning">{dept.warningCount} warning</span>
                            <span className="text-[var(--color-error)] font-semibold" data-testid="dept-critical">{dept.criticalCount} critical</span>
                            <PctBar pct={dept.avgPercentage} level={dept.avgPercentage >= 75 ? 'GOOD' : dept.avgPercentage >= 60 ? 'WARNING' : 'CRITICAL'} />
                        </div>
                    </div>

                    {/* Class breakdown inside dept */}
                    <div className="divide-y divide-[var(--color-border)]" data-testid="dept-classes">
                        {dept.classBreakdown.map((c) => (
                            <div
                                key={c.sectionId}
                                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 hover:bg-[var(--color-background-secondary)] transition-colors cursor-pointer"
                                onClick={() => onDrillDown(c.sectionId)}
                                data-testid={`dept-class-row-${c.sectionId}`}
                            >
                                <div className="flex items-center gap-3">
                                    <LayoutGrid size={14} className="text-[var(--color-foreground-muted)]" />
                                    <span className="font-medium text-sm text-[var(--color-foreground)]" data-testid="class-label">{c.className} · Sem {c.semester}</span>
                                    <span className="text-xs text-[var(--color-foreground-muted)]" data-testid="class-students-count">{c.totalStudents} students</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="text-[var(--color-success)]">{c.goodCount} good</span>
                                    <span className="text-[var(--color-warning)]">{c.warningCount} warn</span>
                                    <span className="text-[var(--color-error)]">{c.criticalCount} crit</span>
                                    <PctBar pct={c.avgPercentage} level={c.avgPercentage >= 75 ? 'GOOD' : c.avgPercentage >= 60 ? 'WARNING' : 'CRITICAL'} />
                                    <ChevronRight size={14} className="text-[var(--color-primary)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Risk Filter Tabs ─────────────────────────────────────────────────────────

function RiskFilterTabs({ active, onChange, counts }: {
    active: AttendanceRiskLevel | 'ALL';
    onChange: (v: AttendanceRiskLevel | 'ALL') => void;
    counts: Record<AttendanceRiskLevel | 'ALL', number>;
}) {
    const tabs: { value: AttendanceRiskLevel | 'ALL'; label: string }[] = [
        { value: 'ALL',      label: 'All'      },
        { value: 'GOOD',     label: 'Good'     },
        { value: 'WARNING',  label: 'Warning'  },
        { value: 'CRITICAL', label: 'Critical' },
    ];
    return (
        <div className="flex flex-wrap gap-2" data-testid="risk-filter-tabs">
            {tabs.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    data-testid={`risk-tab-${value.toLowerCase()}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        active === value
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                            : value === 'CRITICAL' ? 'text-[var(--color-error)]   border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-error)]'
                            : value === 'WARNING'  ? 'text-[var(--color-warning)] border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-warning)]'
                            : value === 'GOOD'     ? 'text-[var(--color-success)] border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-success)]'
                            : 'text-[var(--color-foreground-secondary)] border-[var(--color-border)] bg-[var(--color-card)]'
                    }`}
                >
                    {label} <span className="ml-1 opacity-70" data-testid="risk-count">{counts[value]}</span>
                </button>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HODAttendanceReports() {
    const navigate = useNavigate();

    const {
        reportData,
        loading,
        error,
        loadReport,
        viewMode,
        setViewMode,
        searchTerm,
        setSearchTerm,
        riskFilter,
        setRiskFilter,
        semesterFilter,
        setSemesterFilter,
        subjectFilter,
        setSubjectFilter,
        periodFilter,
        setPeriodFilter,
    } = useHODAttendanceReports();

    useEffect(() => {
        loadReport({
            semesterId:   semesterFilter  ?? undefined,
            subjectId:    subjectFilter   ?? undefined,
            periodNumber: periodFilter    ?? undefined,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [semesterFilter, subjectFilter, periodFilter]);

    const handleStudentDrillDown = (studentId: number) => {
        navigate(`/hod/attendance-reports/student/${studentId}`);
    };

    const handleClassDrillDown = (sectionId: number) => {
        navigate(`/hod/attendance-reports/class/${sectionId}`);
    };

    const riskCounts: Record<AttendanceRiskLevel | 'ALL', number> = {
        ALL:      reportData?.students.length ?? 0,
        GOOD:     reportData?.summaryStats.goodCount     ?? 0,
        WARNING:  reportData?.summaryStats.warningCount  ?? 0,
        CRITICAL: reportData?.summaryStats.criticalCount ?? 0,
    };

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Attendance Reports</h1>
                    {reportData && (
                        <p className="text-[var(--color-foreground-muted)] mt-1">
                            {reportData.summaryStats.departmentName} · {reportData.summaryStats.semesterLabel}
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
                        <p className="font-semibold">Failed to load attendance data</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {!loading && reportData && (
                    <>
                        {/* Summary Stats */}
                        <SummaryBar stats={reportData.summaryStats} />

                        {/* Filter Bar */}
                        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground-secondary)]">
                                <Filter size={14} /> Filters
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {/* Semester */}
                                <select
                                    value={semesterFilter ?? ''}
                                    onChange={(e) => setSemesterFilter(e.target.value ? Number(e.target.value) : null)}
                                    data-testid="semester-filter"
                                    className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                >
                                    <option value="">All Semesters</option>
                                    {reportData.availableSemesters.map((s) => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>

                                {/* Subject */}
                                <select
                                    value={subjectFilter ?? ''}
                                    onChange={(e) => setSubjectFilter(e.target.value ? Number(e.target.value) : null)}
                                    data-testid="subject-filter"
                                    className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                >
                                    <option value="">All Subjects</option>
                                    {reportData.availableSubjects.map((s) => (
                                        <option key={s.id} value={s.id}>{s.code} – {s.name}</option>
                                    ))}
                                </select>

                                {/* Period */}
                                <select
                                    value={periodFilter ?? ''}
                                    onChange={(e) => setPeriodFilter(e.target.value ? Number(e.target.value) : null)}
                                    data-testid="period-filter"
                                    className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                >
                                    <option value="">All Periods</option>
                                    {reportData.availablePeriods.map((p) => (
                                        <option key={p.periodNumber} value={p.periodNumber}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* View Toggle + Search Row */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <ViewToggle current={viewMode} onChange={setViewMode} />
                            <div className="relative flex-1 min-w-[220px] max-w-sm">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={viewMode === 'STUDENTS' ? 'Search student, reg. no., class…' : 'Search class…'}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Risk filter tabs — only for STUDENTS view */}
                        {viewMode === 'STUDENTS' && (
                            <RiskFilterTabs active={riskFilter} onChange={setRiskFilter} counts={riskCounts} />
                        )}

                        {/* Data Table */}
                        {viewMode === 'STUDENTS' && (
                            <StudentsTable
                                students={reportData.students}
                                searchTerm={searchTerm}
                                riskFilter={riskFilter}
                                onDrillDown={handleStudentDrillDown}
                            />
                        )}
                        {viewMode === 'CLASSES' && (
                            <ClassesTable
                                classes={reportData.classes}
                                searchTerm={searchTerm}
                                onDrillDown={handleClassDrillDown}
                            />
                        )}
                        {viewMode === 'DEPARTMENTS' && (
                            <DepartmentsTable
                                departments={reportData.departments}
                                onDrillDown={handleClassDrillDown}
                            />
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
}
