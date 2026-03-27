import React, { useState, useEffect, useCallback } from 'react';
import { Building2, MapPin, Calendar, Clock, BookOpen, AlertCircle, Users, CheckCircle, HelpCircle, ChevronRight, Hash, X } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { DataTable, type Column } from '../../components/ui/DataTable';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';
import { Button } from '../../components/ui/Button';
import axios from 'axios';

interface Schedule {
    id: number;
    day: string;
    period: number;
    subject: string;
    changed_venue?: string;
    changed_building?: string;
}

interface AssignedVenue {
    section_id: number;
    section_name: string;
    primary_venue: string;
    primary_building: string;
    schedule: Schedule[];
}

interface UnassignedSection {
    id: number;
    name: string;
    code: string;
    course: string;
    year: number;
    status: string;
}

interface SummaryData {
    total_sections: number;
    assigned_count: number;
    unassigned_count: number;
    sections: UnassignedSection[];
    pagination: {
        page: number;
        page_size: number;
        total_filtered_items: number;
        total_pages: number;
    };
}

interface AssignFilters {
    sections: { id: number; name: string }[];
    rooms: { id: number; name: string }[];
}

export default function AssignedClassrooms() {
    const { addToast } = useToast();
    const [assignedVenues, setAssignedVenues] = useState<AssignedVenue[]>([]);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);

    // Assignment Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignFormData, setAssignFormData] = useState({ section_id: '', venue_id: '' });
    const [assignFilters, setAssignFilters] = useState<AssignFilters>({ sections: [], rooms: [] });
    const [isAssignSubmitting, setIsAssignSubmitting] = useState(false);
    const [isFiltersLoading, setIsFiltersLoading] = useState(false);

    const fetchAssignedOverview = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<{ assigned_venues: AssignedVenue[] }>('/api/campus-management/venues/assigned-overview/');
            setAssignedVenues(response.data.assigned_venues);
        } catch (error) {
            console.error('Error fetching assigned overview:', error);
            addToast({ type: 'error', title: 'Failed to fetch assignment overview' });
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const fetchSummary = useCallback(async () => {
        try {
            setSummaryLoading(true);
            const response = await api.get<SummaryData>('/api/campus-management/admin/sections/summary/?unassigned=true&page=1&page_size=5');
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setSummaryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssignedOverview();
        fetchSummary();
    }, [fetchAssignedOverview, fetchSummary]);

    const handleAssignClick = async (section: UnassignedSection) => {
        setAssignFormData({ section_id: String(section.id), venue_id: '' });
        setIsAssignModalOpen(true);
        try {
            setIsFiltersLoading(true);
            const response = await api.get<{ filters: AssignFilters }>('/api/core/filters/?type=assign_room');
            setAssignFilters(response.data.filters);
        } catch (error) {
            console.error('Error fetching assign filters:', error);
            addToast({ type: 'error', title: 'Failed to load assignment filters' });
        } finally {
            setIsFiltersLoading(false);
        }
    };

    const handleAssignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignFormData.section_id || !assignFormData.venue_id) {
            addToast({ type: 'error', title: 'Please select both section and venue' });
            return;
        }

        try {
            setIsAssignSubmitting(true);
            await api.post('/api/campus-management/admin/sections/assign-room/', {
                section_id: Number(assignFormData.section_id),
                venue_id: Number(assignFormData.venue_id)
            });
            addToast({ type: 'success', title: 'Room assigned successfully' });
            setIsAssignModalOpen(false);
            fetchAssignedOverview();
            fetchSummary();
        } catch (error) {
            console.error('Error assigning room:', error);
            let message = 'Failed to assign room';
            if (axios.isAxiosError(error)) {
                // Parse specific backend error message e.g. "No timetable entries found for this section."
                message = error.response?.data?.error || error.response?.data?.message || message;
            }
            addToast({ type: 'error', title: message });
        } finally {
            setIsAssignSubmitting(false);
        }
    };

    const summaryCards = [
        {
            label: 'Total Sections',
            value: summary?.total_sections || 0,
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50/50 dark:bg-indigo-900/20',
            border: 'border-indigo-100 dark:border-indigo-800'
        },
        {
            label: 'Assigned',
            value: summary?.assigned_count || 0,
            icon: CheckCircle,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800'
        },
        {
            label: 'Unassigned',
            value: summary?.unassigned_count || 0,
            icon: HelpCircle,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50/50 dark:bg-amber-900/20',
            border: 'border-amber-100 dark:border-amber-800'
        }
    ];

    const unassignedColumns: Column<UnassignedSection>[] = [
        {
            key: 'name',
            header: 'Functional Name',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[var(--color-text-primary)] text-sm">{row.name}</span>
                    <span className="text-[10px] text-[var(--color-text-secondary)] opacity-70 uppercase tracking-widest">{row.course}</span>
                </div>
            ),
        },
        {
            key: 'code',
            header: 'Code',
            render: (row) => (
                <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] flex items-center justify-center font-black text-xs">
                    {row.code}
                </div>
            ),
            align: 'center'
        },
        {
            key: 'status',
            header: 'Status',
            render: () => (
                <div className="px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-md text-[10px] font-black uppercase tracking-tighter w-fit">
                    Unassigned
                </div>
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (row) => (
                <button 
                    onClick={() => handleAssignClick(row)}
                    className="flex items-center gap-1 text-[var(--color-primary)] font-bold text-xs hover:underline group"
                >
                    Assign Now
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            ),
            align: 'right'
        }
    ];

    const columns: Column<AssignedVenue>[] = [
        {
            key: 'section_name',
            header: 'Section / Class',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[var(--color-text-primary)] text-base">{row.section_name}</span>
                    <span className="text-xs text-[var(--color-text-secondary)] opacity-70">ID: {row.section_id}</span>
                </div>
            ),
        },
        {
            key: 'primary_venue',
            header: 'Primary Allocation',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold">
                        <MapPin size={14} />
                        <span>{row.primary_venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                        <Building2 size={12} />
                        <span>{row.primary_building}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'schedule',
            header: 'Weekly Schedule & Special Allocations',
            render: (row) => (
                <div className="space-y-2 py-2">
                    {row.schedule.map((item) => {
                        const isChanged = !!item.changed_venue;
                        return (
                            <div 
                                key={item.id} 
                                className={`group relative p-3 rounded-xl border-2 transition-all ${
                                    isChanged 
                                    ? 'bg-amber-50 border-amber-200 shadow-sm' 
                                    : 'bg-[var(--color-background-secondary)]/50 border-transparent hover:border-[var(--color-border)]'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                                            isChanged ? 'bg-amber-200 text-amber-800' : 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'
                                        }`}>
                                            {item.day} • Period {item.period}
                                        </span>
                                        <span className="text-sm font-bold text-[var(--color-text-primary)]">{item.subject}</span>
                                    </div>
                                    {isChanged && <AlertCircle size={14} className="text-amber-500 animate-pulse" />}
                                </div>
                                
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="flex items-center gap-1.5 opacity-70">
                                        <Clock size={12} />
                                        <span>Slot {item.period}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <MapPin size={12} className={isChanged ? 'text-amber-600' : 'text-[var(--color-primary)]'} />
                                        <span className={isChanged ? 'text-amber-700 underline decoration-dotted' : ''}>
                                            {isChanged ? `${item.changed_venue} (${item.changed_building})` : 'Primary Venue'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {row.schedule.length === 0 && (
                        <span className="text-sm text-[var(--color-text-secondary)] italic">No specific schedule sessions mapped.</span>
                    )}
                </div>
            ),
            minWidth: '400px'
        }
    ];

    return (
        <PageLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--color-border)]">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                                <MapPin size={24} />
                            </div>
                            <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Venue Assignment</h1>
                        </div>
                        <p className="text-[var(--color-text-secondary)] text-lg font-medium">
                            Operational status of section room allocations and schedule overrides
                        </p>
                    </div>
                </div>

                {/* Summary View */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {summaryCards.map((card, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl border ${card.bg} ${card.border} flex items-center justify-between group hover:shadow-lg transition-all`}>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] opacity-60">{card.label}</p>
                                <p className={`text-3xl font-black mt-1 ${card.color}`}>{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${card.color} bg-[var(--color-card)] dark:bg-black/20 group-hover:scale-110 transition-transform`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Unassigned Sections Panel */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-[var(--color-text-primary)] flex items-center gap-2">
                                <HelpCircle size={20} className="text-amber-500 dark:text-amber-400" />
                                Needs Assignment
                            </h2>
                            <span className="text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                {summary?.unassigned_count || 0} SECTIONS
                            </span>
                        </div>
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl">
                            <DataTable 
                                columns={unassignedColumns} 
                                data={summary?.sections || []} 
                                loading={summaryLoading}
                                pageSize={5}
                                emptyMessage="All sections have rooms assigned. Perfect!"
                            />
                        </div>
                        <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors border-t border-[var(--color-border)] flex items-center justify-center gap-2">
                            View All Unassigned <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Assigned Overview Table */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-black text-[var(--color-text-primary)] flex items-center gap-2">
                            <CheckCircle size={20} className="text-emerald-500" />
                            Allocated Inventory
                        </h2>
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl">
                            <DataTable 
                                columns={columns} 
                                data={assignedVenues} 
                                loading={loading}
                                pageSize={5}
                                emptyMessage="No venue assignments found in the system."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Assignment Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Room to Section"
                maxWidth="max-w-md"
            >
                <form onSubmit={handleAssignSubmit} className="p-6 pt-0 space-y-6">
                    <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 rounded-xl space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Target Section</p>
                        <Dropdown 
                            label=""
                            options={assignFilters.sections.map(s => ({ label: s.name, value: s.id }))}
                            value={assignFormData.section_id}
                            onChange={(val) => setAssignFormData(prev => ({ ...prev, section_id: String(val) }))}
                            placeholder="Select Section"
                            dataTestId="assign-section-dropdown"
                        />
                    </div>

                    <div className="space-y-4">
                        <Dropdown 
                            label="Select Room / Venue"
                            options={assignFilters.rooms.map(r => ({ label: r.name, value: r.id }))}
                            value={assignFormData.venue_id}
                            onChange={(val) => setAssignFormData(prev => ({ ...prev, venue_id: String(val) }))}
                            placeholder={isFiltersLoading ? "Loading Rooms..." : "Choose a Room"}
                            dataTestId="assign-room-dropdown"
                            required
                        />
                        
                        {!isFiltersLoading && assignFilters.rooms.length === 0 && (
                            <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                <AlertCircle size={14} />
                                No available rooms found in filters.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            className="flex-1" 
                            onClick={() => setIsAssignModalOpen(false)}
                            data-testid="cancel-assignment-btn"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex-1 shadow-lg shadow-[var(--color-primary)]/20"
                            disabled={isAssignSubmitting || isFiltersLoading || !assignFormData.venue_id}
                            data-testid="submit-assignment-btn"
                        >
                            {isAssignSubmitting ? "Assigning..." : "Confirm Assignment"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageLayout>
    );
}
