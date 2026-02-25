import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Calendar, Download, Award, FileText } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { GET_UPCOMING_EXAMS, GET_MY_RESULTS } from '../../features/exams/graphql';
import type { Exam, ExamResult } from '../../features/exams/types';

export default function StudentExams() {
    const [tab, setTab] = useState<'UPCOMING' | 'RESULTS'>('UPCOMING');

    const { data: upcomingData, loading: uLoading } = useQuery<{ upcomingExams: Exam[] }>(GET_UPCOMING_EXAMS, {
        fetchPolicy: 'cache-and-network',
    });

    const { data: resultsData, loading: rLoading } = useQuery<{ myResults: ExamResult[] }>(GET_MY_RESULTS, {
        fetchPolicy: 'cache-and-network',
    });

    const upcomingExams = upcomingData?.upcomingExams || [];
    const results = resultsData?.myResults || [];

    return (
        <PageLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">My Exams</h1>
                    <p className="text-[var(--color-foreground-muted)]">View upcoming exams, download hall tickets, and check your results.</p>
                </div>

                <div className="flex bg-[var(--color-background-secondary)] rounded-lg p-1 w-fit mb-6">
                    <button
                        onClick={() => setTab('UPCOMING')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${tab === 'UPCOMING'
                            ? 'bg-[var(--color-card)] text-[var(--color-primary)] shadow-sm'
                            : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                            }`}
                    >
                        Upcoming & Schedule
                    </button>
                    <button
                        onClick={() => setTab('RESULTS')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${tab === 'RESULTS'
                            ? 'bg-[var(--color-card)] text-[var(--color-primary)] shadow-sm'
                            : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                            }`}
                    >
                        My Results
                    </button>
                </div>

                {tab === 'UPCOMING' ? (
                    <div className="grid gap-6">
                        {uLoading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                            </div>
                        ) : upcomingExams.length === 0 ? (
                            <div className="text-center p-12 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                                <Calendar size={48} className="mx-auto text-[var(--color-foreground-muted)] mb-4" />
                                <h3 className="text-lg font-medium text-[var(--color-foreground)]">No upcoming exams</h3>
                                <p className="text-[var(--color-foreground-muted)]">You have no upcoming or ongoing exams scheduled right now.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingExams.map((exam: Exam) => (
                                    <div key={exam.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm hover:border-[var(--color-primary-light)] transition-colors flex flex-col items-start gap-4">
                                        <div className="w-full">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${exam.examType === 'FINAL' ? 'bg-[var(--color-error-light)] text-[var(--color-error)]' :
                                                    'bg-[var(--color-primary-light)]/20 text-[var(--color-primary)]'
                                                    }`}>
                                                    {exam.examType}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-[var(--color-foreground)] text-lg leading-tight">{exam.name}</h3>
                                            <p className="text-sm font-medium text-[var(--color-foreground-secondary)] mt-1">{new Date(exam.startDate).toLocaleDateString()} to {new Date(exam.endDate).toLocaleDateString()}</p>
                                        </div>

                                        <div className="w-full p-4 bg-[var(--color-background-secondary)] rounded-lg text-sm flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2 text-[var(--color-foreground)] font-medium">
                                                <FileText size={16} className="text-[var(--color-primary)]" />
                                                Hall Ticket Generted
                                            </div>
                                            <button className="p-1.5 focus:outline-none hover:bg-[var(--color-background-tertiary)] rounded-full text-[var(--color-primary)] transition-colors" title="Download Hall Ticket PDF">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {rLoading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="text-center p-12 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                                <Award size={48} className="mx-auto text-[var(--color-foreground-muted)] mb-4" />
                                <h3 className="text-lg font-medium text-[var(--color-foreground)]">No results available</h3>
                                <p className="text-[var(--color-foreground-muted)]">Your exam results will appear here once published.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--color-background-secondary)] text-[var(--color-foreground-muted)] text-sm uppercase tracking-wider">
                                            <th className="p-4 font-semibold border-b border-[var(--color-border)]">Subject</th>
                                            <th className="p-4 font-semibold border-b border-[var(--color-border)] text-center">Marks Obtained</th>
                                            <th className="p-4 font-semibold border-b border-[var(--color-border)] text-center">Grade Letter</th>
                                            <th className="p-4 font-semibold border-b border-[var(--color-border)]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)]">
                                        {results.map((res: ExamResult) => (
                                            <tr key={res.id} className="hover:bg-[var(--color-background-secondary)]/50 transition-colors cursor-default">
                                                <td className="p-4 font-medium">{res.id} {/* Fake Subject Code for demonstration */}</td>
                                                <td className="p-4 font-semibold text-center">{res.isAbsent ? '-' : res.marksObtained}</td>
                                                <td className="p-4 font-semibold text-center">{res.isAbsent ? 'Absent' : res.gradeLetter}</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${res.status === 'PASSED' ? 'bg-[var(--color-success-light)] text-[var(--color-success)]' :
                                                        res.status === 'FAILED' ? 'bg-[var(--color-error-light)] text-[var(--color-error)]' :
                                                            'bg-[var(--color-warning-light)] text-[var(--color-warning)]'
                                                        }`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
