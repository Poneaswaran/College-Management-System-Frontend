import api from '../lib/axios';

export interface HODFacultyListItem {
    id: number;
    user_id: number;
    full_name: string;
    email: string | null;
    department_id: number | null;
    department_name: string | null;
    designation: string;
    specialization: string;
    joining_date: string;
    office_hours: string;
    teaching_load: number;
    is_active: boolean;
}

export interface HODFacultyListResponse {
    count: number;
    page: number;
    page_size: number;
    results: HODFacultyListItem[];
}

export interface HODFacultyListParams {
    search?: string;
    designation?: string;
    is_active?: boolean;
    page?: number;
    page_size?: number;
}

export async function fetchHODFacultyList(
    params: HODFacultyListParams,
): Promise<HODFacultyListResponse> {
    const { data } = await api.get<HODFacultyListResponse>('/profile/hod/faculty-list/', {
        params,
    });
    return data;
}
