import { useEffect, useState } from 'react';
import {
    Users,
    Clock,
    CheckCircle,
    XCircle,
    CalendarDays,
    Search,
    Filter,
    ThumbsUp,
    ThumbsDown,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    FileText,
    Activity,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { useLeaveApproval } from '../../features/faculty/hooks/leaveApproval';
import type {
    FacultyLeaveRequest,
    LeaveFilterStatus,
    LeaveType,
} from '../../features/faculty/types/leaveApproval';
import { useToast } from '../../components/ui/Toast';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function daysAgo(dateStr: string): string {
    const diff = Math.round(
        (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
}

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
    CASUAL: 'Casual Leave',
    SICK: 'Sick Leave',
    EARNED: 'Earned Leave',
    DUTY: 'On Duty',
    MATERNITY: 'Maternity Leave',
    PATERNITY: 'Paternity Leave',
};

const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
    CASUAL: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30',
    SICK: 'bg-[var(--color-error-light)] text-[var(--color-error)] border-[var(--color-error)]/30',
    EARNED: 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/30',
    DUTY: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/30',
    MATERNITY: 'bg-purple-100 text-purple-700 border-purple-200',
    PATERNITY: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
    status: FacultyLeaveRequest['status'];
}

function StatusBadge({ status }: StatusBadgeProps) {
    const config: Record<
        FacultyLeaveRequest['status'],
        { label: string; className: string; icon: React.ReactNode }
    > = {
        PENDING: {
            label: 'Pending',
            className:
                'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]/40',
            icon: <Clock size={11} />,
        },
        APPROVED: {
            label: 'Approved',
            className:
                'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]/40',
            icon: <CheckCircle size={11} />,
        },
        REJECTED: {
            label: 'Rejected',
            className:
                'bg-[var(--color-error-light)] text-[var(--color-error)] border border-[var(--color-error)]/40',
            icon: <XCircle size={11} />,
        },
    };

    const { label, className, icon } = config[status];
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
        >
            {icon}
            {label}
        </span>
    );
}

// ─── Leave Type Badge ─────────────────────────────────────────────────────────

