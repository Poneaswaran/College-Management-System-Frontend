import React, { useState, useEffect, useCallback } from 'react';
import { 
    Bell, 
    Send, 
    Trash2, 
    Users, 
    UserCheck, 
    Globe, 
    AlertCircle, 
    CheckCircle2,
    Search,
    Calendar,
    ChevronRight,
    Loader2
} from 'lucide-react';

import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import { noticeService, type DepartmentNotice, type TargetAudience } from '../../services/notice.service';

export default function HODPostNotices() {
    const [notices, setNotices] = useState<DepartmentNotice[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState<TargetAudience>('BOTH');

    const fetchNotices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await noticeService.getHODNotices();
            setNotices(data);
        } catch (err: any) {
            setError('Failed to fetch notices');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchNotices();
    }, [fetchNotices]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await noticeService.createNotice({
                title,
                message,
                target_audience: targetAudience
            });
            setSuccess('Notice posted successfully and broadcasted to the department.');
            setTitle('');
            setMessage('');
            setTargetAudience('BOTH');
            void fetchNotices();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to post notice');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        
        try {
            await noticeService.deleteNotice(id);
            setNotices(prev => prev.filter(n => n.id !== id));
        } catch (err: any) {
            setError('Failed to delete notice');
        }
    };

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
                <Header 
                    title="Department Notices" 
                    titleIcon={<Bell size={28} className="text-[var(--color-primary)]" />} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Post Notice Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-2">
                                <Send size={20} className="text-[var(--color-primary)]" />
                                Post New Notice
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-1.5">
                                        Notice Title
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                        placeholder="Enter a descriptive title..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-1.5">
                                        Message Content
                                    </label>
                                    <textarea 
                                        required
                                        rows={5}
                                        className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                                        placeholder="Type your announcement here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-3">
                                        Target Audience
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'BOTH', label: 'All (Students & Faculty)', icon: <Globe size={16} /> },
                                            { id: 'STUDENTS', label: 'Students Only', icon: <Users size={16} /> },
                                            { id: 'FACULTY', label: 'Faculty Only', icon: <UserCheck size={16} /> }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setTargetAudience(opt.id as TargetAudience)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                                    targetAudience === opt.id 
                                                    ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]' 
                                                    : 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)]'
                                                }`}
                                            >
                                                {opt.icon}
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl text-xs flex items-center gap-2">
                                        <AlertCircle size={14} />
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="p-3 bg-[var(--color-success-light)] text-[var(--color-success)] rounded-xl text-xs flex items-center gap-2">
                                        <CheckCircle2 size={14} />
                                        {success}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold shadow-lg shadow-[var(--color-primary-light)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                    Broadcast Notice
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Notice History List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[var(--color-foreground)]">Notice History</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" size={16} />
                                <input 
                                    type="text"
                                    placeholder="Search notices..."
                                    className="pl-9 pr-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                            </div>
                        ) : notices.length === 0 ? (
                            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-[var(--color-background-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell size={32} className="text-[var(--color-foreground-muted)]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-1">No notices yet</h3>
                                <p className="text-[var(--color-foreground-muted)] text-sm">Post your first department announcement to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notices.map((notice) => (
                                    <div key={notice.id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                        notice.target_audience === 'STUDENTS' 
                                                        ? 'bg-blue-100 text-blue-600' 
                                                        : notice.target_audience === 'FACULTY'
                                                        ? 'bg-purple-100 text-purple-600'
                                                        : 'bg-green-100 text-green-600'
                                                    }`}>
                                                        {notice.target_audience}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[10px] text-[var(--color-foreground-muted)] font-medium">
                                                        <Calendar size={10} />
                                                        {new Date(notice.created_at).toLocaleDateString(undefined, { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            year: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => handleDelete(notice.id)}
                                                    className="p-1.5 text-[var(--color-foreground-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-light)] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">{notice.title}</h3>
                                            <p className="text-sm text-[var(--color-foreground-secondary)] line-clamp-3 leading-relaxed whitespace-pre-wrap">
                                                {notice.message}
                                            </p>
                                        </div>
                                        <div className="px-5 py-3 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)] flex items-center justify-between">
                                            <span className="text-xs text-[var(--color-foreground-muted)]">
                                                Posted by <span className="font-semibold text-[var(--color-foreground)]">{notice.created_by_name}</span>
                                            </span>
                                            <button className="text-[var(--color-primary)] text-xs font-bold flex items-center gap-1 hover:underline">
                                                View Details <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
