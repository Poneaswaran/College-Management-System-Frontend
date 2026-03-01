import { useState, useEffect, useCallback } from 'react';
import {
    Clock,
    Users,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Play,
    Square,
    Ban,
    RotateCcw,
    UserCheck,
    Eye,
    RefreshCw,
    Timer,
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { Select } from '../../components/ui/Select';
import {
    fetchFacultySessionsToday,
    fetchSectionAttendanceForSession,
    openAttendanceSession,
    closeAttendanceSession,
    blockAttendanceSession,
    reopenBlockedSession,
    manualMarkAttendance,
} from '../../features/attendance/api';
import type {
    AttendanceSession,
    StudentAttendanceRecord,
    SessionStatus,
    AttendanceStatus,
} from '../../features/attendance/types';

// ============================================
// STATUS HELPERS
// ============================================

const getStatusColor = (status: SessionStatus) => {
    switch (status) {
        case 'ACTIVE':
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'SCHEDULED':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'CLOSED':
            return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
        case 'BLOCKED':
        case 'CANCELLED':
            return 'bg-red-500/20 text-red-400 border-red-500/30';
        default:
            return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
};

const getAttendanceStatusColor = (status: AttendanceStatus) => {
    switch (status) {
        case 'PRESENT':
            return 'bg-green-500/20 text-green-400';
        case 'LATE':
            return 'bg-yellow-500/20 text-yellow-400';
        case 'ABSENT':
            return 'bg-red-500/20 text-red-400';
        default:
            return 'bg-zinc-500/20 text-zinc-400';
    }
};

const getAttendanceStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
        case 'PRESENT':
            return <CheckCircle className="w-4 h-4" />;
        case 'LATE':
            return <Clock className="w-4 h-4" />;
        case 'ABSENT':
            return <XCircle className="w-4 h-4" />;
        default:
            return null;
    }
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function AttendanceManagement() {
    const [sessions, setSessions] = useState<AttendanceSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
    const [studentRecords, setStudentRecords] = useState<StudentAttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Modal states
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showManualMarkModal, setShowManualMarkModal] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [manualMarkStudent, setManualMarkStudent] = useState<StudentAttendanceRecord | null>(null);
    const [manualMarkStatus, setManualMarkStatus] = useState<AttendanceStatus>('PRESENT');
    const [manualMarkNotes, setManualMarkNotes] = useState('');

    // ============================================
    // DATA FETCHING
    // ============================================

    const loadSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchFacultySessionsToday();
            setSessions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load sessions');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadSessionDetails = useCallback(async (session: AttendanceSession) => {
        try {
            setDetailLoading(true);
            setSelectedSession(session);
            const records = await fetchSectionAttendanceForSession(session.id);
            setStudentRecords(records);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load session details');
        } finally {
            setDetailLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    // Auto-refresh active sessions every 30 seconds
    useEffect(() => {
        const activeSession = sessions.find((s) => s.status === 'ACTIVE');
        if (!activeSession) return;

        const interval = setInterval(() => {
            if (selectedSession && selectedSession.id === activeSession.id) {
                loadSessionDetails(activeSession);
            }
            loadSessions();
        }, 30000);

        return () => clearInterval(interval);
    }, [sessions, selectedSession, loadSessions, loadSessionDetails]);

    // ============================================
    // ACTIONS
    // ============================================

    const handleOpenSession = async (session: AttendanceSession) => {
        if (!session.timetableEntry) return;
        try {
            setActionLoading(`open-${session.id}`);
            const today = new Date().toISOString().split('T')[0];
            await openAttendanceSession({
                timetableEntryId: session.timetableEntry.id,
                date: today,
                attendanceWindowMinutes: 10,
            });
            await loadSessions();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to open session');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCloseSession = async (session: AttendanceSession) => {
        try {
            setActionLoading(`close-${session.id}`);
            await closeAttendanceSession(session.id);
            await loadSessions();
            if (selectedSession?.id === session.id) {
                loadSessionDetails(session);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to close session');
        } finally {
            setActionLoading(null);
        }
    };

    const handleBlockSession = async () => {
        if (!selectedSession || !blockReason.trim()) return;
        try {
            setActionLoading(`block-${selectedSession.id}`);
            await blockAttendanceSession({
                sessionId: selectedSession.id,
                cancellationReason: blockReason,
            });
            setShowBlockModal(false);
            setBlockReason('');
            await loadSessions();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to block session');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReopenSession = async (session: AttendanceSession) => {
        try {
            setActionLoading(`reopen-${session.id}`);
            await reopenBlockedSession(session.id);
            await loadSessions();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reopen session');
        } finally {
            setActionLoading(null);
        }
    };

    const handleManualMark = async () => {
        if (!selectedSession || !manualMarkStudent) return;
        try {
            setActionLoading(`manual-mark`);
            await manualMarkAttendance({
                sessionId: selectedSession.id,
                studentId: manualMarkStudent.student?.id ?? 0,
                status: manualMarkStatus,
                notes: manualMarkNotes || undefined,
            });
            setShowManualMarkModal(false);
            setManualMarkStudent(null);
            setManualMarkNotes('');
            await loadSessionDetails(selectedSession);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark attendance');
        } finally {
            setActionLoading(null);
        }
    };

    // ============================================
    // COMPUTED VALUES
    // ============================================

    const activeSessionsCount = sessions.filter((s) => s.status === 'ACTIVE').length;
    const scheduledSessionsCount = sessions.filter((s) => s.status === 'SCHEDULED').length;
    const closedSessionsCount = sessions.filter((s) => s.status === 'CLOSED').length;

    const presentCount = studentRecords.filter((r) => r.status === 'PRESENT').length;
    const absentCount = studentRecords.filter((r) => r.status === 'ABSENT').length;
    const lateCount = studentRecords.filter((r) => r.status === 'LATE').length;

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
                            Attendance Management
                        </h1>
                        <p className="text-[var(--color-foreground-muted)] mt-1">
                            Manage attendance sessions for today's classes
                        </p>
                    </div>
                    <button
                        onClick={loadSessions}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-400 hover:text-red-300"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)] hover:border-green-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Active Sessions</h3>
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                <Play className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-[var(--color-foreground)] mb-1">
                            {activeSessionsCount}
                        </div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Currently taking attendance</p>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)] hover:border-blue-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Scheduled</h3>
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-[var(--color-foreground)] mb-1">
                            {scheduledSessionsCount}
                        </div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Upcoming today</p>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)] hover:border-zinc-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-[var(--color-foreground)]">Completed</h3>
                            <div className="p-2 bg-zinc-500/10 rounded-lg text-zinc-400">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-[var(--color-foreground)] mb-1">
                            {closedSessionsCount}
                        </div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Sessions completed</p>
                    </div>
                </div>

                {/* Main Content: Sessions List + Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Sessions List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-2">
                            Today's Sessions
                        </h2>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5 animate-pulse"
                                    >
                                        <div className="h-4 bg-[var(--color-background-tertiary)] rounded w-3/4 mb-3"></div>
                                        <div className="h-3 bg-[var(--color-background-tertiary)] rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-[var(--color-background-tertiary)] rounded w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-8 text-center">
                                <Clock className="w-12 h-12 text-[var(--color-foreground-muted)] mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-[var(--color-foreground)]">
                                    No sessions today
                                </h3>
                                <p className="text-[var(--color-foreground-muted)] mt-1">
                                    You don't have any scheduled classes for today.
                                </p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => loadSessionDetails(session)}
                                    className={`bg-[var(--color-card)] rounded-xl border p-5 cursor-pointer 
                    transition-all duration-200 hover:shadow-lg group
                    ${selectedSession?.id === session.id
                                            ? 'border-[var(--color-primary)] shadow-md shadow-[var(--color-primary)]/10'
                                            : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                                        }`}
                                >
                                    {/* Session Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                                                {session.subjectName}
                                            </h3>
                                            <p className="text-sm text-[var(--color-foreground-muted)]">
                                                {session.sectionName}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                session.status
                                            )}`}
                                        >
                                            {session.status}
                                        </span>
                                    </div>

                                    {/* Session Info */}
                                    <div className="flex items-center gap-4 text-sm text-[var(--color-foreground-muted)] mb-3">
                                        <div className="flex items-center gap-1">
                                            <Timer className="w-3.5 h-3.5" />
                                            <span>{session.periodInfo}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>{session.totalStudents} students</span>
                                        </div>
                                    </div>

                                    {/* Attendance Progress (for active/closed) */}
                                    {(session.status === 'ACTIVE' || session.status === 'CLOSED') && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-[var(--color-foreground-secondary)]">
                                                    {session.presentCount}/{session.totalStudents} present
                                                </span>
                                                <span className="font-medium text-[var(--color-foreground)]">
                                                    {session.attendancePercentage?.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${session.attendancePercentage >= 75
                                                        ? 'bg-green-500'
                                                        : session.attendancePercentage >= 50
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${session.attendancePercentage || 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Active Session Timer */}
                                    {session.status === 'ACTIVE' && session.timeRemaining !== undefined && (
                                        <div className="flex items-center gap-2 text-sm text-green-400">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span>{session.timeRemaining} min remaining</span>
                                        </div>
                                    )}

                                    {/* Status Message */}
                                    {session.statusMessage && (
                                        <p className="text-xs text-[var(--color-foreground-muted)] mt-2 italic">
                                            {session.statusMessage}
                                        </p>
                                    )}

                                    {/* Session Actions */}
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--color-border)]">
                                        {session.status === 'SCHEDULED' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenSession(session);
                                                }}
                                                disabled={actionLoading === `open-${session.id}`}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <Play className="w-3.5 h-3.5" />
                                                {actionLoading === `open-${session.id}` ? 'Opening...' : 'Open Session'}
                                            </button>
                                        )}

                                        {session.status === 'ACTIVE' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCloseSession(session);
                                                }}
                                                disabled={actionLoading === `close-${session.id}`}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <Square className="w-3.5 h-3.5" />
                                                {actionLoading === `close-${session.id}` ? 'Closing...' : 'Close Session'}
                                            </button>
                                        )}

                                        {(session.status === 'BLOCKED' || session.status === 'CANCELLED') && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReopenSession(session);
                                                }}
                                                disabled={actionLoading === `reopen-${session.id}`}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                {actionLoading === `reopen-${session.id}` ? 'Reopening...' : 'Reopen'}
                                            </button>
                                        )}

                                        {session.status !== 'CLOSED' &&
                                            session.status !== 'BLOCKED' &&
                                            session.status !== 'CANCELLED' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedSession(session);
                                                        setShowBlockModal(true);
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-500/10 text-zinc-400 rounded-lg text-sm font-medium hover:bg-zinc-500/20 transition-colors"
                                                >
                                                    <Ban className="w-3.5 h-3.5" />
                                                    Cancel
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Session Detail Panel */}
                    <div className="lg:col-span-3">
                        {selectedSession ? (
                            <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                                {/* Detail Header */}
                                <div className="p-6 border-b border-[var(--color-border)]">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h2 className="text-xl font-bold text-[var(--color-foreground)]">
                                                {selectedSession.subjectName}
                                            </h2>
                                            <p className="text-[var(--color-foreground-muted)]">
                                                {selectedSession.sectionName} · {selectedSession.periodInfo}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                                                selectedSession.status
                                            )}`}
                                        >
                                            {selectedSession.status}
                                        </span>
                                    </div>

                                    {/* Attendance Summary Stats */}
                                    {studentRecords.length > 0 && (
                                        <div className="flex gap-6 mt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                                <span className="text-sm text-[var(--color-foreground-secondary)]">
                                                    Present: <span className="font-semibold text-[var(--color-foreground)]">{presentCount}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                <span className="text-sm text-[var(--color-foreground-secondary)]">
                                                    Absent: <span className="font-semibold text-[var(--color-foreground)]">{absentCount}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                <span className="text-sm text-[var(--color-foreground-secondary)]">
                                                    Late: <span className="font-semibold text-[var(--color-foreground)]">{lateCount}</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Student List */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-[var(--color-foreground)]">Student Attendance</h3>
                                        {selectedSession.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => loadSessionDetails(selectedSession)}
                                                className="flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                                Refresh
                                            </button>
                                        )}
                                    </div>

                                    {detailLoading ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                                                    <div className="w-10 h-10 rounded-full bg-[var(--color-background-tertiary)]" />
                                                    <div className="flex-1">
                                                        <div className="h-4 bg-[var(--color-background-tertiary)] rounded w-1/3 mb-2" />
                                                        <div className="h-3 bg-[var(--color-background-tertiary)] rounded w-1/4" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : studentRecords.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Users className="w-10 h-10 text-[var(--color-foreground-muted)] mx-auto mb-2" />
                                            <p className="text-[var(--color-foreground-muted)]">
                                                No attendance records yet
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                                            {studentRecords.map((record) => (
                                                <div
                                                    key={record.id}
                                                    className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)] rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Avatar */}
                                                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm">
                                                            {record.studentName
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')
                                                                .substring(0, 2)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-[var(--color-foreground)] text-sm">
                                                                {record.studentName}
                                                            </p>
                                                            <p className="text-xs text-[var(--color-foreground-muted)]">
                                                                {record.registerNumber}
                                                                {record.isManuallyMarked && (
                                                                    <span className="ml-2 text-[var(--color-primary)]">
                                                                        (Manual)
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {/* Status Badge */}
                                                        <span
                                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(
                                                                record.status
                                                            )}`}
                                                        >
                                                            {getAttendanceStatusIcon(record.status)}
                                                            {record.status}
                                                        </span>

                                                        {/* Manual Mark Button */}
                                                        {(selectedSession.status === 'ACTIVE' ||
                                                            selectedSession.status === 'CLOSED') && (
                                                                <button
                                                                    onClick={() => {
                                                                        setManualMarkStudent(record);
                                                                        setManualMarkStatus(
                                                                            record.status === 'ABSENT' ? 'PRESENT' : record.status
                                                                        );
                                                                        setShowManualMarkModal(true);
                                                                    }}
                                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-all"
                                                                    title="Manual mark"
                                                                >
                                                                    <UserCheck className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-12 text-center">
                                <Eye className="w-16 h-16 text-[var(--color-foreground-muted)] mx-auto mb-4 opacity-30" />
                                <h3 className="text-xl font-medium text-[var(--color-foreground)] mb-2">
                                    Select a Session
                                </h3>
                                <p className="text-[var(--color-foreground-muted)] max-w-sm mx-auto">
                                    Click on any session from the left panel to view attendance details and manage
                                    students.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ============================================ */}
                {/* BLOCK SESSION MODAL */}
                {/* ============================================ */}
                {showBlockModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">
                                Cancel Session
                            </h3>
                            <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
                                This will cancel the session for {selectedSession?.subjectName}. Please provide a
                                reason.
                            </p>

                            <textarea
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                placeholder="e.g., Faculty on sick leave, Holiday, etc."
                                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none resize-none h-24"
                            />

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setShowBlockModal(false);
                                        setBlockReason('');
                                    }}
                                    className="px-4 py-2 text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBlockSession}
                                    disabled={!blockReason.trim() || actionLoading !== null}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================ */}
                {/* MANUAL MARK MODAL */}
                {/* ============================================ */}
                {showManualMarkModal && manualMarkStudent && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">
                                Manual Mark Attendance
                            </h3>
                            <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
                                Mark attendance for{' '}
                                <span className="font-medium text-[var(--color-foreground)]">
                                    {manualMarkStudent.studentName}
                                </span>{' '}
                                ({manualMarkStudent.registerNumber})
                            </p>

                            {/* Status Selection */}
                            <div className="mb-4">
                                <Select
                                    label="Status"
                                    value={manualMarkStatus}
                                    onChange={(val) => setManualMarkStatus(val as AttendanceStatus)}
                                    options={[
                                        { value: 'PRESENT', label: 'Present' },
                                        { value: 'LATE', label: 'Late' },
                                        { value: 'ABSENT', label: 'Absent' },
                                    ]}
                                />
                            </div>

                            {/* Notes */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                                    Notes (optional)
                                </label>
                                <textarea
                                    value={manualMarkNotes}
                                    onChange={(e) => setManualMarkNotes(e.target.value)}
                                    placeholder="e.g., Camera not working on student device"
                                    className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none h-20"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowManualMarkModal(false);
                                        setManualMarkStudent(null);
                                        setManualMarkNotes('');
                                    }}
                                    className="px-4 py-2 text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleManualMark}
                                    disabled={actionLoading === 'manual-mark'}
                                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
                                >
                                    {actionLoading === 'manual-mark' ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
