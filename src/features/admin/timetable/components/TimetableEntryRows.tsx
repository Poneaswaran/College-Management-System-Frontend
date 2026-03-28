import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Dropdown } from '../../../../components/ui/Dropdown';
import type { Faculty, PeriodDefinition, Room, Subject } from '../types';

export interface DraftTimetableEntry {
    rowId: string;
    subject_id: string;
    faculty_id: string;
    period_definition_id: string;
    room_id: string;
    notes: string;
}

interface TimetableEntryRowsProps {
    rows: DraftTimetableEntry[];
    subjects: Subject[];
    faculties: Faculty[];
    periods: PeriodDefinition[];
    rooms: Room[];
    duplicatePeriodRows: string[];
    duplicateFacultyPeriodRows: string[];
    onChange: (rowId: string, key: keyof DraftTimetableEntry, value: string) => void;
    onAddRow: () => void;
    onRemoveRow: (rowId: string) => void;
}

const toOptions = (items: Array<{ id: number; name: string }>) =>
    items.map((item) => ({ label: item.name, value: item.id }));

const getPeriodLabel = (period: PeriodDefinition): string => {
    const dayPart = period.day ? `${period.day} - ` : '';
    const timePart = period.startTime && period.endTime ? ` (${period.startTime} - ${period.endTime})` : '';
    return `${dayPart}${period.name}${timePart}`;
};

export default function TimetableEntryRows({
    rows,
    subjects,
    faculties,
    periods,
    rooms,
    duplicatePeriodRows,
    duplicateFacultyPeriodRows,
    onChange,
    onAddRow,
    onRemoveRow,
}: TimetableEntryRowsProps) {
    const subjectOptions = toOptions(subjects);
    const facultyOptions = toOptions(faculties);
    const roomOptions = toOptions(rooms);
    const periodOptions = periods.map((period) => ({
        label: getPeriodLabel(period),
        value: period.id,
    }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Timetable Entries</h2>
                <Button type="button" onClick={onAddRow} className="flex items-center gap-2">
                    <Plus size={16} />
                    Add Row
                </Button>
            </div>

            <div className="space-y-3">
                {rows.map((row, index) => {
                    const hasDuplicatePeriod = duplicatePeriodRows.includes(row.rowId);
                    const hasFacultyConflict = duplicateFacultyPeriodRows.includes(row.rowId);

                    return (
                        <div
                            key={row.rowId}
                            className={`border rounded-xl p-4 space-y-4 ${
                                hasDuplicatePeriod || hasFacultyConflict
                                    ? 'border-[var(--color-error)] bg-[var(--color-error)]/5'
                                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Entry {index + 1}</p>
                                <button
                                    type="button"
                                    onClick={() => onRemoveRow(row.rowId)}
                                    disabled={rows.length === 1}
                                    className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Remove entry row"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                                <Dropdown
                                    label="Subject"
                                    options={subjectOptions}
                                    value={row.subject_id}
                                    onChange={(value) => onChange(row.rowId, 'subject_id', String(value))}
                                    placeholder="Select subject"
                                />
                                <Dropdown
                                    label="Faculty"
                                    options={facultyOptions}
                                    value={row.faculty_id}
                                    onChange={(value) => onChange(row.rowId, 'faculty_id', String(value))}
                                    placeholder="Select faculty"
                                />
                                <Dropdown
                                    label="Period"
                                    options={periodOptions}
                                    value={row.period_definition_id}
                                    onChange={(value) => onChange(row.rowId, 'period_definition_id', String(value))}
                                    placeholder="Select period"
                                />
                                <Dropdown
                                    label="Room"
                                    options={roomOptions}
                                    value={row.room_id}
                                    onChange={(value) => onChange(row.rowId, 'room_id', String(value))}
                                    placeholder="Select room"
                                />
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-[var(--color-foreground)] uppercase tracking-wider text-[11px]">
                                        Notes
                                    </label>
                                    <input
                                        value={row.notes}
                                        onChange={(event) => onChange(row.rowId, 'notes', event.target.value)}
                                        placeholder="Optional notes"
                                        className="w-full px-4 py-2.5 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
                                    />
                                </div>
                            </div>

                            {hasDuplicatePeriod && (
                                <p className="text-xs font-medium text-[var(--color-error)]">
                                    Duplicate period detected for this section. Choose a different period.
                                </p>
                            )}
                            {hasFacultyConflict && (
                                <p className="text-xs font-medium text-[var(--color-error)]">
                                    Faculty conflict detected: same faculty is assigned to the same period more than once.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
