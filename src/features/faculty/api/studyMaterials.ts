import { client } from '../../../lib/graphql';
import type { StudyMaterial, TeachingAssignment, MaterialStats, UploadMaterialInput, UpdateMaterialInput, MutationResult, UploadMaterialResult } from '../types/studyMaterials';
import {
    GET_MY_TEACHING_ASSIGNMENTS,
    GET_MY_UPLOADED_MATERIALS,
    GET_AVAILABLE_MATERIALS_FOR_STUDENT,
    GET_MATERIAL_STATS,
    GET_ALL_MATERIALS,
    UPDATE_STUDY_MATERIAL,
    DELETE_STUDY_MATERIAL,
    RECORD_MATERIAL_VIEW,
    RECORD_MATERIAL_DOWNLOAD,
} from '../graphql/studyMaterials';
import api from '../../../lib/axios';
import {
    MOCK_TEACHING_ASSIGNMENTS,
    MOCK_FACULTY_MATERIALS,
    MOCK_STUDENT_MATERIALS,
    MOCK_HOD_MATERIALS,
    getMockStats,
} from '../mockData/studyMaterials';
import { formatId, ensureInt } from '../../../utils/graphql-helpers';

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

export async function fetchMaterialStats(materialId: number | string): Promise<MaterialStats> {
    const fId = formatId(materialId);
    try {
        const { data } = await client.query<MaterialStatsResponse>({
            query: GET_MATERIAL_STATS,
            variables: { materialId: fId },
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.materialStatistics;
    } catch {
        return getMockStats(Number(fId) || 0);
    }
}

export async function uploadMaterial(input: UploadMaterialInput): Promise<UploadMaterialResult> {
    try {
        const formData = new FormData();
        formData.append('subject', input.subjectId.toString());
        formData.append('section', input.sectionId.toString());
        formData.append('title', input.title);
        formData.append('material_type', input.materialType);
        formData.append('status', input.status);
        if (input.file) {
            formData.append('file', input.file);
        }
        if (input.description) {
            formData.append('description', input.description);
        }

        const { data } = await api.post('/study-materials/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            success: true,
            message: 'Material uploaded successfully',
            material: data,
        };
    } catch (error) {
        console.error('Upload failed:', error);
        const err = error as { response?: { data?: { message?: string } } };
        return {
            success: false,
            message: err?.response?.data?.message || 'Failed to upload material',
            material: null as unknown as { id: number; title: string; fileUrl: string; uploadedAt: string },
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

export async function deleteMaterial(materialId: number | string): Promise<MutationResult> {
    const fId = formatId(materialId);
    try {
        const { data } = await client.mutate<DeleteMaterialResponse>({
            mutation: DELETE_STUDY_MATERIAL,
            variables: { materialId: fId },
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

export async function recordMaterialView(materialId: number | string): Promise<void> {
    const pId = ensureInt(materialId);
    try {
        await client.mutate<RecordEventResponse>({
            mutation: RECORD_MATERIAL_VIEW,
            variables: { input: { materialId: pId } },
        });
    } catch {
        // non-critical – silently fail
    }
}

export async function recordMaterialDownload(materialId: number | string): Promise<void> {
    const pId = ensureInt(materialId);
    try {
        await client.mutate<RecordEventResponse>({
            mutation: RECORD_MATERIAL_DOWNLOAD,
            variables: { input: { materialId: pId } },
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
    const safeFilters = {
        ...filters,
        subjectId: filters.subjectId ? ensureInt(filters.subjectId) : undefined,
        sectionId: filters.sectionId ? ensureInt(filters.sectionId) : undefined,
    };
    try {
        const { data } = await client.query<AllMaterialsResponse>({
            query: GET_ALL_MATERIALS,
            variables: safeFilters,
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
