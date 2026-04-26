import api from './api';

export interface School {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
}

export const schoolService = {
    getSchools: async () => {
        const response = await api.get<{ schools: School[] }>('/core/schools/');
        return response.data;
    }
};
