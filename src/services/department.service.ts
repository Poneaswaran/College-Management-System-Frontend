import api from './api';

export interface Department {
    id: number;
    name: string;
    code: string;
}

export const departmentService = {
    getDepartments: async (schoolId?: number) => {
        const response = await api.get<{ departments: Department[] }>('/core/departments/', {
            params: { school_id: schoolId }
        });
        return response.data;
    },
    updateDepartment: async (id: number, data: { name: string; code: string }) => {
        const response = await api.patch(`/core/admin/departments/${id}/`, data);
        return response.data;
    },
    createDepartment: async (data: { name: string; code: string }) => {
        const response = await api.post('/core/admin/departments/create/', data);
        return response.data;
    },
    deleteDepartment: async (id: number) => {
        const response = await api.delete(`/core/admin/departments/${id}/`);
        return response.data;
    }
};
