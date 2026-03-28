import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus2 } from 'lucide-react';
import PageLayout from '../../../../components/layout/PageLayout';
import { Header } from '../../../../components/layout/Header';
import { Button } from '../../../../components/ui/Button';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useToast } from '../../../../components/ui/Toast';
import TimetableEntryRows, { type DraftTimetableEntry } from '../components/TimetableEntryRows';
import { useCreateTimetable, useTimetableFilters } from '../hooks';
import type { CreateBulkTimetablePayload } from '../types';

const createDraftEntry = (): DraftTimetableEntry => ({
    rowId: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    subject_id: '',
    faculty_id: '',
    period_definition_id: '',
    room_id: '',
    notes: '',
});

const findDuplicates = (values: string[]): string[] => {
    const counts = new Map<string, number>();
    values.forEach((value) => {
        counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return values.filter((value) => value !== '' && (counts.get(value) ?? 0) > 1);
};

export default function CreateTimetablePage() {
    const { addToast } = useToast();
    const { creating, submitBulk } = useCreateTimetable();

    const [semesterId, setSemesterId] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [rows, setRows] = useState<DraftTimetableEntry[]>([createDraftEntry()]);

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

    const semesterOptions = useMemo(
        () => (filters?.semesters ?? []).map((semester) => ({ label: semester.name, value: semester.id })),
        [filters]
    );

    const sectionOptions = useMemo(
        () => (filters?.sections ?? []).map((section) => ({ label: section.name, value: section.id })),
        [filters]
    );

    const selectedSemesterValue = semesterId ? Number(semesterId) : 0;

    const filteredSubjects = useMemo(() => {
        if (!selectedSemesterValue) return filters?.subjects ?? [];
        return (filters?.subjects ?? []).filter((subject) => subject.semesterNumber === selectedSemesterValue);
    }, [filters, selectedSemesterValue]);

    const filteredPeriods = useMemo(() => {
        const allPeriods = filters?.periods ?? [];
        if (!selectedSemesterValue) return allPeriods;

        const semesterBoundPeriods = allPeriods.filter((period) => (period.semesterId ?? 0) > 0);
        if (semesterBoundPeriods.length === 0) return allPeriods;

        return allPeriods.filter((period) => period.semesterId === selectedSemesterValue);
    }, [filters, selectedSemesterValue]);

    const validPeriodIdsForSemester = useMemo(
        () => new Set(filteredPeriods.map((period) => String(period.id))),
        [filteredPeriods]
    );

    const duplicatePeriodValues = findDuplicates(rows.map((row) => row.period_definition_id));

    const duplicateFacultyPeriodKeys = (() => {
        const keys = rows.map((row) => (
            row.faculty_id && row.period_definition_id ? `${row.faculty_id}-${row.period_definition_id}` : ''
        ));
        return findDuplicates(keys);
    })();

    const duplicatePeriodRows = rows
        .filter((row) => row.period_definition_id && duplicatePeriodValues.includes(row.period_definition_id))
        .map((row) => row.rowId);

    const duplicateFacultyPeriodRows = rows
        .filter((row) => (
            row.faculty_id
            && row.period_definition_id
            && duplicateFacultyPeriodKeys.includes(`${row.faculty_id}-${row.period_definition_id}`)
        ))
        .map((row) => row.rowId);

    const onChangeRow = (rowId: string, key: keyof DraftTimetableEntry, value: string) => {
        setRows((prev) => prev.map((row) => (row.rowId === rowId ? { ...row, [key]: value } : row)));
    };

    const onAddRow = () => {
        setRows((prev) => [...prev, createDraftEntry()]);
    };

    const onRemoveRow = (rowId: string) => {
        setRows((prev) => (prev.length === 1 ? prev : prev.filter((row) => row.rowId !== rowId)));
    };

    const validateForm = (): boolean => {
        if (!semesterId || !sectionId) {
            addToast({ type: 'error', title: 'Semester and section are required.' });
            return false;
        }

        const hasMissingField = rows.some(
            (row) => !row.subject_id || !row.faculty_id || !row.period_definition_id || !row.room_id
        );
        if (hasMissingField) {
            addToast({ type: 'error', title: 'Every row must include subject, faculty, period, and room.' });
            return false;
        }

        const hasSubjectSemesterMismatch = rows.some((row) => {
            const subject = (filters?.subjects ?? []).find((item) => String(item.id) === row.subject_id);
            return !subject || subject.semesterNumber !== Number(semesterId);
        });
        if (hasSubjectSemesterMismatch) {
            addToast({ type: 'error', title: 'Selected subject must belong to the selected semester.' });
            return false;
        }

        if (validPeriodIdsForSemester.size > 0) {
            const hasInvalidPeriod = rows.some((row) => !validPeriodIdsForSemester.has(row.period_definition_id));
            if (hasInvalidPeriod) {
                addToast({ type: 'error', title: 'Selected period must belong to the selected semester.' });
                return false;
            }
        }

        if (duplicatePeriodRows.length > 0) {
            addToast({ type: 'error', title: 'Duplicate periods detected for this section. Resolve clashes before submitting.' });
            return false;
        }

        if (duplicateFacultyPeriodRows.length > 0) {
            addToast({ type: 'error', title: 'Faculty clash detected for the same period. Resolve clashes before submitting.' });
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload: CreateBulkTimetablePayload = {
            section_id: Number(sectionId),
            semester_id: Number(semesterId),
            entries: rows.map((row) => ({
                subject_id: Number(row.subject_id),
                faculty_id: Number(row.faculty_id),
                period_definition_id: Number(row.period_definition_id),
                room_id: Number(row.room_id),
                notes: row.notes.trim() || undefined,
            })),
        };

        try {
            await submitBulk(payload);
            addToast({ type: 'success', title: 'Timetable created successfully.' });
            setRows([createDraftEntry()]);
        } catch {
            addToast({ type: 'error', title: 'Failed to create timetable. Please retry.' });
        }
    };

    return (
        <PageLayout>
            <div className="space-y-6 pb-8">
                <Header
                    title="Create Timetable"
                    className="mb-2"
                    titleIcon={
                        <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                            <CalendarPlus2 size={20} className="text-[var(--color-primary)]" />
                        </span>
                    }
                />

                <div className="px-4 md:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
                        <Dropdown
                            label="Semester"
                            options={semesterOptions}
                            value={semesterId}
                            onChange={(value) => setSemesterId(String(value))}
                            placeholder={filtersLoading ? 'Loading semesters...' : 'Select semester'}
                            dataTestId="create-timetable-semester"
                        />
                        <Dropdown
                            label="Section"
                            options={sectionOptions}
                            value={sectionId}
                            onChange={(value) => setSectionId(String(value))}
                            placeholder={filtersLoading ? 'Loading sections...' : 'Select section'}
                            dataTestId="create-timetable-section"
                        />
                    </div>

                    <TimetableEntryRows
                        rows={rows}
                        subjects={filteredSubjects}
                        faculties={filters?.faculties ?? []}
                        periods={filteredPeriods}
                        rooms={filters?.rooms ?? []}
                        duplicatePeriodRows={duplicatePeriodRows}
                        duplicateFacultyPeriodRows={duplicateFacultyPeriodRows}
                        onChange={onChangeRow}
                        onAddRow={onAddRow}
                        onRemoveRow={onRemoveRow}
                    />

                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={creating || filtersLoading}
                            className="h-11 px-6"
                            data-testid="create-timetable-submit"
                        >
                            {creating ? 'Creating...' : 'Create Timetable'}
                        </Button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
