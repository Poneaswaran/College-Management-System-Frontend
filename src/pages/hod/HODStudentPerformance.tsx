import { useCallback, useEffect, useState } from 'react';
import { 
    Search, 
    TrendingUp, 
    Users, 
    AlertCircle, 
    Award,
    ChevronRight,
    Filter,
    Download
} from 'lucide-react';

import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { 
    fetchHODStudentPerformance, 
    type HODStudentPerformanceItem 
} from '../../services/hodStudent.service';

const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-[var(--color-success)]';
    if (percentage >= 75) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-error)]';
};

const getGPAColor = (gpa: number) => {
    if (gpa >= 8.5) return 'text-[var(--color-primary)]';
    if (gpa >= 7.0) return 'text-[var(--color-success)]';
    if (gpa >= 5.0) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-error)]';
};

const performanceColumns: Column<HODStudentPerformanceItem>[] = [
    {
        key: 'name',
        header: 'Student',
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-medium text-[var(--color-foreground)]">{row.name}</span>
                <span className="text-xs text-[var(--color-foreground-muted)]">{row.register_number}</span>
            </div>
        ),
    },
    {
        key: 'course',
        header: 'Course / Year',
        render: (row) => (
            <div className="flex flex-col">
                <span className="text-sm font-medium">{row.course}</span>
                <span className="text-xs text-[var(--color-foreground-muted)]">Year {row.year} • Sec {row.section}</span>
            </div>
        ),
    },
    {
        key: 'attendance_percentage',
        header: 'Attendance',
        render: (row) => {
            const pct = row.attendance_percentage;
            return (
                <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden hidden md:block">
                        <div
                            className={`h-full ${pct >= 75 ? 'bg-[var(--color-success)]' : 'bg-[var(--color-error)]'}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className={`text-sm font-bold ${getAttendanceColor(pct)}`}>
                        {pct}%
                    </span>
                </div>
            );
        },
    },
    {
        key: 'cgpa',
        header: 'CGPA',
        align: 'center',
        render: (row) => (
            <div className="flex flex-col items-center">
                <span className={`text-base font-bold ${getGPAColor(row.cgpa)}`}>
                    {row.cgpa.toFixed(2)}
                </span>
            </div>
        ),
    },
    {
        key: 'last_semester_gpa',
        header: 'Last SGPA',
        align: 'center',
        render: (row) => (
            <span className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                {row.last_semester_gpa.toFixed(2)}
            </span>
        ),
    },
    {
        key: 'arrears_count',
        header: 'Arrears',
        align: 'center',
        render: (row) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                row.arrears_count > 0 
                ? 'bg-[var(--color-error-light)] text-[var(--color-error)] border border-[var(--color-error)]' 
                : 'bg-[var(--color-success-light)] text-[var(--color-success)]'
            }`}>
                {row.arrears_count}
            </span>
        ),
    },
    {
        key: 'id',
        header: '',
        align: 'right',
        render: () => (
            <button className="p-1.5 text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-lg transition-colors flex items-center gap-1 text-xs font-medium">
                Report <ChevronRight size={14} />
            </button>
        ),
    },
];

export default function HODStudentPerformance() {
    const [performanceData, setPerformanceData] = useState<HODStudentPerformanceItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadPerformance = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchHODStudentPerformance({});
            setPerformanceData(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load performance data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPerformance();
    }, [loadPerformance]);

    const filteredData = performanceData.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.register_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        avgCGPA: performanceData.length ? (performanceData.reduce((acc, s) => acc + s.cgpa, 0) / performanceData.length).toFixed(2) : '0.00',
        avgAttendance: performanceData.length ? (performanceData.reduce((acc, s) => acc + s.attendance_percentage, 0) / performanceData.length).toFixed(1) : '0.0',
        totalArrears: performanceData.reduce((acc, s) => acc + s.arrears_count, 0),
        topPerformers: performanceData.filter(s => s.cgpa >= 8.5).length
    };

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Header 
                        title="Student Performance" 
                        titleIcon={<Award size={28} className="text-[var(--color-primary)]" />} 
                    />
                    <div className="flex items-center gap-3">
                        <button 
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] transition-all shadow-sm"
                            data-testid="download-pdf-btn"
                        >
                            <Download size={16} />
                            Download PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<TrendingUp className="text-[var(--color-primary)]" />}
                        label="Dept. Avg CGPA"
                        value={stats.avgCGPA}
                        trend="Overall"
                    />
                    <StatCard 
                        icon={<Users className="text-[var(--color-success)]" />}
                        label="Avg. Attendance"
                        value={`${stats.avgAttendance}%`}
                        trend="Current Sem"
                    />
                    <StatCard 
                        icon={<AlertCircle className="text-[var(--color-error)]" />}
                        label="Total Arrears"
                        value={stats.totalArrears.toString()}
                        trend="Active"
                    />
                    <StatCard 
                        icon={<Award className="text-[var(--color-warning)]" />}
                        label="Elite Students"
                        value={stats.topPerformers.toString()}
                        trend="CGPA > 8.5"
                    />
                </div>

                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" size={18} />
                            <input 
                                type="text"
                                placeholder="Search students by name or register number..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                data-testid="performance-search-input"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-all">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)] flex items-center gap-3">
                            <AlertCircle size={20} />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
                        <DataTable
                            columns={performanceColumns}
                            data={filteredData}
                            loading={loading}
                            emptyMessage="No student performance records found."
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[var(--color-background-secondary)] rounded-lg group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-foreground-muted)] bg-[var(--color-background-secondary)] px-2 py-1 rounded-md">
                    {trend}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-[var(--color-foreground)]">{value}</span>
                <span className="text-xs text-[var(--color-foreground-muted)] font-medium mt-0.5">{label}</span>
            </div>
        </div>
    );
}
