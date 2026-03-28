import { useCallback, useEffect, useState } from 'react';
import {
    createBulkTimetable,
    createSingleEntry,
    getFacultyTimetable,
    getFilters,
    getSectionTimetable,
} from '../services/timetableService';
import type {
    CreateBulkTimetablePayload,
    CreateSingleEntryPayload,
    TimetableEntry,
    TimetableFilters,
} from '../types';

interface UseTimetableFiltersArgs {
    semesterId?: number | null;
    sectionId?: number | null;
}

export function useTimetableFilters(args?: UseTimetableFiltersArgs) {
    const [filters, setFilters] = useState<TimetableFilters | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const semesterId = args?.semesterId ?? null;
    const sectionId = args?.sectionId ?? null;

    const fetchFilters = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFilters({
                semester_id: semesterId ?? undefined,
                section_id: sectionId ?? undefined,
            });
            setFilters(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load timetable filters';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [semesterId, sectionId]);

    useEffect(() => {
        fetchFilters();
    }, [fetchFilters]);

    return {
        filters,
        loading,
        error,
        refetch: fetchFilters,
    };
}

export function useSectionTimetable(sectionId: number | null, semesterId: number | null) {
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        if (!sectionId || !semesterId) {
            setEntries([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await getSectionTimetable(sectionId, semesterId);
            setEntries(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load section timetable';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [sectionId, semesterId]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    return {
        entries,
        loading,
        error,
        refetch: fetchEntries,
    };
}

export function useFacultyTimetable(facultyId: number | null, semesterId: number | null) {
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        if (!facultyId || !semesterId) {
            setEntries([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await getFacultyTimetable(facultyId, semesterId);
            setEntries(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load faculty timetable';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [facultyId, semesterId]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    return {
        entries,
        loading,
        error,
        refetch: fetchEntries,
    };
}

export function useCreateTimetable() {
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitBulk = useCallback(async (payload: CreateBulkTimetablePayload) => {
        setCreating(true);
        setError(null);
        try {
            await createBulkTimetable(payload);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create timetable';
            setError(message);
            throw err;
        } finally {
            setCreating(false);
        }
    }, []);

    const submitSingle = useCallback(async (payload: CreateSingleEntryPayload) => {
        setCreating(true);
        setError(null);
        try {
            await createSingleEntry(payload);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create timetable entry';
            setError(message);
            throw err;
        } finally {
            setCreating(false);
        }
    }, []);

    return {
        creating,
        error,
        submitBulk,
        submitSingle,
    };
}
