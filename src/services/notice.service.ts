import api from './api';

export type TargetAudience = 'STUDENTS' | 'FACULTY' | 'BOTH';

export interface DepartmentNotice {
    id: number;
    title: string;
    message: string;
    department: number;
    department_name: string;
    created_by: number;
    created_by_name: string;
    target_audience: TargetAudience;
    created_at: string;
    updated_at: string;
}

export interface CreateNoticeData {
    title: string;
    message: string;
    target_audience: TargetAudience;
}

export const noticeService = {
    // HOD methods
    getHODNotices: async () => {
        const response = await api.get<DepartmentNotice[]>('/notifications/hod/notices/');
        return response.data;
    },

    createNotice: async (data: CreateNoticeData) => {
        const response = await api.post<DepartmentNotice>('/notifications/hod/notices/', data);
        return response.data;
    },

    deleteNotice: async (id: number) => {
        await api.delete(`/notifications/hod/notices/${id}/`);
    },

    // Faculty methods
    getFacultyAnnouncements: async () => {
        const response = await api.get<DepartmentNotice[]>('/notifications/faculty/announcements/');
        return response.data;
    }
};
