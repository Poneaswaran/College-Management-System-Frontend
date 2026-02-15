import { BookOpen, Clock, User, TrendingUp, FileText, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/layout/Sidebar';
import { client } from '../../lib/graphql';
import { getErrorMessage } from '../../lib/errorHandling';
import { COURSES_PAGE_QUERY } from '../../features/students/graphql/courses';
import type { CoursesPageResponse, Course } from '../../features/students/types/courses';
import type { RootState } from '../../store';

export default function StudentCourses() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [data, setData] = useState<CoursesPageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const registerNumber = user?.username || user?.registerNumber;
            
            if (!registerNumber) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const result = await client.query<CoursesPageResponse>({
                    query: COURSES_PAGE_QUERY,
                    variables: { registerNumber },
                    fetchPolicy: 'network-only',
                });
                if (result.data) {
                    setData(result.data);
                }
            } catch (err) {
                console.error('Courses fetch error:', err);
                const errorMessage = getErrorMessage(err);
                setError(new Error(errorMessage));
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user?.username, user?.registerNumber]);
    const getGradeColor = (grade: string) => {
        if (!grade) return 'text-gray-600 bg-gray-500/10';
        if (grade.startsWith('A')) return 'text-green-600 bg-green-500/10';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-500/10';
        if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-500/10';
        return 'text-red-600 bg-red-500/10';
    };

    const getTypeColor = (type: string) => {
        const typeLower = type.toLowerCase();
        if (typeLower.includes('theory')) {
            return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
        } else if (typeLower.includes('lab')) {
            return 'bg-green-500/10 text-green-600 border-green-500/30';
        } else if (typeLower.includes('practical')) {
            return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
        }
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
    };

    const formatSchedule = (course: Course) => {
        return course.classSchedule.map(
            schedule => `${schedule.dayName} ${schedule.startTime}`
        );
    };

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">My Courses</h1>
                    <p className="text-[var(--color-muted-foreground)]">View and manage your enrolled courses</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-8">
                        <p className="font-medium">Error loading courses</p>
                        <p className="text-sm mt-1">{error.message}</p>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && data && (
                <>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
                        My Courses
                    </h1>
                    <p className="text-[var(--color-foreground-secondary)]">
                        Manage and track your enrolled courses for the current semester
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <BookOpen size={20} className="text-blue-600" />
                            </div>
                            <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                                Total Courses
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {data.courseOverview.totalCourses}
                        </p>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <TrendingUp size={20} className="text-green-600" />
                            </div>
                            <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                                Total Credits
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {data.courseOverview.totalCredits}
                        </p>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <FileText size={20} className="text-purple-600" />
                            </div>
                            <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                                Avg Progress
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {Math.round(data.courseOverview.avgProgress)}%
                        </p>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Calendar size={20} className="text-orange-600" />
                            </div>
                            <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                                Avg Attendance
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {Math.round(data.courseOverview.avgAttendance)}%
                        </p>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {data.myCourses.map((course: Course) => (
                        <div
                            key={course.id}
                            className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-6 hover:shadow-lg transition-all"
                        >
                            {/* Course Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg">
                                        <BookOpen size={24} className="text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-1">
                                            {course.subjectName}
                                        </h3>
                                        <p className="text-sm text-[var(--color-foreground-secondary)] mb-1">
                                            {course.subjectCode} • {course.credits} Credits
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                                        course.subjectType
                                    )}`}
                                >
                                    {course.subjectType}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-secondary)] mb-4">
                                <User size={16} />
                                <span>{course.facultyName}</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--color-foreground-secondary)]">
                                        Course Progress
                                    </span>
                                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                                        {Math.round(course.courseProgress)}%
                                    </span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                                    <div
                                        className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
                                        style={{ width: `${course.courseProgress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                    <p className="text-xs text-[var(--color-foreground-muted)] mb-1">
                                        Grade
                                    </p>
                                    <p
                                        className={`text-lg font-bold px-2 py-1 rounded ${getGradeColor(
                                            course.grade
                                        )}`}
                                    >
                                        {course.grade || 'N/A'}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                    <p className="text-xs text-[var(--color-foreground-muted)] mb-1">
                                        Attendance
                                    </p>
                                    <p className="text-lg font-bold text-[var(--color-foreground)]">
                                        {Math.round(course.attendancePercentage)}%
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                    <p className="text-xs text-[var(--color-foreground-muted)] mb-1">
                                        Assignments
                                    </p>
                                    <p className="text-lg font-bold text-[var(--color-foreground)]">
                                        {course.completedAssignments}/{course.totalAssignments}
                                    </p>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="pt-4 border-t border-[var(--color-border)]">
                                <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-secondary)] mb-2">
                                    <Clock size={16} />
                                    <span className="font-medium">Class Schedule:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formatSchedule(course).map((slot, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-medium"
                                        >
                                            {slot}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </>
                )}
            </main>
        </div>
    );
}
