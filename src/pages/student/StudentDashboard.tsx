
import {
    FileText,
    Mail,
    ChevronDown,
    Sun,
    Moon,
    User,
    Clock,
    MapPin,
    Star,
    ClipboardCheck,
    BookOpen,
    AlertTriangle,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { useTheme } from '../../theme';
import { client } from '../../lib/graphql';
import { getErrorMessage } from '../../lib/errorHandling';
import { getMediaUrl } from '../../lib/constants';
import { STUDENT_DASHBOARD_QUERY } from '../../features/students/graphql/dashboard';
import type { StudentDashboardResponse } from '../../features/students/types/dashboard';
import type { RootState } from '../../store';
import NotificationBell from '../../components/notifications/NotificationBell';

export default function StudentDashboard() {
    const { isDark, setMode } = useTheme();
    const user = useSelector((state: RootState) => state.auth.user);
    const [data, setData] = useState<StudentDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboard = async () => {
        const registerNumber = user?.username || user?.registerNumber;

        if (!registerNumber) {
            console.log('No user found, skipping fetch');
            setLoading(false);
            return;
        }

        console.log('Fetching dashboard for user:', registerNumber);
        try {
            setLoading(true);
            setError(null);
            const result = await client.query<StudentDashboardResponse>({
                query: STUDENT_DASHBOARD_QUERY,
                variables: { registerNumber },
                fetchPolicy: 'network-only',
            });
            console.log('Dashboard data received:', result.data);
            if (result.data) {
                setData(result.data);
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            const errorMessage = getErrorMessage(err);
            setError(new Error(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    // Fetch on component mount/reload
    useEffect(() => {
        console.log('useEffect triggered, user:', user);
        fetchDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.username, user?.registerNumber]);

    const toggleTheme = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    // Helper to get activity icon based on type
    const getActivityIcon = (activityType: string) => {
        switch (activityType) {
            case 'SUBMISSION':
                return <FileText size={20} />;
            case 'GRADE':
                return <Star size={20} />;
            case 'ATTENDANCE':
                return <ClipboardCheck size={20} />;
            default:
                return <BookOpen size={20} />;
        }
    };

    // Helper to get progress bar color based on percentage
    const getProgressColor = (percentage: number): string => {
        if (percentage >= 80) return 'var(--color-success)';
        if (percentage >= 50) return 'var(--color-primary)';
        if (percentage >= 25) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    const dashboardData = data?.studentDashboard;
    const profilePhotoUrl = getMediaUrl(dashboardData?.profilePhotoUrl);

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Student Dashboard</h1>
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
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center font-bold overflow-hidden">
                                {profilePhotoUrl ? (
                                    <img
                                        src={profilePhotoUrl}
                                        alt={dashboardData?.studentName || 'Student'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    dashboardData?.studentName?.charAt(0) || <User size={20} />
                                )}
                            </div>
                            <span className="text-sm font-medium text-[var(--color-foreground)]">
                                {dashboardData?.studentName || 'Student'}
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
                {dashboardData && (
                    <>
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
                                Welcome, {dashboardData.studentName}
                            </h2>
                            <p className="text-[var(--color-foreground-secondary)]">
                                Registration Number: {dashboardData.registerNumber}
                            </p>
                        </div>

                        {/* Summary Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* GPA Card */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-[var(--color-foreground)]">Current GPA</h3>
                                    <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                        <Star size={20} />
                                    </div>
                                </div>
                                <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">
                                    {dashboardData.currentGpa != null ? dashboardData.currentGpa.toFixed(2) : '0.00'}
                                </div>
                            </div>

                            {/* Overall Progress Card */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-[var(--color-foreground)]">Overall Progress</h3>
                                    <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                        <BookOpen size={20} />
                                    </div>
                                </div>
                                <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">
                                    {dashboardData.overallProgressPercentage != null ? dashboardData.overallProgressPercentage.toFixed(0) : '0'}%
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2 mt-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${dashboardData.overallProgressPercentage ?? 0}%`,
                                            backgroundColor: getProgressColor(dashboardData.overallProgressPercentage ?? 0),
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Pending Assignments Card */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-[var(--color-foreground)]">Pending</h3>
                                    <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                        <FileText size={20} />
                                    </div>
                                </div>
                                <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">
                                    {dashboardData.totalPendingAssignments}
                                </div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Assignments to submit</p>
                            </div>

                            {/* Overdue Assignments Card */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-error)] transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-[var(--color-foreground)]">Overdue</h3>
                                    <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg text-[var(--color-error)] group-hover:bg-[var(--color-error)] group-hover:text-white transition-colors">
                                        <AlertTriangle size={20} />
                                    </div>
                                </div>
                                <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">
                                    {dashboardData.totalOverdueAssignments}
                                </div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Past due date</p>
                            </div>
                        </div>

                        {/* Second Row – Today's Classes + Upcoming Assignments */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Today's Classes */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-[var(--color-foreground)]">Today's Classes</h3>
                                        <p className="text-sm text-[var(--color-foreground-muted)]">
                                            ({dashboardData.todayClasses.length} scheduled)
                                        </p>
                                    </div>
                                    <Clock size={20} className="text-[var(--color-primary)]" />
                                </div>

                                {/* Next Class Highlight */}
                                {dashboardData.nextClass && (
                                    <div className="mb-4 p-3 rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)]/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">Next Up</span>
                                            {dashboardData.nextClass.dayName && (
                                                <span className="text-xs text-[var(--color-foreground-muted)]">• {dashboardData.nextClass.dayName}</span>
                                            )}
                                        </div>
                                        <p className="font-medium text-[var(--color-foreground)]">{dashboardData.nextClass.subjectName}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-foreground-muted)]">
                                            <span>{dashboardData.nextClass.subjectCode}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><MapPin size={10} />{dashboardData.nextClass.roomNumber}</span>
                                            <span>•</span>
                                            <span>{dashboardData.nextClass.startTime} – {dashboardData.nextClass.endTime}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {dashboardData.todayClasses.length > 0 ? (
                                        dashboardData.todayClasses.map((cls, index) => (
                                            <div
                                                key={`${cls.subjectCode}-${index}`}
                                                className="flex justify-between items-center p-3 bg-[var(--color-background-secondary)] rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-[var(--color-foreground)]">{cls.subjectName}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-[var(--color-foreground-muted)]">{cls.subjectCode}</span>
                                                        <span className="text-xs text-[var(--color-foreground-muted)] flex items-center gap-1">
                                                            <MapPin size={10} />
                                                            {cls.roomNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-medium text-[var(--color-primary)]">{cls.startTime}</span>
                                                    <p className="text-xs text-[var(--color-foreground-muted)]">to {cls.endTime}</p>
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

                            {/* Upcoming Assignments */}
                            <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-[var(--color-foreground)]">Assignments Due This Week</h3>
                                        <p className="text-sm text-[var(--color-foreground-muted)]">
                                            ({dashboardData.assignmentsDueThisWeek.length} due)
                                        </p>
                                    </div>
                                    <FileText size={20} className="text-[var(--color-primary)]" />
                                </div>
                                <div className="space-y-3">
                                    {dashboardData.assignmentsDueThisWeek.length > 0 ? (
                                        dashboardData.assignmentsDueThisWeek.map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                className="p-3 bg-[var(--color-background-secondary)] rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-[var(--color-foreground)]">{assignment.title}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-[var(--color-foreground-muted)]">{assignment.subjectName}</span>
                                                            <span className="text-xs text-[var(--color-foreground-muted)]">•</span>
                                                            <span className="text-xs text-[var(--color-foreground-muted)]">{assignment.subjectCode}</span>
                                                            <span className="text-xs text-[var(--color-foreground-muted)]">•</span>
                                                            <span className="text-xs text-[var(--color-foreground-muted)]">Max: {assignment.maxMarks}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0 ml-3">
                                                        <p className="text-sm font-medium text-[var(--color-warning)]">
                                                            {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </p>
                                                        {assignment.isSubmitted ? (
                                                            <span className="text-xs text-[var(--color-success)] font-medium">Submitted</span>
                                                        ) : (
                                                            <span className="text-xs text-[var(--color-error)] font-medium">Pending</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-[var(--color-foreground-muted)]">No assignments due this week 🎉</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Third Row – Course Progress */}
                        {dashboardData.courseProgress.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4">Course Progress</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {dashboardData.courseProgress.map((course) => (
                                        <div key={course.subjectCode} className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-[var(--color-foreground)]">{course.subjectName}</h3>
                                                    <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">{course.subjectCode}</p>
                                                </div>
                                                <span className="text-sm font-bold text-[var(--color-foreground)]">
                                                    {course.percentage != null ? course.percentage.toFixed(0) : '0'}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5 mb-3">
                                                <div
                                                    className="h-2.5 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${course.percentage ?? 0}%`,
                                                        backgroundColor: getProgressColor(course.percentage ?? 0),
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-[var(--color-foreground-muted)]">
                                                {course.completedAssignments}/{course.totalAssignments} completed
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        {dashboardData.recentActivities.length > 0 && (
                            <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                                <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6">Recent Activity</h3>
                                <div className="space-y-6">
                                    {dashboardData.recentActivities.map((activity, index) => (
                                        <div key={`${activity.id}-${activity.activityType}-${index}`} className="flex gap-4">
                                            <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                                {getActivityIcon(activity.activityType)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-[var(--color-foreground)]">{activity.title}</h4>
                                                <p className="text-sm text-[var(--color-foreground-secondary)] mt-1">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-[var(--color-foreground-muted)] mt-1">
                                                    {activity.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

            </main>
        </div>
    );
}
