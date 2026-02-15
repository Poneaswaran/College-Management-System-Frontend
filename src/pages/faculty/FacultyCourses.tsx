import { useState } from 'react';
import {
    BookOpen,
    Users,
    Calendar,
    Clock,
    FileText,
    TrendingUp,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    UserPlus,
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

// Mock Data
const mockCourses = [
    {
        id: 1,
        code: 'CS201',
        name: 'Data Structures',
        semester: 'Spring 2026',
        section: 'Section A',
        students: 45,
        totalClasses: 48,
        completedClasses: 32,
        avgAttendance: 92,
        assignments: 8,
        room: 'Room 301',
        schedule: 'Mon, Wed, Fri - 9:00 AM',
        color: 'blue',
    },
    {
        id: 2,
        code: 'CS301',
        name: 'Algorithm Design',
        semester: 'Spring 2026',
        section: 'Section B',
        students: 38,
        totalClasses: 48,
        completedClasses: 30,
        avgAttendance: 88,
        assignments: 6,
        room: 'Room 205',
        schedule: 'Tue, Thu - 2:00 PM',
        color: 'green',
    },
    {
        id: 3,
        code: 'CS202',
        name: 'Database Systems',
        semester: 'Spring 2026',
        section: 'Section A',
        students: 42,
        totalClasses: 48,
        completedClasses: 31,
        avgAttendance: 85,
        assignments: 7,
        room: 'Room 401',
        schedule: 'Mon, Wed - 4:00 PM',
        color: 'purple',
    },
    {
        id: 4,
        code: 'CS401',
        name: 'Machine Learning',
        semester: 'Spring 2026',
        section: 'Section C',
        students: 35,
        totalClasses: 48,
        completedClasses: 29,
        avgAttendance: 90,
        assignments: 5,
        room: 'Room 102',
        schedule: 'Tue, Thu - 10:00 AM',
        color: 'orange',
    },
    {
        id: 5,
        code: 'CS101',
        name: 'Introduction to Programming',
        semester: 'Spring 2026',
        section: 'Section D',
        students: 52,
        totalClasses: 48,
        completedClasses: 33,
        avgAttendance: 94,
        assignments: 10,
        room: 'Room 501',
        schedule: 'Mon, Wed, Fri - 11:00 AM',
        color: 'red',
    },
];

export default function FacultyCourses() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredCourses = mockCourses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = selectedSemester === 'all' || course.semester === selectedSemester;
        return matchesSearch && matchesSemester;
    });

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
            green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
            purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
            orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
            red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">My Courses</h1>
                    <p className="text-[var(--color-foreground-secondary)]">Manage your courses, students, and academic activities</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Total Courses</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">{mockCourses.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Users className="text-green-600 dark:text-green-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Total Students</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">
                                    {mockCourses.reduce((sum, c) => sum + c.students, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Avg Attendance</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">
                                    {(mockCourses.reduce((sum, c) => sum + c.avgAttendance, 0) / mockCourses.length).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <FileText className="text-orange-600 dark:text-orange-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Total Assignments</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">
                                    {mockCourses.reduce((sum, c) => sum + c.assignments, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] mb-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-foreground-muted)]" size={20} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Filter size={20} className="text-[var(--color-foreground-muted)]" />
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                >
                                    <option value="all">All Semesters</option>
                                    <option value="Spring 2026">Spring 2026</option>
                                    <option value="Fall 2025">Fall 2025</option>
                                </select>
                            </div>

                            <div className="flex bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-foreground-secondary)]'}`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-foreground-secondary)]'}`}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Display */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} getColorClasses={getColorClasses} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCourses.map(course => (
                            <CourseListItem key={course.id} course={course} getColorClasses={getColorClasses} />
                        ))}
                    </div>
                )}

                {filteredCourses.length === 0 && (
                    <div className="text-center py-12 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
                        <BookOpen size={48} className="mx-auto mb-4 text-[var(--color-foreground-muted)] opacity-50" />
                        <p className="text-[var(--color-foreground-secondary)]">No courses found</p>
                    </div>
                )}
            </main>
        </div>
    );
}

