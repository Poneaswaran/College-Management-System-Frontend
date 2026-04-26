import api from './api';

export interface CurriculumSubject {
    id: number;
    code: string;
    name: string;
    type: string;
    semester_number: number;
    credits: number;
    is_active: boolean;
}

export interface CurriculumCourse {
    id: number;
    name: string;
    code: string;
    duration_years: number;
    subjectsCount: number;
    totalCredits: number;
}

export interface HODCurriculumData {
    departmentName: string;
    courses: CurriculumCourse[];
    subjectsBySemester: Record<string, CurriculumSubject[]>;
    totalSubjects: number;
    totalCredits: number;
    coreSubjectsCount: number;
    electiveSubjectsCount: number;
    aiCurriculumInsight: string | null;
}

export const getHODCurriculum = async (): Promise<HODCurriculumData> => {
    const response = await api.get<HODCurriculumData>('/timetable/hod/curriculum/');
    return response.data;
};
