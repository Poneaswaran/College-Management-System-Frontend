import api from '../../../services/api';
import type { FacultyWorkloadData } from '../types/workload';

export const fetchFacultyWorkload = async (semesterId?: number): Promise<FacultyWorkloadData> => {
    const response = await api.get<FacultyWorkloadData>('/timetable/hod/faculty-workload/', {
        params: semesterId ? { semester_id: semesterId } : {}
    });
    return response.data;
};
