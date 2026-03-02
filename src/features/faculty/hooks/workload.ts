import { useState, useCallback } from 'react';
import { fetchFacultyWorkload } from '../api/workload';
import type { FacultyWorkloadData, WorkloadStatus } from '../types/workload';

interface UseFacultyWorkloadReturn {
    workloadData: FacultyWorkloadData | null;
    loading: boolean;
    error: string | null;
    loadWorkload: (semesterId?: number) => Promise<void>;
    filterByStatus: (status: WorkloadStatus | 'ALL') => void;
    activeStatusFilter: WorkloadStatus | 'ALL';
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const useFacultyWorkload = (): UseFacultyWorkloadReturn => {
    const [workloadData, setWorkloadData] = useState<FacultyWorkloadData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeStatusFilter, setActiveStatusFilter] = useState<WorkloadStatus | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const loadWorkload = useCallback(async (semesterId?: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFacultyWorkload(semesterId);
            setWorkloadData(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load faculty workload';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterByStatus = useCallback((status: WorkloadStatus | 'ALL') => {
        setActiveStatusFilter(status);
    }, []);

    return {
        workloadData,
        loading,
        error,
        loadWorkload,
        filterByStatus,
        activeStatusFilter,
        searchTerm,
        setSearchTerm,
    };
};
