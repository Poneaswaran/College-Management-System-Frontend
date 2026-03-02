import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    GraduationCap,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    Search,
    ChevronRight,
    Users,
    TrendingUp,
    Edit3,
    Send,
    Eye,
    Loader2,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { useFacultyGrades } from '../../features/faculty/hooks/grades';
import type { GradeStatus, GradeCourseSection, ExamType } from '../../features/faculty/types/grades';

// ——— Badge helpers ———

const STATUS_CONFIG: Record<GradeStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    DRAFT: {
        label: 'Draft',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: <Clock size={12} />,
    },
    SUBMITTED: {
        label: 'Submitted',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        icon: <Send size={12} />,
    },
    APPROVED: {
        label: 'Approved',
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        icon: <CheckCircle size={12} />,
    },
    REJECTED: {
        label: 'Rejected',
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        icon: <XCircle size={12} />,
    },
};

const EXAM_TYPE_LABEL: Record<ExamType, string> = {
    INTERNAL: 'Internal Exam',
    EXTERNAL: 'External Exam',
    QUIZ: 'Quiz',
    LAB: 'Lab Exam',
    ASSIGNMENT: 'Assignment',
};

const STATUS_FILTERS: { value: GradeStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
];

// ——— Sub-component: Course Section Card ———

interface CourseSectionCardProps {
    section: GradeCourseSection;
    onSelect: (id: number) => void;
}

function CourseSectionCard({ section, onSelect }: CourseSectionCardProps) {
    const statusCfg = STATUS_CONFIG[section.status];
    const submissionPct = section.studentCount > 0
        ? Math.round((section.submittedCount / section.studentCount) * 100)
        : 0;

    return (
        <div
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onSelect(section.id)}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-foreground)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                        {section.subjectName}
                    </h3>
                    <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
                        {section.subjectCode} · {section.sectionName}
                    </p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                    {statusCfg.icon}{statusCfg.label}
                </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-foreground-muted)] mb-4">
                <span className="flex items-center gap-1"><BookOpen size={11} />{EXAM_TYPE_LABEL[section.examType]}</span>
                <span className="flex items-center gap-1"><Users size={11} />{section.studentCount} students</span>
                <span className="flex items-center gap-1"><TrendingUp size={11} />Max {section.totalMaxMark}</span>
            </div>

            {/* Submission progress bar */}
            <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-[var(--color-foreground-muted)]">Marks entered</span>
                <span className="font-medium text-[var(--color-foreground)]">{section.submittedCount}/{section.studentCount}</span>
            </div>
            <div className="h-1.5 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                    style={{ width: `${submissionPct}%` }}
                />
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-foreground-muted)]">
                <span>
                    {section.lastModifiedAt
                        ? `Updated ${new Date(section.lastModifiedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`
                        : 'Not started'}
                </span>
                <span className="flex items-center gap-1 text-[var(--color-primary)] font-medium group-hover:underline">
                    {section.status === 'DRAFT' || section.status === 'REJECTED' ? (
                        <><Edit3 size={11} />Edit Grades</>
                    ) : (
                        <><Eye size={11} />View Grades</>
                    )}
                    <ChevronRight size={11} />
                </span>
            </div>
        </div>
    );
}

// ——— Main Page ———

export default function FacultyGrades() {
    const navigate = useNavigate();
    const {
        gradesData,
        loading,
        error,
        loadGrades,
        statusFilter,
        setStatusFilter,
        searchTerm,
        setSearchTerm,
    } = useFacultyGrades();

    useEffect(() => {
        loadGrades();
    }, [loadGrades]);

    const summary = gradesData?.summary;
    const courseSections = gradesData?.courseSections ?? [];

    const filteredSections = courseSections.filter(s => {
        const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
        const matchesSearch =
            s.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.sectionName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <PageLayout>
            <main className="p-4 md:p-6 lg:p-8">
                {/* Page Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] mb-1 flex items-center gap-3">
                        <GraduationCap className="text-[var(--color-primary)]" size={32} />
                        Grade Submission
                    </h1>
                    <p className="text-[var(--color-foreground-secondary)]">
                        Enter, save, and submit student marks for your assigned courses
                        {summary ? ` · ${summary.currentSemesterLabel}` : ''}
                    </p>
                </div>

                {/* Summary stats */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        {[
                            { label: 'Total Courses', value: summary.totalCourses, icon: <BookOpen size={18} />, color: 'blue' },
                            { label: 'Draft', value: summary.totalDraft, icon: <Clock size={18} />, color: 'yellow' },
                            { label: 'Submitted', value: summary.totalSubmitted, icon: <Send size={18} />, color: 'blue' },
                            { label: 'Pending Approval', value: summary.totalPendingApproval, icon: <AlertCircle size={18} />, color: 'orange' },
                            { label: 'Approved', value: summary.totalApproved, icon: <CheckCircle size={18} />, color: 'green' },
                            { label: 'Rejected', value: summary.totalRejected, icon: <XCircle size={18} />, color: 'red' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 shadow-sm">
                                <div className={`inline-flex p-2 rounded-lg mb-2 ${
                                    stat.color === 'blue'   ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                    stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                    stat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                    stat.color === 'green'  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                    stat.color === 'red'    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}>
                                    {stat.icon}
                                </div>
                                <p className="text-xs text-[var(--color-foreground-muted)]">{stat.label}</p>
                                <p className="text-xl font-bold text-[var(--color-foreground)]">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" />
                        <input
                            type="text"
                            placeholder="Search by subject or section…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-foreground)] placeholder-[var(--color-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {STATUS_FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setStatusFilter(f.value)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === f.value
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)]'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="animate-spin text-[var(--color-primary)]" size={36} />
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                        {error}
                    </div>
                ) : filteredSections.length === 0 ? (
                    <div className="text-center py-20 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
                        <GraduationCap size={48} className="mx-auto text-[var(--color-foreground-muted)] mb-3" />
                        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">No courses found</h3>
                        <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'Try adjusting your filters.'
                                : 'No courses assigned this semester.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredSections.map(section => (
                            <CourseSectionCard
                                key={section.id}
                                section={section}
                                onSelect={id => navigate(`/faculty/grades/${id}`)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </PageLayout>
    );
}