function LeaveTypeBadge({ type }: { type: LeaveType }) {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${LEAVE_TYPE_COLORS[type]}`}
        >
            {LEAVE_TYPE_LABELS[type]}
        </span>
    );
}

// ─── Approve / Reject Modal ───────────────────────────────────────────────────

type ModalAction = 'approve' | 'reject';

interface ActionModalProps {
    request: FacultyLeaveRequest;
    action: ModalAction;
    loading: boolean;
    onConfirm: (remark: string) => void;
    onClose: () => void;
}

function ActionModal({ request, action, loading, onConfirm, onClose }: ActionModalProps) {
    const [remark, setRemark] = useState('');
    const isReject = action === 'reject';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isReject && !remark.trim()) return;
        onConfirm(remark.trim());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-2xl w-full max-w-md">
                {/* Header */}
                <div
                    className={`px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-3 rounded-t-2xl ${
                        isReject
                            ? 'bg-[var(--color-error-light)]'
                            : 'bg-[var(--color-success-light)]'
                    }`}
                >
                    {isReject ? (
                        <ThumbsDown size={20} className="text-[var(--color-error)]" />
                    ) : (
                        <ThumbsUp size={20} className="text-[var(--color-success)]" />
                    )}
                    <div>
                        <h3
                            className={`font-bold text-base ${
                                isReject
                                    ? 'text-[var(--color-error)]'
                                    : 'text-[var(--color-success)]'
                            }`}
                        >
                            {isReject ? 'Reject Leave Request' : 'Approve Leave Request'}
                        </h3>
                        <p className="text-xs text-[var(--color-foreground-muted)]">
                            {request.facultyName} · {LEAVE_TYPE_LABELS[request.leaveType]}
                        </p>
                    </div>
                </div>

                {/* Request Summary */}
                <div className="px-6 py-4 bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-[var(--color-foreground-muted)] text-xs mb-0.5">Duration</p>
                            <p className="font-medium text-[var(--color-foreground)]">
                                {formatDate(request.startDate)}
                                {request.startDate !== request.endDate &&
                                    ` → ${formatDate(request.endDate)}`}
                            </p>
                        </div>
                        <div>
                            <p className="text-[var(--color-foreground-muted)] text-xs mb-0.5">Days</p>
                            <p className="font-medium text-[var(--color-foreground)]">
                                {request.totalDays} day{request.totalDays !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[var(--color-foreground-muted)] text-xs mb-0.5">Reason</p>
                            <p className="text-[var(--color-foreground)]">{request.reason}</p>
                        </div>
                    </div>
                </div>

                {/* Remark Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label
                            htmlFor="action-remark"
                            className="block text-sm font-medium text-[var(--color-foreground)] mb-1"
                        >
                            {isReject ? (
                                <>
                                    Rejection Reason{' '}
                                    <span className="text-[var(--color-error)]">*</span>
                                </>
                            ) : (
                                'Remarks (optional)'
                            )}
                        </label>
                        <textarea
                            id="action-remark"
                            rows={3}
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder={
                                isReject
                                    ? 'State the reason for rejection…'
                                    : 'Add any notes for the faculty…'
                            }
                            required={isReject}
                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] px-3 py-2 text-sm resize-none focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground-secondary)] text-sm font-medium hover:bg-[var(--color-background-secondary)] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (isReject && !remark.trim())}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                                isReject
                                    ? 'bg-[var(--color-error)] hover:opacity-90'
                                    : 'bg-[var(--color-success)] hover:opacity-90'
                            }`}
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {isReject ? 'Reject' : 'Approve'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Leave Request Card ───────────────────────────────────────────────────────

interface LeaveCardProps {
    request: FacultyLeaveRequest;
    onApprove: (req: FacultyLeaveRequest) => void;
    onReject: (req: FacultyLeaveRequest) => void;
}

function LeaveRequestCard({ request, onApprove, onReject }: LeaveCardProps) {
    const [expanded, setExpanded] = useState(false);

    const initials = request.facultyName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden hover:border-[var(--color-primary)]/40 transition-colors">
            <div className="p-5">
                {/* Faculty Info Row */}
                <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-[var(--color-foreground)] truncate">
                                    {request.facultyName}
                                </h3>
                                <p className="text-xs text-[var(--color-foreground-muted)]">
                                    {request.designation} · ID: {request.employeeId}
                                </p>
                            </div>
                            <StatusBadge status={request.status} />
                        </div>
                    </div>
                </div>

                {/* Leave Details */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                        <p className="text-xs text-[var(--color-foreground-muted)] mb-0.5">Leave Type</p>
                        <LeaveTypeBadge type={request.leaveType} />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--color-foreground-muted)] mb-0.5">Duration</p>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">
                            {request.totalDays} day{request.totalDays !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-[var(--color-foreground-muted)] mb-0.5">Dates</p>
                        <p className="text-sm text-[var(--color-foreground)]">
                            {formatDate(request.startDate)}
                            {request.startDate !== request.endDate &&
                                ` — ${formatDate(request.endDate)}`}
                        </p>
                    </div>
                </div>

                {/* Applied On */}
                <p className="mt-3 text-xs text-[var(--color-foreground-muted)]">
                    Applied {daysAgo(request.appliedOn)}
                </p>

                {/* Action Buttons (only for PENDING) */}
                {request.status === 'PENDING' && (
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => onApprove(request)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-success-light)] text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white text-xs font-semibold border border-[var(--color-success)]/30 transition-all"
                        >
                            <ThumbsUp size={13} />
                            Approve
                        </button>
                        <button
                            onClick={() => onReject(request)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-error-light)] text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white text-xs font-semibold border border-[var(--color-error)]/30 transition-all"
                        >
                            <ThumbsDown size={13} />
                            Reject
                        </button>
                    </div>
                )}
            </div>

            {/* Expandable Detail Panel */}
            <button
                onClick={() => setExpanded((p) => !p)}
                className="w-full flex items-center justify-between px-5 py-2.5 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)] text-xs font-medium text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-tertiary)] transition-colors"
            >
                <span className="flex items-center gap-1.5">
                    <FileText size={12} />
                    Details &amp; Remarks
                </span>
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {expanded && (
                <div className="px-5 py-4 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)] space-y-3">
                    {/* AI Summary */}
                    {request.ai_summary && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 flex items-center gap-1">
                                <Activity size={10} />
                                AI Insight
                            </p>
                            <p className="text-sm text-blue-900 italic font-medium leading-relaxed">
                                "{request.ai_summary}"
                            </p>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <p className="text-xs font-semibold text-[var(--color-foreground-muted)] uppercase tracking-wide mb-1">
                            Reason
                        </p>
                        <p className="text-sm text-[var(--color-foreground)]">{request.reason}</p>
                    </div>

                    {/* Leave Balances */}
                    <div>
                        <p className="text-xs font-semibold text-[var(--color-foreground-muted)] uppercase tracking-wide mb-2">
                            Leave Balances
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'CL', value: request.casualLeaveBalance, color: 'text-[var(--color-primary)]' },
                                { label: 'SL', value: request.sickLeaveBalance, color: 'text-[var(--color-error)]' },
                                { label: 'EL', value: request.earnedLeaveBalance, color: 'text-[var(--color-success)]' },
                            ].map(({ label, value, color }) => (
                                <div
                                    key={label}
                                    className="bg-[var(--color-card)] rounded-lg p-2 text-center border border-[var(--color-border)]"
                                >
                                    <p className={`text-base font-bold ${color}`}>{value}</p>
                                    <p className="text-xs text-[var(--color-foreground-muted)]">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Remark / Rejection note */}
                    {request.status === 'APPROVED' && request.approvalRemark && (
                        <div className="p-3 rounded-lg bg-[var(--color-success-light)] border border-[var(--color-success)]/30">
                            <p className="text-xs font-semibold text-[var(--color-success)] mb-0.5">
                                HOD Remark
                            </p>
                            <p className="text-sm text-[var(--color-foreground)]">
                                {request.approvalRemark}
                            </p>
                        </div>
                    )}
                    {request.status === 'REJECTED' && request.rejectionRemark && (
                        <div className="p-3 rounded-lg bg-[var(--color-error-light)] border border-[var(--color-error)]/30">
                            <p className="text-xs font-semibold text-[var(--color-error)] mb-0.5">
                                Rejection Reason
                            </p>
                            <p className="text-sm text-[var(--color-foreground)]">
                                {request.rejectionRemark}
                            </p>
                        </div>
                    )}
                    {request.actionTakenOn && (
                        <p className="text-xs text-[var(--color-foreground-muted)]">
                            Action taken on {formatDate(request.actionTakenOn)}
                            {request.actionTakenBy && ` by ${request.actionTakenBy}`}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Summary Stats Bar ────────────────────────────────────────────────────────

interface SummaryStatsProps {
    data: {
        totalRequests: number;
        pendingCount: number;
        approvedCount: number;
        rejectedCount: number;
        totalDaysRequested: number;
        avgDaysPerRequest: number;
    };
}

function SummaryStatsBar({ data }: SummaryStatsProps) {
    const stats = [
        {
            icon: <Users size={20} />,
            label: 'Total Requests',
            value: data.totalRequests,
            color: 'text-[var(--color-primary)]',
            bg: 'bg-[var(--color-primary)]/10',
        },
        {
            icon: <Clock size={20} />,
            label: 'Pending',
            value: data.pendingCount,
            color: 'text-[var(--color-warning)]',
            bg: 'bg-[var(--color-warning-light)]',
        },
        {
            icon: <CheckCircle size={20} />,
            label: 'Approved',
            value: data.approvedCount,
            color: 'text-[var(--color-success)]',
            bg: 'bg-[var(--color-success-light)]',
        },
        {
            icon: <XCircle size={20} />,
            label: 'Rejected',
            value: data.rejectedCount,
            color: 'text-[var(--color-error)]',
            bg: 'bg-[var(--color-error-light)]',
        },
        {
            icon: <CalendarDays size={20} />,
            label: 'Total Days',
            value: data.totalDaysRequested,
            color: 'text-[var(--color-foreground)]',
            bg: 'bg-[var(--color-background-secondary)]',
        },
        {
            icon: <Filter size={20} />,
            label: 'Avg Days / Req',
            value: data.avgDaysPerRequest.toFixed(1),
            color: 'text-[var(--color-foreground)]',
            bg: 'bg-[var(--color-background-secondary)]',
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map(({ icon, label, value, color, bg }) => (
                <div
                    key={label}
                    className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col items-center text-center gap-2 shadow-sm"
                >
                    <div className={`p-2 rounded-lg ${bg} ${color}`}>{icon}</div>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-[var(--color-foreground-muted)]">{label}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Status Filter Tabs ───────────────────────────────────────────────────────

interface StatusTabsProps {
    active: LeaveFilterStatus;
    onSelect: (v: LeaveFilterStatus) => void;
    counts: Record<LeaveFilterStatus, number>;
}

function StatusTabs({ active, onSelect, counts }: StatusTabsProps) {
    const tabs: { value: LeaveFilterStatus; label: string; colorClass: string }[] = [
        { value: 'ALL', label: 'All', colorClass: 'text-[var(--color-primary)]' },
        { value: 'PENDING', label: 'Pending', colorClass: 'text-[var(--color-warning)]' },
        { value: 'APPROVED', label: 'Approved', colorClass: 'text-[var(--color-success)]' },
        { value: 'REJECTED', label: 'Rejected', colorClass: 'text-[var(--color-error)]' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map(({ value, label, colorClass }) => (
                <button
                    key={value}
                    onClick={() => onSelect(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        active === value
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                            : `bg-[var(--color-card)] border-[var(--color-border)] ${colorClass} hover:border-[var(--color-primary)]/40`
                    }`}
                >
                    {label}
                    <span className={`ml-2 text-xs font-bold ${active === value ? 'text-white' : ''}`}>
                        {counts[value]}
                    </span>
                </button>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HODFacultyLeaveApproval() {
    const {
        leaveData,
        loading,
        actionLoading,
        error,
        loadLeaveRequests,
        approveLeave,
        rejectLeave,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        searchTerm,
        setSearchTerm,
        filteredRequests,
    } = useLeaveApproval();

    const { addToast } = useToast();

    // Modal state
    const [modalRequest, setModalRequest] = useState<FacultyLeaveRequest | null>(null);
    const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);

    useEffect(() => {
        loadLeaveRequests();
    }, [loadLeaveRequests]);

    // Status counts
    const statusCounts: Record<LeaveFilterStatus, number> = {
        ALL: leaveData?.leaveRequests.length ?? 0,
        PENDING: leaveData?.summaryStats.pendingCount ?? 0,
        APPROVED: leaveData?.summaryStats.approvedCount ?? 0,
        REJECTED: leaveData?.summaryStats.rejectedCount ?? 0,
    };

    const openApprove = (req: FacultyLeaveRequest) => {
        setModalRequest(req);
        setModalAction('approve');
    };

    const openReject = (req: FacultyLeaveRequest) => {
        setModalRequest(req);
        setModalAction('reject');
    };

    const closeModal = () => {
        setModalRequest(null);
        setModalAction(null);
    };

    const handleConfirm = async (remark: string) => {
        if (!modalRequest || !modalAction) return;
        try {
            if (modalAction === 'approve') {
                await approveLeave({ leaveRequestId: modalRequest.id, remark });
                addToast({
                    type: 'success',
                    title: 'Leave Approved',
                    message: `${modalRequest.facultyName}'s leave has been approved.`,
                });
            } else {
                await rejectLeave({ leaveRequestId: modalRequest.id, remark });
                addToast({
                    type: 'error',
                    title: 'Leave Rejected',
                    message: `${modalRequest.facultyName}'s leave has been rejected.`,
                });
            }
            closeModal();
        } catch {
            addToast({
                type: 'error',
                title: 'Action Failed',
                message: 'Could not process the request. Please try again.',
            });
        }
    };

    const TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
        { value: 'ALL', label: 'All Types' },
        { value: 'CASUAL', label: 'Casual Leave' },
        { value: 'SICK', label: 'Sick Leave' },
        { value: 'EARNED', label: 'Earned Leave' },
        { value: 'DUTY', label: 'On Duty' },
        { value: 'MATERNITY', label: 'Maternity Leave' },
        { value: 'PATERNITY', label: 'Paternity Leave' },
    ];

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
                        Faculty Leave Approvals
                    </h1>
                    {leaveData && (
                        <p className="text-[var(--color-foreground-muted)] mt-1">
                            {leaveData.departmentName} · {leaveData.academicYear}
                        </p>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="p-5 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)]/40 flex items-start gap-3">
                        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Failed to load leave requests</p>
                            <p className="text-sm mt-0.5">{error}</p>
                        </div>
                    </div>
                )}

                {/* Data */}
                {!loading && leaveData && (
                    <>
                        {/* Summary Stats */}
                        <SummaryStatsBar data={leaveData.summaryStats} />

                        {/* Filters Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Status Tabs */}
                            <StatusTabs
                                active={statusFilter}
                                onSelect={setStatusFilter}
                                counts={statusCounts}
                            />

                            {/* Type Filter */}
                            <div className="flex items-center gap-2 ml-auto">
                                <Filter
                                    size={15}
                                    className="text-[var(--color-foreground-muted)]"
                                />
                                <select
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setTypeFilter(
                                            e.target.value as typeof typeFilter,
                                        )
                                    }
                                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] text-sm px-3 py-2 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                >
                                    {TYPE_FILTER_OPTIONS.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>

                                {/* Search */}
                                <div className="relative">
                                    <Search
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]"
                                    />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search faculty, reason…"
                                        className="pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors w-56"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pending Highlight Banner */}
                        {statusFilter === 'ALL' && leaveData.summaryStats.pendingCount > 0 && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-warning-light)] border border-[var(--color-warning)]/40">
                                <Clock
                                    size={18}
                                    className="text-[var(--color-warning)] flex-shrink-0"
                                />
                                <p className="text-sm text-[var(--color-foreground)]">
                                    <span className="font-bold text-[var(--color-warning)]">
                                        {leaveData.summaryStats.pendingCount} leave request
                                        {leaveData.summaryStats.pendingCount !== 1 ? 's' : ''}
                                    </span>{' '}
                                    awaiting your approval.
                                </p>
                                <button
                                    onClick={() => setStatusFilter('PENDING')}
                                    className="ml-auto text-xs font-semibold text-[var(--color-warning)] underline underline-offset-2 hover:no-underline"
                                >
                                    View pending
                                </button>
                            </div>
                        )}

                        {/* Request Grid */}
                        {filteredRequests.length === 0 ? (
                            <div className="text-center py-16 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
                                <CalendarDays
                                    size={48}
                                    className="mx-auto text-[var(--color-foreground-muted)] mb-4"
                                />
                                <h3 className="text-lg font-medium text-[var(--color-foreground)]">
                                    No leave requests found
                                </h3>
                                <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
                                    Try adjusting your filters or search term.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filteredRequests.map((req) => (
                                    <LeaveRequestCard
                                        key={req.id}
                                        request={req}
                                        onApprove={openApprove}
                                        onReject={openReject}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Action Modal */}
            {modalRequest && modalAction && (
                <ActionModal
                    request={modalRequest}
                    action={modalAction}
                    loading={actionLoading}
                    onConfirm={handleConfirm}
                    onClose={closeModal}
                />
            )}
        </PageLayout>
    );
}
