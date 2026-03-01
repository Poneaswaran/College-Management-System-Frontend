import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Settings, FileText } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { FilterBar } from '../../components/ui/FilterBar';
import { GET_EXAMS, UPDATE_EXAM_STATUS } from '../../features/exams/graphql';
import type { Exam } from '../../features/exams/types';

export default function HODExams() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const STATUS_OPTIONS = [
        { value: 'ALL', label: 'All Status' },
        { value: 'DRAFT', label: 'Draft' },
        { value: 'SCHEDULED', label: 'Scheduled' },
        { value: 'ONGOING', label: 'Ongoing' },
        { value: 'COMPLETED', label: 'Completed' },
    ];

    // Using mock data fallback if Apollo throws while backend is not ready
    const { data, loading, error } = useQuery<{ exams: Exam[] }>(GET_EXAMS, {
        variables: { status: statusFilter === 'ALL' ? undefined : statusFilter },
        fetchPolicy: 'cache-and-network',
    });

    const [updateStatus] = useMutation(UPDATE_EXAM_STATUS, {
        refetchQueries: [{ query: GET_EXAMS }],
    });

    const exams = data?.exams || [];

    const handleStatusChange = (id: string, newStatus: string) => {
        updateStatus({ variables: { id, status: newStatus } }).catch((err: unknown) => console.error(err));
    };

    return (
        <PageLayout>
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Exam Management</h1>
                        <p className="text-[var(--color-foreground-muted)]">Manage departmental exams, schedules, and results.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                        <Plus size={20} />
                        Add Exam
                    </button>
                </div>

                <FilterBar>
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search exams..."
                        wrapperClassName="flex-1"
                    />
                    <FilterBar.Actions>
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={STATUS_OPTIONS}
                        />
                    </FilterBar.Actions>
                </FilterBar>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)]">
                        Failed to load exams: {error.message}
                    </div>
                ) : exams.length === 0 ? (
                    <div className="text-center p-12 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm">
                        <FileText size={48} className="mx-auto text-[var(--color-foreground-muted)] mb-4" />
                        <h3 className="text-lg font-medium text-[var(--color-foreground)]">No exams found</h3>
                        <p className="text-[var(--color-foreground-muted)]">Try adjusting your filters or create a new exam.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {exams.map((exam: Exam) => (
                            <div key={exam.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm hover:border-[var(--color-primary-light)] transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-[var(--color-foreground)]">{exam.name}</h3>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${exam.status === 'COMPLETED' ? 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                                                exam.status === 'ONGOING' ? 'bg-[var(--color-primary-light)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/20' :
                                                    exam.status === 'SCHEDULED' ? 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/20' :
                                                        'bg-[var(--color-background-tertiary)] text-[var(--color-foreground-secondary)] border-[var(--color-border)]'
                                                }`}>
                                                {exam.status}
                                            </span>
                                        </div>
                                        <p className="text-[var(--color-foreground-secondary)]">{exam.description || 'No description provided.'}</p>
                                        <div className="flex gap-6 mt-4 text-sm text-[var(--color-foreground-muted)]">
                                            <span>Type: <b>{exam.examType}</b></span>
                                            <span>Max Marks: <b>{exam.maxMarks}</b></span>
                                            <span>Pass Marks: <b>{exam.passMarks}</b></span>
                                            <span>Start: <b>{new Date(exam.startDate).toLocaleDateString()}</b></span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors" title="Manage Schedules & Seating">
                                            <Settings size={20} />
                                        </button>
                                        {exam.status === 'DRAFT' && (
                                            <button
                                                onClick={() => handleStatusChange(exam.id, 'SCHEDULED')}
                                                className="text-sm bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-tertiary)] px-3 py-1.5 rounded-lg font-medium text-[var(--color-foreground)] transition-colors"
                                            >
                                                Mark Scheduled
                                            </button>
                                        )}
                                        {exam.status === 'SCHEDULED' && (
                                            <button
                                                onClick={() => handleStatusChange(exam.id, 'ONGOING')}
                                                className="text-sm bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] px-3 py-1.5 rounded-lg font-medium transition-colors"
                                            >
                                                Start Exam
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
