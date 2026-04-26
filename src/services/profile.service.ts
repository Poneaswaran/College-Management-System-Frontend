import api from '../lib/axios';

export interface StudentProfile {
    id: number;
    first_name: string;
    last_name: string;
    register_number: string;
    roll_number: string | null;
    department_name: string;
    year: number;
    semester: number;
    profile_photo: string | null;
}

export interface FacultyProfile {
    id: number;
    full_name: string;
    email: string | null;
    department_name: string | null;
    designation: string;
    profile_photo: string | null;
}

class ProfileService {
    async getStudents(params: any = {}): Promise<{ results: StudentProfile[], count: number }> {
        const response = await api.get('/profile/students/', { params });
        // If it's not paginated, response.data might be an array
        if (Array.isArray(response.data)) {
            return { results: response.data, count: response.data.length };
        }
        return response.data;
    }

    async getFaculties(params: any = {}): Promise<{ results: FacultyProfile[], count: number }> {
        const response = await api.get('/profile/hod/faculty-list/', { params });
        return response.data;
    }

    async downloadIDCard(type: 'students' | 'faculty', id: string | number, orientation: 'landscape' | 'portrait' = 'landscape') {
        const endpoint = type === 'students' 
            ? `/profile/students/${id}/id-card/` 
            : `/profile/faculty/${id}/id-card/`;
        
        const response = await api.get(endpoint, { 
            params: { orientation },
            responseType: 'blob' 
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `id_card_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
    }

    async bulkGenerateIDCards(type: 'students' | 'faculty', ids: number[], orientation: 'landscape' | 'portrait' = 'landscape') {
        const response = await api.post('/profile/id-cards/bulk-generate/', { type, ids, orientation }, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bulk_id_cards.pdf`);
        document.body.appendChild(link);
        link.click();
    }

    async updateStudent(registerNumber: string, data: any) {
        const response = await api.patch(`/profile/students/${registerNumber}/admin/`, data);
        return response.data;
    }

    async updateFaculty(userId: number, data: any) {
        const response = await api.patch('/profile/faculty/me/', { ...data, user_id: userId });
        return response.data;
    }
}

export default new ProfileService();
