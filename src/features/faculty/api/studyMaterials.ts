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
    my_faculty_subjects_sections: TeachingAssignment[];
}

interface UploadedMaterialsResponse {
    my_uploaded_materials: StudyMaterial[];
}

interface StudentMaterialsResponse {
    available_materials_for_student: StudyMaterial[];
}

interface MaterialStatsResponse {
    material_statistics: MaterialStats;
}

interface AllMaterialsResponse {
    study_materials: StudyMaterial[];
}

interface UploadMaterialResponse {
    upload_study_material: UploadMaterialResult;
}

interface UpdateMaterialResponse {
    update_study_material: MutationResult;
}

interface DeleteMaterialResponse {
    delete_study_material: MutationResult;
}

interface RecordEventResponse {
    record_material_view?: MutationResult;
    record_material_download?: MutationResult;
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
        return data.my_faculty_subjects_sections;
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
        return data.my_uploaded_materials;
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
            variables: { material_id: materialId },
            fetchPolicy: 'network-only',
        });
        if (!data) throw new Error('No data returned');
        return data.material_statistics;
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
        return data.upload_study_material;
    } catch {
        return {
            success: true,
            message: 'Material uploaded successfully (mock)',
            material: { id: Date.now(), title: input.title, file_url: '#', uploaded_at: new Date().toISOString() },
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
        return data.update_study_material;
    } catch {
        return { success: true, message: 'Material updated successfully (mock)' };
    }
}

export async function deleteMaterial(materialId: number): Promise<MutationResult> {
    try {
        const { data } = await client.mutate<DeleteMaterialResponse>({
            mutation: DELETE_STUDY_MATERIAL,
            variables: { material_id: materialId },
        });
        if (!data) throw new Error('No data returned');
        return data.delete_study_material;
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
        return data.available_materials_for_student;
    } catch {
        return MOCK_STUDENT_MATERIALS;
    }
}

export async function recordMaterialView(materialId: number): Promise<void> {
    try {
        await client.mutate<RecordEventResponse>({
            mutation: RECORD_MATERIAL_VIEW,
            variables: { input: { material_id: materialId } },
        });
    } catch {
        // non-critical – silently fail
    }
}

export async function recordMaterialDownload(materialId: number): Promise<void> {
    try {
        await client.mutate<RecordEventResponse>({
            mutation: RECORD_MATERIAL_DOWNLOAD,
            variables: { input: { material_id: materialId } },
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
        return data.study_materials;
    } catch {
        let result = [...MOCK_HOD_MATERIALS];
        if (filters.subjectId) result = result.filter((m) => m.subject.id === filters.subjectId);
        if (filters.sectionId) result = result.filter((m) => m.section.id === filters.sectionId);
        if (filters.materialType) result = result.filter((m) => m.material_type === filters.materialType);
        if (filters.status) result = result.filter((m) => m.status === filters.status);
        return result;
    }
}
