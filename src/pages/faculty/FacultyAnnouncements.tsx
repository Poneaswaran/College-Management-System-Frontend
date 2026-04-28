import React, { useState, useEffect, useCallback } from 'react';
import { 
    Bell, 
    Calendar, 
    User, 
    ChevronRight, 
    Search,
    Loader2,
    Building2
} from 'lucide-react';

import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import { noticeService, type DepartmentNotice } from '../../services/notice.service';

export default function FacultyAnnouncements() {
    const [announcements, setAnnouncements] = useState<DepartmentNotice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await noticeService.getFacultyAnnouncements();
            setAnnouncements(data);
        } catch (err: any) {
            setError('Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchAnnouncements();
    }, [fetchAnnouncements]);

    const filteredAnnouncements = announcements.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.created_by_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Header 
                        title="Announcements" 
                        titleIcon={<Bell size={28} className="text-[var(--color-primary)]" />} 
                    />
                    <div className="relative flex-1 min-w-[280px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" size={18} />
                        <input 
                            type="text"
                            placeholder="Search announcements..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
                        <p className="text-[var(--color-foreground-muted)] font-medium animate-pulse">Loading latest announcements...</p>
                    </div>
                ) : error ? (
                    <div className="bg-[var(--color-error-light)] border border-[var(--color-error)] p-6 rounded-2xl flex items-center gap-4 text-[var(--color-error)]">
                        <div className="p-3 bg-white/50 rounded-xl">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">Oops! Something went wrong</h3>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                    </div>
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-[var(--color-background-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell size={40} className="text-[var(--color-foreground-muted)]" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
                            {searchTerm ? 'No matches found' : 'All quiet for now'}
                        </h3>
                        <p className="text-[var(--color-foreground-muted)] max-w-sm mx-auto">
                            {searchTerm 
                                ? `We couldn't find any announcements matching "${searchTerm}". Try a different search term.` 
                                : "There are no active announcements for your department at this time."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredAnnouncements.map((announcement) => (
                            <div 
                                key={announcement.id} 
                                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row"
                            >
                                <div className="sm:w-2 bg-[var(--color-primary)] shrink-0" />
                                <div className="flex-1 p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center text-[var(--color-primary)] font-bold">
                                                {announcement.created_by_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--color-foreground)] leading-tight">
                                                    {announcement.created_by_name}
                                                </p>
                                                <p className="text-[11px] text-[var(--color-foreground-muted)] font-medium">
                                                    HOD • {announcement.department_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-foreground-muted)] bg-[var(--color-background-secondary)] px-3 py-1.5 rounded-full uppercase tracking-wider">
                                            <Calendar size={12} className="text-[var(--color-primary)]" />
                                            {new Date(announcement.created_at).toLocaleDateString(undefined, { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                                        {announcement.title}
                                    </h3>
                                    
                                    <div className="prose prose-sm max-w-none text-[var(--color-foreground-secondary)] leading-relaxed whitespace-pre-wrap mb-6">
                                        {announcement.message}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] border-dashed">
                                        <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-muted)]">
                                            <Building2 size={14} />
                                            Official Departmental Release
                                        </div>
                                        <button className="flex items-center gap-1.5 text-[var(--color-primary)] text-sm font-bold hover:gap-2 transition-all">
                                            View Full Details <ChevronRight size={16} />
                                        </button>
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
