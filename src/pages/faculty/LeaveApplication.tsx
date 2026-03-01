import { useState } from 'react';
import {
    Calendar,
    Plus,
    X,
    Clock,
    CheckCircle2,
    XCircle,
    CalendarDays,
    FileText,
    Activity,
    AlertCircle
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { FormInput } from '../../components/ui/FormInput';
import { Select } from '../../components/ui/Select';
import { DataTable, type Column } from '../../components/ui/DataTable';

// Dummy static data until GraphQL is integrated
const DUMMY_LEAVES = [
    { id: '1', type: 'CASUAL', startDate: '2026-03-05', endDate: '2026-03-06', days: 2, status: 'APPROVED', reason: 'Personal work', appliedOn: '2026-02-28' },
    { id: '2', type: 'SICK', startDate: '2026-02-15', endDate: '2026-02-15', days: 1, status: 'REJECTED', reason: 'Fever', appliedOn: '2026-02-14' },
    { id: '3', type: 'CASUAL', startDate: '2026-03-10', endDate: '2026-03-10', days: 1, status: 'PENDING', reason: 'Family function', appliedOn: '2026-03-01' },
    { id: '4', type: 'DUTY', startDate: '2026-01-20', endDate: '2026-01-22', days: 3, status: 'APPROVED', reason: 'Conference attendance', appliedOn: '2026-01-10' }
];

const LEAVE_TYPES = [
    { value: 'CASUAL', label: 'Casual Leave (CL)' },
    { value: 'SICK', label: 'Sick Leave (SL)' },
    { value: 'EARNED', label: 'Earned Leave (EL)' },
    { value: 'DUTY', label: 'On Duty (OD)' },
];

interface LeaveRecord {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    status: string;
    reason: string;
    appliedOn: string;
}

export default function LeaveApplication() {
    const [leaves, setLeaves] = useState<LeaveRecord[]>(DUMMY_LEAVES);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add dummy new leave
        const newLeave: LeaveRecord = {
            id: Date.now().toString(),
            type: formData.leaveType,
            startDate: formData.startDate,
            endDate: formData.endDate,
            days: 1, // simplified calculation for dummy
            status: 'PENDING',
            reason: formData.reason,
            appliedOn: new Date().toISOString().split('T')[0]
        };

        setLeaves([newLeave, ...leaves]);
        setIsSubmitting(false);
        setIsApplyModalOpen(false);
        setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const columns: Column<LeaveRecord>[] = [
        {
            key: 'type',
            header: 'Leave Type',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                        {row.type === 'SICK' ? <Activity size={16} /> : <CalendarDays size={16} />}
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-foreground)]">{row.type}</p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">Applied: {formatDate(row.appliedOn)}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'dates',
            header: 'Date Range',
            render: (row) => (
                <div>
                    <p className="text-[var(--color-foreground)] font-medium">
                        {formatDate(row.startDate)}
                        {row.startDate !== row.endDate && ` — ${formatDate(row.endDate)}`}
                    </p>
                    <p className="text-xs text-[var(--color-foreground-muted)]">{row.days} Day{row.days > 1 ? 's' : ''}</p>
                </div>
            )
        },
        {
            key: 'reason',
            header: 'Reason',
            render: (row) => (
                <p className="text-[var(--color-foreground)] max-w-xs truncate" title={row.reason}>
                    {row.reason}
                </p>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => {
                switch (row.status) {
                    case 'APPROVED':
                        return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-[var(--color-success-light)] text-[var(--color-success-dark)]">
                                <CheckCircle2 size={12} strokeWidth={3} />
                                APPROVED
                            </span>
                        );
                    case 'PENDING':
                        return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-[var(--color-warning-light)] text-[var(--color-warning-dark)]">
                                <Clock size={12} strokeWidth={3} />
                                PENDING
                            </span>
                        );
                    case 'REJECTED':
                        return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-[var(--color-error-light)] text-[var(--color-error-dark)]">
                                <XCircle size={12} strokeWidth={3} />
                                REJECTED
                            </span>
                        );
                    default:
                        return <span>{row.status}</span>;
                }
            }
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (row) => (
                row.status === 'PENDING' ? (
                    <button className="text-xs font-medium text-[var(--color-error)] hover:underline whitespace-nowrap">
                        Withdraw
                    </button>
                ) : (
                    <span className="text-[var(--color-foreground-muted)] text-xs">—</span>
                )
            )
        }
    ];

    return (
        <PageLayout>
            <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-in-left">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-foreground)] tracking-tight">Leave Application</h1>
                        <p className="text-[var(--color-foreground-secondary)] mt-2 text-lg">Manage your leave requests and view remaining balances</p>
                    </div>
                    <button
                        onClick={() => setIsApplyModalOpen(true)}
                        className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-colors shadow-theme-md flex items-center justify-center gap-2 shrink-0 animate-scale-in"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        Apply for Leave
                    </button>
                </div>

                {/* Balances Section / Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up delay-100">
                    <StatCard
                        title="Casual Leaves (CL)"
                        used={4}
                        total={12}
                        icon={<CalendarDays size={24} />}
                        color="var(--color-primary)"
                    />
                    <StatCard
                        title="Sick Leaves (SL)"
                        used={2}
                        total={8}
                        icon={<Activity size={24} />}
                        color="var(--color-secondary)"
                    />
                    <StatCard
                        title="Earned Leaves (EL)"
                        used={0}
                        total={15}
                        icon={<FileText size={24} />}
                        color="var(--color-success)"
                    />
                </div>

                {/* Info Alert */}
                <div className="bg-[var(--color-warning-light)]/50 border border-[var(--color-warning)] p-4 rounded-xl flex items-start gap-4 animate-slide-up delay-200">
                    <AlertCircle size={24} className="text-[var(--color-warning-dark)] shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-[var(--color-warning-dark)]">Leave Policy Update</h4>
                        <p className="text-[var(--color-warning-dark)]/80 text-sm mt-1">
                            Earned Leaves (EL) can only be applied with a minimum of 7 days prior notice. Medical certificates are required for Sick Leaves (SL) exceeding 2 consecutive days.
                        </p>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="animate-slide-up delay-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Leave History</h2>
                        <Select
                            value="ALL"
                            onChange={() => { }}
                            options={[
                                { value: 'ALL', label: 'All Status' },
                                { value: 'PENDING', label: 'Pending' },
                                { value: 'APPROVED', label: 'Approved' }
                            ]}
                            size="sm"
                            wrapperClassName="w-40"
                        />
                    </div>
                    <DataTable
                        columns={columns}
                        data={leaves}
                        pageSize={10}
                        emptyMessage="You haven't applied for any leaves yet."
                    />
                </div>

                {/* Apply Leave Modal */}
                {isApplyModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-xl border border-[var(--color-border)] max-w-md w-full flex flex-col animate-scale-in overflow-hidden">
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0 bg-gradient-to-r from-[var(--color-background-secondary)] to-transparent">
                                <div>
                                    <h2 className="text-xl font-bold text-[var(--color-foreground)] flex items-center gap-2">
                                        <Calendar size={20} className="text-[var(--color-primary)]" />
                                        Apply for Leave
                                    </h2>
                                </div>
                                <button
                                    onClick={() => !isSubmitting && setIsApplyModalOpen(false)}
                                    className="p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-tertiary)] rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <form id="leave-form" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                                <Select
                                    label="Leave Type"
                                    id="leaveType"
                                    name="leaveType"
                                    required
                                    value={formData.leaveType}
                                    onChange={(val) => handleSelectChange('leaveType', val)}
                                    options={LEAVE_TYPES}
                                    placeholder="Select leave type..."
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Start Date"
                                        type="date"
                                        name="startDate"
                                        required
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                    />
                                    <FormInput
                                        label="End Date"
                                        type="date"
                                        name="endDate"
                                        required
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        error={
                                            formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)
                                                ? "Must be after start"
                                                : undefined
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--color-foreground)]">
                                        Reason <span className="text-[var(--color-error)] ml-0.5">*</span>
                                    </label>
                                    <textarea
                                        name="reason"
                                        required
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all resize-none"
                                        placeholder="Briefly explain the reason for your leave..."
                                    />
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)]/50 shrink-0 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsApplyModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 font-semibold text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-tertiary)] rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="leave-form"
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors shadow-theme-md disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : 'Submit Application'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function StatCard({
    title,
    used,
    total,
    icon,
    color
}: {
    title: string;
    used: number;
    total: number;
    icon: React.ReactNode;
    color: string;
}) {
    const percentage = Math.min((used / total) * 100, 100);
    const isLow = (total - used) <= 2;

    return (
        <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-sm border border-[var(--color-border)] p-6 transition-all hover:shadow-theme-md hover:-translate-y-1 duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${color}15`, color: color }}
                >
                    {icon}
                </div>
                {isLow && (
                    <span className="px-2 py-1 bg-[var(--color-warning-light)] text-[var(--color-warning-dark)] text-xs font-bold rounded-md animate-pulse">
                        Low Balance
                    </span>
                )}
            </div>
            <h3 className="text-[var(--color-foreground-muted)] font-semibold text-sm uppercase tracking-wider mb-2">{title}</h3>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-[var(--color-foreground)]">{total - used}</span>
                <span className="text-[var(--color-foreground-secondary)] font-medium">remaining</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[var(--color-foreground-muted)]">
                    <span>Used: {used}</span>
                    <span>Total: {total}</span>
                </div>
                <div className="h-2 w-full bg-[var(--color-background-tertiary)] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: color
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
