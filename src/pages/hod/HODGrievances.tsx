import { useCallback, useEffect, useState } from 'react';
import { 
    MessageSquare, 
    CheckCircle2, 
    Clock, 
    Search, 
    MoreHorizontal,
    ArrowUpRight,
    XCircle,
    Send
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { Select, type SelectOption } from '../../components/ui/Select';
import { 
    fetchGrievances, 
    resolveGrievance, 
    updateGrievanceStatus,
    type Grievance,
    type GrievanceStatus,
    type GrievancePriority,
    type GrievanceCategory
} from '../../services/grievance.service';

const STATUS_OPTIONS: SelectOption[] = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'REJECTED', label: 'Rejected' },
];

const PRIORITY_OPTIONS: SelectOption[] = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
];

const CATEGORY_OPTIONS: SelectOption[] = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'ACADEMIC', label: 'Academic' },
    { value: 'FACILITY', label: 'Facility' },
    { value: 'HOSTEL', label: 'Hostel' },
    { value: 'ADMINISTRATIVE', label: 'Administrative' },
    { value: 'DISCIPLINARY', label: 'Disciplinary' },
    { value: 'OTHER', label: 'Other' },
];

export default function HODGrievances() {
    // State
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

    // Selected Grievance for Resolution
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [submittingResolution, setSubmittingResolution] = useState(false);

    const loadGrievances = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchGrievances({
                search: searchTerm || undefined,
                status: statusFilter === 'ALL' ? undefined : statusFilter as GrievanceStatus,
                priority: priorityFilter === 'ALL' ? undefined : priorityFilter as GrievancePriority,
                category: categoryFilter === 'ALL' ? undefined : categoryFilter as GrievanceCategory,
                page,
                page_size: pageSize
            });
            setGrievances(response.results);
            setTotalCount(response.count);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load grievances';
            console.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, priorityFilter, categoryFilter, page, pageSize]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadGrievances();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadGrievances]);

    const handleResolve = async () => {
        if (!selectedGrievance || !resolutionNote.trim()) return;
        setSubmittingResolution(true);
        try {
            await resolveGrievance(selectedGrievance.id, resolutionNote);
            setResolutionNote('');
            setSelectedGrievance(null);
            loadGrievances();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to resolve grievance';
            alert(errorMessage);
        } finally {
            setSubmittingResolution(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: GrievanceStatus) => {
        try {
            await updateGrievanceStatus(id, status);
            loadGrievances();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
            alert(errorMessage);
        }
    };

    const getStatusStyle = (status: GrievanceStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'RESOLVED':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPriorityStyle = (priority: GrievancePriority) => {
        switch (priority) {
            case 'URGENT':
                return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'HIGH':
                return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'MEDIUM':
                return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'LOW':
                return 'text-slate-600 bg-slate-50 border-slate-100';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    const columns: Column<Grievance>[] = [
        {
            key: 'subject',
            header: 'Subject & Category',
            render: (row) => (
                <div className="flex flex-col max-w-xs">
                    <span className="font-semibold text-[var(--color-foreground)] truncate">{row.subject}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-foreground-muted)] flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                        {row.category_display}
                    </span>
                </div>
            )
        },
        {
            key: 'student',
            header: 'Student',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {row.student_details.profile_photo ? (
                            <img src={row.student_details.profile_photo} className="w-full h-full rounded-full object-cover" alt="" />
                        ) : (
                            row.student_details.full_name.charAt(0)
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">{row.student_details.full_name}</span>
                        <span className="text-[10px] text-[var(--color-foreground-muted)] font-mono">{row.student_details.register_number}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'priority',
            header: 'Priority',
            align: 'center',
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityStyle(row.priority)}`}>
                    {row.priority}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${getStatusStyle(row.status)}`}>
                    {row.status === 'PENDING' && <Clock size={10} />}
                    {row.status === 'IN_PROGRESS' && <ArrowUpRight size={10} />}
                    {row.status === 'RESOLVED' && <CheckCircle2 size={10} />}
                    {row.status === 'REJECTED' && <XCircle size={10} />}
                    {row.status}
                </span>
            )
        },
        {
            key: 'created_at',
            header: 'Date Submitted',
            render: (row) => (
                <span className="text-xs text-[var(--color-foreground-muted)]">
                    {new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            )
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.status !== 'RESOLVED' && row.status !== 'REJECTED' && (
                        <button 
                            onClick={() => setSelectedGrievance(row)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Resolve"
                            data-testid={`resolve-btn-${row.id}`}
                        >
                            <Send size={16} />
                        </button>
                    )}
                    <button 
                        className="p-1.5 text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-secondary)] rounded-lg transition-all"
                        data-testid={`more-actions-btn-${row.id}`}
                    >
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                <Header 
                    title="Student Grievances" 
                    titleIcon={<MessageSquare size={28} className="text-indigo-600" />}
                />

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Grievances', value: totalCount, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Pending Action', value: grievances.filter(g => g.status === 'PENDING').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'In Progress', value: grievances.filter(g => g.status === 'IN_PROGRESS').length, icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Successfully Resolved', value: grievances.filter(g => g.status === 'RESOLVED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[var(--color-foreground-muted)]">{stat.label}</p>
                                <p className="text-xl font-bold text-[var(--color-foreground)]">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-[var(--color-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" size={18} />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search grievances by subject or student..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-background-secondary)] border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                data-testid="grievance-search-input"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Select 
                                options={STATUS_OPTIONS}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                className="w-40"
                            />
                            <Select 
                                options={PRIORITY_OPTIONS}
                                value={priorityFilter}
                                onChange={setPriorityFilter}
                                className="w-40"
                            />
                            <Select 
                                options={CATEGORY_OPTIONS}
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                className="w-40"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] overflow-hidden shadow-xl glass-morphism">
                    <DataTable
                        columns={columns}
                        data={grievances}
                        loading={loading}
                        totalCount={totalCount}
                        currentPage={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        emptyMessage="No grievances found. High five! 🙌"
                    />
                </div>
            </div>

            {/* Resolution Modal */}
            {selectedGrievance && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[var(--color-card)] w-full max-w-lg rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[var(--color-border)] bg-gradient-to-r from-indigo-50 to-purple-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-[var(--color-foreground)]">Resolve Grievance</h3>
                                    <p className="text-xs text-[var(--color-foreground-muted)] mt-1">
                                        Case #{selectedGrievance.id} • {selectedGrievance.student_details.full_name}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedGrievance(null)}
                                    className="p-1 text-[var(--color-foreground-muted)] hover:bg-white rounded-lg transition-colors"
                                    data-testid="close-modal-btn"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-[var(--color-background-secondary)] p-4 rounded-2xl">
                                <h4 className="text-sm font-semibold mb-1">{selectedGrievance.subject}</h4>
                                <p className="text-sm text-[var(--color-foreground-muted)] italic">
                                    "{selectedGrievance.description}"
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--color-foreground)]">Resolution Note</label>
                                <textarea 
                                    className="w-full h-32 p-4 bg-[var(--color-background-secondary)] border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
                                    placeholder="Explain how this concern was addressed..."
                                    value={resolutionNote}
                                    onChange={(e) => setResolutionNote(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => handleStatusUpdate(selectedGrievance.id, 'IN_PROGRESS')}
                                    className="flex-1 py-3 px-4 bg-blue-50 text-blue-700 font-bold rounded-2xl text-sm hover:bg-blue-100 transition-all"
                                    data-testid="mark-in-progress-btn"
                                >
                                    Mark In Progress
                                </button>
                                <button 
                                    onClick={handleResolve}
                                    disabled={submittingResolution || !resolutionNote.trim()}
                                    className="flex-[2] py-3 px-4 bg-indigo-600 text-white font-bold rounded-2xl text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all"
                                    data-testid="submit-resolution-btn"
                                >
                                    {submittingResolution ? 'Processing...' : 'Resolve Concerns'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
