import { client } from '../../../lib/graphql';
import { GET_FACULTY_WORKLOAD } from '../graphql/workload';
import { MOCK_FACULTY_WORKLOAD_DATA } from '../mockData/workload';
import type { FacultyWorkloadData, FacultyWorkloadResponse } from '../types/workload';

export const fetchFacultyWorkload = async (semesterId?: number): Promise<FacultyWorkloadData> => {
    try {
        const { data } = await client.query<FacultyWorkloadResponse>({
            query: GET_FACULTY_WORKLOAD,
            variables: semesterId ? { semesterId } : {},
        });

        if (!data) throw new Error('No data returned');
        return data.facultyWorkload;
    } catch {
        // Return mock data as fallback while backend endpoint is not yet ready
        return MOCK_FACULTY_WORKLOAD_DATA;
    }
};
