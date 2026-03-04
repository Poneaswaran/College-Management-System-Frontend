import { useState, useRef } from 'react';
import React from 'react';
import {
    Upload,
    FileText,
    Eye,
    Download,
    Pencil,
    Trash2,
    BarChart2,
    Plus,
    X,
    Search,
    ChevronDown,
    AlertTriangle,
    CheckCircle,
    Clock,
    Archive,
    BookOpen,
    Layers,
    TrendingUp,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { useFacultyMaterials } from '../../features/faculty/hooks/studyMaterials';
import type { UploadMaterialInput, UpdateMaterialInput, StudyMaterial, MaterialType, MaterialStatus } from '../../features/faculty/types/studyMaterials';
import { MATERIAL_TYPE_LABELS, MATERIAL_STATUS_LABELS, ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB } from '../../features/faculty/types/studyMaterials';
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
        label: 'Published',
        className: 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/30',
        icon: <CheckCircle size={11} />,
    },
    DRAFT: {
        label: 'Draft',
        className: 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]/30',
        icon: <Clock size={11} />,
    },
    ARCHIVED: {
        label: 'Archived',
        className: 'bg-[var(--color-surface-elevated)] text-[var(--color-muted)] border-[var(--color-border)]',
        icon: <Archive size={11} />,
    },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MaterialStatus }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
            {cfg.icon}
            {cfg.label}
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

// ─── File Drop Zone ───────────────────────────────────────────────────────────

interface FileZoneProps {
    file: File | null;
    onFile: (f: File | null) => void;
    required?: boolean;
}

