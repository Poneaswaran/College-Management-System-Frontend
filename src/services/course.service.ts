import api from './api';

export interface Course {
    id: number;
    name: string;
    code: string;
    department_name: string;
    duration_years: number;
}

export interface Department {
    id: number;
    name: string;
}

export interface CourseUpdatePayload {
    name: string;
    duration_years: number;
}

export interface CourseCreatePayload {
    name: string;
    code: string;
    department_id: number;
    duration_years: number;
}

export const courseService = {
    getCourses: async () => {
        const response = await api.get<{ courses: Course[] }>('/core/courses/');
        return response.data;
    },
    getDepartments: async () => {
        const response = await api.get<{ departments: Department[] }>('/core/departments/');
        return response.data;
    },
    updateCourse: async (id: number, data: CourseUpdatePayload) => {
        const response = await api.patch(`/core/admin/courses/${id}/`, data);
        return response.data;
    },
    createCourse: async (data: CourseCreatePayload) => {
        const response = await api.post('/core/admin/courses/create/', data);
        return response.data;
    },
    deleteCourse: async (id: number) => {
        const response = await api.delete(`/core/admin/courses/${id}/`);
        return response.data;
    },
    getHODCourses: async () => {
        const response = await api.get<any[]>('/timetable/hod/courses/');
        return response.data;
    }
};
