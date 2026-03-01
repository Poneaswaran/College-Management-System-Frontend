import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    BookOpen,
    Users,
    Calendar,
    Clock,
    FileText,
    TrendingUp,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    UserPlus,
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { FilterBar } from '../../components/ui/FilterBar';
import { GET_FACULTY_COURSES } from '../../features/faculty/graphql/courses';
import type { FacultyCourse, FacultyCoursesResponse } from '../../features/faculty/types/courses';

// We dynamically assign colors to courses
const COLORS = ['blue', 'green', 'purple', 'orange', 'red'];
const getCourseColor = (index: number) => COLORS[index % COLORS.length];

const SEMESTER_OPTIONS = [
    { value: 'all', label: 'All Semesters' },
    { value: 'Spring 2026', label: 'Spring 2026' },
    { value: 'Fall 2025', label: 'Fall 2025' },
];
export default function FacultyCourses() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const { data, loading, error } = useQuery<FacultyCoursesResponse>(GET_FACULTY_COURSES, {
        fetchPolicy: 'cache-and-network',
    });

    const coursesData = data?.facultyCourses;
    const courses = coursesData?.courses || [];

    const filteredCourses = courses.filter((course: FacultyCourse) => {
        const matchesSearch = course.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = selectedSemester === 'all' || course.semesterName === selectedSemester;
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
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">{coursesData?.totalCourses || 0}</p>
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
                                    {coursesData?.totalStudents || 0}
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
                                    {coursesData?.avgAttendance ? Math.round(coursesData.avgAttendance) : 0}%
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
                                    {coursesData?.totalAssignments || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search — Using shared components */}
                <FilterBar className="mb-8">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search courses..."
                        wrapperClassName="flex-1"
                    />
                    <FilterBar.Actions>
                        <Select
                            value={selectedSemester}
                            onChange={setSelectedSemester}
                            options={SEMESTER_OPTIONS}
                        />

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
                    </FilterBar.Actions>
                </FilterBar>

                {/* Courses Display */}
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)]">
                        Failed to load courses: {error.message}
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course: FacultyCourse, index: number) => (
                            <CourseCard key={course.id} course={course} color={getCourseColor(index)} getColorClasses={getColorClasses} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCourses.map((course: FacultyCourse, index: number) => (
                            <CourseListItem key={course.id} course={course} color={getCourseColor(index)} getColorClasses={getColorClasses} />
                        ))}
                    </div>
                )}

                {!loading && !error && filteredCourses.length === 0 && (
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
function CourseCard({ course, color, getColorClasses }: { course: FacultyCourse; color: string; getColorClasses: (color: string) => { bg: string; text: string; border: string } }) {
    const colors = getColorClasses(color);
    const [showMenu, setShowMenu] = useState(false);

    const safeProgress = course.classesTotal > 0 ? (course.classesCompleted / course.classesTotal) * 100 : 0;
    const safeAttendance = course.avgAttendance || 0;

    return (
        <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow">
            {/* Course Header */}
            <div className={`${colors.bg} px-6 py-4 border-b ${colors.border}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`text-lg font-bold ${colors.text}`}>{course.subjectCode}</h3>
                        <p className="text-[var(--color-foreground)] font-semibold mt-1">{course.subjectName}</p>
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
                        {course.sectionName}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {course.semesterName}
                    </span>
                </div>
            </div>

            {/* Course Body */}
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Students</p>
                        <p className="text-2xl font-bold text-[var(--color-foreground)]">{course.studentsCount}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Assignments</p>
                        <p className="text-2xl font-bold text-[var(--color-foreground)]">{course.assignmentsCount}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-foreground-secondary)]">Class Progress</span>
                        <span className="font-medium text-[var(--color-foreground)]">
                            {course.classesCompleted}/{course.classesTotal}
                        </span>
                    </div>
                    <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                        <div
                            className="bg-[var(--color-primary)] h-2 rounded-full"
                            style={{ width: `${safeProgress}%` }}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-foreground-secondary)]">Avg Attendance</span>
                        <span className={`font-medium ${safeAttendance >= 90 ? 'text-green-600 dark:text-green-400' : safeAttendance >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                            {Math.round(safeAttendance)}%
                        </span>
                    </div>
                    <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${safeAttendance >= 90 ? 'bg-green-500' : safeAttendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${safeAttendance}%` }}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-secondary)]">
                        <Clock size={14} />
                        {course.scheduleSummary}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-secondary)]">
                        <BookOpen size={14} />
                        {course.roomNumber}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Course List Item Component (List View)
function CourseListItem({ course, color, getColorClasses }: { course: FacultyCourse; color: string; getColorClasses: (color: string) => { bg: string; text: string; border: string } }) {
    const colors = getColorClasses(color);
    const safeAttendance = course.avgAttendance || 0;

    return (
        <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                    <div className={`${colors.bg} px-4 py-3 rounded-lg`}>
                        <p className={`text-lg font-bold ${colors.text}`}>{course.subjectCode}</p>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">{course.subjectName}</h3>
                        <div className="flex items-center gap-4 text-sm text-[var(--color-foreground-secondary)]">
                            <span className="flex items-center gap-1">
                                <Users size={14} />
                                {course.sectionName}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {course.semesterName}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {course.scheduleSummary}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[var(--color-foreground)]">{course.studentsCount}</p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">Students</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[var(--color-foreground)]">{course.assignmentsCount}</p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">Assignments</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-2xl font-bold ${safeAttendance >= 90 ? 'text-green-600 dark:text-green-400' : safeAttendance >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                                {Math.round(safeAttendance)}%
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
