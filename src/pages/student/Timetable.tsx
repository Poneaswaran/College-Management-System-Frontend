import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/layout/Sidebar';
import { client } from '../../lib/graphql';
import { getErrorMessage } from '../../lib/errorHandling';
import { TIMETABLE_PAGE_QUERY } from '../../features/students/graphql/timetable';
import type { TimetablePageResponse, TimetableEntry } from '../../features/students/types/timetable';
import type { RootState } from '../../store';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Timetable() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [data, setData] = useState<TimetablePageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchTimetable = async () => {
            const registerNumber = user?.username || user?.registerNumber;
            
            if (!registerNumber) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const result = await client.query<TimetablePageResponse>({
                    query: TIMETABLE_PAGE_QUERY,
                    variables: { registerNumber },
                    fetchPolicy: 'network-only',
                });
                setData(result.data);
            } catch (err) {
                console.error('Timetable fetch error:', err);
                const errorMessage = getErrorMessage(err);
                setError(new Error(errorMessage));
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, [user?.username, user?.registerNumber]);

    const getClassForSlot = (dayName: string, periodNumber: number): TimetableEntry | undefined => {
        return data?.myTimetable.find(
            entry => entry.periodDefinition.dayName === dayName && entry.periodDefinition.periodNumber === periodNumber
        );
    };

    const getTypeColor = (type: string) => {
        const typeLower = type.toLowerCase();
        if (typeLower.includes('theory')) {
            return 'bg-blue-500/10 border-blue-500 text-blue-600';
        } else if (typeLower.includes('lab')) {
            return 'bg-green-500/10 border-green-500 text-green-600';
        } else if (typeLower.includes('tutorial')) {
            return 'bg-purple-500/10 border-purple-500 text-purple-600';
        }
        return 'bg-gray-500/10 border-gray-500 text-gray-600';
    };

    // Get unique periods sorted by period number
    const getUniquePeriods = () => {
        if (!data?.myTimetable.length) return [];
        
        const periodsMap = new Map<number, { startTime: string; endTime: string; periodNumber: number }>();
        data.myTimetable.forEach(entry => {
            const { periodNumber, startTime, endTime } = entry.periodDefinition;
            if (!periodsMap.has(periodNumber)) {
                periodsMap.set(periodNumber, { startTime, endTime, periodNumber });
            }
        });
        
        return Array.from(periodsMap.values()).sort((a, b) => a.periodNumber - b.periodNumber);
    };

    const periods = getUniquePeriods();

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />
            
            <main className="flex-1 ml-64 p-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-8">
                        <p className="font-medium">Error loading timetable</p>
                        <p className="text-sm mt-1">{error.message}</p>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && data && (
                <>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Weekly Timetable</h1>
                            <p className="text-[var(--color-foreground-secondary)] mt-2">
                                Your class schedule for the current semester
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                            <Calendar size={20} className="text-[var(--color-primary)]" />
                            <span className="text-sm font-medium text-[var(--color-foreground)]">
                                {data.currentSemester.displayName} - {data.currentSemester.year}
                            </span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 p-4 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                        <span className="text-sm font-medium text-[var(--color-foreground-secondary)]">Class Types:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500/20 border-2 border-blue-500"></div>
                            <span className="text-sm text-[var(--color-foreground)]">Theory</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
                            <span className="text-sm text-[var(--color-foreground)]">Lab</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-purple-500/20 border-2 border-purple-500"></div>
                            <span className="text-sm text-[var(--color-foreground)]">Tutorial</span>
                        </div>
                    </div>
                </div>

                {/* Timetable Grid */}
                <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-foreground)] sticky left-0 bg-[var(--color-background)] min-w-[150px]">
                                        Time / Day
                                    </th>
                                    {daysOfWeek.map((day) => (
                                        <th key={day} className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-foreground)] min-w-[220px]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map((period, index) => (
                                    <tr key={period.periodNumber} className={index !== periods.length - 1 ? 'border-b border-[var(--color-border)]' : ''}>
                                        <td className="px-4 py-3 text-sm font-medium text-[var(--color-foreground-secondary)] sticky left-0 bg-[var(--color-card)] border-r border-[var(--color-border)]">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-[var(--color-primary)]" />
                                                <div>
                                                    <div>{period.startTime} - {period.endTime}</div>
                                                    <div className="text-xs text-[var(--color-foreground-muted)]">Period {period.periodNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {daysOfWeek.map((day) => {
                                            const classInfo = getClassForSlot(day, period.periodNumber);
                                            return (
                                                <td key={`${day}-${period.periodNumber}`} className="px-2 py-2">
                                                    {classInfo ? (
                                                        <div className={`p-3 rounded-lg border-2 ${getTypeColor(classInfo.subject?.subjectType || '')} hover:shadow-md transition-shadow cursor-pointer`}>
                                                            <div className="font-semibold text-sm mb-1">
                                                                {classInfo.subject?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-xs opacity-80 mb-2">
                                                                {classInfo.subject?.code || 'N/A'}
                                                            </div>
                                                            {classInfo.faculty && (
                                                                <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                                                                    <User size={12} />
                                                                    <span>{classInfo.faculty.email || classInfo.faculty.registerNumber || 'N/A'}</span>
                                                                </div>
                                                            )}
                                                            {classInfo.room && (
                                                                <div className="flex items-center gap-1 text-xs opacity-70">
                                                                    <MapPin size={12} />
                                                                    <span>
                                                                        {classInfo.room.building ? `${classInfo.room.building} - ` : ''}
                                                                        {classInfo.room.roomNumber || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="p-3 rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-background-secondary)] text-center">
                                                            <span className="text-xs text-[var(--color-foreground-muted)]">Free</span>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                            Total Classes This Week
                        </h3>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {data.timetableStatistics.totalClasses}
                        </p>
                    </div>
                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                            Theory Classes
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {data.timetableStatistics.theoryClasses}
                        </p>
                    </div>
                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                            Lab Sessions
                        </h3>
                        <p className="text-3xl font-bold text-green-600">
                            {data.timetableStatistics.labSessions}
                        </p>
                    </div>
                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
                            Tutorial Classes
                        </h3>
                        <p className="text-3xl font-bold text-purple-600">
                            {data.timetableStatistics.tutorialClasses}
                        </p>
                    </div>
                </div>
                </>
                )}
            </main>
        </div>
    );
}
