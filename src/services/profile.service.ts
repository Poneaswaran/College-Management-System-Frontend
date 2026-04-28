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
    phone?: string | null;
}

export interface FacultyProfile {
    id: number;
    user: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    date_of_birth: string | null;
    gender: string | null;
    department: number;
    department_name: string | null;
    designation: string;
    qualifications: string;
    specialization: string;
    joining_date: string;
    office_hours: string;
    teaching_load: number;
    profile_photo: string | null;
    research_interests: string[];
    experience: string | null;
    is_active: boolean;
}

type ApiParams = Record<string, string | number | boolean | undefined | null>;

type StudentUpdatePayload = Partial<{
    roll_number: string;
    year: number;
    semester: number;
}>;

type FacultyUpdatePayload = Partial<{
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    date_of_birth: string;
    gender: string;
    designation: string;
    qualifications: string;
    specialization: string;
    office_hours: string;
    teaching_load: number;
    research_interests: string[];
    experience: string;
    user_id: number;
}>;

class ProfileService {
    async getStudents(params: ApiParams = {}): Promise<{ results: StudentProfile[]; count: number }> {
        const response = await api.get('/profile/students/', { params });
        if (Array.isArray(response.data)) {
            return { results: response.data, count: response.data.length };
        }
        return response.data as { results: StudentProfile[]; count: number };
    }

    async getFaculties(params: ApiParams = {}): Promise<{ results: FacultyProfile[]; count: number }> {
        const response = await api.get('/profile/hod/faculty-list/', { params });
        return response.data as { results: FacultyProfile[]; count: number };
    }

    async getFacultyProfile(): Promise<FacultyProfile> {
        const response = await api.get('/profile/faculty/me/');
        return response.data;
    }

    async downloadIDCard(
        type: 'students' | 'faculty',
        id: string | number,
        orientation: 'landscape' | 'portrait' = 'landscape',
    ) {
        const endpoint =
            type === 'students'
                ? `/profile/students/${id}/id-card/`
                : `/profile/faculty/${id}/id-card/`;

        const response = await api.get(endpoint, {
            params: { orientation },
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `id_card_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    async bulkGenerateIDCards(
        type: 'students' | 'faculty',
        ids: number[],
        orientation: 'landscape' | 'portrait' = 'landscape',
    ) {
        const response = await api.post(
            '/profile/id-cards/bulk-generate/',
            { type, ids, orientation },
            { responseType: 'blob' },
        );
        const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'bulk_id_cards.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    async updateStudent(registerNumber: string, data: StudentUpdatePayload) {
        const response = await api.patch(`/profile/students/${registerNumber}/admin/`, data);
        return response.data;
    }

    async updateFaculty(userId: number, data: FacultyUpdatePayload) {
        const response = await api.patch('/profile/faculty/me/', { ...data, user_id: userId });
        return response.data;
    }
}

export default new ProfileService();
