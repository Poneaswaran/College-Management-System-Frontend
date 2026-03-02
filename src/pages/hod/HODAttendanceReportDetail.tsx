import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    LayoutGrid,
    CheckCircle,
    XCircle,
    Clock,
    BookOpen,
    AlertTriangle,
    Pencil,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { useHODAttendanceReports } from '../../features/hod/hooks/attendanceReports';
import type {
    AttendanceRiskLevel,
    AttendanceStatus,
    StudentAttendanceDetail,
    ClassAttendanceDetail,
} from '../../features/hod/types/attendanceReports';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const riskCls: Record<AttendanceRiskLevel, string> = {
    GOOD:     'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]',
    WARNING:  'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]',
    CRITICAL: 'bg-[var(--color-error-light)] text-[var(--color-error)] border border-[var(--color-error)]',
};

const statusIcon: Record<AttendanceStatus, React.ReactNode> = {
    PRESENT: <CheckCircle size={14} className="text-[var(--color-success)]" />,
    ABSENT:  <XCircle    size={14} className="text-[var(--color-error)]"   />,
    LATE:    <Clock      size={14} className="text-[var(--color-warning)]"  />,
};

const statusCls: Record<AttendanceStatus, string> = {
    PRESENT: 'text-[var(--color-success)]',
    ABSENT:  'text-[var(--color-error)]',
    LATE:    'text-[var(--color-warning)]',
};

function PctBar({ pct, level }: { pct: number; level: AttendanceRiskLevel }) {
    const barCls: Record<AttendanceRiskLevel, string> = {
        GOOD:     'bg-[var(--color-success)]',
        WARNING:  'bg-[var(--color-warning)]',
        CRITICAL: 'bg-[var(--color-error)]',
    };
    return (
        <div className="flex items-center gap-2 min-w-[140px]">
            <div className="flex-1 h-2 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barCls[level]}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <span className={`text-sm font-bold w-10 text-right ${riskCls[level].split(' ')[1]}`}>{pct}%</span>
        </div>
    );
}

