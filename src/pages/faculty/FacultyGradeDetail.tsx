import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Send,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    BarChart2,
    Award,
    UserX,
    Loader2,
    X,
    AlertTriangle,
    TrendingUp,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import { useFacultyGradeDetail } from '../../features/faculty/hooks/grades';
import type { GradeStatus, ExamType, LetterGrade } from '../../features/faculty/types/grades';
import { getMediaUrl } from '../../lib/constants';

// ——— Static config helpers ———

const STATUS_CONFIG: Record<GradeStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    DRAFT:     { label: 'Draft',     bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', icon: <Clock size={12} /> },
    SUBMITTED: { label: 'Submitted', bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-300',    icon: <Send size={12} /> },
    APPROVED:  { label: 'Approved',  bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-300',  icon: <CheckCircle size={12} /> },
    REJECTED:  { label: 'Rejected',  bg: 'bg-red-100 dark:bg-red-900/30',      text: 'text-red-700 dark:text-red-300',      icon: <XCircle size={12} /> },
};

const EXAM_TYPE_LABEL: Record<ExamType, string> = {
    INTERNAL:   'Internal Exam',
    EXTERNAL:   'External Exam',
    QUIZ:       'Quiz',
    LAB:        'Lab Exam',
    ASSIGNMENT: 'Assignment',
};

const GRADE_CONFIG: Record<LetterGrade, { bg: string; text: string; label: string; range: string }> = {
    O:        { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', label: 'Outstanding',   range: '91–100' },
    'A+':     { bg: 'bg-green-100 dark:bg-green-900/30',    text: 'text-green-700 dark:text-green-300',    label: 'Excellent',      range: '81–90' },
    A:        { bg: 'bg-teal-100 dark:bg-teal-900/30',      text: 'text-teal-700 dark:text-teal-300',      label: 'Very Good',      range: '71–80' },
    'B+':     { bg: 'bg-blue-100 dark:bg-blue-900/30',      text: 'text-blue-700 dark:text-blue-300',      label: 'Good',           range: '61–70' },
    B:        { bg: 'bg-indigo-100 dark:bg-indigo-900/30',  text: 'text-indigo-700 dark:text-indigo-300',  label: 'Above Average',  range: '51–60' },
    C:        { bg: 'bg-orange-100 dark:bg-orange-900/30',  text: 'text-orange-700 dark:text-orange-300',  label: 'Average',        range: '41–50' },
    F:        { bg: 'bg-red-100 dark:bg-red-900/30',        text: 'text-red-700 dark:text-red-300',        label: 'Fail',           range: '<41' },
    ABSENT:   { bg: 'bg-gray-100 dark:bg-gray-800',         text: 'text-gray-500 dark:text-gray-400',      label: 'Absent',         range: '—' },
    WITHHELD: { bg: 'bg-purple-100 dark:bg-purple-900/30',  text: 'text-purple-700 dark:text-purple-300',  label: 'Withheld',       range: '—' },
};

const GRADE_ORDER: LetterGrade[] = ['O', 'A+', 'A', 'B+', 'B', 'C', 'F', 'ABSENT', 'WITHHELD'];

// ——— Grade calculation helpers ———

function calcLetterGrade(percentage: number | null, isAbsent: boolean): LetterGrade | null {
    if (isAbsent) return 'ABSENT';
    if (percentage === null) return null;
    if (percentage >= 91) return 'O';
    if (percentage >= 81) return 'A+';
    if (percentage >= 71) return 'A';
    if (percentage >= 61) return 'B+';
    if (percentage >= 51) return 'B';
    if (percentage >= 41) return 'C';
    return 'F';
}

function calcGradePoint(grade: LetterGrade): number {
    const pts: Record<LetterGrade, number> = {
        O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, F: 0, ABSENT: 0, WITHHELD: 0,
    };
    return pts[grade];
}

// ——— Student avatar ———

function StudentAvatar({ name, photo, size = 8 }: { name: string; photo: string | null; size?: number }) {
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    if (photo) {
        return (
            <img
                src={getMediaUrl(photo) ?? undefined}
                alt={name}
                className={`w-${size} h-${size} rounded-full object-cover shrink-0`}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
        );
    }
    return (
        <div className={`w-${size} h-${size} rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold shrink-0`}>
            {initials}
        </div>
    );
}

// ——— Grade Bar Chart (pure CSS, no external lib) ———

function GradeDistributionBar({ distribution, total }: {
    distribution: { grade: LetterGrade; count: number; percentage: number }[];
    total: number;
}) {
    if (total === 0) return <p className="text-xs text-[var(--color-foreground-muted)]">No data yet</p>;

    const ordered = GRADE_ORDER
        .map(g => distribution.find(d => d.grade === g))
        .filter(Boolean) as typeof distribution;

    return (
        <div className="space-y-2">
            {ordered.filter(d => d.count > 0).map(d => {
                const cfg = GRADE_CONFIG[d.grade];
                return (
                    <div key={d.grade} className="flex items-center gap-3 text-xs">
                        <span className={`w-10 text-center font-bold rounded px-1 py-0.5 ${cfg.bg} ${cfg.text}`}>{d.grade}</span>
                        <div className="flex-1 bg-[var(--color-background-tertiary)] rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${cfg.bg.replace('bg-', 'bg-').replace('/30', '')} opacity-80`}
                                style={{ width: `${d.percentage}%`, backgroundColor: 'currentColor' }}
                            />
                        </div>
                        <span className="w-16 text-right text-[var(--color-foreground-muted)]">{d.count} ({d.percentage}%)</span>
                    </div>
                );
            })}
        </div>
    );
}

// ——— Main Page ———

export default function FacultyGradeDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const courseSectionId = Number(id);

    const {
        detailData,
        loading,
        error,
        saving,
        submitting,
        saveMessage,
        updateStudentMark,
        toggleAbsent,
        handleSaveDraft,
        handleSubmit,
    } = useFacultyGradeDetail(courseSectionId);

    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [autoSaveTimer, setAutoSaveTimer] = useState<string | null>(null);
    const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-save with 800ms debounce whenever students data changes
    const scheduleAutoSave = useCallback(() => {
        if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
        setAutoSaveTimer('Saving...');
        autoSaveRef.current = setTimeout(async () => {
            await handleSaveDraft();
            setAutoSaveTimer(`Saved at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
            setTimeout(() => setAutoSaveTimer(null), 5000);
        }, 800);
    }, [handleSaveDraft]);

    useEffect(() => {
        return () => {
            if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
        };
    }, []);

    const handleMarkChange = useCallback((
        studentId: string,
        field: 'internalMark' | 'externalMark',
        value: number | null,
    ) => {
        updateStudentMark(studentId, field, value);
        if (detailData?.courseSection.status === 'DRAFT' || detailData?.courseSection.status === 'REJECTED') {
            scheduleAutoSave();
        }
    }, [updateStudentMark, scheduleAutoSave, detailData]);

    const handleToggleAbsent = useCallback((studentId: string) => {
        toggleAbsent(studentId);
        if (detailData?.courseSection.status === 'DRAFT' || detailData?.courseSection.status === 'REJECTED') {
            scheduleAutoSave();
        }
    }, [toggleAbsent, scheduleAutoSave, detailData]);

    const handleSubmitClick = () => {
        if (!detailData) return;
        const incomplete = detailData.students.filter(
            s => !s.isAbsent && (s.internalMark === null || s.externalMark === null)
        );
        if (incomplete.length > 0) {
            setValidationError(
                `${incomplete.length} student${incomplete.length > 1 ? 's' : ''} still need marks or absent marking`
            );
            return;
        }
        setValidationError(null);
        setConfirmSubmit(true);
    };

    const handleConfirmSubmit = async () => {
        setConfirmSubmit(false);
        await handleSubmit();
    };

    if (loading) {
        return (
            <PageLayout>
                <main className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                </main>
            </PageLayout>
        );
    }

    if (error || !detailData) {
        return (
            <PageLayout>
                <main className="p-4 md:p-6 lg:p-8">
                    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 flex items-center gap-3">
                        <XCircle size={20} />
                        {error ?? 'Failed to load grade detail.'}
                    </div>
                    <button
                        onClick={() => navigate('/faculty/grades')}
                        className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                    >
                        <ArrowLeft size={16} />Back to Course List
                    </button>
                </main>
            </PageLayout>
        );
    }

    const { courseSection, stats, students } = detailData;
    const isEditable = courseSection.status === 'DRAFT' || courseSection.status === 'REJECTED';
    const statusCfg = STATUS_CONFIG[courseSection.status];

    // Recalculate letter grades for display (real-time, even before save)
    const computedStudents = students.map(s => {
        if (s.isDirty && !s.isAbsent && s.internalMark !== null && s.externalMark !== null) {
            const total = s.internalMark + s.externalMark;
            const pct = Math.round((total / courseSection.totalMaxMark) * 100 * 100) / 100;
            const grade = calcLetterGrade(pct, false);
            return {
                ...s,
                totalMark: total,
                percentage: Math.round(pct),
                letterGrade: grade,
                gradePoint: grade ? calcGradePoint(grade) : null,
                isPass: grade ? !['F', 'ABSENT', 'WITHHELD'].includes(grade) : null,
            };
        }
        return s;
    });

    // Recompute stats for dirty data
    const livePassCount = computedStudents.filter(s => s.isPass === true).length;
    const liveAbsentCount = computedStudents.filter(s => s.isAbsent).length;
    const liveFailCount = computedStudents.filter(s => s.isPass === false && !s.isAbsent).length;
    const withMarks = computedStudents.filter(s => s.totalMark !== null && !s.isAbsent);
    const liveAvg = withMarks.length > 0
        ? Math.round((withMarks.reduce((acc, s) => acc + (s.totalMark ?? 0), 0) / withMarks.length) * 10) / 10
        : 0;

    return (
        <PageLayout>
            <Header title="Grade details" />
            <main className="p-4 md:p-6 lg:p-8 space-y-6">

                {/* ——— Back Link ——— */}
                <div className="flex items-center gap-2 -mt-2 mb-4">
                    <button
                        onClick={() => navigate('/faculty/grades')}
                        className="p-1 px-2 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors text-[var(--color-foreground-muted)] flex items-center gap-1.5 text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Grade List
                    </button>
                </div>

                {/* ——— Course Header Info ——— */}
                <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0 font-mono">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)] truncate">
                                {courseSection.subjectName}
                            </h1>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                                {statusCfg.icon}{statusCfg.label}
                            </span>
                        </div>
                        <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                            {courseSection.subjectCode} · {courseSection.sectionName} · {EXAM_TYPE_LABEL[courseSection.examType]}
                            {courseSection.examDate && ` · ${new Date(courseSection.examDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                        </p>
                        <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
                            Internal max: {courseSection.internalMaxMark} · External max: {courseSection.externalMaxMark} · Total max: {courseSection.totalMaxMark} · Pass mark: {courseSection.passMark}
                        </p>
                    </div>
                </div>

                {/* ——— Stats row ——— */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Students', value: stats.totalStudents, icon: <Users size={18} />, color: 'blue', sub: courseSection.semesterLabel },
                        { label: 'Pass', value: `${livePassCount} (${stats.totalStudents > 0 ? Math.round((livePassCount / stats.totalStudents) * 100) : 0}%)`, icon: <CheckCircle size={18} />, color: 'green', sub: 'Passing' },
                        { label: 'Fail / Absent', value: `${liveFailCount} / ${liveAbsentCount}`, icon: <XCircle size={18} />, color: 'red', sub: 'Need attention' },
                        { label: 'Average Mark', value: `${liveAvg}`, icon: <BarChart2 size={18} />, color: 'purple', sub: `/ ${courseSection.totalMaxMark}` },
                    ].map(s => (
                        <div key={s.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 shadow-sm">
                            <div className={`inline-flex p-2 rounded-lg mb-2 ${
                                s.color === 'blue'   ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                s.color === 'green'  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                s.color === 'red'    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            }`}>
                                {s.icon}
                            </div>
                            <p className="text-xs text-[var(--color-foreground-muted)]">{s.label}</p>
                            <p className="text-xl font-bold text-[var(--color-foreground)]">{s.value}</p>
                            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ——— Grade Distribution + Legend ——— */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-[var(--color-primary)]" />
                            Grade Distribution
                        </h3>
                        <GradeDistributionBar distribution={stats.gradeDistribution} total={stats.totalStudents} />
                    </div>
                    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                            <Award size={16} className="text-[var(--color-primary)]" />
                            Grade Legend
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {GRADE_ORDER.slice(0, 7).map(g => {
                                const cfg = GRADE_CONFIG[g];
                                return (
                                    <div key={g} className="flex items-center gap-2">
                                        <span className={`w-8 text-center font-bold rounded px-1 py-0.5 ${cfg.bg} ${cfg.text}`}>{g}</span>
                                        <span className="text-[var(--color-foreground-muted)]">{cfg.range}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ——— Validation error ——— */}
                {validationError && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                        <AlertTriangle size={16} className="shrink-0" />
                        {validationError}
                        <button onClick={() => setValidationError(null)} className="ml-auto"><X size={14} /></button>
                    </div>
                )}

                {/* ——— Save/Submit message ——— */}
                {saveMessage && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm font-medium">
                        <CheckCircle size={16} className="shrink-0" />
                        {saveMessage}
                    </div>
                )}

                {/* ——— Marks table ——— */}
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
                    {/* Table header bar */}
                    <div className="px-5 py-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                        <div>
                            <h2 className="font-semibold text-[var(--color-foreground)]">Student Marks</h2>
                            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
                                {courseSection.submittedCount} of {courseSection.studentCount} students have marks entered
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Auto-save indicator */}
                            {autoSaveTimer && (
                                <span className="text-xs text-[var(--color-foreground-muted)] flex items-center gap-1">
                                    {autoSaveTimer.startsWith('Saving') ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                    {autoSaveTimer}
                                </span>
                            )}
                            {isEditable && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveDraft}
                                        disabled={saving}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-background-tertiary)] transition-colors disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        Save Draft
                                    </button>
                                    <button
                                        onClick={handleSubmitClick}
                                        disabled={submitting}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                        Submit for Approval
                                    </button>
                                </div>
                            )}
                            {!isEditable && (
                                <span className="text-xs px-3 py-1.5 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-foreground-muted)]">
                                    Read-only — {statusCfg.label}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--color-background-secondary)] sticky top-0 z-10">
                                <tr>
                                    <th className="text-left px-4 py-3 text-[var(--color-foreground-muted)] font-medium w-10">#</th>
                                    <th className="text-left px-4 py-3 text-[var(--color-foreground-muted)] font-medium min-w-[180px]">Student</th>
                                    <th className="text-center px-4 py-3 text-[var(--color-foreground-muted)] font-medium">
                                        Internal<br />
                                        <span className="text-xs font-normal opacity-70">/ {courseSection.internalMaxMark}</span>
                                    </th>
                                    <th className="text-center px-4 py-3 text-[var(--color-foreground-muted)] font-medium">
                                        External<br />
                                        <span className="text-xs font-normal opacity-70">/ {courseSection.externalMaxMark}</span>
                                    </th>
                                    <th className="text-center px-4 py-3 text-[var(--color-foreground-muted)] font-medium">
                                        Total<br />
                                        <span className="text-xs font-normal opacity-70">/ {courseSection.totalMaxMark}</span>
                                    </th>
                                    <th className="text-center px-4 py-3 text-[var(--color-foreground-muted)] font-medium">%</th>
                                    <th className="text-center px-4 py-3 text-[var(--color-foreground-muted)] font-medium">Grade</th>
                                    {isEditable && (
                                        <th className="text-center px-4 py-3 text-[var(--color-foreground-muted)] font-medium">
                                            <UserX size={14} className="mx-auto" />
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {computedStudents.map((student, idx) => {
                                    const gradeCfg = student.letterGrade ? GRADE_CONFIG[student.letterGrade] : null;
                                    const isIncomplete = !student.isAbsent && (student.internalMark === null || student.externalMark === null);
                                    return (
                                        <tr
                                            key={student.studentId}
                                            className={`transition-colors
                                                ${student.isAbsent ? 'opacity-50' : 'hover:bg-[var(--color-background-secondary)]'}
                                                ${student.isDirty ? 'border-l-2 border-l-[var(--color-primary)]' : ''}
                                                ${isIncomplete && isEditable ? 'bg-yellow-50/40 dark:bg-yellow-900/10' : ''}
                                            `}
                                        >
                                            {/* # */}
                                            <td className="px-4 py-3 text-[var(--color-foreground-muted)] text-center">{idx + 1}</td>

                                            {/* Student */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <StudentAvatar name={student.studentName} photo={student.profilePhoto} size={8} />
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-[var(--color-foreground)] truncate">{student.studentName}</p>
                                                        <p className="text-xs text-[var(--color-foreground-muted)]">
                                                            {student.registerNumber} · Roll {student.rollNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Internal */}
                                            <td className="px-4 py-3 text-center">
                                                {isEditable && !student.isAbsent ? (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={courseSection.internalMaxMark}
                                                        step={0.5}
                                                        value={student.internalMark ?? ''}
                                                        onChange={e => handleMarkChange(
                                                            student.studentId,
                                                            'internalMark',
                                                            e.target.value === '' ? null : Math.min(Number(e.target.value), courseSection.internalMaxMark),
                                                        )}
                                                        className={`w-16 text-center border rounded-md px-2 py-1 text-sm bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                                                            student.internalMark !== null
                                                                ? 'border-[var(--color-primary)] border-opacity-50'
                                                                : 'border-[var(--color-border)]'
                                                        }`}
                                                        aria-label={`Internal mark for ${student.studentName}`}
                                                    />
                                                ) : (
                                                    <span className="text-[var(--color-foreground)]">
                                                        {student.isAbsent ? '—' : (student.internalMark ?? '—')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* External */}
                                            <td className="px-4 py-3 text-center">
                                                {isEditable && !student.isAbsent ? (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={courseSection.externalMaxMark}
                                                        step={0.5}
                                                        value={student.externalMark ?? ''}
                                                        onChange={e => handleMarkChange(
                                                            student.studentId,
                                                            'externalMark',
                                                            e.target.value === '' ? null : Math.min(Number(e.target.value), courseSection.externalMaxMark),
                                                        )}
                                                        className={`w-16 text-center border rounded-md px-2 py-1 text-sm bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                                                            student.externalMark !== null
                                                                ? 'border-[var(--color-primary)] border-opacity-50'
                                                                : 'border-[var(--color-border)]'
                                                        }`}
                                                        aria-label={`External mark for ${student.studentName}`}
                                                    />
                                                ) : (
                                                    <span className="text-[var(--color-foreground)]">
                                                        {student.isAbsent ? '—' : (student.externalMark ?? '—')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Total */}
                                            <td className="px-4 py-3 text-center font-semibold text-[var(--color-foreground)]">
                                                {student.isAbsent ? '—' : (student.totalMark !== null ? student.totalMark : '—')}
                                            </td>

                                            {/* % */}
                                            <td className="px-4 py-3 text-center text-[var(--color-foreground-secondary)]">
                                                {student.isAbsent ? '—' : (student.percentage !== null ? `${student.percentage}%` : '—')}
                                            </td>

                                            {/* Grade */}
                                            <td className="px-4 py-3 text-center">
                                                {gradeCfg ? (
                                                    <span className={`inline-flex items-center justify-center w-12 h-7 rounded-md text-xs font-bold ${gradeCfg.bg} ${gradeCfg.text}`}>
                                                        {student.letterGrade}
                                                    </span>
                                                ) : '—'}
                                            </td>

                                            {/* Absent toggle */}
                                            {isEditable && (
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => handleToggleAbsent(student.studentId)}
                                                        className={`p-1.5 rounded-lg transition-colors ${
                                                            student.isAbsent
                                                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                                : 'hover:bg-red-100 dark:hover:bg-red-900/30 text-[var(--color-foreground-muted)] hover:text-red-500'
                                                        }`}
                                                        title={student.isAbsent ? 'Mark present' : 'Mark absent'}
                                                        aria-label={student.isAbsent ? `Mark ${student.studentName} as present` : `Mark ${student.studentName} as absent`}
                                                    >
                                                        <UserX size={15} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom action bar */}
                    {isEditable && (
                        <div className="px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] flex items-center justify-between gap-4 flex-wrap">
                            <p className="text-xs text-[var(--color-foreground-muted)]">
                                Marks auto-save after you stop typing · Yellow left border = unsaved change
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveDraft}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-background-tertiary)] transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save Draft
                                </button>
                                <button
                                    onClick={handleSubmitClick}
                                    disabled={submitting}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                    Submit for Approval
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ——— Submit confirmation modal ——— */}
                {confirmSubmit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-[var(--color-card)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--color-border)]">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-[var(--color-foreground)]">Submit Grades for Approval?</h3>
                                    <button onClick={() => setConfirmSubmit(false)} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-4 bg-[var(--color-background-secondary)] rounded-lg mb-4 space-y-1 text-sm">
                                    <p><span className="text-[var(--color-foreground-muted)]">Course:</span> <span className="font-medium text-[var(--color-foreground)]">{courseSection.subjectName} – {courseSection.sectionName}</span></p>
                                    <p><span className="text-[var(--color-foreground-muted)]">Students:</span> <span className="font-medium text-[var(--color-foreground)]">{students.length}</span></p>
                                    <p><span className="text-[var(--color-foreground-muted)]">Exam type:</span> <span className="font-medium text-[var(--color-foreground)]">{EXAM_TYPE_LABEL[courseSection.examType]}</span></p>
                                </div>
                                <p className="text-sm text-[var(--color-foreground-secondary)] mb-6">
                                    Once submitted, you will <strong>not be able to edit marks</strong> unless the HOD rejects the submission.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmSubmit(false)}
                                        className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmSubmit}
                                        className="flex-1 py-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-medium"
                                    >
                                        Yes, Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </PageLayout>
    );
}
