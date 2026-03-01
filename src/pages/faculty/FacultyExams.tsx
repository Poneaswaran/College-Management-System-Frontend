import { useQuery } from '@apollo/client/react';
import { Edit3, CheckCircle, FileText } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { GET_EXAM_SCHEDULES } from '../../features/exams/graphql';
import type { ExamSchedule } from '../../features/exams/types';

export default function FacultyExams() {
    // In reality we would fetch schedules for the logged-in faculty member's ID
    const { data: schedulesData, loading: sLoading, error: sError } = useQuery<{ examSchedules: ExamSchedule[] }>(GET_EXAM_SCHEDULES, {
        variables: { examId: 1, sectionId: undefined },
        fetchPolicy: 'cache-and-network',
    });

    const schedules = schedulesData?.examSchedules || [];

    return (
        <PageLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Invigilation & Marks Entry</h1>
                    <p className="text-[var(--color-foreground-muted)]">View your exam schedules and enter student marks.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sLoading ? (
                        <div className="flex justify-center p-12 col-span-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                        </div>
                    ) : sError ? (
                        <div className="p-6 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)] col-span-full">
                            Failed to load schedules: {sError.message}
                        </div>
                    ) : schedules.length === 0 ? (
                        <div className="text-center p-12 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm col-span-full">
                            <FileText size={48} className="mx-auto text-[var(--color-foreground-muted)] mb-4" />
                            <h3 className="text-lg font-medium text-[var(--color-foreground)]">No duties assigned</h3>
                            <p className="text-[var(--color-foreground-muted)]">You currently have no invigilation or grading duties.</p>
                        </div>
                    ) : (
                        schedules.map((schedule: ExamSchedule) => (
                            <div key={schedule.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-[var(--color-foreground)] text-lg mb-1">{schedule.subject?.name}</h3>
                                <p className="text-sm font-medium text-[var(--color-foreground-secondary)]">{schedule.subject?.code}</p>

                                <div className="mt-4 space-y-2 text-sm text-[var(--color-foreground-muted)]">
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span className="font-medium text-[var(--color-foreground)]">{new Date(schedule.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Time:</span>
                                        <span className="font-medium text-[var(--color-foreground)]">{schedule.startTime} - {schedule.endTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Room:</span>
                                        <span className="font-medium text-[var(--color-foreground)]">{schedule.room?.roomNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Section:</span>
                                        <span className="font-medium text-[var(--color-foreground)]">{schedule.section?.name || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex gap-2">
                                    <button
                                        className="flex-1 flex justify-center items-center gap-2 py-2 bg-[var(--color-background-secondary)] text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-background-tertiary)] transition-colors text-sm font-medium"
                                        onClick={() => console.log('attendance', schedule.id)}
                                    >
                                        <CheckCircle size={16} /> Mark Attendance
                                    </button>
                                    <button
                                        className="flex-1 flex justify-center items-center gap-2 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-medium"
                                        onClick={() => console.log('marks', schedule.id)}
                                    >
                                        <Edit3 size={16} /> Enter Marks
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