function RiskBadge({ level }: { level: AttendanceRiskLevel }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${riskCls[level]}`}>
            {level === 'CRITICAL' ? <AlertTriangle size={11} className="mr-1" /> : level === 'GOOD' ? <CheckCircle size={11} className="mr-1" /> : <Clock size={11} className="mr-1" />}
            {level.charAt(0) + level.slice(1).toLowerCase()}
        </span>
    );
}

// ─── Student Detail View ──────────────────────────────────────────────────────

function StudentDetailView({ detail, loading, error }: { detail: StudentAttendanceDetail | null; loading: boolean; error: string | null }) {
    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-5 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)]">
                <p className="font-semibold">Failed to load student detail</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }
    if (!detail) return null;

    return (
        <div className="space-y-6">
            {/* Student info card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex flex-wrap gap-5 items-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {detail.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-[var(--color-foreground)]">{detail.studentName}</h2>
                    <p className="text-sm text-[var(--color-foreground-secondary)]">
                        {detail.registerNumber} · Roll {detail.rollNumber}
                    </p>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                        {detail.className} · Semester {detail.semester}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <User size={16} className="text-[var(--color-foreground-muted)]" />
                    <span className="text-xs text-[var(--color-foreground-muted)]">Year {detail.year}</span>
                </div>
            </div>

            {/* Subject-wise summary */}
            <div>
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-3 flex items-center gap-2">
                    <BookOpen size={17} /> Subject-wise Summary
                </h3>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Subject</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Faculty</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Total</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-success)]">Present</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-error)]">Absent</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-warning)]">Late</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)] min-w-[160px]">Attendance</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {detail.subjectSummaries.map((sub) => (
                                    <tr key={sub.subjectId} className="hover:bg-[var(--color-background-secondary)] transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-[var(--color-foreground)]">{sub.subjectName}</p>
                                            <p className="text-xs text-[var(--color-foreground-muted)]">{sub.subjectCode}</p>
                                        </td>
                                        <td className="px-4 py-3 text-[var(--color-foreground-secondary)] text-xs">{sub.facultyName}</td>
                                        <td className="px-4 py-3 text-center text-[var(--color-foreground-muted)]">{sub.totalClasses}</td>
                                        <td className="px-4 py-3 text-center text-[var(--color-success)] font-semibold">{sub.attended}</td>
                                        <td className="px-4 py-3 text-center text-[var(--color-error)] font-semibold">{sub.absent}</td>
                                        <td className="px-4 py-3 text-center text-[var(--color-warning)] font-semibold">{sub.late}</td>
                                        <td className="px-4 py-3"><PctBar pct={sub.percentage} level={sub.riskLevel} /></td>
                                        <td className="px-4 py-3 text-center"><RiskBadge level={sub.riskLevel} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Period-level records */}
            <div>
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-3 flex items-center gap-2">
                    <Clock size={17} /> Period-level Records
                </h3>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Date</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Subject</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Period</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Status</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Marked By</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Manual</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {detail.periodRecords.map((rec, i) => (
                                    <tr key={i} className="hover:bg-[var(--color-background-secondary)] transition-colors">
                                        <td className="px-4 py-3 text-[var(--color-foreground-muted)]">{rec.date}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-[var(--color-foreground)]">{rec.subjectName}</p>
                                            <p className="text-xs text-[var(--color-foreground-muted)]">{rec.subjectCode}</p>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[var(--color-foreground-muted)]">{rec.periodLabel}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`flex items-center justify-center gap-1 font-semibold ${statusCls[rec.status]}`}>
                                                {statusIcon[rec.status]} {rec.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[var(--color-foreground-secondary)]">{rec.markedBy}</td>
                                        <td className="px-4 py-3 text-center">
                                            {rec.isManuallyMarked
                                                ? <Pencil size={13} className="mx-auto text-[var(--color-warning)]" />
                                                : <span className="text-[var(--color-foreground-muted)] text-xs">—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Class Detail View ────────────────────────────────────────────────────────

function ClassDetailView({ detail, loading, error, onStudentDrillDown }: {
    detail: ClassAttendanceDetail | null;
    loading: boolean;
    error: string | null;
    onStudentDrillDown: (id: number) => void;
}) {
    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-5 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)]">
                <p className="font-semibold">Failed to load class detail</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }
    if (!detail) return null;

    return (
        <div className="space-y-6">
            {/* Class info */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex flex-wrap gap-5 items-center shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-[var(--color-primary-light)]/20 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    <LayoutGrid size={26} />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-[var(--color-foreground)]">{detail.className}</h2>
                    <p className="text-sm text-[var(--color-foreground-secondary)]">
                        Semester {detail.semester} · Year {detail.year} · {detail.students.length} Students
                    </p>
                </div>
            </div>

            {/* Subject breakdown */}
            <div>
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-3 flex items-center gap-2">
                    <BookOpen size={17} /> Subject-wise Class Average
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detail.subjectBreakdown.map((sub) => {
                        const level: AttendanceRiskLevel = sub.avgPercentage >= 75 ? 'GOOD' : sub.avgPercentage >= 60 ? 'WARNING' : 'CRITICAL';
                        return (
                            <div key={sub.subjectId} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 shadow-sm">
                                <p className="font-semibold text-[var(--color-foreground)] text-sm">{sub.subjectName}</p>
                                <p className="text-xs text-[var(--color-foreground-muted)] mb-3">{sub.subjectCode} · {sub.facultyName}</p>
                                <PctBar pct={sub.avgPercentage} level={level} />
                                <p className="text-xs text-[var(--color-foreground-muted)] mt-1">{sub.totalClasses} classes conducted</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Student list */}
            <div>
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-3 flex items-center gap-2">
                    <User size={17} /> Student Attendance
                </h3>
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Student</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Reg. No.</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Total</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-success)]">Present</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-error)]">Absent</th>
                                    <th className="text-left px-4 py-3 font-semibold text-[var(--color-foreground-secondary)] min-w-[160px]">Attendance</th>
                                    <th className="text-center px-4 py-3 font-semibold text-[var(--color-foreground-secondary)]">Status</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {detail.students.map((s) => (
                                    <tr key={s.studentId} className="hover:bg-[var(--color-background-secondary)] transition-colors">
                                        <td className="px-4 py-3 font-medium text-[var(--color-foreground)]">{s.studentName}</td>
                                        <td className="px-4 py-3 text-[var(--color-foreground-muted)]">{s.registerNumber}</td>
                                        <td className="px-4 py-3 text-center text-[var(--color-foreground-muted)]">{s.totalClasses}</td>
                                        <td className="px-4 py-3 text-center text-[var(--color-success)] font-semibold">{s.attended}</td>
                                        <td className="px-4 py-3 text-center text-[var(--color-error)] font-semibold">{s.absent}</td>
                                        <td className="px-4 py-3"><PctBar pct={s.percentage} level={s.riskLevel} /></td>
                                        <td className="px-4 py-3 text-center"><RiskBadge level={s.riskLevel} /></td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => onStudentDrillDown(s.studentId)}
                                                className="text-[var(--color-primary)] hover:underline text-xs font-medium"
                                            >
                                                Details →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HODAttendanceReportDetail() {
    const { type, id } = useParams<{ type: string; id: string }>();
    const navigate = useNavigate();

    const {
        studentDetail,
        studentDetailLoading,
        studentDetailError,
        loadStudentDetail,
        classDetail,
        classDetailLoading,
        classDetailError,
        loadClassDetail,
    } = useHODAttendanceReports();

    const numericId = id ? Number(id) : null;

    useEffect(() => {
        if (!numericId) return;
        if (type === 'student') loadStudentDetail(numericId);
        if (type === 'class')   loadClassDetail(numericId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, numericId]);

    const title =
        type === 'student'
            ? studentDetail?.studentName ?? 'Student Detail'
            : type === 'class'
              ? `${classDetail?.className ?? 'Class'} · Sem ${classDetail?.semester ?? ''}`
              : 'Detail';

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
                {/* Breadcrumb + back */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/hod/attendance-reports"
                        className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
                    >
                        <ArrowLeft size={15} /> Attendance Reports
                    </Link>
                    <span className="text-[var(--color-foreground-muted)]">/</span>
                    <span className="text-sm font-semibold text-[var(--color-foreground)]">{title}</span>
                </div>

                {type === 'student' && (
                    <StudentDetailView detail={studentDetail} loading={studentDetailLoading} error={studentDetailError} />
                )}

                {type === 'class' && (
                    <ClassDetailView
                        detail={classDetail}
                        loading={classDetailLoading}
                        error={classDetailError}
                        onStudentDrillDown={(sid) => navigate(`/hod/attendance-reports/student/${sid}`)}
                    />
                )}

                {type !== 'student' && type !== 'class' && (
                    <div className="text-center py-16 text-[var(--color-foreground-muted)]">
                        Unknown detail type.{' '}
                        <Link to="/hod/attendance-reports" className="text-[var(--color-primary)] underline">
                            Go back
                        </Link>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
