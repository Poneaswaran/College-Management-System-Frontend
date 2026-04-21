import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, UserCheck, CalendarDays, Loader2 } from 'lucide-react';

import PageLayout from '../../../components/layout/PageLayout';
import { Header } from '../../../components/layout/Header';
import { useToast } from '../../../components/ui/Toast';
import api from '../../../api/axios.js';

type HODClass = {
    id: number;
    name: string;
    section: string;
    semester: number;
};

type Period = {
    id: number;
    label: string;
    start_time: string;
    end_time: string;
    order: number;
    is_break: boolean;
};

type Slot = {
    slot_id: number;
    day: string;
    period_id: number;
    subject_id: number | null;
    subject_name: string | null;
    faculty_id: number | null;
    faculty_name: string | null;
    is_assigned: boolean;
};

type TimetableResponse = {
    days: string[];
    periods: Period[];
    slots: Slot[];
};

type SubjectItem = {
    id: number;
    name: string;
};

type FacultyItem = {
    id: number;
    name: string;
};

type AssignmentStep = 'subject' | 'faculty';

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

    const [selectedClass, setSelectedClass] = useState<HODClass | null>(null);

    const [timetable, setTimetable] = useState<TimetableResponse | null>(null);
    const [timetableLoading, setTimetableLoading] = useState(false);

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

    const classSubjects = selectedClass ? subjectsByClass[selectedClass.id] || [] : [];
    const subjectFaculty = selectedSubject ? facultyBySubject[selectedSubject.id] || [] : [];

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

    const fetchClasses = useCallback(async () => {
        setClassesLoading(true);
        try {
            const { data } = await api.get<HODClass[]>('/hod/classes/');
            setClasses(data || []);
        } catch {
            addToast({
                type: 'error',
                title: 'Failed to load classes',
                message: 'Please try again in a moment.',
            });
            setClasses([]);
        } finally {
            setClassesLoading(false);
        }
    }, [addToast]);

    const fetchTimetable = useCallback(
        async (classId: number) => {
            setTimetableLoading(true);
            try {
                const { data } = await api.get<TimetableResponse>('/hod/timetable/', {
                    params: { class_id: classId },
                });
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
                const { data } = await api.get<SubjectItem[]>('/hod/subjects/', {
                    params: { class_id: classId },
                });
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

    const fetchFaculty = useCallback(
        async (subjectId: number) => {
            if (facultyBySubject[subjectId]) {
                return;
            }
            setFacultyLoading(true);
            try {
                const { data } = await api.get<FacultyItem[]>('/hod/faculty/', {
                    params: { subject_id: subjectId },
                });
                setFacultyBySubject((prev) => ({ ...prev, [subjectId]: data || [] }));
            } catch {
                addToast({
                    type: 'error',
                    title: 'Failed to load faculty',
                    message: 'Please retry faculty selection.',
                });
                setFacultyBySubject((prev) => ({ ...prev, [subjectId]: [] }));
            } finally {
                setFacultyLoading(false);
            }
        },
        [addToast, facultyBySubject],
    );

    useEffect(() => {
        void fetchClasses();
    }, [fetchClasses]);

    const openAssignmentModal = async (slot: Slot) => {
        if (!selectedClass) {
            return;
        }

        setActiveSlot(slot);
        setSelectedSubject(null);
        setSelectedFaculty(null);
        setActiveStep('subject');
        setConfirmError(null);
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
        await fetchFaculty(subject.id);
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
            const { data } = await api.post<{ success: boolean; slot: Slot }>('/hod/assign-slot/', {
                slot_id: activeSlot.slot_id,
                subject_id: selectedSubject.id,
                faculty_id: selectedFaculty.id,
            });

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

    const renderClassListView = () => {
        if (classesLoading) {
            return (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <ClassCardSkeleton key={`class-skeleton-${idx}`} />
                    ))}
                </div>
            );
        }

        if (!classes.length) {
            return (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-10 text-center">
                    <p className="text-lg font-semibold text-[var(--color-foreground)]">No classes found in your department</p>
                    <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">Please contact the admin to map classes.</p>
                </div>
            );
        }

        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {classes.map((klass) => (
                    <button
                        key={klass.id}
                        type="button"
                        onClick={() => void handleSelectClass(klass)}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-left shadow-sm transition-colors hover:border-[var(--color-primary)]"
                    >
                        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{klass.name}</h3>
                        <p className="mt-2 text-sm text-[var(--color-foreground-secondary)]">Section: {klass.section}</p>
                        <p className="text-sm text-[var(--color-foreground-secondary)]">Semester: {klass.semester}</p>
                    </button>
                ))}
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
                    <div className="text-right">
                        <p className="text-sm text-[var(--color-foreground-muted)]">Class</p>
                        <p className="font-semibold text-[var(--color-foreground)]">
                            {selectedClass.name} {selectedClass.section}
                        </p>
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
                                                        className={`h-full min-h-[70px] w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                                                            assigned
                                                                ? 'border-[var(--color-success)] bg-[var(--color-success-light)] text-[var(--color-foreground)] hover:opacity-90'
                                                                : 'border-[var(--color-border)] bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)] hover:border-[var(--color-primary)]'
                                                        }`}
                                                    >
                                                        {assigned ? (
                                                            <>
                                                                <p className="font-semibold">{slot.subject_name}</p>
                                                                <p className="text-xs">{slot.faculty_name}</p>
                                                            </>
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

                                    {facultyLoading && (
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
                                            {subjectFaculty.map((faculty) => (
                                                <button
                                                    key={faculty.id}
                                                    type="button"
                                                    onClick={() => handleSelectFaculty(faculty)}
                                                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-3 py-2 text-left text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)]"
                                                >
                                                    <span className="inline-flex items-center gap-2">
                                                        <UserCheck size={15} />
                                                        {faculty.name}
                                                    </span>
                                                </button>
                                            ))}
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
            </div>
        </PageLayout>
    );
}
