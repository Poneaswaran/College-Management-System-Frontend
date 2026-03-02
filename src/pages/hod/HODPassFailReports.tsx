import { useState, useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Users,
    CheckCircle,
    XCircle,
    BarChart3,
    Download,
    Filter,
    Award,
    AlertTriangle,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { FilterBar } from '../../components/ui/FilterBar';

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface SubjectResult {
    subjectCode: string;
    subjectName: string;
    totalStudents: number;
    appeared: number;
    passed: number;
    failed: number;
    absentees: number;
    highestMark: number;
    averageMark: number;
    passPercentage: number;
}

interface SemesterReport {
    id: string;
    semester: string;
    year: string;
    examType: 'INTERNAL' | 'SEMESTER';
    department: string;
    batch: string;
    subjects: SubjectResult[];
}

const MOCK_REPORTS: SemesterReport[] = [
    {
        id: '1',
        semester: 'Semester 5',
        year: '2025-2026',
        examType: 'SEMESTER',
        department: 'Computer Science & Engineering',
        batch: '2022-2026',
        subjects: [
            { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', totalStudents: 120, appeared: 118, passed: 102, failed: 16, absentees: 2, highestMark: 98, averageMark: 74.3, passPercentage: 86.4 },
            { subjectCode: 'CS502', subjectName: 'Database Management Systems', totalStudents: 120, appeared: 119, passed: 110, failed: 9, absentees: 1, highestMark: 100, averageMark: 81.2, passPercentage: 92.4 },
            { subjectCode: 'CS503', subjectName: 'Operating Systems', totalStudents: 120, appeared: 117, passed: 93, failed: 24, absentees: 3, highestMark: 95, averageMark: 68.7, passPercentage: 79.5 },
            { subjectCode: 'CS504', subjectName: 'Computer Networks', totalStudents: 120, appeared: 120, passed: 88, failed: 32, absentees: 0, highestMark: 97, averageMark: 65.4, passPercentage: 73.3 },
            { subjectCode: 'CS505', subjectName: 'Software Engineering', totalStudents: 120, appeared: 118, passed: 112, failed: 6, absentees: 2, highestMark: 99, averageMark: 83.6, passPercentage: 94.9 },
        ],
    },
    {
        id: '2',
        semester: 'Semester 4',
        year: '2024-2025',
        examType: 'SEMESTER',
        department: 'Computer Science & Engineering',
        batch: '2022-2026',
        subjects: [
            { subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', totalStudents: 115, appeared: 114, passed: 89, failed: 25, absentees: 1, highestMark: 94, averageMark: 69.1, passPercentage: 78.1 },
            { subjectCode: 'CS402', subjectName: 'Theory of Computation', totalStudents: 115, appeared: 112, passed: 76, failed: 36, absentees: 3, highestMark: 91, averageMark: 61.4, passPercentage: 67.9 },
            { subjectCode: 'CS403', subjectName: 'Microprocessors & Microcontrollers', totalStudents: 115, appeared: 115, passed: 99, failed: 16, absentees: 0, highestMark: 96, averageMark: 75.8, passPercentage: 86.1 },
            { subjectCode: 'CS404', subjectName: 'Object Oriented Programming', totalStudents: 115, appeared: 113, passed: 108, failed: 5, absentees: 2, highestMark: 100, averageMark: 84.2, passPercentage: 95.6 },
        ],
    },
    {
        id: '3',
        semester: 'Semester 5',
        year: '2025-2026',
        examType: 'INTERNAL',
        department: 'Computer Science & Engineering',
        batch: '2022-2026',
        subjects: [
            { subjectCode: 'CS501', subjectName: 'Data Structures & Algorithms', totalStudents: 120, appeared: 120, passed: 108, failed: 12, absentees: 0, highestMark: 50, averageMark: 38.4, passPercentage: 90.0 },
            { subjectCode: 'CS502', subjectName: 'Database Management Systems', totalStudents: 120, appeared: 120, passed: 115, failed: 5, absentees: 0, highestMark: 50, averageMark: 42.1, passPercentage: 95.8 },
            { subjectCode: 'CS503', subjectName: 'Operating Systems', totalStudents: 120, appeared: 119, passed: 101, failed: 18, absentees: 1, highestMark: 49, averageMark: 36.9, passPercentage: 84.9 },
        ],
    },
];

// ─── Static Options ───────────────────────────────────────────────────────────

const SEMESTER_OPTIONS = [
    { value: 'ALL', label: 'All Semesters' },
    { value: 'Semester 5', label: 'Semester 5' },
    { value: 'Semester 4', label: 'Semester 4' },
    { value: 'Semester 3', label: 'Semester 3' },
];

const EXAM_TYPE_OPTIONS = [
    { value: 'ALL', label: 'All Exam Types' },
    { value: 'SEMESTER', label: 'Semester Exam' },
    { value: 'INTERNAL', label: 'Internal Exam' },
];

const YEAR_OPTIONS = [
    { value: 'ALL', label: 'All Years' },
    { value: '2025-2026', label: '2025-2026' },
    { value: '2024-2025', label: '2024-2025' },
    { value: '2023-2024', label: '2023-2024' },
];

// ─── Helper utilities ─────────────────────────────────────────────────────────

function getPassRateColor(rate: number): string {
    if (rate >= 90) return 'text-[var(--color-success)]';
    if (rate >= 75) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-error)]';
}

function getPassRateBadge(rate: number): string {
    if (rate >= 90) return 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/20';
    if (rate >= 75) return 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/20';
    return 'bg-[var(--color-error-light)] text-[var(--color-error)] border-[var(--color-error)]/20';
}

function getPassRateBarColor(rate: number): string {
    if (rate >= 90) return 'bg-[var(--color-success)]';
    if (rate >= 75) return 'bg-[var(--color-warning)]';
    return 'bg-[var(--color-error)]';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
    iconBg: string;
    iconColor: string;
}

function StatCard({ icon, label, value, sub, iconBg, iconColor }: StatCardProps) {
    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm hover:border-[var(--color-primary-light)] transition-colors">
            <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-[var(--color-foreground-muted)]">{label}</p>
                <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>{icon}</div>
            </div>
            <p className="text-3xl font-bold text-[var(--color-foreground)]">{value}</p>
            {sub && <p className="text-xs text-[var(--color-foreground-muted)] mt-1">{sub}</p>}
        </div>
    );
}

