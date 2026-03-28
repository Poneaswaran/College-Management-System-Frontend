import {
    Bot,
    BookOpen,
    Download,
    Eye,
    Search,
    ChevronDown,
    FileText,
    Presentation,
    Book,
    Newspaper,
    LifeBuoy,
    MoreHorizontal,
    X,
    AlertTriangle,
    Layers,
    User,
    Calendar,
    Send,
} from 'lucide-react';
import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { useStudentMaterials } from '../../features/faculty/hooks/studyMaterials';
import type { StudyMaterial, MaterialType } from '../../features/faculty/types/studyMaterials';
import { MATERIAL_TYPE_LABELS } from '../../features/faculty/types/studyMaterials';
import { useToast } from '../../components/ui/Toast';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatSize(mb: number | null): string {
    if (!mb) return '—';
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(mb * 1024).toFixed(0)} KB`;
}

const TYPE_ICONS: Record<MaterialType, React.ReactNode> = {
    NOTES: <FileText size={20} />,
    SLIDES: <Presentation size={20} />,
    REFERENCE: <Book size={20} />,
    BOOK: <BookOpen size={20} />,
    PAPER: <Newspaper size={20} />,
    TUTORIAL: <LifeBuoy size={20} />,
    OTHER: <MoreHorizontal size={20} />,
};

const TYPE_COLORS: Record<MaterialType, { bg: string; text: string; border: string }> = {
    NOTES: { bg: 'bg-[var(--color-primary)]/10', text: 'text-[var(--color-primary)]', border: 'border-[var(--color-primary)]/30' },
    SLIDES: { bg: 'bg-[var(--color-secondary)]/10', text: 'text-[var(--color-secondary)]', border: 'border-[var(--color-secondary)]/30' },
    REFERENCE: { bg: 'bg-[var(--color-warning-light)]', text: 'text-[var(--color-warning)]', border: 'border-[var(--color-warning)]/30' },
    BOOK: { bg: 'bg-[var(--color-success-light)]', text: 'text-[var(--color-success)]', border: 'border-[var(--color-success)]/30' },
    PAPER: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    TUTORIAL: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    OTHER: { bg: 'bg-[var(--color-surface-elevated)]', text: 'text-[var(--color-muted)]', border: 'border-[var(--color-border)]' },
};

// Extension → icon color map for the ext badge
function ExtBadge({ ext }: { ext: string }) {
    const clean = ext.replace('.', '').toUpperCase();
    const isVideo = ['MP4', 'AVI', 'MKV', 'WEBM'].includes(clean);
    const isDoc = ['PDF', 'DOC', 'DOCX'].includes(clean);
    const isSlide = ['PPT', 'PPTX'].includes(clean);
    const color = isVideo
        ? 'bg-rose-100 text-rose-700'
        : isDoc
            ? 'bg-blue-100 text-blue-700'
            : isSlide
                ? 'bg-orange-100 text-orange-700'
                : 'bg-[var(--color-surface-elevated)] text-[var(--color-muted)]';
    return <span className={`px-1.5 py-0.5 rounded text-xs font-bold font-mono ${color}`}>{clean}</span>;
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
    material: StudyMaterial;
    onClose: () => void;
    onDownload: (m: StudyMaterial) => void;
    onAskAi: (m: StudyMaterial, message: string) => Promise<{ answer: string; sources: string[] }>;
}

function DetailPanel({ material, onClose, onDownload, onAskAi }: DetailPanelProps) {
    const tc = TYPE_COLORS[material.materialType];
    const [question, setQuestion] = React.useState('');
    const [asking, setAsking] = React.useState(false);
    const [answer, setAnswer] = React.useState<string | null>(null);
    const [sources, setSources] = React.useState<string[]>([]);
    const [aiError, setAiError] = React.useState<string | null>(null);

    const aiStatus = material.vectorizationStatus;
    const isAiReady = !aiStatus || aiStatus === 'INDEXED';
    const aiUnavailableMessage = aiStatus === 'PROCESSING'
        ? 'Document is being indexed. Try again shortly.'
        : aiStatus === 'FAILED'
            ? (material.vectorErrorMessage || 'Document indexing failed. Please contact faculty for a refreshed upload.')
            : aiStatus === 'PENDING'
                ? 'Document is queued for indexing. Try again shortly.'
                : null;

    const handleAskAi = async () => {
        const trimmed = question.trim();
        if (!trimmed || !isAiReady) {
            return;
        }

        setAsking(true);
        setAiError(null);

        try {
            const result = await onAskAi(material, trimmed);
            setAnswer(result.answer);
            setSources(result.sources);
        } catch (error) {
            setAiError(error instanceof Error ? error.message : 'Unable to fetch AI response.');
        } finally {
            setAsking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="flex items-start justify-between p-5 border-b border-[var(--color-border)]">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${tc.bg} ${tc.text} border ${tc.border}`}>
                            {TYPE_ICONS[material.materialType]}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-[var(--color-foreground)] leading-tight">{material.title}</h2>
                            <p className="text-sm text-[var(--color-muted)] mt-0.5">
                                {material.subject.code} · {material.section.name}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mt-1">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5 space-y-5">
                    {material.description && (
                        <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{material.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3">
                            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">Subject</p>
                            <p className="font-semibold text-[var(--color-foreground)]">{material.subject.name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{material.subject.code}</p>
                        </div>
                        <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3">
                            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">Faculty</p>
                            <p className="font-semibold text-[var(--color-foreground)]">{material.faculty?.fullName ?? '—'}</p>
                        </div>
                        <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3">
                            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">File</p>
                            <div className="flex items-center gap-1.5">
                                <ExtBadge ext={material.fileExtension} />
                                <span className="text-[var(--color-muted)] text-xs">{formatSize(material.fileSizeMb)}</span>
                            </div>
                        </div>
                        <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg p-3">
                            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">Uploaded</p>
                            <p className="font-semibold text-[var(--color-foreground)]">{formatDate(material.uploadedAt)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
                        <span className="flex items-center gap-1"><Eye size={12} /> {material.viewCount} views</span>
                        <span className="flex items-center gap-1"><Download size={12} /> {material.downloadCount} downloads</span>
                        {material.vectorizationStatus && (
                            <span className="px-2 py-0.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-muted)] font-semibold">
                                AI: {material.vectorizationStatus}
                            </span>
                        )}
                    </div>

                    <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-elevated)] space-y-3">
                        <div className="flex items-center gap-2">
                            <Bot size={16} className="text-[var(--color-primary)]" />
                            <h3 className="text-sm font-semibold text-[var(--color-foreground)]">AI Tutor</h3>
                        </div>
                        {aiUnavailableMessage && (
                            <p className="text-xs text-[var(--color-warning)]">{aiUnavailableMessage}</p>
                        )}
                        <div className="flex items-start gap-2">
                            <textarea
                                className="input w-full min-h-20 resize-none"
                                placeholder="Ask a question about this material"
                                value={question}
                                onChange={(event) => setQuestion(event.target.value)}
                                disabled={!isAiReady || asking}
                            />
                            <button
                                onClick={() => void handleAskAi()}
                                disabled={!isAiReady || asking || !question.trim()}
                                className="btn btn-primary btn-md h-10 px-3 flex items-center justify-center"
                                title="Ask AI Tutor"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                        {asking && <p className="text-xs text-[var(--color-muted)]">Generating answer...</p>}
                        {aiError && <p className="text-xs text-[var(--color-error)]">{aiError}</p>}
                        {answer && (
                            <div className="space-y-2">
                                <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider font-semibold">Answer</p>
                                <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{answer}</p>
                                {sources.length > 0 && (
                                    <div>
                                        <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider font-semibold mb-1">Sources</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {sources.map((source, index) => (
                                                <span
                                                    key={`${index}-${String(source)}`}
                                                    className="px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-medium"
                                                >
                                                    {String(source)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="btn btn-outline btn-md flex-1">Close</button>
                        <button
                            onClick={() => { onDownload(material); onClose(); }}
                            className="btn btn-primary btn-md flex-1 flex items-center justify-center gap-2"
                        >
                            <Download size={15} /> Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Material Card ─────────────────────────────────────────────────────────────

interface MaterialCardProps {
    material: StudyMaterial;
    onView: (m: StudyMaterial) => void;
    onDownload: (m: StudyMaterial) => void;
}

function MaterialCard({ material, onView, onDownload }: MaterialCardProps) {
    const tc = TYPE_COLORS[material.materialType];
    return (
        <div
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-md hover:shadow-theme-xl hover:border-[var(--color-primary)]/40 transition-all cursor-pointer group animate-slide-up"
            onClick={() => onView(material)}
        >
            {/* Header */}
            <div className={`p-4 border-b border-[var(--color-border)] flex items-center gap-3`}>
                <div className={`p-2.5 rounded-lg ${tc.bg} ${tc.text} border ${tc.border}`}>
                    {TYPE_ICONS[material.materialType]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${tc.text}`}>{MATERIAL_TYPE_LABELS[material.materialType]}</p>
                    <p className="font-semibold text-[var(--color-foreground)] text-sm leading-snug mt-0.5 truncate">{material.title}</p>
                </div>
            </div>
            {/* Body */}
            <div className="p-4 space-y-3">
                {material.description && (
                    <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">{material.description}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                    <BookOpen size={11} />
                    <span className="font-medium text-[var(--color-foreground)]">{material.subject.code}</span>
                    <span>·</span>
                    <span>{material.section.name}</span>
                </div>
                {material.faculty && (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                        <User size={11} />
                        <span>{material.faculty.fullName}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <ExtBadge ext={material.fileExtension} />
                        <span className="text-xs text-[var(--color-muted)]">{formatSize(material.fileSizeMb)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                        <Calendar size={10} />
                        {formatDate(material.publishedAt ?? material.uploadedAt)}
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye size={10} /> {material.viewCount}</span>
                        <span className="flex items-center gap-1"><Download size={10} /> {material.downloadCount}</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDownload(material); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Download size={11} /> Download
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentMaterials() {
    const { addToast } = useToast();
    const {
        materials,
        loading,
        error,
        refresh,
        subjectFilter,
        setSubjectFilter,
        typeFilter,
        setTypeFilter,
        searchQuery,
        setSearchQuery,
        selectedMaterial,
        setSelectedMaterial,
        uniqueSubjects,
        handleViewMaterial,
        handleDownload,
        askMaterialQuestion,
    } = useStudentMaterials();

    const handleAskAi = async (material: StudyMaterial, message: string) => {
        try {
            return await askMaterialQuestion(material.id, message);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'AI tutor is currently unavailable.';
            addToast({ type: 'error', title: 'AI Tutor Error', message: errorMessage });
            throw error;
        }
    };

    return (
        <PageLayout>
            {/* Filters */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-md mb-6">
                <div className="flex flex-wrap items-center gap-3 p-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-52">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                        <input
                            className="input text-sm pl-8 pr-3 py-1.5 w-full"
                            placeholder="Search by title, subject or faculty…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Subject filter */}
                    <div className="relative">
                        <select
                            className="input text-sm pl-3 pr-8 py-1.5 appearance-none min-w-36"
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                        >
                            <option value="">All Subjects</option>
                            {uniqueSubjects.map((s) => (
                                <option key={s.id} value={String(s.id)}>{s.code}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                    </div>
                    {/* Type filter */}
                    <div className="relative">
                        <select
                            className="input text-sm pl-3 pr-8 py-1.5 appearance-none min-w-36"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">All Types</option>
                            {(Object.keys(MATERIAL_TYPE_LABELS) as MaterialType[]).map((t) => (
                                <option key={t} value={t}>{MATERIAL_TYPE_LABELS[t]}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* States */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 space-y-3 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)]" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3 bg-[var(--color-surface-elevated)] rounded w-16" />
                                    <div className="h-4 bg-[var(--color-surface-elevated)] rounded w-full" />
                                </div>
                            </div>
                            <div className="h-3 bg-[var(--color-surface-elevated)] rounded w-3/4" />
                            <div className="h-3 bg-[var(--color-surface-elevated)] rounded w-1/2" />
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
                    <p className="text-lg font-semibold text-[var(--color-foreground)] mb-1">No materials available</p>
                    <p className="text-sm text-[var(--color-muted)]">
                        {searchQuery || subjectFilter || typeFilter
                            ? 'No materials match your filters. Try adjusting them.'
                            : 'Your faculty has not uploaded any study materials yet.'}
                    </p>
                </div>
            ) : (
                <>
                    <p className="text-xs text-[var(--color-muted)] mb-3 uppercase tracking-wider font-semibold">
                        {materials.length} material{materials.length !== 1 ? 's' : ''} available
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {materials.map((mat) => (
                            <MaterialCard
                                key={mat.id}
                                material={mat}
                                onView={(m) => void handleViewMaterial(m)}
                                onDownload={(m) => void handleDownload(m)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Detail Panel */}
            {selectedMaterial && (
                <DetailPanel
                    material={selectedMaterial}
                    onClose={() => setSelectedMaterial(null)}
                    onDownload={(m) => void handleDownload(m)}
                    onAskAi={(m, message) => handleAskAi(m, message)}
                />
            )}
        </PageLayout>
    );
}