function FileDropZone({ file, onFile, required }: FileZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

    const validate = (f: File): string | null => {
        const ext = '.' + f.name.split('.').pop()?.toLowerCase();
        if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) return `File type ${ext} is not allowed.`;
        if (f.size / 1024 / 1024 > MAX_FILE_SIZE_MB) return `File size must be under ${MAX_FILE_SIZE_MB} MB.`;
        return null;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (!f) return;
        const err = validate(f);
        setFileError(err);
        if (!err) onFile(f);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const err = validate(f);
        setFileError(err);
        if (!err) onFile(f);
    };

    return (
        <div>
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${dragOver
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 bg-[var(--color-surface-elevated)]'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={ALLOWED_EXTENSIONS.join(',')}
                    onChange={handleChange}
                />
                {file ? (
                    <div className="flex items-center justify-center gap-3">
                        <FileText size={20} className="text-[var(--color-primary)]" />
                        <div className="text-left">
                            <p className="text-sm font-semibold text-[var(--color-foreground)]">{file.name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{formatSize(file.size / 1024 / 1024)}</p>
                        </div>
                        <button
                            type="button"
                            className="ml-2 text-[var(--color-muted)] hover:text-[var(--color-error)]"
                            onClick={(e) => { e.stopPropagation(); onFile(null); setFileError(null); }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload size={24} className="mx-auto mb-2 text-[var(--color-muted)]" />
                        <p className="text-sm text-[var(--color-foreground)] font-medium">
                            Drag & drop or <span className="text-[var(--color-primary)]">browse</span>
                        </p>
                        <p className="text-xs text-[var(--color-muted)] mt-1">
                            PDF, DOCX, PPTX, XLSX, ZIP, images, video · max {MAX_FILE_SIZE_MB} MB
                        </p>
                    </>
                )}
            </div>
            {fileError && (
                <p className="mt-1 text-xs text-[var(--color-error)] flex items-center gap-1">
                    <AlertTriangle size={11} /> {fileError}
                </p>
            )}
            {required && !file && !fileError && (
                <p className="mt-1 text-xs text-[var(--color-muted)]">A file is required.</p>
            )}
        </div>
    );
}

// ─── Upload / Edit Modal ───────────────────────────────────────────────────────

interface MaterialModalProps {
    mode: 'upload' | 'edit';
    material?: StudyMaterial | null;
    assignments: Array<{ subjectId: number; subjectName: string; subjectCode: string; sectionId: number; sectionName: string }>;
    onSubmit: (input: UploadMaterialInput | UpdateMaterialInput) => Promise<boolean>;
    onClose: () => void;
}

function MaterialModal({ mode, material, assignments, onSubmit, onClose }: MaterialModalProps) {
    const [title, setTitle] = useState(material?.title ?? '');
    const [description, setDescription] = useState(material?.description ?? '');
    const [materialType, setMaterialType] = useState<MaterialType>(material?.materialType ?? 'NOTES');
    const [status, setStatus] = useState<MaterialStatus>(material?.status ?? 'DRAFT');
    const [selectedSubjectId, setSelectedSubjectId] = useState<number>(material?.subject.id ?? (assignments[0]?.subjectId ?? 0));
    const [selectedSectionId, setSelectedSectionId] = useState<number>(material?.section.id ?? (assignments[0]?.sectionId ?? 0));
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const uniqueSubjects = assignments.filter(
        (a, i, arr) => arr.findIndex((x) => x.subjectId === a.subjectId) === i,
    );
    const sectionsForSubject = assignments.filter((a) => a.subjectId === selectedSubjectId);

    const handleSubjectChange = (subjectId: number) => {
        setSelectedSubjectId(subjectId);
        const firstSection = assignments.find((a) => a.subjectId === subjectId);
        if (firstSection) setSelectedSectionId(firstSection.sectionId);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        if (mode === 'upload' && !file) return;

        setSubmitting(true);
        let success: boolean;
        if (mode === 'upload') {
            const reader = new FileReader();
            const fileData = await new Promise<string>((resolve) => {
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file!);
            });
            success = await onSubmit({
                subjectId: selectedSubjectId,
                sectionId: selectedSectionId,
                title: title.trim(),
                description: description.trim(),
                materialType: materialType,
                fileData: fileData,
                fileName: file!.name,
                status,
            } as UploadMaterialInput);
        } else {
            const input: UpdateMaterialInput = {
                id: material!.id,
                title: title.trim(),
                description: description.trim(),
                materialType: materialType,
                status,
            };
            if (file) {
                const reader = new FileReader();
                const fileData = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
                input.fileData = fileData;
                input.fileName = file.name;
            }
            success = await onSubmit(input);
        }
        if (!success) setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                        {mode === 'upload' ? 'Upload New Material' : 'Edit Material'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={(e) => { void handleSubmit(e); }} className="p-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                            Title <span className="text-[var(--color-error)]">*</span>
                        </label>
                        <input
                            className="input w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Unit 3 – Sorting Algorithms"
                            required
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">Description</label>
                        <textarea
                            className="input w-full resize-none"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the material…"
                        />
                    </div>
                    {/* Subject + Section (upload only) */}
                    {mode === 'upload' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                                    Subject <span className="text-[var(--color-error)]">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="input w-full appearance-none pr-8"
                                        value={selectedSubjectId}
                                        onChange={(e) => handleSubjectChange(Number(e.target.value))}
                                    >
                                        {uniqueSubjects.map((a) => (
                                            <option key={a.subjectId} value={a.subjectId}>
                                                {a.subjectCode}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                                    Section <span className="text-[var(--color-error)]">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="input w-full appearance-none pr-8"
                                        value={selectedSectionId}
                                        onChange={(e) => setSelectedSectionId(Number(e.target.value))}
                                    >
                                        {sectionsForSubject.map((a) => (
                                            <option key={a.sectionId} value={a.sectionId}>
                                                {a.sectionName}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Type + Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">Type</label>
                            <div className="relative">
                                <select
                                    className="input w-full appearance-none pr-8"
                                    value={materialType}
                                    onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                                >
                                    {(Object.keys(MATERIAL_TYPE_LABELS) as MaterialType[]).map((t) => (
                                        <option key={t} value={t}>{MATERIAL_TYPE_LABELS[t]}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">Status</label>
                            <div className="flex gap-2 mt-1">
                                {(['DRAFT', 'PUBLISHED'] as MaterialStatus[]).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setStatus(s)}
                                        className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-all ${status === s
                                                ? s === 'PUBLISHED'
                                                    ? 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]'
                                                    : 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border-[var(--color-warning)]'
                                                : 'bg-transparent text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                                            }`}
                                    >
                                        {MATERIAL_STATUS_LABELS[s]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* File */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                            {mode === 'upload' ? 'File' : 'Replace File'} {mode === 'upload' && <span className="text-[var(--color-error)]">*</span>}
                        </label>
                        <FileDropZone file={file} onFile={setFile} required={mode === 'upload'} />
                    </div>
                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn btn-outline btn-md">Cancel</button>
                        <button
                            type="submit"
                            disabled={submitting || (mode === 'upload' && !file) || !title.trim()}
                            className="btn btn-primary btn-md"
                        >
                            {submitting ? 'Saving…' : mode === 'upload' ? 'Upload' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
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

// ─── Delete Confirm Row ───────────────────────────────────────────────────────

interface DeleteConfirmProps {
    onConfirm: () => void;
    onCancel: () => void;
}

function DeleteConfirmBar({ onConfirm, onCancel }: DeleteConfirmProps) {
    return (
        <td colSpan={8} className="px-4 py-3 bg-[var(--color-error-light)] border-t border-b border-[var(--color-error)]/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[var(--color-error)] font-medium">
                    <AlertTriangle size={14} />
                    This action is permanent. Are you sure you want to delete this material?
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onCancel} className="btn btn-outline btn-md text-xs px-3 py-1.5">Cancel</button>
                    <button onClick={onConfirm} className="text-xs px-3 py-1.5 rounded font-semibold bg-[var(--color-error)] text-white hover:opacity-90 transition-opacity">
                        Yes, Delete
                    </button>
                </div>
            </div>
        </td>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudyMaterials() {
    const { addToast } = useToast();
    const {
        materials,
        allMaterials,
        assignments,
        loading,
        error,
        refresh,
        showUploadModal,
        showEditModal,
        showStatsModal,
        selectedMaterial,
        stats,
        statsLoading,
        deleteConfirmId,
        setShowUploadModal,
        setDeleteConfirmId,
        closeModals,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        searchQuery,
        setSearchQuery,
        handleUpload,
        handleUpdate,
        handleDelete,
        openStatsModal,
        openEditModal,
    } = useFacultyMaterials();

    const onUpload = async (input: UploadMaterialInput | UpdateMaterialInput) => {
        const ok = await handleUpload(input as UploadMaterialInput);
        if (ok) addToast({ title: 'Success', message: 'Material uploaded successfully.', type: 'success' });
        else addToast({ title: 'Error', message: 'Upload failed. Please try again.', type: 'error' });
        return ok;
    };

    const onUpdate = async (input: UploadMaterialInput | UpdateMaterialInput) => {
        const ok = await handleUpdate(input as UpdateMaterialInput);
        if (ok) addToast({ title: 'Success', message: 'Material updated.', type: 'success' });
        else addToast({ title: 'Error', message: 'Update failed. Please try again.', type: 'error' });
        return ok;
    };

    const onDelete = async (id: number) => {
        const ok = await handleDelete(id);
        if (ok) addToast({ title: 'Success', message: 'Material deleted.', type: 'success' });
        else addToast({ title: 'Error', message: 'Delete failed. Please try again.', type: 'error' });
    };

    // Summary stats
    const totalDownloads = allMaterials.reduce((s, m) => s + m.downloadCount, 0);
    const totalViews = allMaterials.reduce((s, m) => s + m.viewCount, 0);

    const STATUS_TABS: Array<{ key: string; label: string }> = [
        { key: '', label: 'All' },
        { key: 'PUBLISHED', label: 'Published' },
        { key: 'DRAFT', label: 'Draft' },
        { key: 'ARCHIVED', label: 'Archived' },
    ];

    return (
        <PageLayout>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Uploaded', value: allMaterials.length, icon: <BookOpen size={20} />, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10' },
                    { label: 'Published', value: allMaterials.filter((m) => m.status === 'PUBLISHED').length, icon: <CheckCircle size={20} />, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success-light)]' },
                    { label: 'Total Downloads', value: totalDownloads, icon: <Download size={20} />, color: 'text-[var(--color-secondary)]', bg: 'bg-[var(--color-secondary)]/10' },
                    { label: 'Total Views', value: totalViews, icon: <TrendingUp size={20} />, color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning-light)]' },
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

            {/* Toolbar */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-md mb-4">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                    {/* Status tabs */}
                    <div className="flex items-center gap-1 bg-[var(--color-surface-elevated)] rounded-lg p-1">
                        {STATUS_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === tab.key
                                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                        : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Type filter */}
                        <div className="relative">
                            <select
                                className="input text-sm pl-3 pr-8 py-1.5 appearance-none"
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
                        {/* Search */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                            <input
                                className="input text-sm pl-8 pr-3 py-1.5 w-52"
                                placeholder="Search materials…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Upload button */}
                        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary btn-md flex items-center gap-2">
                            <Plus size={15} /> Upload
                        </button>
                    </div>
                </div>
            </div>

            {/* Table / States */}
            {loading ? (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-md overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border)] last:border-0">
                            <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse w-64" />
                            <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse w-40" />
                            <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse w-20" />
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
                    <p className="text-sm text-[var(--color-muted)] mb-4">
                        {searchQuery || statusFilter || typeFilter ? 'Try adjusting your filters.' : 'Upload your first study material to get started.'}
                    </p>
                    {!searchQuery && !statusFilter && !typeFilter && (
                        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary btn-md inline-flex items-center gap-2">
                            <Plus size={15} /> Upload Material
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-theme-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
                                <tr>
                                    {['Title', 'Subject & Section', 'Type', 'Status', 'Size', 'Downloads / Views', 'Uploaded', 'Actions'].map((h) => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {materials.map((mat) => (
                                    <React.Fragment key={mat.id}>
                                        <tr className="hover:bg-[var(--color-surface-elevated)] transition-colors group">
                                            <td className="px-4 py-3 max-w-xs">
                                                <p className="font-medium text-[var(--color-foreground)] truncate">{mat.title}</p>
                                                {mat.description && (
                                                    <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">{mat.description}</p>
                                                )}
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
                                            <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">
                                                <span className="font-mono text-xs">{formatSize(mat.fileSizeMb)}</span>
                                                <span className="ml-1 text-xs text-[var(--color-muted)]/60 uppercase">{mat.fileExtension.replace('.', '')}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-[var(--color-muted)]">
                                                    <span className="flex items-center gap-1 text-xs"><Download size={11} /> {mat.downloadCount}</span>
                                                    <span className="flex items-center gap-1 text-xs"><Eye size={11} /> {mat.viewCount}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--color-muted)]">
                                                {formatDate(mat.uploadedAt)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(mat)}
                                                        className="p-1.5 rounded text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => void openStatsModal(mat)}
                                                        className="p-1.5 rounded text-[var(--color-muted)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-colors"
                                                        title="Statistics"
                                                    >
                                                        <BarChart2 size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(mat.id)}
                                                        className="p-1.5 rounded text-[var(--color-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-light)] transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {deleteConfirmId === mat.id && (
                                            <tr key={`delete-${mat.id}`}>
                                                <DeleteConfirmBar
                                                    onConfirm={() => void onDelete(mat.id)}
                                                    onCancel={() => setDeleteConfirmId(null)}
                                                />
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <MaterialModal
                    mode="upload"
                    assignments={assignments}
                    onSubmit={onUpload}
                    onClose={closeModals}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && selectedMaterial && (
                <MaterialModal
                    mode="edit"
                    material={selectedMaterial}
                    assignments={assignments}
                    onSubmit={onUpdate}
                    onClose={closeModals}
                />
            )}

            {/* Stats Modal */}
            {showStatsModal && selectedMaterial && (
                <StatsModal
                    material={selectedMaterial}
                    stats={stats}
                    loading={statsLoading}
                    onClose={closeModals}
                />
            )}
        </PageLayout>
    );
}