interface SubjectRowProps {
    subject: SubjectResult;
    rank: number;
}

function SubjectRow({ subject, rank }: SubjectRowProps) {
    return (
        <tr className="hover:bg-[var(--color-background-secondary)] transition-colors">
            <td className="px-4 py-3 text-sm text-[var(--color-foreground-muted)] font-mono">{rank}</td>
            <td className="px-4 py-3">
                <div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">{subject.subjectName}</p>
                    <p className="text-xs text-[var(--color-foreground-muted)]">{subject.subjectCode}</p>
                </div>
            </td>
            <td className="px-4 py-3 text-center text-sm text-[var(--color-foreground)]">{subject.appeared}</td>
            <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-success)]">
                    <CheckCircle size={14} /> {subject.passed}
                </span>
            </td>
            <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-error)]">
                    <XCircle size={14} /> {subject.failed}
                </span>
            </td>
            <td className="px-4 py-3 text-center text-sm text-[var(--color-foreground-muted)]">{subject.absentees}</td>
            <td className="px-4 py-3 text-center text-sm text-[var(--color-foreground)]">{subject.highestMark}</td>
            <td className="px-4 py-3 text-center text-sm text-[var(--color-foreground)]">{subject.averageMark.toFixed(1)}</td>
            <td className="px-4 py-3 text-center">
                <div className="flex flex-col items-center gap-1">
                    <span className={`text-sm font-bold ${getPassRateColor(subject.passPercentage)}`}>
                        {subject.passPercentage.toFixed(1)}%
                    </span>
                    <div className="w-20 h-1.5 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${getPassRateBarColor(subject.passPercentage)}`}
                            style={{ width: `${subject.passPercentage}%` }}
                        />
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 text-center">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPassRateBadge(subject.passPercentage)}`}>
                    {subject.passPercentage >= 90 ? 'Excellent' : subject.passPercentage >= 75 ? 'Average' : 'Needs Attention'}
                </span>
            </td>
        </tr>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HODPassFailReports() {
    const [semesterFilter, setSemesterFilter] = useState('ALL');
    const [examTypeFilter, setExamTypeFilter] = useState('ALL');
    const [yearFilter, setYearFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReportId, setSelectedReportId] = useState<string>(MOCK_REPORTS[0].id);

    // Filter the report list
    const filteredReports = useMemo(() => {
        return MOCK_REPORTS.filter((r) => {
            if (semesterFilter !== 'ALL' && r.semester !== semesterFilter) return false;
            if (examTypeFilter !== 'ALL' && r.examType !== examTypeFilter) return false;
            if (yearFilter !== 'ALL' && r.year !== yearFilter) return false;
            return true;
        });
    }, [semesterFilter, examTypeFilter, yearFilter]);

    // Active report detail
    const activeReport = useMemo(
        () => filteredReports.find((r) => r.id === selectedReportId) ?? filteredReports[0],
        [filteredReports, selectedReportId],
    );

    // Filter subjects inside the active report by search
    const filteredSubjects = useMemo(() => {
        if (!activeReport) return [];
        const term = searchTerm.toLowerCase();
        if (!term) return activeReport.subjects;
        return activeReport.subjects.filter(
            (s) =>
                s.subjectName.toLowerCase().includes(term) ||
                s.subjectCode.toLowerCase().includes(term),
        );
    }, [activeReport, searchTerm]);

    // Aggregate stats for active report
    const stats = useMemo(() => {
        if (!activeReport) return null;
        const subjects = activeReport.subjects;
        const totalAppeared = subjects.reduce((sum, s) => sum + s.appeared, 0);
        const totalPassed = subjects.reduce((sum, s) => sum + s.passed, 0);
        const totalFailed = subjects.reduce((sum, s) => sum + s.failed, 0);
        const overallPass = totalAppeared > 0 ? (totalPassed / totalAppeared) * 100 : 0;
        const weakSubjects = subjects.filter((s) => s.passPercentage < 75).length;
        return { totalAppeared, totalPassed, totalFailed, overallPass, weakSubjects };
    }, [activeReport]);

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Pass / Fail Reports</h1>
                        <p className="text-[var(--color-foreground-muted)] mt-1">
                            Exam-wise pass/fail analysis across subjects for your department.
                        </p>
                    </div>
                    <button
                        className="flex items-center gap-2 bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground)] px-4 py-2 rounded-lg border border-[var(--color-border)] transition-colors text-sm font-medium"
                        title="Export coming soon (backend pending)"
                    >
                        <Download size={16} />
                        Export Report
                    </button>
                </div>

                {/* ── Global Filters ── */}
                <FilterBar>
                    <FilterBar.Actions>
                        <Select
                            value={semesterFilter}
                            onChange={setSemesterFilter}
                            options={SEMESTER_OPTIONS}
                        />
                        <Select
                            value={examTypeFilter}
                            onChange={setExamTypeFilter}
                            options={EXAM_TYPE_OPTIONS}
                        />
                        <Select
                            value={yearFilter}
                            onChange={setYearFilter}
                            options={YEAR_OPTIONS}
                        />
                    </FilterBar.Actions>
                </FilterBar>

                {/* ── Report Selector Cards ── */}
                {filteredReports.length === 0 ? (
                    <div className="text-center p-12 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                        <Filter size={48} className="mx-auto text-[var(--color-foreground-muted)] mb-4" />
                        <h3 className="text-lg font-medium text-[var(--color-foreground)]">No reports match the selected filters</h3>
                        <p className="text-[var(--color-foreground-muted)]">Try adjusting your filters above.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredReports.map((report) => {
                                const totalPassed = report.subjects.reduce((s, r) => s + r.passed, 0);
                                const totalAppeared = report.subjects.reduce((s, r) => s + r.appeared, 0);
                                const passRate = totalAppeared > 0 ? (totalPassed / totalAppeared) * 100 : 0;
                                const isActive = activeReport?.id === report.id;
                                return (
                                    <button
                                        key={report.id}
                                        onClick={() => setSelectedReportId(report.id)}
                                        className={`text-left p-5 rounded-xl border shadow-sm transition-all ${
                                            isActive
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/10 ring-1 ring-[var(--color-primary)]'
                                                : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary-light)]'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-[var(--color-foreground)]">{report.semester}</p>
                                                <p className="text-xs text-[var(--color-foreground-muted)]">{report.year}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                report.examType === 'SEMESTER'
                                                    ? 'bg-[var(--color-primary-light)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/20'
                                                    : 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/20'
                                            }`}>
                                                {report.examType === 'SEMESTER' ? 'Semester' : 'Internal'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="flex-1 h-2 bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${getPassRateBarColor(passRate)}`}
                                                    style={{ width: `${passRate}%` }}
                                                />
                                            </div>
                                            <span className={`text-sm font-bold ${getPassRateColor(passRate)}`}>{passRate.toFixed(1)}%</span>
                                        </div>
                                        <p className="text-xs text-[var(--color-foreground-muted)] mt-1">{report.subjects.length} subjects</p>
                                    </button>
                                );
                            })}
                        </div>

                        {activeReport && stats && (
                            <>
                                {/* ── Summary Stats ── */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <StatCard
                                        icon={<Users size={18} />}
                                        label="Total Appeared"
                                        value={stats.totalAppeared}
                                        sub="across all subjects"
                                        iconBg="bg-[var(--color-background-secondary)]"
                                        iconColor="text-[var(--color-primary)]"
                                    />
                                    <StatCard
                                        icon={<CheckCircle size={18} />}
                                        label="Total Passed"
                                        value={stats.totalPassed}
                                        sub="cumulative passes"
                                        iconBg="bg-[var(--color-success-light)]"
                                        iconColor="text-[var(--color-success)]"
                                    />
                                    <StatCard
                                        icon={<XCircle size={18} />}
                                        label="Total Failed"
                                        value={stats.totalFailed}
                                        sub="cumulative fails"
                                        iconBg="bg-[var(--color-error-light)]"
                                        iconColor="text-[var(--color-error)]"
                                    />
                                    <StatCard
                                        icon={<BarChart3 size={18} />}
                                        label="Overall Pass Rate"
                                        value={`${stats.overallPass.toFixed(1)}%`}
                                        sub="all subjects combined"
                                        iconBg="bg-[var(--color-background-secondary)]"
                                        iconColor={getPassRateColor(stats.overallPass)}
                                    />
                                    <StatCard
                                        icon={<AlertTriangle size={18} />}
                                        label="Subjects Needing Attention"
                                        value={stats.weakSubjects}
                                        sub="pass rate below 75%"
                                        iconBg="bg-[var(--color-warning-light)]"
                                        iconColor="text-[var(--color-warning)]"
                                    />
                                </div>

                                {/* ── Pass Rate Visual Bars ── */}
                                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-5">
                                        <TrendingUp size={20} className="text-[var(--color-primary)]" />
                                        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Subject-wise Pass Rate</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {activeReport.subjects.map((subject) => (
                                            <div key={subject.subjectCode}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-xs font-mono text-[var(--color-foreground-muted)] shrink-0">{subject.subjectCode}</span>
                                                        <span className="text-sm font-medium text-[var(--color-foreground)] truncate">{subject.subjectName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                                        <span className="hidden sm:inline text-xs text-[var(--color-foreground-muted)]">
                                                            {subject.passed}/{subject.appeared}
                                                        </span>
                                                        <span className={`text-sm font-bold ${getPassRateColor(subject.passPercentage)}`}>
                                                            {subject.passPercentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-[var(--color-background-tertiary)]">
                                                    <div
                                                        className={`h-full ${getPassRateBarColor(subject.passPercentage)} transition-all duration-500`}
                                                        style={{ width: `${subject.passPercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-[var(--color-border)]">
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-muted)]">
                                            <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
                                            Excellent (≥ 90%)
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-muted)]">
                                            <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]" />
                                            Average (75–89%)
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-muted)]">
                                            <div className="w-3 h-3 rounded-full bg-[var(--color-error)]" />
                                            Needs Attention (&lt; 75%)
                                        </div>
                                    </div>
                                </div>

                                {/* ── Detailed Subject Table ── */}
                                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden">
                                    <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[var(--color-border)]">
                                        <div className="flex items-center gap-2">
                                            <Award size={20} className="text-[var(--color-primary)]" />
                                            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Subject-wise Detailed Report</h2>
                                            <span className="text-xs text-[var(--color-foreground-muted)] bg-[var(--color-background-secondary)] px-2 py-0.5 rounded-full">
                                                {activeReport.semester} · {activeReport.examType === 'SEMESTER' ? 'Semester Exam' : 'Internal Exam'} · {activeReport.year}
                                            </span>
                                        </div>
                                        <SearchInput
                                            value={searchTerm}
                                            onChange={setSearchTerm}
                                            placeholder="Search subject..."
                                            size="sm"
                                            showClear
                                            wrapperClassName="w-full sm:w-64"
                                        />
                                    </div>

                                    {filteredSubjects.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <TrendingDown size={36} className="mx-auto text-[var(--color-foreground-muted)] mb-3" />
                                            <p className="text-[var(--color-foreground-muted)]">No subjects match your search.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-[var(--color-background-secondary)] text-[var(--color-foreground-muted)] text-xs uppercase tracking-wide">
                                                        <th className="px-4 py-3 text-left">#</th>
                                                        <th className="px-4 py-3 text-left">Subject</th>
                                                        <th className="px-4 py-3 text-center">Appeared</th>
                                                        <th className="px-4 py-3 text-center">Passed</th>
                                                        <th className="px-4 py-3 text-center">Failed</th>
                                                        <th className="px-4 py-3 text-center">Absent</th>
                                                        <th className="px-4 py-3 text-center">Highest</th>
                                                        <th className="px-4 py-3 text-center">Average</th>
                                                        <th className="px-4 py-3 text-center">Pass %</th>
                                                        <th className="px-4 py-3 text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[var(--color-border)]">
                                                    {filteredSubjects.map((subject, idx) => (
                                                        <SubjectRow key={subject.subjectCode} subject={subject} rank={idx + 1} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* ── Mock data notice ── */}
                                <div className="flex items-start gap-3 p-4 bg-[var(--color-warning-light)] border border-[var(--color-warning)]/30 rounded-xl text-sm">
                                    <AlertTriangle size={18} className="text-[var(--color-warning)] shrink-0 mt-0.5" />
                                    <p className="text-[var(--color-warning)]">
                                        <span className="font-semibold">Mock Data:</span> This page is currently using placeholder data. It will be connected to the backend API once the exam results module is ready.
                                    </p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
}
