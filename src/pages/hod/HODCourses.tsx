import { useState } from 'react';
import {
    BookOpen,
    Users,
    Clock,
    TrendingUp,
    BarChart3,
    Filter,
    Eye,
    Edit,
    MoreVertical,
    CheckCircle,
    AlertTriangle,
    XCircle,
    GraduationCap,
    Layers,
    Hash,
    Star,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DepartmentCourse {
    id: string;
    subjectCode: string;
    subjectName: string;
    credits: number;
    type: 'THEORY' | 'LAB' | 'ELECTIVE' | 'PROJECT';
    semester: number;
    semesterLabel: string;
    section: string;
    facultyName: string;
    facultyId: string;
    studentsCount: number;
    avgAttendance: number;
    avgGrade: number;
    classesCompleted: number;
    classesTotal: number;
    assignmentsCount: number;
    pendingSubmissions: number;
    schedule: string;
    room: string;
    status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_COURSES: DepartmentCourse[] = [
    {
        id: '1',
        subjectCode: 'CS301',
        subjectName: 'Data Structures & Algorithms',
        credits: 4,
        type: 'THEORY',
        semester: 3,
        semesterLabel: 'Semester 3 — Spring 2026',
        section: 'CSE-A',
        facultyName: 'Dr. Ramesh Kumar',
        facultyId: 'F001',
        studentsCount: 62,
        avgAttendance: 88,
        avgGrade: 7.4,
        classesCompleted: 38,
        classesTotal: 60,
        assignmentsCount: 5,
        pendingSubmissions: 8,
        schedule: 'Mon, Wed, Fri — 9:00 AM',
        room: 'Block A — 301',
        status: 'ACTIVE',
    },
    {
        id: '2',
        subjectCode: 'CS302',
        subjectName: 'Object Oriented Programming',
        credits: 4,
        type: 'THEORY',
        semester: 3,
        semesterLabel: 'Semester 3 — Spring 2026',
        section: 'CSE-B',
        facultyName: 'Ms. Priya Sharma',
        facultyId: 'F002',
        studentsCount: 58,
        avgAttendance: 92,
        avgGrade: 8.1,
        classesCompleted: 42,
        classesTotal: 60,
        assignmentsCount: 6,
        pendingSubmissions: 3,
        schedule: 'Tue, Thu — 10:30 AM',
        room: 'Block B — 205',
        status: 'ACTIVE',
    },
    {
        id: '3',
        subjectCode: 'CS303L',
        subjectName: 'Data Structures Lab',
        credits: 2,
        type: 'LAB',
        semester: 3,
        semesterLabel: 'Semester 3 — Spring 2026',
        section: 'CSE-A',
        facultyName: 'Mr. Suresh Patel',
        facultyId: 'F003',
        studentsCount: 62,
        avgAttendance: 95,
        avgGrade: 8.6,
        classesCompleted: 18,
        classesTotal: 28,
        assignmentsCount: 9,
        pendingSubmissions: 0,
        schedule: 'Wed — 2:00 PM',
        room: 'DSA Lab — GF',
        status: 'ACTIVE',
    },
    {
        id: '4',
        subjectCode: 'CS401',
        subjectName: 'Database Management Systems',
        credits: 4,
        type: 'THEORY',
        semester: 5,
        semesterLabel: 'Semester 5 — Spring 2026',
        section: 'CSE-A',
        facultyName: 'Dr. Anita Verma',
        facultyId: 'F004',
        studentsCount: 55,
        avgAttendance: 74,
        avgGrade: 6.8,
        classesCompleted: 30,
        classesTotal: 60,
        assignmentsCount: 4,
        pendingSubmissions: 14,
        schedule: 'Mon, Wed — 11:30 AM',
        room: 'Block C — 102',
        status: 'ACTIVE',
    },
    {
        id: '5',
        subjectCode: 'CS402',
        subjectName: 'Computer Networks',
        credits: 4,
        type: 'THEORY',
        semester: 5,
        semesterLabel: 'Semester 5 — Spring 2026',
        section: 'CSE-B',
        facultyName: 'Dr. Ramesh Kumar',
        facultyId: 'F001',
        studentsCount: 60,
        avgAttendance: 81,
        avgGrade: 7.2,
        classesCompleted: 28,
        classesTotal: 60,
        assignmentsCount: 3,
        pendingSubmissions: 5,
        schedule: 'Tue, Thu, Fri — 8:00 AM',
        room: 'Block A — 401',
        status: 'ACTIVE',
    },
    {
        id: '6',
        subjectCode: 'CS403L',
        subjectName: 'DBMS Lab',
        credits: 2,
        type: 'LAB',
        semester: 5,
        semesterLabel: 'Semester 5 — Spring 2026',
        section: 'CSE-A',
        facultyName: 'Ms. Priya Sharma',
        facultyId: 'F002',
        studentsCount: 55,
        avgAttendance: 97,
        avgGrade: 9.0,
        classesCompleted: 14,
        classesTotal: 28,
        assignmentsCount: 7,
        pendingSubmissions: 0,
        schedule: 'Fri — 2:00 PM',
        room: 'DB Lab — FF',
        status: 'ACTIVE',
    },
    {
        id: '7',
        subjectCode: 'CS501',
        subjectName: 'Machine Learning',
        credits: 4,
        type: 'ELECTIVE',
        semester: 7,
        semesterLabel: 'Semester 7 — Spring 2026',
        section: 'CSE-A',
        facultyName: 'Dr. Anita Verma',
        facultyId: 'F004',
        studentsCount: 45,
        avgAttendance: 86,
        avgGrade: 7.9,
        classesCompleted: 22,
        classesTotal: 45,
        assignmentsCount: 4,
        pendingSubmissions: 6,
        schedule: 'Mon, Wed — 2:00 PM',
        room: 'Smart Class — 201',
        status: 'ACTIVE',
    },
    {
        id: '8',
        subjectCode: 'CS502',
        subjectName: 'Software Engineering',
        credits: 4,
        type: 'THEORY',
        semester: 7,
        semesterLabel: 'Semester 7 — Spring 2026',
        section: 'CSE-B',
        facultyName: 'Mr. Suresh Patel',
        facultyId: 'F003',
        studentsCount: 50,
        avgAttendance: 78,
        avgGrade: 7.0,
        classesCompleted: 20,
        classesTotal: 45,
        assignmentsCount: 5,
        pendingSubmissions: 11,
        schedule: 'Tue, Thu — 1:00 PM',
        room: 'Block B — 301',
        status: 'ACTIVE',
    },
    {
        id: '9',
        subjectCode: 'CS503',
        subjectName: 'Major Project',
        credits: 6,
        type: 'PROJECT',
        semester: 7,
        semesterLabel: 'Semester 7 — Spring 2026',
        section: 'CSE-A & B',
        facultyName: 'Dr. Ramesh Kumar',
        facultyId: 'F001',
        studentsCount: 110,
        avgAttendance: 91,
        avgGrade: 8.3,
        classesCompleted: 10,
        classesTotal: 20,
        assignmentsCount: 2,
        pendingSubmissions: 20,
        schedule: 'Fri — 9:00 AM',
        room: 'Project Lab — SF',
        status: 'ACTIVE',
    },
    {
        id: '10',
        subjectCode: 'CS201',
        subjectName: 'Digital Logic Design',
        credits: 4,
        type: 'THEORY',
        semester: 2,
        semesterLabel: 'Semester 2 — Fall 2025',
        section: 'CSE-A',
        facultyName: 'Ms. Priya Sharma',
        facultyId: 'F002',
        studentsCount: 65,
        avgAttendance: 85,
        avgGrade: 7.6,
        classesCompleted: 60,
        classesTotal: 60,
        assignmentsCount: 6,
        pendingSubmissions: 0,
        schedule: 'Mon, Tue, Thu — 9:00 AM',
        room: 'Block A — 202',
        status: 'COMPLETED',
    },
];

// ─── Constants ─────────────────────────────────────────────────────────────────

const COLORS = ['blue', 'green', 'purple', 'orange', 'rose', 'cyan', 'amber', 'indigo'];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    blue:   { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-600 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-700',   dot: 'bg-blue-500' },
    green:  { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-700', dot: 'bg-green-500' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30',text:'text-purple-600 dark:text-purple-400',border:'border-purple-200 dark:border-purple-700',dot:'bg-purple-500'},
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30',text:'text-orange-600 dark:text-orange-400',border:'border-orange-200 dark:border-orange-700',dot:'bg-orange-500'},
    rose:   { bg: 'bg-rose-100 dark:bg-rose-900/30',   text: 'text-rose-600 dark:text-rose-400',   border: 'border-rose-200 dark:border-rose-700',   dot: 'bg-rose-500' },
    cyan:   { bg: 'bg-cyan-100 dark:bg-cyan-900/30',   text: 'text-cyan-600 dark:text-cyan-400',   border: 'border-cyan-200 dark:border-cyan-700',   dot: 'bg-cyan-500' },
    amber:  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-700', dot: 'bg-amber-500' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30',text:'text-indigo-600 dark:text-indigo-400',border:'border-indigo-200 dark:border-indigo-700',dot:'bg-indigo-500'},
};

const SEMESTER_OPTIONS = [
    { value: 'all', label: 'All Semesters' },
    { value: '3', label: 'Semester 3' },
    { value: '5', label: 'Semester 5' },
    { value: '7', label: 'Semester 7' },
    { value: '2', label: 'Semester 2 (Completed)' },
];

const TYPE_OPTIONS = [
    { value: 'all', label: 'All Types' },
    { value: 'THEORY', label: 'Theory' },
    { value: 'LAB', label: 'Lab' },
    { value: 'ELECTIVE', label: 'Elective' },
    { value: 'PROJECT', label: 'Project' },
];

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'UPCOMING', label: 'Upcoming' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAttendanceColor(pct: number) {
    if (pct >= 90) return 'text-green-600 dark:text-green-400';
    if (pct >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
}

function getAttendanceBarColor(pct: number) {
    if (pct >= 90) return 'bg-green-500';
    if (pct >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
}

function getAttendanceIcon(pct: number) {
    if (pct >= 90) return <CheckCircle size={14} className="text-green-500" />;
    if (pct >= 75) return <AlertTriangle size={14} className="text-yellow-500" />;
    return <XCircle size={14} className="text-red-500" />;
}

function getTypeConfig(type: DepartmentCourse['type']) {
    const map = {
        THEORY:   { label: 'Theory',   className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
        LAB:      { label: 'Lab',      className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
        ELECTIVE: { label: 'Elective', className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
        PROJECT:  { label: 'Project',  className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
    };
    return map[type];
}

function getStatusConfig(status: DepartmentCourse['status']) {
    const map = {
        ACTIVE:    { label: 'Active',    icon: <CheckCircle size={12} />, className: 'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]' },
        COMPLETED: { label: 'Completed', icon: <Star size={12} />,        className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700' },
        UPCOMING:  { label: 'Upcoming',  icon: <Clock size={12} />,       className: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]' },
    };
    return map[status];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HODCourses() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    const filtered = MOCK_COURSES.filter((c) => {
        const matchSearch =
            c.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.facultyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSemester = selectedSemester === 'all' || c.semester.toString() === selectedSemester;
        const matchType = selectedType === 'all' || c.type === selectedType;
        const matchStatus = selectedStatus === 'all' || c.status === selectedStatus;
        return matchSearch && matchSemester && matchType && matchStatus;
    });

    // Summary stats
    const totalCourses = MOCK_COURSES.length;
    const activeCourses = MOCK_COURSES.filter((c) => c.status === 'ACTIVE').length;
    const totalStudents = MOCK_COURSES.filter((c) => c.status === 'ACTIVE').reduce((s, c) => s + c.studentsCount, 0);
    const avgAttendance = Math.round(
        MOCK_COURSES.filter((c) => c.status === 'ACTIVE').reduce((s, c) => s + c.avgAttendance, 0) /
        (MOCK_COURSES.filter((c) => c.status === 'ACTIVE').length || 1),
    );
    const lowAttendanceCourses = MOCK_COURSES.filter((c) => c.status === 'ACTIVE' && c.avgAttendance < 75).length;

    return (
        <PageLayout>
            <main className="p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-start gap-3 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">
                            Department Courses
                        </h1>
                        <p className="text-[var(--color-foreground-secondary)] mt-1">
                            Overview of all courses across semesters in your department
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[var(--color-card)] p-5 rounded-xl border border-[var(--color-border)] shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                                <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--color-foreground-muted)] truncate">Total Courses</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">{totalCourses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-5 rounded-xl border border-[var(--color-border)] shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
                                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--color-foreground-muted)] truncate">Active Courses</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">{activeCourses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-5 rounded-xl border border-[var(--color-border)] shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                                <Users size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--color-foreground-muted)] truncate">Total Students</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">{totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-5 rounded-xl border border-[var(--color-border)] shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg shrink-0 ${lowAttendanceCourses > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                                <TrendingUp size={20} className={lowAttendanceCourses > 0 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--color-foreground-muted)] truncate">Avg Attendance</p>
                                <p className={`text-2xl font-bold ${getAttendanceColor(avgAttendance)}`}>{avgAttendance}%</p>
                            </div>
                        </div>
                        {lowAttendanceCourses > 0 && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                                <AlertTriangle size={12} />
                                {lowAttendanceCourses} course{lowAttendanceCourses > 1 ? 's' : ''} below 75%
                            </p>
                        )}
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 mb-6 space-y-3">
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex-1 min-w-[200px]">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search by name, code, or faculty..."
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                showFilters
                                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                    : 'border-[var(--color-border)] text-[var(--color-foreground-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                            }`}
                        >
                            <Filter size={16} />
                            Filters
                            {(selectedSemester !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
                                <span className="w-2 h-2 rounded-full bg-white/80 ml-0.5" />
                            )}
                        </button>

                        {/* View Toggle */}
                        <div className="flex bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-foreground-secondary)]'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-foreground-secondary)]'}`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--color-border)]">
                            <Select
                                value={selectedSemester}
                                onChange={setSelectedSemester}
                                options={SEMESTER_OPTIONS}
                                wrapperClassName="min-w-[160px]"
                            />
                            <Select
                                value={selectedType}
                                onChange={setSelectedType}
                                options={TYPE_OPTIONS}
                                wrapperClassName="min-w-[140px]"
                            />
                            <Select
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                options={STATUS_OPTIONS}
                                wrapperClassName="min-w-[140px]"
                            />
                            {(selectedSemester !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
                                <button
                                    onClick={() => { setSelectedSemester('all'); setSelectedType('all'); setSelectedStatus('all'); }}
                                    className="text-sm text-[var(--color-error)] hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Result count */}
                <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
                    Showing <span className="font-semibold text-[var(--color-foreground)]">{filtered.length}</span> of {totalCourses} courses
                </p>

                {/* Courses */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map((course, index) => (
                            <CourseCard key={course.id} course={course} colorKey={COLORS[index % COLORS.length]} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((course, index) => (
                            <CourseListItem key={course.id} course={course} colorKey={COLORS[index % COLORS.length]} />
                        ))}
                    </div>
                )}

                {filtered.length === 0 && (
                    <div className="text-center py-16 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
                        <BookOpen size={48} className="mx-auto mb-4 text-[var(--color-foreground-muted)] opacity-40" />
                        <p className="text-[var(--color-foreground-secondary)] font-medium">No courses match your filters</p>
                        <p className="text-sm text-[var(--color-foreground-muted)] mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </main>
        </PageLayout>
    );
}

// ─── Course Card (Grid View) ──────────────────────────────────────────────────

function CourseCard({ course, colorKey }: { course: DepartmentCourse; colorKey: string }) {
    const [showMenu, setShowMenu] = useState(false);
    const colors = COLOR_MAP[colorKey] ?? COLOR_MAP.blue;
    const typeConfig = getTypeConfig(course.type);
    const statusConfig = getStatusConfig(course.status);
    const progress = course.classesTotal > 0 ? (course.classesCompleted / course.classesTotal) * 100 : 0;

    return (
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            {/* Card Header */}
            <div className={`${colors.bg} px-5 py-4 border-b ${colors.border}`}>
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-base font-bold ${colors.text}`}>{course.subjectCode}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeConfig.className}`}>
                                {typeConfig.label}
                            </span>
                        </div>
                        <h3 className="font-semibold text-[var(--color-foreground)] text-sm leading-snug">{course.subjectName}</h3>
                    </div>

                    <div className="relative shrink-0">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 hover:bg-[var(--color-background)] rounded-lg transition-colors"
                        >
                            <MoreVertical size={18} className="text-[var(--color-foreground-muted)]" />
                        </button>
                        {showMenu && (
                            <div
                                className="absolute right-0 mt-1 w-44 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-10"
                                onMouseLeave={() => setShowMenu(false)}
                            >
                                <button className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-background-secondary)] flex items-center gap-2 text-[var(--color-foreground)]">
                                    <Eye size={14} /> View Details
                                </button>
                                <button className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-background-secondary)] flex items-center gap-2 text-[var(--color-foreground)]">
                                    <Edit size={14} /> Edit Course
                                </button>
                                <button className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-background-secondary)] flex items-center gap-2 text-[var(--color-foreground)]">
                                    <BarChart3 size={14} /> View Analytics
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[var(--color-foreground-secondary)]">
                    <span className="flex items-center gap-1">
                        <GraduationCap size={12} />
                        {course.semesterLabel}
                    </span>
                    <span className="flex items-center gap-1">
                        <Layers size={12} />
                        {course.section}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Faculty */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold shrink-0">
                        {course.facultyName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="text-sm text-[var(--color-foreground-secondary)] truncate">{course.facultyName}</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                        <p className="text-xl font-bold text-[var(--color-foreground)]">{course.studentsCount}</p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Students</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-[var(--color-foreground)]">{course.assignmentsCount}</p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Assignments</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-[var(--color-foreground)]">{course.credits}</p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Credits</p>
                    </div>
                </div>

                {/* Class Progress */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--color-foreground-secondary)]">Class Progress</span>
                        <span className="font-medium text-[var(--color-foreground)]">
                            {course.classesCompleted}/{course.classesTotal}
                        </span>
                    </div>
                    <div className="h-2 w-full bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Attendance */}
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-1 text-[var(--color-foreground-secondary)]">
                            {getAttendanceIcon(course.avgAttendance)}
                            Avg Attendance
                        </span>
                        <span className={`font-semibold ${getAttendanceColor(course.avgAttendance)}`}>
                            {course.avgAttendance}%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${getAttendanceBarColor(course.avgAttendance)}`}
                            style={{ width: `${course.avgAttendance}%` }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-[var(--color-border)] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-secondary)]">
                            <Clock size={12} />
                            <span className="truncate">{course.schedule}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig.className}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-secondary)]">
                        <Hash size={12} />
                        <span>{course.room}</span>
                    </div>
                    {course.pendingSubmissions > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            <AlertTriangle size={12} />
                            {course.pendingSubmissions} pending submission{course.pendingSubmissions > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Course List Item (List View) ─────────────────────────────────────────────

function CourseListItem({ course, colorKey }: { course: DepartmentCourse; colorKey: string }) {
    const colors = COLOR_MAP[colorKey] ?? COLOR_MAP.blue;
    const typeConfig = getTypeConfig(course.type);
    const statusConfig = getStatusConfig(course.status);
    const progress = course.classesTotal > 0 ? (course.classesCompleted / course.classesTotal) * 100 : 0;

    return (
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow p-4 md:p-5">
            <div className="flex items-start gap-4">
                {/* Color code dot + subject code */}
                <div className={`${colors.bg} px-3 py-2 rounded-lg shrink-0 text-center min-w-[56px]`}>
                    <p className={`text-sm font-bold ${colors.text}`}>{course.subjectCode}</p>
                    <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">{course.credits}cr</p>
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-[var(--color-foreground)] text-sm">{course.subjectName}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeConfig.className}`}>
                            {typeConfig.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig.className}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-foreground-secondary)] mb-3">
                        <span className="flex items-center gap-1"><GraduationCap size={12} />{course.semesterLabel}</span>
                        <span className="flex items-center gap-1"><Layers size={12} />{course.section}</span>
                        <span className="flex items-center gap-1"><Users size={12} />{course.facultyName}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{course.schedule}</span>
                        <span className="flex items-center gap-1"><Hash size={12} />{course.room}</span>
                    </div>

                    {/* Progress bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[var(--color-foreground-muted)]">Class Progress</span>
                                <span className="font-medium text-[var(--color-foreground)]">
                                    {course.classesCompleted}/{course.classesTotal}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--color-primary)] rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[var(--color-foreground-muted)]">Attendance</span>
                                <span className={`font-semibold ${getAttendanceColor(course.avgAttendance)}`}>
                                    {course.avgAttendance}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${getAttendanceBarColor(course.avgAttendance)}`}
                                    style={{ width: `${course.avgAttendance}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats + Actions (right side, hidden on small) */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                    <div className="text-center">
                        <p className="text-xl font-bold text-[var(--color-foreground)]">{course.studentsCount}</p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Students</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-[var(--color-foreground)]">{course.assignmentsCount}</p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Assignments</p>
                    </div>
                    {course.pendingSubmissions > 0 && (
                        <div className="text-center">
                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{course.pendingSubmissions}</p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">Pending</p>
                        </div>
                    )}
                    <div className="flex gap-1">
                        <button className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors" title="View Details">
                            <Eye size={18} className="text-[var(--color-foreground-muted)]" />
                        </button>
                        <button className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors" title="Analytics">
                            <BarChart3 size={18} className="text-[var(--color-foreground-muted)]" />
                        </button>
                        <button className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors" title="Edit">
                            <Edit size={18} className="text-[var(--color-foreground-muted)]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
