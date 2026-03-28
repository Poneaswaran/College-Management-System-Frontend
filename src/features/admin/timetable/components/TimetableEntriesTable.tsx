import { DataTable, type Column } from '../../../../components/ui/DataTable';
import type { TimetableEntry } from '../types';

interface TimetableEntriesTableProps {
    entries: TimetableEntry[];
    loading?: boolean;
    emptyMessage?: string;
}

export default function TimetableEntriesTable({
    entries,
    loading = false,
    emptyMessage = 'No timetable entries found.',
}: TimetableEntriesTableProps) {
    const columns: Column<TimetableEntry>[] = [
        {
            key: 'day',
            header: 'Day',
            render: (row) => row.day || row.period.day || 'N/A',
        },
        {
            key: 'period',
            header: 'Period',
            render: (row) => row.period.name,
        },
        {
            key: 'subject',
            header: 'Subject',
            render: (row) => row.subject.name,
        },
        {
            key: 'faculty',
            header: 'Faculty',
            render: (row) => row.faculty.name,
        },
        {
            key: 'room',
            header: 'Room',
            render: (row) => row.room.name,
        },
        {
            key: 'time',
            header: 'Time',
            render: (row) => {
                const start = row.period.startTime || '';
                const end = row.period.endTime || '';
                if (!start && !end) return 'N/A';
                return `${start} - ${end}`;
            },
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={entries}
            loading={loading}
            emptyMessage={emptyMessage}
        />
    );
}
