import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    BookOpen,
    Users,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Calendar,
    TrendingUp
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { GET_ACTIVE_SESSIONS, GET_ALL_REPORTS } from '../../features/students/graphql/attendance';

// Types
interface ActiveSession {
    id: number;
    subjectName: string;
    sectionName: string;
    periodTime: string;
    facultyName: string;
    canMarkAttendance: boolean;
    timeRemaining: number;
    statusMessage: string;
    openedAt: string;
}

interface SubjectReport {
    subjectName: string;
    totalClasses: number;
    classesPresent: number;
    classesAbsent: number;
    attendancePercentage: number;
    isBelowThreshold: boolean;
}

interface ActiveSessionsData {
    activeSessionsForStudent: ActiveSession[];
}

interface AllReportsData {
    allReportsForStudent: SubjectReport[];
}

export default function StudentAttendance() {
    const navigate = useNavigate();
    const registerNumber = localStorage.getItem('registerNumber') || '';

    // Poll active sessions every 30 seconds
    const { data: sessionsData, refetch: refetchSessions } = useQuery<ActiveSessionsData>(
        GET_ACTIVE_SESSIONS,
        {
            pollInterval: 30000,
            fetchPolicy: 'network-only'
        }
    );

    const { data: reportsData, loading: reportsLoading } = useQuery<AllReportsData>(
        GET_ALL_REPORTS,
        {
            variables: { registerNumber },
            fetchPolicy: 'cache-and-network',
            skip: !registerNumber
        }
    );

    const activeSessions: ActiveSession[] = sessionsData?.activeSessionsForStudent || [];
    const reports: SubjectReport[] = reportsData?.allReportsForStudent || [];

    // Calculate overall attendance
    const overallAttendance = reports.length > 0
        ? (reports.reduce((sum, r) => sum + r.attendancePercentage, 0) / reports.length).toFixed(1)
        : '0';

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Page Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Attendance</h1>
                        <p className="text-[var(--color-foreground-secondary)] mt-1">Track and mark your attendance</p>
                    </div>
                    <button
                        onClick={() => refetchSessions()}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                {/* Active Sessions Alert */}
                {activeSessions.length > 0 && (
                    <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Active Classes - Mark Attendance Now!</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeSessions.map(session => (
                                <ActiveSessionCard
                                    key={session.id}
                                    session={session}
                                    onMarkAttendance={() => navigate('/student/mark-attendance', { state: { session } })}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Overall Attendance</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">{overallAttendance}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Classes Present</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">
                                    {reports.reduce((sum, r) => sum + r.classesPresent, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <XCircle className="text-red-600 dark:text-red-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Classes Absent</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">
                                    {reports.reduce((sum, r) => sum + r.classesAbsent, 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <BookOpen className="text-purple-600 dark:text-purple-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-foreground-muted)]">Total Subjects</p>
                                <p className="text-2xl font-bold text-[var(--color-foreground)]">{reports.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subject-wise Attendance */}
                <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Subject-wise Attendance</h2>
                        <button
                            onClick={() => navigate('/student/attendance-history')}
                            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium flex items-center gap-1"
                        >
                            <Calendar size={16} />
                            View History
                        </button>
                    </div>

                    {reportsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                        </div>
                    ) : reports.length > 0 ? (
                        <div className="space-y-4">
                            {reports.map(report => (
                                <SubjectReportCard key={report.subjectName} report={report} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-[var(--color-foreground-muted)]">
                            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No attendance records found</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => navigate('/student/attendance-history')}
                        className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors text-left group"
                    >
                        <Calendar size={32} className="text-[var(--color-primary)] mb-4" />
                        <h3 className="text-lg font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]">
                            View Attendance History
                        </h3>
                        <p className="text-sm text-[var(--color-foreground-secondary)] mt-1">
                            See your complete attendance record with filters
                        </p>
                    </button>

                    <button
                        onClick={() => refetchSessions()}
                        className="bg-[var(--color-card)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors text-left group"
                    >
                        <RefreshCw size={32} className="text-[var(--color-primary)] mb-4" />
                        <h3 className="text-lg font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]">
                            Check Active Sessions
                        </h3>
                        <p className="text-sm text-[var(--color-foreground-secondary)] mt-1">
                            Refresh to see if any class is accepting attendance
                        </p>
                    </button>
                </div>
            </main>
        </div>
    );
}

// Active Session Card Component
function ActiveSessionCard({ session, onMarkAttendance }: { session: ActiveSession; onMarkAttendance: () => void }) {
    const isUrgent = session.timeRemaining < 3;
    const canMark = session.canMarkAttendance;

    return (
        <div className={`bg-[var(--color-card)] p-5 rounded-xl border-2 ${
            isUrgent ? 'border-red-400 dark:border-red-600' : 'border-orange-300 dark:border-orange-600'
        } shadow-md`}>
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[var(--color-foreground)]">{session.subjectName}</h3>
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">
                    {session.periodTime}
                </span>
            </div>

            <p className="text-sm text-[var(--color-foreground-secondary)] mb-1">
                <Users size={14} className="inline mr-1" /> {session.sectionName}
            </p>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-3">
                Faculty: {session.facultyName}
            </p>

            <div className={`flex items-center gap-2 mb-4 ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                <Clock size={16} />
                <span className="text-sm font-semibold">{session.timeRemaining} minutes remaining</span>
            </div>

            {canMark ? (
                <button
                    className={`w-full py-2.5 rounded-lg font-semibold text-white transition-colors ${isUrgent
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                    onClick={onMarkAttendance}
                >
                    Mark Attendance Now
                </button>
            ) : (
                <p className="text-sm text-[var(--color-foreground-muted)] text-center py-2">
                    {session.statusMessage}
                </p>
            )}
        </div>
    );
}

// Subject Report Card Component
function SubjectReportCard({ report }: { report: SubjectReport }) {
    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getTextColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 75) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="flex items-center gap-6 p-4 bg-[var(--color-background-secondary)] rounded-lg">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[var(--color-foreground)]">{report.subjectName}</h3>
                    {report.isBelowThreshold && (
                        <span className="flex items-center gap-1 text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle size={12} />
                            Below 75%
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--color-foreground-secondary)]">
                    <span className="flex items-center gap-1">
                        <CheckCircle size={14} className="text-green-500" />
                        {report.classesPresent} Present
                    </span>
                    <span className="flex items-center gap-1">
                        <XCircle size={14} className="text-red-500" />
                        {report.classesAbsent} Absent
                    </span>
                    <span>Total: {report.totalClasses}</span>
                </div>
            </div>

            <div className="w-48">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--color-foreground-muted)]">Progress</span>
                    <span className={`font-bold ${getTextColor(report.attendancePercentage)}`}>
                        {report.attendancePercentage}%
                    </span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${getProgressColor(report.attendancePercentage)}`}
                        style={{ width: `${report.attendancePercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
