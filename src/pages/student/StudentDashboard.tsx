
import {
    FileText,
    Bell,
    Mail,
    ChevronDown,
    Sun,
    Moon,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { useTheme } from '../../theme';
import { client } from '../../lib/graphql';
import { getErrorMessage } from '../../lib/errorHandling';
import { STUDENT_DASHBOARD_QUERY } from '../../features/students/graphql/dashboard';
import type { StudentDashboardResponse } from '../../features/students/types/dashboard';
import type { RootState } from '../../store';

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

    const dashboardData = data?.studentDashboard;

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
                        <button className="p-2 rounded-full hover:bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full border-2 border-[var(--color-background)]"></span>
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-tertiary)] px-3 py-1.5 rounded-lg transition-colors">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] text-white flex items-center justify-center font-bold">
                                {dashboardData?.studentName?.charAt(0) || 'S'}
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-8">
                        <p className="font-medium">Error loading dashboard data</p>
                        <p className="text-sm mt-1">{error.message}</p>
                        <button 
                            onClick={fetchDashboard} 
                            className="mt-2 text-sm underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Welcome Section */}
                {dashboardData && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
                            Welcome, {dashboardData.studentName}
                        </h2>
                        <p className="text-[var(--color-foreground-secondary)]">
                            Registration Number: {dashboardData.registerNumber}
                        </p>
                    </div>
                )}

                {/* Cards Grid */}
                {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* GPA Card */}
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary-light)] transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Current GPA</h3>
                        </div>
                        <div className="text-5xl font-bold text-[var(--color-foreground)] mb-2">
                            {dashboardData.currentGpa != null ? dashboardData.currentGpa.toFixed(2) : '0.00'}
                        </div>
                    </div>

                    {/* Upcoming Assignments Card */}
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Upcoming Assignments</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">
                                    ({dashboardData.assignmentsDueThisWeek.length} due this week)
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {dashboardData.assignmentsDueThisWeek.slice(0, 2).map((assignment) => (
                                <div key={assignment.id} className="flex items-center gap-3 text-sm text-[var(--color-foreground-secondary)]">
                                    <FileText size={16} className="text-[var(--color-primary)]" />
                                    <div className="flex-1">
                                        <div>{assignment.title}</div>
                                        <div className="text-xs text-[var(--color-foreground-muted)]">
                                            {assignment.subjectName} • Due {new Date(assignment.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {dashboardData.assignmentsDueThisWeek.length === 0 && (
                                <p className="text-sm text-[var(--color-foreground-muted)]">No assignments due this week</p>
                            )}
                        </div>
                    </div>

                    {/* Course Progress Card */}
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)]">Overall Progress</h3>
                                <p className="text-sm text-[var(--color-foreground-muted)]">
                                    ({dashboardData.overallProgressPercentage != null ? dashboardData.overallProgressPercentage.toFixed(0) : '0'}% complete)
                                </p>
                            </div>
                        </div>
                        <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-[var(--color-foreground-secondary)]">Course Progress</span>
                            </div>
                            <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5">
                                <div 
                                    className="bg-[var(--color-primary)] h-2.5 rounded-full" 
                                    style={{ width: `${dashboardData.overallProgressPercentage ?? 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Second Row Cards - Individual Course Progress */}
                {dashboardData && dashboardData.courseProgress.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {dashboardData.courseProgress.slice(0, 3).map((course) => (
                        <div key={course.subjectCode} className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] md:col-span-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-[var(--color-foreground)]">{course.subjectName}</h3>
                                    <p className="text-sm text-[var(--color-foreground-muted)]">
                                        ({course.completedAssignments}/{course.totalAssignments} completed)
                                    </p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[var(--color-foreground-secondary)]">{course.percentage != null ? course.percentage.toFixed(0) : '0'}%</span>
                                </div>
                                <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2.5">
                                    <div 
                                        className="bg-[var(--color-primary)] h-2.5 rounded-full" 
                                        style={{ width: `${course.percentage ?? 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--color-foreground-muted)]">{course.subjectCode}</p>
                        </div>
                    ))}
                </div>
                )}


                {/* Recent Activity */}
                {dashboardData && dashboardData.recentActivities.length > 0 && (
                <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6">
                    <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {dashboardData.recentActivities.map((activity) => {
                            const timeAgo = new Date(activity.timestamp).toLocaleString();
                            return (
                                <div key={activity.id} className="flex gap-4">
                                    <div className="mt-1 p-2 bg-[var(--color-background-secondary)] rounded-lg h-fit text-[var(--color-foreground-muted)]">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-[var(--color-foreground)]">{activity.title}</h4>
                                        <p className="text-sm text-[var(--color-foreground-secondary)] mt-1">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-[var(--color-foreground-muted)] mt-1">{timeAgo}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}

            </main>
        </div>
    );
}
