import api from './api';

export type GrievanceStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type GrievancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type GrievanceCategory = 'ACADEMIC' | 'FACILITY' | 'HOSTEL' | 'ADMINISTRATIVE' | 'DISCIPLINARY' | 'OTHER';

export interface Grievance {
    id: number;
    student: number;
    student_details: {
        id: number;
        register_number: string;
        full_name: string;
        profile_photo: string | null;
    };
    department: number;
    subject: string;
    description: string;
    category: GrievanceCategory;
    category_display: string;
    priority: GrievancePriority;
    priority_display: string;
    status: GrievanceStatus;
    status_display: string;
    created_at: string;
    updated_at: string;
    resolved_by: number | null;
    resolved_by_name: string | null;
    resolution_note: string | null;
    resolved_at: string | null;
}

export interface GrievanceListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Grievance[];
}

export interface GrievanceFilters {
    status?: GrievanceStatus;
    priority?: GrievancePriority;
    category?: GrievanceCategory;
    search?: string;
    page?: number;
    page_size?: number;
}

export const fetchGrievances = async (filters: GrievanceFilters = {}): Promise<GrievanceListResponse> => {
    const response = await api.get<GrievanceListResponse>('/grievances/requests/', { params: filters });
    return response.data;
};

export const resolveGrievance = async (id: number, resolution_note: string): Promise<Grievance> => {
    const response = await api.post<Grievance>(`/grievances/requests/${id}/resolve/`, { resolution_note });
    return response.data;
};

export const updateGrievanceStatus = async (id: number, status: GrievanceStatus): Promise<Grievance> => {
    const response = await api.post<Grievance>(`/grievances/requests/${id}/update-status/`, { status });
    return response.data;
};
