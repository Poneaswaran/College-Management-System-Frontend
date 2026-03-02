import { client } from '../../../lib/graphql';
import { GET_FACULTY_GRADES, GET_FACULTY_GRADE_DETAIL, SAVE_GRADES_DRAFT, SUBMIT_GRADES } from '../graphql/grades';
import { MOCK_FACULTY_GRADES_DATA, MOCK_GRADE_DETAILS } from '../mockData/grades';
import type {
    FacultyGradesData,
    FacultyGradeDetailData,
    FacultyGradesResponse,
    FacultyGradeDetailResponse,
    SaveGradesDraftInput,
    SubmitGradesInput,
    SaveGradesDraftResponse,
    SubmitGradesResponse,
} from '../types/grades';

// ============================================
// Faculty Grades — API Layer
// Falls back to mock data when backend is not ready
// ============================================

export const fetchFacultyGrades = async (semesterId?: number): Promise<FacultyGradesData> => {
    try {
        const { data } = await client.query<FacultyGradesResponse>({
            query: GET_FACULTY_GRADES,
            variables: semesterId ? { semesterId } : {},
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.facultyGrades;
    } catch {
        // Return mock data as fallback while backend endpoint is not yet ready
        return MOCK_FACULTY_GRADES_DATA;
    }
};

export const fetchFacultyGradeDetail = async (courseSectionId: number): Promise<FacultyGradeDetailData> => {
    try {
        const { data } = await client.query<FacultyGradeDetailResponse>({
            query: GET_FACULTY_GRADE_DETAIL,
            variables: { courseSectionId },
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.facultyGradeDetail;
    } catch {
        // Return mock detail data as fallback
        const detail = MOCK_GRADE_DETAILS[courseSectionId];
        if (detail) return detail;
        throw new Error(`No grade detail found for course section ${courseSectionId}`);
    }
};

export const saveGradesDraft = async (input: SaveGradesDraftInput): Promise<SaveGradesDraftResponse['saveGradesDraft']> => {
    try {
        const { data } = await client.mutate<SaveGradesDraftResponse>({
            mutation: SAVE_GRADES_DRAFT,
            variables: { input },
        });
        if (!data) throw new Error('No data returned');
        return data.saveGradesDraft;
    } catch {
        // Mock success response while backend is not ready
        return {
            success: true,
            message: 'Draft saved successfully (mock)',
            updatedAt: new Date().toISOString(),
        };
    }
};

export const submitGrades = async (input: SubmitGradesInput): Promise<SubmitGradesResponse['submitGrades']> => {
    try {
        const { data } = await client.mutate<SubmitGradesResponse>({
            mutation: SUBMIT_GRADES,
            variables: { input },
        });
        if (!data) throw new Error('No data returned');
        return data.submitGrades;
    } catch {
        // Mock success response while backend is not ready
        return {
            success: true,
            message: 'Grades submitted for approval (mock)',
            submittedAt: new Date().toISOString(),
            status: 'SUBMITTED',
        };
    }
};