// Course Card Component (Grid View)
function CourseCard({ course, getColorClasses }: { course: typeof mockCourses[0]; getColorClasses: (color: string) => { bg: string; text: string; border: string } }) {
    const colors = getColorClasses(course.color);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow">
            {/* Course Header */}
            <div className={`${colors.bg} px-6 py-4 border-b ${colors.border}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`text-lg font-bold ${colors.text}`}>{course.code}</h3>
                        <p className="text-[var(--color-foreground)] font-semibold mt-1">{course.name}</p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors"
                        >
                            <MoreVertical size={20} className="text-[var(--color-foreground-muted)]" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-10">
                                <button className="w-full px-4 py-2 text-left hover:bg-[var(--color-background-secondary)] flex items-center gap-2 text-[var(--color-foreground)]">
                                    <Eye size={16} /> View Details
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-[var(--color-background-secondary)] flex items-center gap-2 text-[var(--color-foreground)]">
                                    <Edit size={16} /> Edit Course
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-[var(--color-background-secondary)] flex items-center gap-2 text-[var(--color-foreground)]">
                                    <UserPlus size={16} /> Manage Students
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-[var(--color-background-secondary)] flex items-center gap-2 text-red-600">
                                    <Trash2 size={16} /> Delete Course
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-[var(--color-foreground-secondary)]">
                    <span className="flex items-center gap-1">
                        <Users size={14} />
                        {course.section}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {course.semester}
                    </span>
                </div>
            </div>

            {/* Course Body */}
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Students</p>
                        <p className="text-2xl font-bold text-[var(--color-foreground)]">{course.students}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Assignments</p>
                        <p className="text-2xl font-bold text-[var(--color-foreground)]">{course.assignments}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-foreground-secondary)]">Class Progress</span>
                        <span className="font-medium text-[var(--color-foreground)]">
                            {course.completedClasses}/{course.totalClasses}
                        </span>
                    </div>
                    <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                        <div
                            className="bg-[var(--color-primary)] h-2 rounded-full"
                            style={{ width: `${(course.completedClasses / course.totalClasses) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-foreground-secondary)]">Avg Attendance</span>
                        <span className={`font-medium ${course.avgAttendance >= 90 ? 'text-green-600 dark:text-green-400' : course.avgAttendance >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                            {course.avgAttendance}%
                        </span>
                    </div>
                    <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${course.avgAttendance >= 90 ? 'bg-green-500' : course.avgAttendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${course.avgAttendance}%` }}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-secondary)]">
                        <Clock size={14} />
                        {course.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-secondary)]">
                        <BookOpen size={14} />
                        {course.room}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Course List Item Component (List View)
function CourseListItem({ course, getColorClasses }: { course: typeof mockCourses[0]; getColorClasses: (color: string) => { bg: string; text: string; border: string } }) {
    const colors = getColorClasses(course.color);

    return (
        <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                    <div className={`${colors.bg} px-4 py-3 rounded-lg`}>
                        <p className={`text-lg font-bold ${colors.text}`}>{course.code}</p>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">{course.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-[var(--color-foreground-secondary)]">
                            <span className="flex items-center gap-1">
                                <Users size={14} />
                                {course.section}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {course.semester}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {course.schedule}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[var(--color-foreground)]">{course.students}</p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">Students</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[var(--color-foreground)]">{course.assignments}</p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">Assignments</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-2xl font-bold ${course.avgAttendance >= 90 ? 'text-green-600 dark:text-green-400' : course.avgAttendance >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                                {course.avgAttendance}%
                            </p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">Attendance</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors" title="View Details">
                            <Eye size={20} className="text-[var(--color-foreground-muted)]" />
                        </button>
                        <button className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors" title="Edit Course">
                            <Edit size={20} className="text-[var(--color-foreground-muted)]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
