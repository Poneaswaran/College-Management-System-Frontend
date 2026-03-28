import {
    askAiTutor as askAiTutorFromService,
    availableMaterialsForStudent,
    deleteStudyMaterial,
    getStudyMaterialsApiMode,
    materialDownloadList,
    materialStatistics,
    myFacultySubjectsSections,
    myUploadedMaterials,
    recordMaterialDownload as recordMaterialDownloadFromService,
    recordMaterialView as recordMaterialViewFromService,
    studyMaterial,
    studyMaterials,
    updateStudyMaterial,
    uploadStudyMaterial,
} from '../../../services/studyMaterialsApi';
import type {
    AiTutorResponse,
    DownloadRecord,
    MaterialStats,
    MutationResult,
    StudyMaterial,
    TeachingAssignment,
    UploadMaterialInput,
    UploadMaterialResult,
    UpdateMaterialInput,
} from '../types/studyMaterials';
import {
    getMockStats,
    MOCK_FACULTY_MATERIALS,
    MOCK_HOD_MATERIALS,
    MOCK_STUDENT_MATERIALS,
    MOCK_TEACHING_ASSIGNMENTS,
} from '../mockData/studyMaterials';

export interface HODMaterialFilters {
    subjectId?: number;
    sectionId?: number;
    materialType?: string;
    status?: string;
}

export async function fetchTeachingAssignments(): Promise<TeachingAssignment[]> {
    try {
        return await myFacultySubjectsSections();
    } catch {
        return MOCK_TEACHING_ASSIGNMENTS;
    }
}

export async function fetchMyMaterials(status?: string): Promise<StudyMaterial[]> {
    try {
        return await myUploadedMaterials(status);
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Invalid status filter')) {
            throw error;
        }

        if (status) {
            return MOCK_FACULTY_MATERIALS.filter((material) => material.status === status);
        }
        return MOCK_FACULTY_MATERIALS;
    }
}

export async function fetchMaterialById(materialId: number | string): Promise<StudyMaterial | null> {
    try {
        return await studyMaterial(materialId);
    } catch {
        return MOCK_FACULTY_MATERIALS.find((material) => material.id === Number(materialId)) ?? null;
    }
}

export async function fetchMaterialStats(materialId: number | string): Promise<MaterialStats> {
    try {
        return await materialStatistics(materialId);
    } catch {
        return getMockStats(Number(materialId) || 0);
    }
}

export async function fetchMaterialDownloadList(materialId: number | string): Promise<DownloadRecord[]> {
    try {
        return await materialDownloadList(materialId);
    } catch {
        return getMockStats(Number(materialId) || 0).recentDownloads;
    }
}

export async function uploadMaterial(input: UploadMaterialInput): Promise<UploadMaterialResult> {
    try {
        return await uploadStudyMaterial(input);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to upload material';
        return {
            success: false,
            message,
            material: {
                id: 0,
                title: '',
                fileUrl: '#',
                uploadedAt: new Date(0).toISOString(),
                vectorizationStatus: 'PENDING',
            },
        };
    }
}

export async function updateMaterial(input: UpdateMaterialInput): Promise<MutationResult> {
    try {
        return await updateStudyMaterial(input);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update material';
        return { success: false, message };
    }
}

export async function deleteMaterial(materialId: number | string): Promise<MutationResult> {
    try {
        return await deleteStudyMaterial(materialId);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete material';
        return { success: false, message };
    }
}

export async function fetchStudentMaterials(): Promise<StudyMaterial[]> {
    try {
        return await availableMaterialsForStudent();
    } catch {
        return MOCK_STUDENT_MATERIALS;
    }
}

export async function recordMaterialView(materialId: number | string): Promise<void> {
    try {
        await recordMaterialViewFromService(materialId);
    } catch {
        // Non-critical action should not block student flow.
    }
}

export async function recordMaterialDownload(materialId: number | string): Promise<void> {
    try {
        await recordMaterialDownloadFromService(materialId);
    } catch {
        // Non-critical action should not block student flow.
    }
}

export async function fetchAllMaterials(filters: HODMaterialFilters = {}): Promise<StudyMaterial[]> {
    try {
        return await studyMaterials(filters);
    } catch {
        let result = [...MOCK_HOD_MATERIALS];
        if (filters.subjectId) result = result.filter((material) => material.subject.id === filters.subjectId);
        if (filters.sectionId) result = result.filter((material) => material.section.id === filters.sectionId);
        if (filters.materialType) result = result.filter((material) => material.materialType === filters.materialType);
        if (filters.status) result = result.filter((material) => material.status === filters.status);
        return result;
    }
}

export async function askAiTutor(materialId: number | string, message: string): Promise<AiTutorResponse> {
    return askAiTutorFromService(materialId, message);
}

export { getStudyMaterialsApiMode };
