import {
    BookOpen,
    Download,
    Eye,
    Search,
    ChevronDown,
    AlertTriangle,
    Layers,
    BarChart2,
    X,
    TrendingUp,
    CheckCircle,
    Clock,
    Archive,
    Calendar,
    User,
} from 'lucide-react';
import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { useHODMaterials } from '../../features/faculty/hooks/studyMaterials';
import type { StudyMaterial, MaterialType, MaterialStatus } from '../../features/faculty/types/studyMaterials';
import { MATERIAL_TYPE_LABELS, MATERIAL_STATUS_LABELS } from '../../features/faculty/types/studyMaterials';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatSize(mb: number | null): string {
    if (!mb) return '—';
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(mb * 1024).toFixed(0)} KB`;
}

const TYPE_COLORS: Record<MaterialType, string> = {
    NOTES: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30',
    SLIDES: 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-[var(--color-secondary)]/30',
    REFERENCE: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/30',
    BOOK: 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/30',
    PAPER: 'bg-purple-100 text-purple-700 border-purple-200',
    TUTORIAL: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    OTHER: 'bg-[var(--color-surface-elevated)] text-[var(--color-muted)] border-[var(--color-border)]',
};

const STATUS_CONFIG: Record<MaterialStatus, { label: string; className: string; icon: React.ReactNode }> = {
    PUBLISHED: {
        label: MATERIAL_STATUS_LABELS.PUBLISHED,
        className: 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/30',
        icon: <CheckCircle size={11} />,
    },
    DRAFT: {
        label: MATERIAL_STATUS_LABELS.DRAFT,
        className: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/30',
        icon: <Clock size={11} />,
    },
    ARCHIVED: {
        label: MATERIAL_STATUS_LABELS.ARCHIVED,
        className: 'bg-[var(--color-surface-elevated)] text-[var(--color-muted)] border-[var(--color-border)]',
        icon: <Archive size={11} />,
    },
};

function StatusBadge({ status }: { status: MaterialStatus }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

function TypeBadge({ type }: { type: MaterialType }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${TYPE_COLORS[type]}`}>
            {MATERIAL_TYPE_LABELS[type]}
        </span>
    );
}

