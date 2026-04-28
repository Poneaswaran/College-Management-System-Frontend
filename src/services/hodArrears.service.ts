import api from '../lib/axios';

export interface ArrearStudent {
    id: number;
    full_name: string;
    register_number: string;
    semester: number;
}

export interface ArrearSubject {
    id: number;
    name: string;
    code: string;
}

export interface ArrearResult {
    id: number;
    student: ArrearStudent;
    subject: ArrearSubject;
    exam_name: string;
    marks_obtained: string;
    percentage: string;
    grade_letter: string;
    status: string;
}

export interface ArrearListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ArrearResult[];
}

export interface FetchArrearsParams {
    page?: number;
    page_size?: number;
    search?: string;
}

export const fetchHODArrears = async (
    params: FetchArrearsParams
): Promise<ArrearListResponse> => {
    const { data } = await api.get<ArrearListResponse>('/exams/hod-arrears/', { params });
    return data;
};
