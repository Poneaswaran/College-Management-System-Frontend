import { useMemo, useState } from 'react';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileCheck,
    Search,
    XCircle,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';

type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface TimetableSlot {
    day: string;
    period: string;
    courseCode: string;
    courseTitle: string;
    facultyName: string;
    section: string;
    room: string;
}

interface TimetableApprovalRequest {
    id: string;
    submittedAt: string;
    submittedBy: string;
    semester: string;
    academicYear: string;
    changeSummary: string;
    status: ApprovalStatus;
    note: string;
    slots: TimetableSlot[];
}

const MOCK_REQUESTS: TimetableApprovalRequest[] = [
    {
        id: 'TT-2026-041',
        submittedAt: '2026-03-12T10:20:00Z',
        submittedBy: 'Dr. Kavitha Raman',
        semester: 'Sem 6',
        academicYear: '2025-26',
        changeSummary: 'Swap Tuesday and Thursday labs for CS602 due to lab maintenance.',
        status: 'PENDING',
        note: 'Lab-2 unavailable on Thursday morning for maintenance.',
        slots: [
            {
                day: 'Tuesday',
                period: 'P5-P6',
                courseCode: 'CS602',
                courseTitle: 'Machine Learning Lab',
                facultyName: 'Dr. Kavitha Raman',
                section: 'CSE-A',
                room: 'Lab-4',
            },
            {
                day: 'Thursday',
                period: 'P2-P3',
                courseCode: 'CS602',
                courseTitle: 'Machine Learning Lab',
                facultyName: 'Dr. Kavitha Raman',
                section: 'CSE-A',
                room: 'Lab-2',
            },
        ],
    },
    {
        id: 'TT-2026-038',
        submittedAt: '2026-03-11T07:50:00Z',
        submittedBy: 'Prof. Arjun Menon',
        semester: 'Sem 4',
        academicYear: '2025-26',
        changeSummary: 'Merge two tutorial batches for CS401 to free one slot for remedial class.',
        status: 'PENDING',
        note: 'Batch strength dropped after elective migration.',
        slots: [
            {
                day: 'Monday',
                period: 'P3',
                courseCode: 'CS401',
                courseTitle: 'Design and Analysis of Algorithms',
                facultyName: 'Prof. Arjun Menon',
                section: 'CSE-B',
                room: 'CR-204',
            },
        ],
    },
    {
        id: 'TT-2026-032',
        submittedAt: '2026-03-09T13:10:00Z',
        submittedBy: 'Dr. Preethi Nair',
        semester: 'Sem 2',
        academicYear: '2025-26',
        changeSummary: 'Shift Friday CS201 lecture from P1 to P2 due to orientation event.',
        status: 'APPROVED',
        note: 'Approved after confirming no overlap with Physics lab.',
        slots: [
            {
                day: 'Friday',
                period: 'P2',
                courseCode: 'CS201',
                courseTitle: 'Discrete Mathematics',
                facultyName: 'Dr. Preethi Nair',
                section: 'CSE-C',
                room: 'CR-112',
            },
        ],
    },
    {
        id: 'TT-2026-027',
        submittedAt: '2026-03-07T11:35:00Z',
        submittedBy: 'Prof. Vivek Sharma',
        semester: 'Sem 8',
        academicYear: '2025-26',
        changeSummary: 'Requested additional weekend project studio slot for final year teams.',
        status: 'REJECTED',
        note: 'Weekend slot denied due to maintenance shutdown schedule.',
        slots: [
            {
                day: 'Saturday',
                period: 'P2-P4',
                courseCode: 'CS890',
                courseTitle: 'Capstone Project Studio',
                facultyName: 'Prof. Vivek Sharma',
                section: 'CSE-A+B',
                room: 'Innovation Lab',
            },
        ],
    },
];

const STATUS_LABELS: Record<ApprovalStatus, string> = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
};