function AiIndexBadge({ status }: { status?: StudyMaterial['vectorizationStatus'] }) {
    if (!status) {
        return <span className="text-xs text-[var(--color-muted)]">-</span>;
    }

    const palette = status === 'INDEXED'
        ? 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/30'
        : status === 'FAILED'
            ? 'bg-[var(--color-error-light)] text-[var(--color-error)] border-[var(--color-error)]/30'
            : 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/30';

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${palette}`}>
            {status}
        </span>
    );
}

// ─── Stats Modal ───────────────────────────────────────────────────────────────

interface StatsModalProps {
    material: StudyMaterial;
    stats: import('../../features/faculty/types/studyMaterials').MaterialStats | null;
    loading: boolean;
    onClose: () => void;
}

function StatsModal({ material, stats, loading, onClose }: StatsModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-foreground)]">Material Statistics</h2>
                        <p className="text-sm text-[var(--color-muted)] mt-0.5">{material.title}</p>
                        {material.faculty && (
                            <p className="text-xs text-[var(--color-muted)] flex items-center gap-1 mt-0.5">
                                <User size={10} /> {material.faculty.fullName}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 bg-[var(--color-surface-elevated)] rounded animate-pulse" />
                            ))}
                        </div>
                    ) : stats ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                {[
                                    { label: 'Total Downloads', value: stats.totalDownloads, icon: <Download size={16} /> },
                                    { label: 'Unique Downloads', value: stats.uniqueDownloads, icon: <Download size={16} /> },
                                    { label: 'Total Views', value: stats.totalViews, icon: <Eye size={16} /> },
                                    { label: 'Unique Views', value: stats.uniqueViews, icon: <Eye size={16} /> },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3 text-center">
                                        <div className="text-[var(--color-primary)] mb-1 flex justify-center">{stat.icon}</div>
                                        <div className="text-xl font-bold text-[var(--color-foreground)]">{stat.value}</div>
                                        <div className="text-xs text-[var(--color-muted)] mt-0.5">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            <h3 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">Recent Downloads</h3>
                            {stats.recentDownloads.length === 0 ? (
                                <p className="text-sm text-[var(--color-muted)] text-center py-4">No downloads yet.</p>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
                                            <tr>
                                                {['Student', 'Roll No.', 'Downloaded At', 'IP Address'].map((h) => (
                                                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--color-border)]">
                                            {stats.recentDownloads.map((rec) => (
                                                <tr key={rec.id} className="hover:bg-[var(--color-surface-elevated)] transition-colors">
                                                    <td className="px-4 py-2.5 font-medium text-[var(--color-foreground)]">{rec.studentName}</td>
                                                    <td className="px-4 py-2.5 text-[var(--color-muted)] font-mono text-xs">{rec.studentRollNumber}</td>
                                                    <td className="px-4 py-2.5 text-[var(--color-muted)]">{formatDate(rec.downloadedAt)}</td>
                                                    <td className="px-4 py-2.5 text-[var(--color-muted)] font-mono text-xs">{rec.ipAddress}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-[var(--color-error)] text-center py-4">Failed to load statistics.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HODStudyMaterials() {
    const {
        materials,
        loading,
        error,
        refresh,
        filters,
        applyFilter,
        searchQuery,
        setSearchQuery,
        summaryStats,
        uniqueSubjects,
        uniqueSections,
        selectedMaterial,
        stats,
        statsLoading,
        showStatsModal,
        setShowStatsModal,
        openStatsModal,
    } = useHODMaterials();

    return (
        <PageLayout>
            {/* Summary bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Materials', value: summaryStats.total, icon: <BookOpen size={20} />, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10' },
                    { label: 'Published', value: summaryStats.published, icon: <CheckCircle size={20} />, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success-light)]' },
                    { label: 'Uploaded This Month', value: summaryStats.thisMonth, icon: <Calendar size={20} />, color: 'text-[var(--color-secondary)]', bg: 'bg-[var(--color-secondary)]/10' },
                    { label: 'Most Downloads', value: summaryStats.mostDownloaded, icon: <TrendingUp size={20} />, color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning-light)]' },
                ].map((card) => (
                    <div key={card.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 shadow-theme-md animate-scale-in">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">{card.label}</p>
                                <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                            </div>
                            <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-md mb-4">
                <div className="flex flex-wrap items-center gap-3 p-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-48">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                        <input
                            className="input text-sm pl-8 pr-3 py-1.5 w-full"
                            placeholder="Search by title, subject or faculty…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Subject */}
                    <div className="relative">
                        <select
                            className="input text-sm pl-3 pr-8 py-1.5 appearance-none min-w-36"
                            value={filters.subjectId ?? ''}
                            onChange={(e) => applyFilter('subjectId', e.target.value ? Number(e.target.value) : undefined)}
                        >
                            <option value="">All Subjects</option>
                            {uniqueSubjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.code}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                    </div>
                    {/* Section */}
                    <div className="relative">
                        <select
                            className="input text-sm pl-3 pr-8 py-1.5 appearance-none min-w-32"
                            value={filters.sectionId ?? ''}
                            onChange={(e) => applyFilter('sectionId', e.target.value ? Number(e.target.value) : undefined)}
                        >
                            <option value="">All Sections</option>
                            {uniqueSections.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                    </div>
                    {/* Type */}
                    <div className="relative">
                        <select
                            className="input text-sm pl-3 pr-8 py-1.5 appearance-none min-w-36"
                            value={filters.materialType ?? ''}
                            onChange={(e) => applyFilter('materialType', e.target.value || undefined)}
                        >
                            <option value="">All Types</option>
                            {(Object.keys(MATERIAL_TYPE_LABELS) as MaterialType[]).map((t) => (
                                <option key={t} value={t}>{MATERIAL_TYPE_LABELS[t]}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                    </div>
                    {/* Status */}
                    <div className="relative">
                        <select
                            className="input text-sm pl-3 pr-8 py-1.5 appearance-none min-w-32"
                            value={filters.status ?? ''}
                            onChange={(e) => applyFilter('status', e.target.value || undefined)}
                        >
                            <option value="">All Statuses</option>
                            {(['PUBLISHED', 'DRAFT', 'ARCHIVED'] as MaterialStatus[]).map((s) => (
                                <option key={s} value={s}>{MATERIAL_STATUS_LABELS[s]}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table / States */}
            {loading ? (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-md overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border)] last:border-0">
                            <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse w-56" />
                            <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse w-32" />
                            <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse w-24" />
                            <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse w-20 ml-auto" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-[var(--color-error-light)] border border-[var(--color-error)]/30 rounded-xl p-6 text-center">
                    <AlertTriangle size={24} className="mx-auto text-[var(--color-error)] mb-2" />
                    <p className="text-sm text-[var(--color-error)] font-medium">{error}</p>
                    <button onClick={refresh} className="btn btn-outline btn-md mt-3">Try Again</button>
                </div>
            ) : materials.length === 0 ? (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-12 text-center shadow-theme-md">
                    <Layers size={40} className="mx-auto text-[var(--color-muted)] mb-3 opacity-40" />
                    <p className="text-lg font-semibold text-[var(--color-foreground)] mb-1">No materials found</p>
                    <p className="text-sm text-[var(--color-muted)]">
                        {Object.values(filters).some(Boolean) || searchQuery
                            ? 'Try adjusting your filters.'
                            : 'No study materials have been uploaded in this department yet.'}
                    </p>
                </div>
            ) : (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-md overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                            {materials.length} material{materials.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
                                <tr>
                                    {['Title', 'Faculty', 'Subject & Section', 'Type', 'Status', 'AI Index', 'Size', 'Downloads / Views', 'Uploaded', 'Stats'].map((h) => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {materials.map((mat) => (
                                    <tr key={mat.id} className="hover:bg-[var(--color-surface-elevated)] transition-colors group">
                                        <td className="px-4 py-3 max-w-xs">
                                            <p className="font-medium text-[var(--color-foreground)] truncate">{mat.title}</p>
                                            {mat.description && (
                                                <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">{mat.description}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <p className="text-sm text-[var(--color-foreground)]">{mat.faculty?.fullName ?? '—'}</p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <p className="font-medium text-[var(--color-foreground)]">{mat.subject.code}</p>
                                            <p className="text-xs text-[var(--color-muted)]">{mat.section.name}</p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <TypeBadge type={mat.materialType} />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <StatusBadge status={mat.status} />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <AiIndexBadge status={mat.vectorizationStatus} />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--color-muted)] font-mono">
                                            {formatSize(mat.fileSizeMb)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                                                <span className="flex items-center gap-1"><Download size={11} /> {mat.downloadCount}</span>
                                                <span className="flex items-center gap-1"><Eye size={11} /> {mat.viewCount}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--color-muted)]">
                                            {formatDate(mat.uploadedAt)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <button
                                                onClick={() => void openStatsModal(mat)}
                                                className="p-1.5 rounded text-[var(--color-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-colors opacity-0 group-hover:opacity-100"
                                                title="View Statistics"
                                            >
                                                <BarChart2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stats Modal */}
            {showStatsModal && selectedMaterial && (
                <StatsModal
                    material={selectedMaterial}
                    stats={stats}
                    loading={statsLoading}
                    onClose={() => setShowStatsModal(false)}
                />
            )}
        </PageLayout>
    );
}
