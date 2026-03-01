import {
    FileText,
    Mail,
    ChevronDown,
    Users,
    BookOpen,
    ClipboardCheck,
    Sun,
    Moon,
    Clock,
    MapPin,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import NotificationBell from '../../components/notifications/NotificationBell';
import { useTheme } from '../../theme';
import { client } from '../../lib/graphql';
import { getErrorMessage } from '../../lib/errorHandling';
import { FACULTY_DASHBOARD_QUERY } from '../../features/faculty/graphql/dashboard';
import type { FacultyDashboardData, FacultyDashboardResponse } from '../../features/faculty/types/dashboard';

export default function FacultyDashboard() {
    const { isDark, setMode } = useTheme();
    const [data, setData] = useState<FacultyDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await client.query<FacultyDashboardResponse>({
                query: FACULTY_DASHBOARD_QUERY,
                fetchPolicy: 'network-only',
            });
            if (result.data) {
                setData(result.data.facultyDashboard);
            }
        } catch (err) {
            console.error('Faculty dashboard fetch error:', err);
            const errorMessage = getErrorMessage(err);
            setError(new Error(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const toggleTheme = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    // Helper to get attendance bar color based on percentage
    const getAttendanceColor = (percentage: number): string => {
        if (percentage >= 90) return 'var(--color-success)';
        if (percentage >= 75) return 'var(--color-primary)';
        if (percentage >= 60) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    // Helper to get activity icon
    const getActivityIcon = (activityType: string) => {
        switch (activityType) {
            case 'GRADED_ASSIGNMENT':
                return <FileText size={20} />;
            case 'MARKED_ATTENDANCE':
                return <ClipboardCheck size={20} />;
            default:
                return <BookOpen size={20} />;
        }
    };

    // Get faculty initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Faculty Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-all"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] relative">
                            <Mail size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-background)]"></span>
                        </button>
                        <NotificationBell />
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-tertiary)] px-3 py-1.5 rounded-lg transition-colors">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center font-bold text-sm">
                                {data ? getInitials(data.facultyName) : 'FN'}
                            </div>
                            <span className="text-sm font-medium text-[var(--color-foreground)]">
                                {data?.facultyName || 'Faculty'}
                            </span>
                            <ChevronDown size={16} className="text-[var(--color-foreground-muted)]" />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
                            <p className="text-[var(--color-foreground-muted)]">Loading dashboard...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-[var(--color-card)] border border-[var(--color-error)] rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={24} className="text-[var(--color-error)] shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-[var(--color-foreground)]">Error loading dashboard data</p>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">{error.message}</p>
                                <button
                                    onClick={fetchDashboard}
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                                >
                                    <RefreshCw size={14} />
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dashboard Content */}
                {data && (
                    <>
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
                                Welcome, {data.facultyName}
                            </h2>
                            <p className="text-[var(--color-foreground-secondary)]">
                                {data.departmentName} • Manage your courses, students, and academic activities from your dashboard.
                            </p>
                        </div>

                        {/* Summary Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {/* Total Students Card */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-[var(--color-foreground)]">Total Students</h3>
                                    <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                        <Users size={20} />
                                    </div>
                                </div>
                                <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">{data.totalStudents}</div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Across all courses</p>
                            </div>

                            {/* Active Courses Card */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-[var(--color-foreground)]">Active Courses</h3>
                                    <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                        <BookOpen size={20} />
                                    </div>
                                </div>
                                <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">{data.activeCourses}</div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">This semester</p>
                            </div>

                            {/* Pending Reviews Card */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-[var(--color-foreground)]">Pending Reviews</h3>
                                    <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                        <FileText size={20} />
                                    </div>
                                </div>
                                <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">{data.pendingReviews}</div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Assignments to grade</p>
                            </div>
                        </div>

                        {/* Second Row Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Today's Classes */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-[var(--color-foreground)]">Today's Classes</h3>
                                        <p className="text-sm text-[var(--color-foreground-muted)]">
                                            ({data.todayClassCount} scheduled)
                                        </p>
                                    </div>
                                    <Clock size={20} className="text-[var(--color-primary)]" />
                                </div>
                                <div className="space-y-3">
                                    {data.todayClasses.length > 0 ? (
                                        data.todayClasses.map((cls) => (
                                            <div
                                                key={cls.id}
                                                className="flex justify-between items-center p-3 bg-[var(--color-background-secondary)] rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-[var(--color-foreground)]">
                                                        {cls.subjectName}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-[var(--color-foreground-muted)]">
                                                            {cls.subjectCode}
                                                        </span>
                                                        <span className="text-xs text-[var(--color-foreground-muted)]">•</span>
                                                        <span className="text-xs text-[var(--color-foreground-muted)]">
                                                            {cls.sectionName}
                                                        </span>
                                                        <span className="text-xs text-[var(--color-foreground-muted)] flex items-center gap-1">
                                                            <MapPin size={10} />
                                                            {cls.roomNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-medium text-[var(--color-primary)]">
                                                        {cls.startTime}
                                                    </span>
                                                    <p className="text-xs text-[var(--color-foreground-muted)]">
                                                        to {cls.endTime}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-[var(--color-foreground-muted)]">No classes scheduled for today</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Attendance Overview */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-[var(--color-foreground)]">Attendance Overview</h3>
                                        <p className="text-sm text-[var(--color-foreground-muted)]">This week</p>
                                    </div>
                                    <ClipboardCheck size={20} className="text-[var(--color-primary)]" />
                                </div>
                                <div className="space-y-4">
                                    {data.attendanceOverview.length > 0 ? (
                                        data.attendanceOverview.map((item) => (
                                            <div key={item.subjectCode}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-[var(--color-foreground-secondary)]">
                                                        {item.subjectName}
                                                    </span>
                                                    <span className="font-medium text-[var(--color-foreground)]">
                                                        {item.attendancePercentage}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5">
                                                    <div
                                                        className="h-2.5 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${item.attendancePercentage}%`,
                                                            backgroundColor: getAttendanceColor(item.attendancePercentage),
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-[var(--color-foreground-muted)]">No attendance data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                            <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {data.recentActivities.length > 0 ? (
                                    data.recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex gap-4">
                                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                                {getActivityIcon(activity.activityType)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-[var(--color-foreground)]">
                                                    {activity.title}
                                                </h4>
                                                <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-[var(--color-foreground-muted)] mt-1">
                                                    {activity.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-sm text-[var(--color-foreground-muted)]">No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