const STATUS_CLASSNAMES: Record<ApprovalStatus, string> = {
    PENDING: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/40',
    APPROVED: 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/40',
    REJECTED: 'bg-[var(--color-error-light)] text-[var(--color-error)] border-[var(--color-error)]/40',
};

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function StatusBadge({ status }: { status: ApprovalStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSNAMES[status]}`}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}

export default function HODTimetableApprovalReview() {
    const [requests, setRequests] = useState<TimetableApprovalRequest[]>(MOCK_REQUESTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'ALL'>('ALL');
    const [semesterFilter, setSemesterFilter] = useState<string>('ALL');

    const semesters = useMemo(() => {
        const values = Array.from(new Set(requests.map((request) => request.semester)));
        return values.sort((a, b) => a.localeCompare(b));
    }, [requests]);

    const filteredRequests = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return requests.filter((request) => {
            const matchesQuery =
                query.length === 0 ||
                request.id.toLowerCase().includes(query) ||
                request.submittedBy.toLowerCase().includes(query) ||
                request.changeSummary.toLowerCase().includes(query) ||
                request.slots.some(
                    (slot) =>
                        slot.courseCode.toLowerCase().includes(query) ||
                        slot.courseTitle.toLowerCase().includes(query),
                );

            const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
            const matchesSemester = semesterFilter === 'ALL' || request.semester === semesterFilter;

            return matchesQuery && matchesStatus && matchesSemester;
        });
    }, [requests, searchQuery, statusFilter, semesterFilter]);

    const pendingCount = requests.filter((request) => request.status === 'PENDING').length;
    const approvedCount = requests.filter((request) => request.status === 'APPROVED').length;
    const rejectedCount = requests.filter((request) => request.status === 'REJECTED').length;

    const updateStatus = (id: string, status: ApprovalStatus) => {
        setRequests((current) =>
            current.map((request) => (request.id === id ? { ...request, status } : request)),
        );
    };

    return (
        <PageLayout>
            <main className="p-4 md:p-6 lg:p-8 space-y-6">
                <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-primary)]">HOD Workflow</p>
                            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">
                                Timetable Approval Review
                            </h1>
                            <p className="mt-2 text-sm text-[var(--color-foreground-secondary)] max-w-3xl">
                                Review faculty timetable change requests and approve or reject updates before publishing.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-2">
                            <CalendarDays size={16} className="text-[var(--color-primary)]" />
                            <span className="text-sm font-medium text-[var(--color-foreground)]">Academic Year {MOCK_REQUESTS[0].academicYear}</span>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[var(--color-foreground-muted)]">Pending</p>
                            <Clock3 size={18} className="text-[var(--color-warning)]" />
                        </div>
                        <p className="mt-2 text-2xl font-bold text-[var(--color-warning)]">{pendingCount}</p>
                    </article>
                    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[var(--color-foreground-muted)]">Approved</p>
                            <CheckCircle2 size={18} className="text-[var(--color-success)]" />
                        </div>
                        <p className="mt-2 text-2xl font-bold text-[var(--color-success)]">{approvedCount}</p>
                    </article>
                    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[var(--color-foreground-muted)]">Rejected</p>
                            <XCircle size={18} className="text-[var(--color-error)]" />
                        </div>
                        <p className="mt-2 text-2xl font-bold text-[var(--color-error)]">{rejectedCount}</p>
                    </article>
                </section>

                <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 md:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2">
                            <Search size={16} className="text-[var(--color-foreground-muted)]" />
                            <input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search by request, faculty, or course"
                                className="w-full bg-transparent text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] focus:outline-none"
                            />
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value as ApprovalStatus | 'ALL')}
                            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>

                        <select
                            value={semesterFilter}
                            onChange={(event) => setSemesterFilter(event.target.value)}
                            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:outline-none"
                        >
                            <option value="ALL">All Semesters</option>
                            {semesters.map((semester) => (
                                <option key={semester} value={semester}>
                                    {semester}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="space-y-4">
                    {filteredRequests.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center">
                            <p className="text-lg font-semibold text-[var(--color-foreground)]">No matching requests</p>
                            <p className="mt-1 text-sm text-[var(--color-foreground-secondary)]">Try adjusting your search or filter selection.</p>
                        </div>
                    )}

                    {filteredRequests.map((request) => (
                        <article
                            key={request.id}
                            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm"
                        >
                            <div className="border-b border-[var(--color-border)] p-4 md:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">{request.id}</h2>
                                            <StatusBadge status={request.status} />
                                        </div>
                                        <p className="mt-1 text-sm text-[var(--color-foreground-secondary)]">
                                            Submitted by {request.submittedBy} on {formatDateTime(request.submittedAt)}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-3 py-1.5 text-xs font-medium text-[var(--color-foreground)]">
                                        {request.semester}
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-[var(--color-foreground)]">{request.changeSummary}</p>
                                <p className="mt-2 text-xs text-[var(--color-foreground-muted)]">Note: {request.note}</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)]">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium">Day</th>
                                            <th className="px-4 py-2 text-left font-medium">Period</th>
                                            <th className="px-4 py-2 text-left font-medium">Course</th>
                                            <th className="px-4 py-2 text-left font-medium">Faculty</th>
                                            <th className="px-4 py-2 text-left font-medium">Section</th>
                                            <th className="px-4 py-2 text-left font-medium">Room</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {request.slots.map((slot, index) => (
                                            <tr
                                                key={`${request.id}-${slot.courseCode}-${index}`}
                                                className="border-t border-[var(--color-border)] text-[var(--color-foreground)]"
                                            >
                                                <td className="px-4 py-2">{slot.day}</td>
                                                <td className="px-4 py-2">{slot.period}</td>
                                                <td className="px-4 py-2">
                                                    <p className="font-medium">{slot.courseCode}</p>
                                                    <p className="text-xs text-[var(--color-foreground-muted)]">{slot.courseTitle}</p>
                                                </td>
                                                <td className="px-4 py-2">{slot.facultyName}</td>
                                                <td className="px-4 py-2">{slot.section}</td>
                                                <td className="px-4 py-2">{slot.room}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--color-border)] p-4">
                                <button
                                    onClick={() => updateStatus(request.id, 'APPROVED')}
                                    disabled={request.status === 'APPROVED'}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-success)] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <CheckCircle2 size={16} />
                                    Approve
                                </button>
                                <button
                                    onClick={() => updateStatus(request.id, 'REJECTED')}
                                    disabled={request.status === 'REJECTED'}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-error)] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <XCircle size={16} />
                                    Reject
                                </button>
                                <button
                                    onClick={() => updateStatus(request.id, 'PENDING')}
                                    disabled={request.status === 'PENDING'}
                                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <FileCheck size={16} />
                                    Mark Pending
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </PageLayout>
    );
}
