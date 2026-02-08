import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter,
    BookOpen
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { GET_ATTENDANCE_HISTORY } from '../../features/students/graphql/attendance';

interface AttendanceRecord {
    id: string;
    sessionDate: string;
    subjectName: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    markedAt: string | null;
    isLate: boolean;
    isManuallyMarked: boolean;
    notes: string | null;
    periodTime: string;
}

interface AttendanceHistoryData {
    studentAttendanceHistory: AttendanceRecord[];
}

export default function AttendanceHistory() {
    const navigate = useNavigate();
    const registerNumber = localStorage.getItem('registerNumber') || '';

    const [filters, setFilters] = useState({
        subjectId: null as number | null,
        startDate: null as string | null,
        endDate: null as string | null
    });

    const { data, loading, refetch } = useQuery<AttendanceHistoryData>(GET_ATTENDANCE_HISTORY, {
        variables: {
            registerNumber,
            ...filters
        },
        skip: !registerNumber
    });

    const attendanceHistory: AttendanceRecord[] = data?.studentAttendanceHistory || [];

    const statusConfig = {
        PRESENT: {
            color: 'bg-green-100 text-green-700 border-green-200',
            icon: CheckCircle,
            label: 'Present'
        },
        ABSENT: {
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: XCircle,
            label: 'Absent'
        },
        LATE: {
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            icon: AlertCircle,
            label: 'Late'
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Group attendance by date
    const groupedAttendance = attendanceHistory.reduce((groups, record) => {
        const date = record.sessionDate;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(record);
        return groups;
    }, {} as Record<string, AttendanceRecord[]>);

    const sortedDates = Object.keys(groupedAttendance).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/student/attendance')}
                    className="flex items-center gap-2 text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Attendance
                </button>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Attendance History</h1>
                        <p className="text-[var(--color-foreground-secondary)] mt-1">
                            View your complete attendance record
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter size={20} className="text-[var(--color-foreground-muted)]" />
                        <h2 className="font-semibold text-[var(--color-foreground)]">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value || null })}
                                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value || null })}
                                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setFilters({ subjectId: null, startDate: null, endDate: null });
                                    refetch();
                                }}
                                className="px-4 py-2 text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance List */}
                <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                        </div>
                    ) : sortedDates.length > 0 ? (
                        <div className="divide-y divide-[var(--color-border)]">
                            {sortedDates.map(date => (
                                <div key={date} className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calendar size={18} className="text-[var(--color-primary)]" />
                                        <h3 className="font-semibold text-[var(--color-foreground)]">
                                            {formatDate(date)}
                                        </h3>
                                    </div>

                                    <div className="space-y-3 ml-7">
                                        {groupedAttendance[date].map(record => {
                                            const config = statusConfig[record.status];
                                            const StatusIcon = config.icon;

                                            return (
                                                <div
                                                    key={record.id}
                                                    className="flex items-center justify-between p-4 bg-[var(--color-background-secondary)] rounded-lg"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-[var(--color-foreground)]">
                                                                {record.subjectName}
                                                            </span>
                                                            <div className="flex items-center gap-3 text-sm text-[var(--color-foreground-muted)]">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={14} />
                                                                    {record.periodTime}
                                                                </span>
                                                                {record.markedAt && (
                                                                    <span>
                                                                        Marked at {formatTime(record.markedAt)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {record.isManuallyMarked && (
                                                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                                                Manual
                                                            </span>
                                                        )}
                                                        {record.isLate && (
                                                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                                                Late Entry
                                                            </span>
                                                        )}
                                                        <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}>
                                                            <StatusIcon size={16} />
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-[var(--color-foreground-muted)]">
                            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No attendance records found</p>
                            <p className="text-sm mt-1">Try adjusting your filters or check back later</p>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                {attendanceHistory.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-green-600" size={24} />
                                <div>
                                    <p className="text-sm text-green-700">Present</p>
                                    <p className="text-2xl font-bold text-green-800">
                                        {attendanceHistory.filter(r => r.status === 'PRESENT').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                            <div className="flex items-center gap-3">
                                <XCircle className="text-red-600" size={24} />
                                <div>
                                    <p className="text-sm text-red-700">Absent</p>
                                    <p className="text-2xl font-bold text-red-800">
                                        {attendanceHistory.filter(r => r.status === 'ABSENT').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-yellow-600" size={24} />
                                <div>
                                    <p className="text-sm text-yellow-700">Late</p>
                                    <p className="text-2xl font-bold text-yellow-800">
                                        {attendanceHistory.filter(r => r.status === 'LATE').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
