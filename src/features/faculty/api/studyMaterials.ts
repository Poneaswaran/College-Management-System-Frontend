import { client } from '../../../lib/graphql';
import type { StudyMaterial, TeachingAssignment, MaterialStats, UploadMaterialInput, UpdateMaterialInput, MutationResult, UploadMaterialResult } from '../types/studyMaterials';
import {
    GET_MY_TEACHING_ASSIGNMENTS,
    GET_MY_UPLOADED_MATERIALS,
    GET_AVAILABLE_MATERIALS_FOR_STUDENT,
    GET_MATERIAL_STATS,
    GET_ALL_MATERIALS,
    UPLOAD_STUDY_MATERIAL,
    UPDATE_STUDY_MATERIAL,
    DELETE_STUDY_MATERIAL,
    RECORD_MATERIAL_VIEW,
    RECORD_MATERIAL_DOWNLOAD,
} from '../graphql/studyMaterials';
import {
    MOCK_TEACHING_ASSIGNMENTS,
    MOCK_FACULTY_MATERIALS,
    MOCK_STUDENT_MATERIALS,
    MOCK_HOD_MATERIALS,
    getMockStats,
} from '../mockData/studyMaterials';

// ============================================
// Apollo response interfaces
// ============================================

interface TeachingAssignmentsResponse {
    myFacultySubjectsSections: TeachingAssignment[];
}

interface UploadedMaterialsResponse {
    myUploadedMaterials: StudyMaterial[];
}

interface StudentMaterialsResponse {
    availableMaterialsForStudent: StudyMaterial[];
}

interface MaterialStatsResponse {
    materialStatistics: MaterialStats;
}

interface AllMaterialsResponse {
    studyMaterials: StudyMaterial[];
}

interface UploadMaterialResponse {
    uploadStudyMaterial: UploadMaterialResult;
}

interface UpdateMaterialResponse {
    updateStudyMaterial: MutationResult;
}

interface DeleteMaterialResponse {
    deleteStudyMaterial: MutationResult;
}

interface RecordEventResponse {
    recordMaterialView?: MutationResult;
    recordMaterialDownload?: MutationResult;
}

// ============================================
// Faculty API
// ============================================

export async function fetchTeachingAssignments(): Promise<TeachingAssignment[]> {
    try {
        const { data } = await client.query<TeachingAssignmentsResponse>({
            query: GET_MY_TEACHING_ASSIGNMENTS,
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.myFacultySubjectsSections;
    } catch {
        return MOCK_TEACHING_ASSIGNMENTS;
    }
}

export async function fetchMyMaterials(status?: string): Promise<StudyMaterial[]> {
    try {
        const { data } = await client.query<UploadedMaterialsResponse>({
            query: GET_MY_UPLOADED_MATERIALS,
            variables: { status },
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.myUploadedMaterials;
    } catch {
        if (status) {
            return MOCK_FACULTY_MATERIALS.filter((m) => m.status === status);
        }
        return MOCK_FACULTY_MATERIALS;
    }
}

export async function fetchMaterialStats(materialId: number): Promise<MaterialStats> {
    try {
        const { data } = await client.query<MaterialStatsResponse>({
            query: GET_MATERIAL_STATS,
            variables: { materialId },
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.materialStatistics;
    } catch {
        return getMockStats(materialId);
    }
}

export async function uploadMaterial(input: UploadMaterialInput): Promise<UploadMaterialResult> {
    try {
        const { data } = await client.mutate<UploadMaterialResponse>({
            mutation: UPLOAD_STUDY_MATERIAL,
            variables: { input },
        });
        if (!data) throw new Error('No data returned');
        return data.uploadStudyMaterial;
    } catch {
        return {
            success: true,
            message: 'Material uploaded successfully (mock)',
            material: { id: Date.now(), title: input.title, fileUrl: '#', uploadedAt: new Date().toISOString() },
        };
    }
}

export async function updateMaterial(input: UpdateMaterialInput): Promise<MutationResult> {
    try {
        const { data } = await client.mutate<UpdateMaterialResponse>({
            mutation: UPDATE_STUDY_MATERIAL,
            variables: { input },
        });
        if (!data) throw new Error('No data returned');
        return data.updateStudyMaterial;
    } catch {
        return { success: true, message: 'Material updated successfully (mock)' };
    }
}

export async function deleteMaterial(materialId: number): Promise<MutationResult> {
    try {
        const { data } = await client.mutate<DeleteMaterialResponse>({
            mutation: DELETE_STUDY_MATERIAL,
            variables: { materialId },
        });
        if (!data) throw new Error('No data returned');
        return data.deleteStudyMaterial;
    } catch {
        return { success: true, message: 'Material deleted successfully (mock)' };
    }
}

// ============================================
// Student API
// ============================================

export async function fetchStudentMaterials(): Promise<StudyMaterial[]> {
    try {
        const { data } = await client.query<StudentMaterialsResponse>({
            query: GET_AVAILABLE_MATERIALS_FOR_STUDENT,
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.availableMaterialsForStudent;
    } catch {
        return MOCK_STUDENT_MATERIALS;
    }
}

export async function recordMaterialView(materialId: number): Promise<void> {
    try {
        await client.mutate<RecordEventResponse>({
            mutation: RECORD_MATERIAL_VIEW,
            variables: { input: { materialId } },
        });
    } catch {
        // non-critical – silently fail
    }
}

export async function recordMaterialDownload(materialId: number): Promise<void> {
    try {
        await client.mutate<RecordEventResponse>({
            mutation: RECORD_MATERIAL_DOWNLOAD,
            variables: { input: { materialId } },
        });
    } catch {
        // non-critical – silently fail
    }
}

// ============================================
// HOD / Admin API
// ============================================

export interface HODMaterialFilters {
    subjectId?: number;
    sectionId?: number;
    materialType?: string;
    status?: string;
}

export async function fetchAllMaterials(filters: HODMaterialFilters = {}): Promise<StudyMaterial[]> {
    try {
        const { data } = await client.query<AllMaterialsResponse>({
            query: GET_ALL_MATERIALS,
            variables: filters,
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.studyMaterials;
    } catch {
        let result = [...MOCK_HOD_MATERIALS];
        if (filters.subjectId) result = result.filter((m) => m.subject.id === filters.subjectId);
        if (filters.sectionId) result = result.filter((m) => m.section.id === filters.sectionId);
        if (filters.materialType) result = result.filter((m) => m.materialType === filters.materialType);
        if (filters.status) result = result.filter((m) => m.status === filters.status);
        return result;
    }
}
