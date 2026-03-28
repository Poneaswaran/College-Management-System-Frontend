import { useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import PageLayout from '../../../../components/layout/PageLayout';
import { Header } from '../../../../components/layout/Header';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useToast } from '../../../../components/ui/Toast';
import TimetableEntriesTable from '../components/TimetableEntriesTable';
import { useTimetableFilters } from '../hooks';
import { getSectionTimetable } from '../services/timetableService';
import type { TimetableEntry } from '../types';

export default function ViewSectionTimetablePage() {
    const { addToast } = useToast();

    const [semesterId, setSemesterId] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const semesterValue = semesterId ? Number(semesterId) : null;
    const sectionValue = sectionId ? Number(sectionId) : null;

    const { filters, loading: filtersLoading, error: filtersError } = useTimetableFilters({
        semesterId: semesterValue,
        sectionId: sectionValue,
    });

    useEffect(() => {
        if (filtersError) {
            addToast({ type: 'error', title: filtersError });
        }
    }, [filtersError, addToast]);

    useEffect(() => {
        if (!semesterId && (filters?.semesters?.length ?? 0) > 0) {
            setSemesterId(String(filters.semesters[0].id));
        }
    }, [filters, semesterId]);

    useEffect(() => {
        if (!sectionId && (filters?.sections?.length ?? 0) > 0) {
            setSectionId(String(filters.sections[0].id));
        }
    }, [filters, sectionId]);

    useEffect(() => {
        let disposed = false;

        const loadSectionTimetable = async () => {
            if (!sectionValue || !semesterValue) {
                setEntries([]);
                return;
            }

            setLoading(true);
            try {
                const response = await getSectionTimetable(sectionValue, semesterValue);
                if (!disposed) {
                    setEntries(response);
                }
            } catch {
                if (!disposed) {
                    setEntries([]);
                    addToast({ type: 'error', title: 'Failed to load section timetable.' });
                }
            } finally {
                if (!disposed) {
                    setLoading(false);
                }
            }
        };

        loadSectionTimetable();

        return () => {
            disposed = true;
        };
    }, [sectionValue, semesterValue, addToast]);

    useEffect(() => {
        if ((filters?.sections?.length ?? 0) === 0) {
            setSectionId('');
            setEntries([]);
        }
    }, [filters]);

    const semesterOptions = useMemo(
        () => (filters?.semesters ?? []).map((semester) => ({ label: semester.name, value: semester.id })),
        [filters]
    );

    const sectionOptions = useMemo(
        () => (filters?.sections ?? []).map((section) => ({ label: section.name, value: section.id })),
        [filters]
    );

    return (
        <PageLayout>
            <div className="space-y-6 pb-8">
                <Header
                    title="View Section Timetable"
                    className="mb-2"
                    titleIcon={
                        <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                            <CalendarDays size={20} className="text-[var(--color-primary)]" />
                        </span>
                    }
                />

                <div className="px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
                        <Dropdown
                            label="Semester"
                            options={semesterOptions}
                            value={semesterId}
                            onChange={(value) => setSemesterId(String(value))}
                            placeholder={filtersLoading ? 'Loading semesters...' : 'Select semester'}
                            dataTestId="timetable-section-semester"
                        />
                        <Dropdown
                            label="Section"
                            options={sectionOptions}
                            value={sectionId}
                            onChange={(value) => setSectionId(String(value))}
                            placeholder={filtersLoading ? 'Loading sections...' : 'Select section'}
                            dataTestId="timetable-section-section"
                        />
                    </div>

                    <TimetableEntriesTable
                        entries={entries}
                        loading={loading || filtersLoading}
                        emptyMessage="Choose semester and section to call section timetable API and view entries."
                    />
                </div>
            </div>
        </PageLayout>
    );
}
