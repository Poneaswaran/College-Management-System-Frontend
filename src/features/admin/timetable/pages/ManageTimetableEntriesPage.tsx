import { useEffect, useMemo, useState } from 'react';
import { ListChecks } from 'lucide-react';
import PageLayout from '../../../../components/layout/PageLayout';
import { Header } from '../../../../components/layout/Header';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useToast } from '../../../../components/ui/Toast';
import TimetableEntriesTable from '../components/TimetableEntriesTable';
import { useTimetableFilters } from '../hooks';
import { getSectionTimetable } from '../services/timetableService';
import type { TimetableEntry } from '../types';

export default function ManageTimetableEntriesPage() {
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
        let isDisposed = false;

        const loadEntries = async () => {
            if (!semesterId) {
                setEntries([]);
                return;
            }

            setLoading(true);
            try {
                const semesterValue = Number(semesterId);
                const sectionValue = sectionId ? Number(sectionId) : null;

                if (sectionValue) {
                    const single = await getSectionTimetable(sectionValue, semesterValue);
                    if (!isDisposed) setEntries(single);
                    return;
                }

                const allSections = filters?.sections ?? [];
                const allResults = await Promise.all(
                    allSections.map((section) => getSectionTimetable(section.id, semesterValue))
                );

                const merged = allResults.flat();
                if (!isDisposed) setEntries(merged);
            } catch {
                if (!isDisposed) {
                    setEntries([]);
                    addToast({ type: 'error', title: 'Failed to load timetable entries.' });
                }
            } finally {
                if (!isDisposed) setLoading(false);
            }
        };

        loadEntries();

        return () => {
            isDisposed = true;
        };
    }, [semesterId, sectionId, filters, addToast]);

    const semesterOptions = useMemo(
        () => (filters?.semesters ?? []).map((semester) => ({ label: semester.name, value: semester.id })),
        [filters]
    );

    const sectionOptions = useMemo(
        () => [
            { label: 'All Sections', value: 'ALL' },
            ...(filters?.sections ?? []).map((section) => ({ label: section.name, value: section.id })),
        ],
        [filters]
    );

    return (
        <PageLayout>
            <div className="space-y-6 pb-8">
                <Header
                    title="Manage Timetable Entries"
                    className="mb-2"
                    titleIcon={
                        <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                            <ListChecks size={20} className="text-[var(--color-primary)]" />
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
                            dataTestId="manage-timetable-semester"
                        />
                        <Dropdown
                            label="Section"
                            options={sectionOptions}
                            value={sectionId || 'ALL'}
                            onChange={(value) => {
                                const selected = String(value);
                                setSectionId(selected === 'ALL' ? '' : selected);
                            }}
                            placeholder="Filter by section"
                            dataTestId="manage-timetable-section"
                        />
                    </div>

                    <TimetableEntriesTable
                        entries={entries}
                        loading={loading || filtersLoading}
                        emptyMessage="Select a semester to load timetable entries."
                    />
                </div>
            </div>
        </PageLayout>
    );
}
