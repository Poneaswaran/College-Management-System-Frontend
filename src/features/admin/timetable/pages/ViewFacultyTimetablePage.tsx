import { useEffect, useMemo, useState } from 'react';
import { UserRound } from 'lucide-react';
import PageLayout from '../../../../components/layout/PageLayout';
import { Header } from '../../../../components/layout/Header';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useToast } from '../../../../components/ui/Toast';
import TimetableEntriesTable from '../components/TimetableEntriesTable';
import { useTimetableFilters } from '../hooks';
import { getFacultyTimetable } from '../services/timetableService';
import type { TimetableEntry } from '../types';

export default function ViewFacultyTimetablePage() {
    const { addToast } = useToast();

    const [semesterId, setSemesterId] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const semesterValue = semesterId ? Number(semesterId) : null;
    const facultyValue = facultyId ? Number(facultyId) : null;

    const { filters, loading: filtersLoading, error: filtersError } = useTimetableFilters({
        semesterId: semesterValue,
    });

    useEffect(() => {
        if (filtersError) {
            addToast({ type: 'error', title: filtersError });
        }
    }, [filtersError, addToast]);

    useEffect(() => {
        if (!semesterId && (filters?.semesters?.length ?? 0) > 0) {
            setSemesterId(String(filters?.semesters[0].id));
        }
    }, [filters, semesterId]);

    useEffect(() => {
        if (!facultyId && (filters?.faculties?.length ?? 0) > 0) {
            setFacultyId(String(filters?.faculties[0].id));
        }
    }, [filters, facultyId]);

    useEffect(() => {
        let disposed = false;

        const loadFacultyTimetable = async () => {
            if (!semesterValue || !facultyValue) {
                setEntries([]);
                return;
            }

            setLoading(true);
            try {
                const response = await getFacultyTimetable(facultyValue, semesterValue);
                if (!disposed) {
                    setEntries(response);
                }
            } catch {
                if (!disposed) {
                    setEntries([]);
                    addToast({ type: 'error', title: 'Failed to load faculty timetable.' });
                }
            } finally {
                if (!disposed) {
                    setLoading(false);
                }
            }
        };

        loadFacultyTimetable();

        return () => {
            disposed = true;
        };
    }, [facultyValue, semesterValue, addToast]);

    useEffect(() => {
        if ((filters?.faculties?.length ?? 0) === 0) {
            setFacultyId('');
            setEntries([]);
        }
    }, [filters]);

    const semesterOptions = useMemo(
        () => (filters?.semesters ?? []).map((semester) => ({ label: semester.name, value: semester.id })),
        [filters]
    );

    const facultyOptions = useMemo(
        () => (filters?.faculties ?? []).map((faculty) => ({ label: faculty.name, value: faculty.id })),
        [filters]
    );

    return (
        <PageLayout>
            <div className="space-y-6 pb-8">
                <Header
                    title="View Faculty Timetable"
                    className="mb-2"
                    titleIcon={
                        <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                            <UserRound size={20} className="text-[var(--color-primary)]" />
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
                            dataTestId="timetable-faculty-semester"
                        />
                        <Dropdown
                            label="Faculty"
                            options={facultyOptions}
                            value={facultyId}
                            onChange={(value) => setFacultyId(String(value))}
                            placeholder={filtersLoading ? 'Loading faculty...' : 'Select faculty'}
                            dataTestId="timetable-faculty-faculty"
                        />
                    </div>

                    <TimetableEntriesTable
                        entries={entries}
                        loading={loading || filtersLoading}
                        emptyMessage="Choose semester and faculty to call faculty timetable API and view entries."
                    />
                </div>
            </div>
        </PageLayout>
    );
}
