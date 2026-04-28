import api from '../lib/axios';

export interface HODStudentListItem {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    registerNumber: string;
    rollNumber: string;
    departmentName: string;
    courseName: string;
    sectionName: string;
    year: number;
    semester: number;
    academicStatus: string;
    profilePhoto: string | null;
    attendancePercentage?: number;
    gpa?: number;
}

export interface HODStudentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: HODStudentListItem[];
}

export interface FetchHODStudentsParams {
    search?: string;
    department_id?: number;
    course_id?: number;
    year?: string;
    academic_status?: string;
    page?: number;
    page_size?: number;
}

export interface HODStudentPerformanceItem {
    id: number;
    name: string;
    register_number: string;
    year: number;
    section: string;
    course: string;
    cgpa: number;
    attendance_percentage: number;
    arrears_count: number;
    last_semester_gpa: number;
}

export const fetchHODStudentList = async (
    params: FetchHODStudentsParams
): Promise<HODStudentListResponse> => {
    const { data } = await api.get<HODStudentListResponse>('/profile/hod/students/', { params });
    return data;
};

export const fetchHODStudentPerformance = async (
    params: FetchHODStudentsParams
): Promise<HODStudentPerformanceItem[]> => {
    const { data } = await api.get<HODStudentPerformanceItem[]>('/profile/hod/student-performance/', { params });
    return data;
};
