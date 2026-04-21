import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { ArrowLeft, Plus, UserCheck, CalendarDays, Loader2, ShieldCheck, AlertCircle, Search, LayoutGrid, List, ChevronRight, Download, FileText } from 'lucide-react';
import { SERVER_URL } from '../../../config/constant';

import PageLayout from '../../../components/layout/PageLayout';
import { Header } from '../../../components/layout/Header';
import { useToast } from '../../../components/ui/Toast';
import { 
    HODTimeTableService, 
    type HODClass, 
    type Period, 
    type Slot, 
    type TimetableResponse, 
    type InchargeAssignment, 
    type SubjectItem, 
    type FacultyItem 
} from '../../../services/HODTimeTableAssignment';
import AICopilotPanel from '../../../components/HOD/AICopilotPanel';

type AssignmentStep = 'subject' | 'faculty';

function FacultyAvatar({ src, name, size = 'md' }: { src?: string | null; name: string; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'h-6 w-6 text-[10px]',
        md: 'h-8 w-8 text-xs',
        lg: 'h-10 w-10 text-sm'
    };

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${sizeClasses[size]} rounded-full object-cover border border-[var(--color-border)]`}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`; }}
            />
        );
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-bold border border-[var(--color-primary-light)]`}>
            {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
    );
}

function ClassCardSkeleton() {
    return (
        <div className="animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <div className="mb-3 h-5 w-2/3 rounded bg-[var(--color-background-tertiary)]" />
            <div className="mb-2 h-4 w-1/2 rounded bg-[var(--color-background-tertiary)]" />
            <div className="h-4 w-1/3 rounded bg-[var(--color-background-tertiary)]" />
        </div>
    );
}

export default function TimetableAssignment() {
    const { addToast } = useToast();

    const [classes, setClasses] = useState<HODClass[]>([]);
    const [classesLoading, setClassesLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [classesSearchQuery, setClassesSearchQuery] = useState('');
    const [classesNextUrl, setClassesNextUrl] = useState<string | null>(null);
    const [globalSemesterId, setGlobalSemesterId] = useState<number | null>(null);

    const [selectedClass, setSelectedClass] = useState<HODClass | null>(null);

    const [timetable, setTimetable] = useState<TimetableResponse | null>(null);
    const [timetableLoading, setTimetableLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const [activeStep, setActiveStep] = useState<AssignmentStep>('subject');
    const [activeSlot, setActiveSlot] = useState<Slot | null>(null);

    const [subjectsByClass, setSubjectsByClass] = useState<Record<number, SubjectItem[]>>({});
    const [facultyBySubject, setFacultyBySubject] = useState<Record<number, FacultyItem[]>>({});

    const [subjectsLoading, setSubjectsLoading] = useState(false);
    const [facultyLoading, setFacultyLoading] = useState(false);

    const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyItem | null>(null);

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmError, setConfirmError] = useState<string | null>(null);

    // Section In-Charge Management State
    const [inchargeModalOpen, setInchargeModalOpen] = useState(false);
    const [inchargeConfirmModalOpen, setInchargeConfirmModalOpen] = useState(false);
    const [allIncharges, setAllIncharges] = useState<InchargeAssignment[]>([]);
    const [deptFaculty, setDeptFaculty] = useState<FacultyItem[]>([]);
    const [pendingIncharge, setPendingIncharge] = useState<FacultyItem | null>(null);
    const [conflictClass, setConflictClass] = useState<string | null>(null);
    const [inchargeLoading, setInchargeLoading] = useState(false);
    const [facultySearchQuery, setFacultySearchQuery] = useState('');
    const [facultyNextUrl, setFacultyNextUrl] = useState<string | null>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const classSubjects = selectedClass ? subjectsByClass[selectedClass.id] || [] : [];
    const cacheKey = selectedClass && selectedSubject ? `${selectedClass.id}-${selectedSubject.id}` : null;
    const subjectFaculty = cacheKey ? facultyBySubject[cacheKey] || [] : [];

    const slotMap = useMemo(() => {
        const map = new Map<string, Slot>();
        if (!timetable) {
            return map;
        }
        timetable.slots.forEach((slot) => {
            map.set(`${slot.day}-${slot.period_id}`, slot);
        });
        return map;
    }, [timetable]);

    const currentPeriod = useMemo(() => {
        if (!activeSlot || !timetable) {
            return null;
        }
        return timetable.periods.find((period) => period.id === activeSlot.period_id) || null;
    }, [activeSlot, timetable]);

    const fetchFaculty = useCallback(async (subjectId: number, classId: number, search: string = '', isNext: boolean = false) => {
        try {
            if (!isNext) setFacultyLoading(true);
            else setIsFetchingMore(true);

            const url = isNext ? facultyNextUrl : undefined;
            const data = await HODTimeTableService.fetchFaculty(subjectId, classId, search, url || undefined);
            
            setSubjectFaculty(prev => isNext ? [...prev, ...data.results] : data.results);
            setFacultyNextUrl(data.next);
        } catch (error) {
            console.error('Error fetching faculty:', error);
            addToast({
                type: 'error',
                title: 'Error',
                message: 'Failed to fetch faculty list',
            });
        } finally {
            setFacultyLoading(false);
            setIsFetchingMore(false);
        }
    }, [addToast, facultyNextUrl]);

    const fetchAllDeptFaculty = useCallback(async (search: string = '', isNext: boolean = false) => {
        try {
            if (!isNext) setInchargeLoading(true);
            else setIsFetchingMore(true);

            const url = isNext ? facultyNextUrl : undefined;
            const data = await HODTimeTableService.fetchAllDeptFaculty(search, url || undefined);
            
            setDeptFaculty(prev => isNext ? [...prev, ...data.results] : data.results);
            setFacultyNextUrl(data.next);
        } catch (error) {
            console.error('Error fetching department faculty:', error);
        } finally {
            setInchargeLoading(false);
            setIsFetchingMore(false);
        }
    }, [facultyNextUrl]);

    useEffect(() => {
        if (!assignmentModalOpen && !inchargeModalOpen) return;

        const timeoutId = setTimeout(() => {
            if (activeStep === 'faculty' && selectedClass && selectedSubject) {
                fetchFaculty(selectedSubject.id, selectedClass.id, facultySearchQuery);
            } else if (inchargeModalOpen) {
                fetchAllDeptFaculty(facultySearchQuery);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [facultySearchQuery, assignmentModalOpen, inchargeModalOpen, activeStep, selectedClass, selectedSubject, fetchFaculty, fetchAllDeptFaculty]);

    const fetchClasses = useCallback(async (search: string = '', isNext: boolean = false) => {
        try {
            if (!isNext) setClassesLoading(true);
            else setIsFetchingMore(true);

            const url = isNext ? classesNextUrl : undefined;
            const data = await HODTimeTableService.fetchClasses(search, url || undefined);
            
            setClasses(prev => isNext ? [...prev, ...data.results] : data.results);
            setClassesNextUrl(data.next);
            if (data.current_semester_id) {
                setGlobalSemesterId(data.current_semester_id);
            }
        } catch (error) {
            console.error('Failed to fetch classes:', error);
            addToast({
                type: 'error',
                title: 'Error',
                message: 'Failed to load classes',
            });
        } finally {
            setClassesLoading(false);
            setIsFetchingMore(false);
        }
    }, [addToast, classesNextUrl]);

    const lastElementRef = useCallback((node: HTMLElement | null) => {
        if (classesLoading || facultyLoading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!selectedClass && classesNextUrl) {
                    fetchClasses(classesSearchQuery, true);
                } else if (inchargeModalOpen && facultyNextUrl) {
                    fetchAllDeptFaculty(facultySearchQuery, true);
                } else if (activeStep === 'faculty' && selectedClass && selectedSubject && facultyNextUrl) {
                    fetchFaculty(selectedSubject.id, selectedClass.id, facultySearchQuery, true);
                }
            }
        });

        if (node) observer.current.observe(node);
    }, [classesLoading, facultyLoading, isFetchingMore, selectedClass, classesNextUrl, classesSearchQuery, fetchClasses, inchargeModalOpen, facultyNextUrl, fetchAllDeptFaculty, facultySearchQuery, activeStep, selectedSubject]);

    // Initial fetch and class search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!selectedClass) {
                fetchClasses(classesSearchQuery);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [classesSearchQuery, selectedClass, fetchClasses]);

    const fetchTimetable = useCallback(
        async (classId: number) => {
            setTimetableLoading(true);
            try {
                const data = await HODTimeTableService.fetchTimetable(classId);
                setTimetable(data);
            } catch {
                addToast({
                    type: 'error',
                    title: 'Failed to load timetable',
                    message: 'Could not fetch timetable grid for the selected class.',
                });
                setTimetable(null);
            } finally {
                setTimetableLoading(false);
            }
        },
        [addToast],
    );

    const fetchSubjects = useCallback(
        async (classId: number) => {
            if (subjectsByClass[classId]) {
                return;
            }
            setSubjectsLoading(true);
            try {
                const data = await HODTimeTableService.fetchSubjects(classId);
                setSubjectsByClass((prev) => ({ ...prev, [classId]: data || [] }));
            } catch {
                addToast({
                    type: 'error',
                    title: 'Failed to load subjects',
                    message: 'Please retry subject selection.',
                });
                setSubjectsByClass((prev) => ({ ...prev, [classId]: [] }));
            } finally {
                setSubjectsLoading(false);
            }
        },
        [addToast, subjectsByClass],
    );

    const fetchAllIncharges = useCallback(async () => {
        try {
            const data = await HODTimeTableService.fetchAllIncharges();
            setAllIncharges(data || []);
        } catch {
            console.error('Failed to load all in-charges');
        }
    }, []);

    useEffect(() => {
        void fetchClasses();
    }, [fetchClasses]);

    useEffect(() => {
        if (selectedClass) {
            void fetchAllIncharges();
        }
    }, [selectedClass, fetchAllIncharges]);

    const openAssignmentModal = async (slot: Slot) => {
        if (!selectedClass) {
            return;
        }

        setActiveSlot(slot);
        setSelectedSubject(null);
        setSelectedFaculty(null);
        setActiveStep('subject');
        setConfirmError(null);
        setFacultySearchQuery('');
        setAssignmentModalOpen(true);
        await fetchSubjects(selectedClass.id);
    };

    const closeAssignmentModal = () => {
        setAssignmentModalOpen(false);
        setActiveStep('subject');
        setActiveSlot(null);
        setSelectedSubject(null);
        setSelectedFaculty(null);
    };

    const closeConfirmModal = () => {
        if (confirmLoading) {
            return;
        }
        setConfirmModalOpen(false);
        setConfirmError(null);
    };

    const handleSelectClass = async (klass: HODClass) => {
        setSelectedClass(klass);
        await fetchTimetable(klass.id);
    };

    const handleSelectSubject = async (subject: SubjectItem) => {
        setSelectedSubject(subject);
        setSelectedFaculty(null);
        setActiveStep('faculty');
        await fetchFaculty(subject.id, selectedClass!.id);
    };

    const handleSelectFaculty = (faculty: FacultyItem) => {
        setSelectedFaculty(faculty);
        setConfirmError(null);
        setConfirmModalOpen(true);
    };

    const handleConfirmAssign = async () => {
        if (!activeSlot || !selectedSubject || !selectedFaculty) {
            return;
        }

        setConfirmLoading(true);
        setConfirmError(null);

        try {
            const data = await HODTimeTableService.assignSlot(
                activeSlot.slot_id,
                selectedSubject.id,
                selectedFaculty.id
            );

            if (!data?.success) {
                throw new Error('Assignment failed');
            }

            setTimetable((prev) => {
                if (!prev) {
                    return prev;
                }
                return {
                    ...prev,
                    slots: prev.slots.map((slot) =>
                        slot.slot_id === data.slot.slot_id ? data.slot : slot,
                    ),
                };
            });

            setConfirmModalOpen(false);
            setAssignmentModalOpen(false);
            setConfirmError(null);
            setActiveSlot(null);
            setSelectedSubject(null);
            setSelectedFaculty(null);

            addToast({
                type: 'success',
                title: 'Slot assigned successfully',
            });
        } catch (error: unknown) {
            const defaultMessage = 'Unable to assign this timetable slot. Please retry.';
            const message =
                error && typeof error === 'object' && 'response' in error
                    ? ((error as { response?: { data?: { detail?: string } } }).response?.data?.detail || defaultMessage)
                    : defaultMessage;
            setConfirmError(message);
            addToast({
                type: 'error',
                title: 'Assignment failed',
                message,
            });
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleExportPDF = async () => {
        if (!selectedClass || !timetable || !timetable.semester_id) {
            addToast({
                type: 'error',
                title: 'Export Error',
                message: 'Timetable data or Semester ID not found.'
            });
            return;
        }
        
        try {
            setExporting(true);
            const sectionId = selectedClass.id;
            const semesterId = timetable.semester_id;
            const token = localStorage.getItem('token');

            const response = await fetch(`${SERVER_URL}/api/timetable/export/?section_id=${sectionId}&semester_id=${semesterId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to export PDF');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `timetable_${selectedClass.name}_${selectedClass.section}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            addToast({
                type: 'success',
                title: 'PDF Exported',
                message: 'Your timetable PDF is ready.'
            });
        } catch (err) {
            console.error('PDF Export error:', err);
            addToast({
                type: 'error',
                title: 'Export Failed',
                message: 'An error occurred while generating the PDF.'
            });
        } finally {
            setExporting(false);
        }
    };

    const handleInchargeChangeClick = (faculty: FacultyItem) => {
        setPendingIncharge(faculty);
        setFacultySearchQuery('');

        const conflict = allIncharges.find(ic => ic.faculty === faculty.id && ic.section !== selectedClass?.id);

        if (conflict) {
            setConflictClass(conflict.section_full_name);
            setInchargeConfirmModalOpen(true);
        } else {
            void confirmInchargeAssignment(faculty.id);
        }
    };

    const confirmInchargeAssignment = async (facultyId: number) => {
        if (!selectedClass) return;

        setInchargeLoading(true);
        try {
            await HODTimeTableService.assignIncharge(selectedClass.id, facultyId);

            await fetchTimetable(selectedClass.id);
            await fetchAllIncharges();

            setInchargeModalOpen(false);
            setInchargeConfirmModalOpen(false);
            addToast({
                type: 'success',
                title: 'Class In-Charge updated',
                message: 'Assignment has been saved for the current semester.'
            });
        } catch (err: any) {
            addToast({
                type: 'error',
                title: 'Update failed',
                message: err.response?.data?.detail || 'Could not reassign class in-charge.'
            });
        } finally {
            setInchargeLoading(false);
        }
    };

    const renderClassListView = () => {
        return (
            <div className="space-y-6">
                {/* Filters & View Toggle */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-card)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search class or course..."
                            value={classesSearchQuery}
                            onChange={(e) => setClassesSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-[var(--color-background-secondary)] p-1 rounded-lg border border-[var(--color-border)]">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[var(--color-card)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-[var(--color-card)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'}`}
                            title="Table View"
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {classesLoading && !isFetchingMore ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <ClassCardSkeleton key={`class-skeleton-${idx}`} />
                        ))}
                    </div>
                ) : !classes.length ? (
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-12 text-center shadow-sm">
                        <div className="mx-auto w-16 h-16 bg-[var(--color-background-secondary)] rounded-full flex items-center justify-center mb-4">
                            <CalendarDays size={32} className="text-[var(--color-foreground-muted)]" />
                        </div>
                        <p className="text-lg font-bold text-[var(--color-foreground)]">No classes found</p>
                        <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">Check your search query or department configuration.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {classes.map((klass, index) => (
                            <div
                                key={klass.id}
                                ref={index === classes.length - 1 ? (node => lastElementRef(node)) : null}
                            >
                                <button
                                    type="button"
                                    onClick={() => void handleSelectClass(klass)}
                                    className="group w-full h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-left shadow-sm transition-all hover:border-[var(--color-primary)] hover:shadow-md active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-[var(--color-primary-light)] rounded-xl text-[var(--color-primary)]">
                                            <CalendarDays size={24} />
                                        </div>
                                        <div className="px-2.5 py-1 rounded-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-[10px] font-bold uppercase tracking-wider text-[var(--color-foreground-secondary)]">
                                            Semester {klass.semester}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">{klass.name}</h3>
                                    <p className="mt-1 text-sm text-[var(--color-foreground-muted)] font-medium">Section: {klass.section}</p>

                                    <div className="mt-6 flex items-center justify-between text-xs text-[var(--color-foreground-muted)]">
                                        <span>Manage Timetable</span>
                                        <ChevronRight size={16} className="text-[var(--color-foreground-muted)] group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-foreground-secondary)]">Class Name</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-foreground-secondary)]">Section</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-foreground-secondary)]">Semester</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-foreground-secondary)] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((klass, index) => (
                                    <tr
                                        key={klass.id}
                                        ref={index === classes.length - 1 ? (node => lastElementRef(node)) : null}
                                        className="border-b border-[var(--color-border)] hover:bg-[var(--color-background-secondary)] transition-colors group cursor-pointer"
                                        onClick={() => void handleSelectClass(klass)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[var(--color-background-tertiary)] rounded-lg text-[var(--color-foreground-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                                                    <CalendarDays size={18} />
                                                </div>
                                                <span className="font-bold text-[var(--color-foreground)]">{klass.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[var(--color-foreground-secondary)]">{klass.section}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-[var(--color-background-secondary)] border border-[var(--color-border)] text-xs font-semibold">
                                                {klass.semester}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[var(--color-primary)] font-bold text-sm inline-flex items-center gap-1 hover:underline">
                                                View <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isFetchingMore && (
                    <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
                            <span className="text-xs font-bold text-[var(--color-foreground-muted)] uppercase tracking-widest">Loading Records...</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderTimetableView = () => {
        if (!selectedClass) {
            return null;
        }

        return (
            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedClass(null);
                            setTimetable(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm font-medium text-[var(--color-foreground-secondary)] transition-colors hover:border-[var(--color-primary)]"
                    >
                        <ArrowLeft size={16} />
                        Back to Classes
                    </button>

                    <div className="flex flex-1 flex-wrap items-center justify-end gap-4 md:gap-6">
                        <button
                            onClick={handleExportPDF}
                            disabled={exporting || timetableLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-lg hover:brightness-95 transition-all text-xs font-bold disabled:opacity-50"
                        >
                            {exporting ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Download size={14} />
                            )}
                            {exporting ? 'GENERATING...' : 'DOWNLOAD PDF'}
                        </button>

                        {timetable?.incharge && (
                            <button
                                onClick={() => setInchargeModalOpen(true)}
                                className="group flex flex-col items-end"
                            >
                                <p className="text-xs text-[var(--color-foreground-muted)] group-hover:text-[var(--color-primary)]">Class In-Charge</p>
                                <div className="flex items-center gap-2 font-bold text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                                    <div className="h-5 w-5 rounded-full border border-[var(--color-primary)] overflow-hidden">
                                        <FacultyAvatar name={timetable.incharge.faculty_name} size="sm" />
                                    </div>
                                    {timetable.incharge.faculty_name}
                                </div>
                            </button>
                        )}
                        {!timetable?.incharge && !timetableLoading && (
                            <button
                                onClick={() => setInchargeModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary-light)] px-3 py-1.5 text-xs font-bold text-[var(--color-primary)] transition-all hover:brightness-95"
                            >
                                <ShieldCheck size={14} />
                                ASSIGN IN-CHARGE
                            </button>
                        )}
                        <div className="text-right">
                            <p className="text-xs text-[var(--color-foreground-muted)]">Current Class</p>
                            <p className="font-bold text-base text-[var(--color-foreground)] leading-tight">
                                {selectedClass.name} {selectedClass.section}
                            </p>
                        </div>
                    </div>
                </div>

                {timetableLoading && (
                    <div className="flex min-h-48 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
                        <Loader2 className="animate-spin text-[var(--color-primary)]" size={30} />
                    </div>
                )}

                {!timetableLoading && timetable && (
                    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                        <table className="min-w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-[var(--color-background-secondary)]">
                                    <th className="sticky left-0 z-10 border-b border-r border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-3 text-left font-semibold text-[var(--color-foreground)]">
                                        Day
                                    </th>
                                    {timetable.periods.map((period) => (
                                        <th
                                            key={period.id}
                                            className="min-w-[180px] border-b border-r border-[var(--color-border)] px-3 py-3 text-left font-semibold text-[var(--color-foreground)]"
                                        >
                                            <div>{period.label}</div>
                                            <div className="text-xs font-normal text-[var(--color-foreground-muted)]">
                                                {period.start_time} - {period.end_time}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timetable.days.map((day) => (
                                    <tr key={day}>
                                        <td className="sticky left-0 z-10 border-b border-r border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-3 font-medium text-[var(--color-foreground)]">
                                            {day}
                                        </td>
                                        {timetable.periods.map((period) => {
                                            const slot = slotMap.get(`${day}-${period.id}`);
                                            if (!slot) {
                                                return (
                                                    <td key={`${day}-${period.id}`} className="border-b border-r border-[var(--color-border)] px-3 py-3" />
                                                );
                                            }

                                            if (period.is_break) {
                                                return (
                                                    <td
                                                        key={`${day}-${period.id}`}
                                                        className="border-b border-r border-[var(--color-border)] bg-[var(--color-background-tertiary)] px-3 py-4 text-center font-semibold text-[var(--color-foreground-muted)]"
                                                    >
                                                        Break
                                                    </td>
                                                );
                                            }

                                            const assigned = slot.is_assigned;
                                            return (
                                                <td key={`${day}-${period.id}`} className="border-b border-r border-[var(--color-border)] p-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => void openAssignmentModal(slot)}
                                                        className={`h-full min-h-[70px] w-full rounded-lg border px-3 py-2 text-left transition-colors ${assigned
                                                                ? 'border-[var(--color-success)] bg-[var(--color-success-light)] text-[var(--color-foreground)] hover:opacity-90'
                                                                : 'border-[var(--color-border)] bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)] hover:border-[var(--color-primary)]'
                                                            }`}
                                                    >
                                                        {assigned ? (
                                                            <div className="flex flex-col h-full justify-between">
                                                                <p className="font-bold text-sm leading-tight line-clamp-2">{slot.subject_name}</p>
                                                                <div className="flex items-center gap-2 mt-auto">
                                                                    <FacultyAvatar src={slot.faculty_profile_photo} name={slot.faculty_name || 'Faculty'} size="sm" />
                                                                    <p className="text-[10px] font-medium text-[var(--color-foreground-secondary)] truncate">{slot.faculty_name}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-sm font-medium">
                                                                <Plus size={14} />
                                                                Assign
                                                            </span>
                                                        )}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <PageLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <Header title="Timetable Assignment" titleIcon={<CalendarDays size={28} />} />

                {!selectedClass ? renderClassListView() : renderTimetableView()}

                {assignmentModalOpen && activeSlot && selectedClass && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-xl">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Assign Timetable Slot</h2>
                                    <p className="text-sm text-[var(--color-foreground-muted)]">
                                        {activeSlot.day} · {currentPeriod?.label} ({currentPeriod?.start_time} - {currentPeriod?.end_time})
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeAssignmentModal}
                                    className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-foreground-secondary)]"
                                >
                                    Close
                                </button>
                            </div>

                            {activeStep === 'subject' && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-[var(--color-foreground-secondary)]">Step 1: Select Subject</h3>
                                    {subjectsLoading && (
                                        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] p-4 text-sm text-[var(--color-foreground-muted)]">
                                            <Loader2 size={16} className="animate-spin" />
                                            Loading subjects...
                                        </div>
                                    )}
                                    {!subjectsLoading && !classSubjects.length && (
                                        <div className="rounded-lg border border-[var(--color-border)] p-4 text-sm text-[var(--color-foreground-muted)]">
                                            No subjects available for this class.
                                        </div>
                                    )}
                                    {!subjectsLoading && classSubjects.length > 0 && (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {classSubjects.map((subject) => (
                                                <button
                                                    key={subject.id}
                                                    type="button"
                                                    onClick={() => void handleSelectSubject(subject)}
                                                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-3 py-2 text-left text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)]"
                                                >
                                                    {subject.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeStep === 'faculty' && selectedSubject && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-[var(--color-foreground-secondary)]">Step 2: Select Faculty</h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveStep('subject');
                                                setSelectedFaculty(null);
                                            }}
                                            className="text-sm font-medium text-[var(--color-primary)]"
                                        >
                                            Back to Subjects
                                        </button>
                                    </div>

                                    <div className="rounded-lg bg-[var(--color-background-secondary)] px-3 py-2 text-sm text-[var(--color-foreground-secondary)]">
                                        Subject: <span className="font-semibold text-[var(--color-foreground)]">{selectedSubject.name}</span>
                                    </div>

                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search faculty..."
                                            value={facultySearchQuery}
                                            onChange={(e) => setFacultySearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                        />
                                    </div>

                                    {facultyLoading && !isFetchingMore && (
                                        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] p-4 text-sm text-[var(--color-foreground-muted)]">
                                            <Loader2 size={16} className="animate-spin" />
                                            Loading faculty...
                                        </div>
                                    )}

                                    {!facultyLoading && !subjectFaculty.length && (
                                        <div className="rounded-lg border border-[var(--color-border)] p-4 text-sm text-[var(--color-foreground-muted)]">
                                            No faculty in your department teaches this subject
                                        </div>
                                    )}

                                    {!facultyLoading && subjectFaculty.length > 0 && (
                                        <div className="grid gap-2">
                                            {subjectFaculty.map((faculty, index) => (
                                                <div
                                                    key={faculty.id}
                                                    ref={index === subjectFaculty.length - 1 ? (node => lastElementRef(node)) : null}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectFaculty(faculty)}
                                                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-3 py-2 text-left text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)]"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <FacultyAvatar src={faculty.profile_photo} name={faculty.name} size="md" />
                                                            <span className="inline-flex flex-col">
                                                                <span className="text-sm font-semibold">{faculty.name}</span>
                                                                <span className="text-[10px] text-[var(--color-foreground-muted)] uppercase tracking-wider font-bold">Faculty Member</span>
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            ))}
                                            {isFetchingMore && (
                                                <div className="mt-2 flex justify-center py-2">
                                                    <Loader2 size={20} className="animate-spin text-[var(--color-primary)]" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {confirmModalOpen && activeSlot && selectedClass && selectedSubject && selectedFaculty && currentPeriod && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4">
                        <div className="w-full max-w-xl rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-xl">
                            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Confirm Assignment</h3>
                            <p className="mt-3 text-sm text-[var(--color-foreground-secondary)]">
                                Assign <span className="font-semibold">{selectedFaculty.name}</span> to{' '}
                                <span className="font-semibold">{selectedSubject.name}</span> - {activeSlot.day}, {currentPeriod.label} ({currentPeriod.start_time} - {currentPeriod.end_time}) for{' '}
                                <span className="font-semibold">{selectedClass.name} {selectedClass.section}</span>?
                            </p>

                            {confirmError && (
                                <div className="mt-4 rounded-lg border border-[var(--color-error)] bg-[var(--color-error-light)] p-3 text-sm text-[var(--color-error)]">
                                    {confirmError}
                                </div>
                            )}

                            <div className="mt-5 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={confirmLoading}
                                    onClick={closeConfirmModal}
                                    className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground-secondary)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={confirmLoading}
                                    onClick={() => void handleConfirmAssign()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                                >
                                    {confirmLoading && <Loader2 size={14} className="animate-spin" />}
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {inchargeModalOpen && selectedClass && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
                        <div className="max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl flex flex-col">
                            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-[var(--color-foreground)]">Select Class In-Charge</h3>
                                    <p className="text-xs text-[var(--color-foreground-muted)]">Department Faculty List</p>
                                </div>
                                <button onClick={() => setInchargeModalOpen(false)} className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]">×</button>
                            </div>

                            <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-background-tertiary)]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={facultySearchQuery}
                                        onChange={(e) => setFacultySearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="p-4 overflow-y-auto flex-1 space-y-2">
                                {deptFaculty.map((faculty, index) => {
                                    const isCurrent = faculty.id === timetable?.incharge?.faculty_id;
                                    const assignedTo = allIncharges.find(ic => ic.faculty === faculty.id && ic.section !== selectedClass.id);

                                    return (
                                        <div
                                            key={faculty.id}
                                            ref={index === deptFaculty.length - 1 ? (node => lastElementRef(node)) : null}
                                        >
                                            <button
                                                disabled={isCurrent || inchargeLoading}
                                                onClick={() => handleInchargeChangeClick(faculty)}
                                                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${isCurrent
                                                        ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] opacity-80'
                                                        : 'bg-[var(--color-background-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FacultyAvatar src={faculty.profile_photo} name={faculty.name} size="md" />
                                                    <div className="flex flex-col">
                                                        <p className="font-bold text-sm">{faculty.name}</p>
                                                        {assignedTo && (
                                                            <p className="text-[10px] text-[var(--color-warning)] font-bold">In-Charge: {assignedTo.section_full_name}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {isCurrent && <ShieldCheck size={16} className="text-[var(--color-primary)]" />}
                                            </button>
                                        </div>
                                    );
                                })}
                                {isFetchingMore && (
                                    <div className="mt-2 flex justify-center py-2">
                                        <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {inchargeConfirmModalOpen && pendingIncharge && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
                        <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-2xl text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-warning-light)]">
                                <AlertCircle size={28} className="text-[var(--color-warning)]" />
                            </div>
                            <h3 className="text-lg font-bold">Ownership Conflict</h3>
                            <p className="mt-2 text-sm text-[var(--color-foreground-secondary)] px-2">
                                <span className="font-bold">{pendingIncharge.name}</span> is already the In-Charge for <span className="font-bold text-[var(--color-primary)]">{conflictClass}</span>.
                            </p>
                            <p className="mt-1 text-sm text-[var(--color-foreground-secondary)]">Do you really want to reassign them to this class?</p>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setInchargeConfirmModalOpen(false)}
                                    className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-semibold hover:bg-[var(--color-background-secondary)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => void confirmInchargeAssignment(pendingIncharge.id)}
                                    disabled={inchargeLoading}
                                    className="flex-1 bg-[var(--color-primary)] py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                                >
                                    {inchargeLoading && <Loader2 size={14} className="animate-spin" />}
                                    Yes, Reassign
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Timetable Copilot Floating Panel */}
                <AICopilotPanel 
                    selectedClass={selectedClass} 
                    semesterId={timetable?.semester_id || globalSemesterId} 
                    onProposalApplied={() => selectedClass && fetchTimetable(selectedClass.id)}
                />
            </div>
        </PageLayout>
    );
}
