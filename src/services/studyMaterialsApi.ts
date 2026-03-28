import { client } from '../lib/graphql';
import api from '../lib/axios';
import { getMediaUrl } from '../lib/constants';
import { ensureInt, formatId } from '../utils/graphql-helpers';
import type {
    DownloadRecord,
    MaterialStats,
    MutationResult,
    StudyMaterial,
    TeachingAssignment,
    UploadMaterialInput,
    UpdateMaterialInput,
    UploadMaterialResult,
    MaterialType,
    MaterialStatus,
    VectorizationStatus,
    AiTutorResponse,
} from '../features/faculty/types/studyMaterials';
import {
    DELETE_STUDY_MATERIAL,
    GET_ALL_MATERIALS,
    GET_AVAILABLE_MATERIALS_FOR_STUDENT,
    GET_MATERIAL_DOWNLOAD_LIST,
    GET_MATERIAL_STATS,
    GET_MY_TEACHING_ASSIGNMENTS,
    GET_MY_UPLOADED_MATERIALS,
    GET_STUDY_MATERIAL,
    RECORD_MATERIAL_DOWNLOAD,
    RECORD_MATERIAL_VIEW,
    UPDATE_STUDY_MATERIAL,
} from '../features/faculty/graphql/studyMaterials';

type ApiMode = 'graphql' | 'rest';

const STUDY_MATERIALS_API_MODE: ApiMode = import.meta.env.VITE_STUDY_MATERIALS_API_MODE === 'graphql' ? 'graphql' : 'rest';

const EMPTY_DATE = new Date(0).toISOString();

interface SubjectWire {
    id?: number;
    name?: string;
    code?: string;
}

interface SectionWire {
    id?: number;
    name?: string;
}

interface FacultyWire {
    id?: number;
    fullName?: string;
    name?: string;
}

interface StudyMaterialWire {
    id?: number;
    title?: string;
    description?: string;
    materialType?: MaterialType;
    material_type?: MaterialType;
    status?: MaterialStatus;
    subject?: SubjectWire | number;
    section?: SectionWire | number;
    faculty?: FacultyWire | number;
    fileUrl?: string;
    file_url?: string;
    file?: string;
    fileSizeMb?: number;
    file_size_mb?: number;
    file_size?: number;
    fileExtension?: string;
    file_extension?: string;
    viewCount?: number;
    view_count?: number;
    downloadCount?: number;
    download_count?: number;
    uploadedAt?: string;
    uploaded_at?: string;
    publishedAt?: string | null;
    published_at?: string | null;
    updatedAt?: string;
    updated_at?: string;
    vectorizationStatus?: VectorizationStatus;
    vectorization_status?: VectorizationStatus;
    vectorDocumentId?: string;
    vector_document_id?: string;
    lastIndexedAt?: string | null;
    last_indexed_at?: string | null;
    vectorErrorMessage?: string | null;
    vector_error_message?: string | null;
}

interface TeachingAssignmentWire {
    subjectId?: number;
    subject_id?: number;
    subjectName?: string;
    subject_name?: string;
    subjectCode?: string;
    subject_code?: string;
    sectionId?: number;
    section_id?: number;
    sectionName?: string;
    section_name?: string;
}

interface DownloadRecordWire {
    id?: number;
    studentName?: string;
    student_name?: string;
    studentRollNumber?: string;
    student_roll_number?: string;
    student?: {
        id?: number;
        name?: string;
        register_number?: string;
        roll_number?: string;
    };
    downloadedAt?: string;
    downloaded_at?: string;
    ipAddress?: string;
    ip_address?: string;
}

interface MaterialStatsWire {
    materialId?: number;
    material_id?: number;
    totalDownloads?: number;
    total_downloads?: number;
    uniqueDownloads?: number;
    unique_downloads?: number;
    totalViews?: number;
    total_views?: number;
    uniqueViews?: number;
    unique_views?: number;
    recentDownloads?: DownloadRecordWire[];
    recent_downloads?: DownloadRecordWire[];
}

interface GraphQLTeachingAssignmentsResponse {
    myFacultySubjectsSections: TeachingAssignment[];
}

interface GraphQLUploadedMaterialsResponse {
    myUploadedMaterials: StudyMaterial[];
}

interface GraphQLStudentMaterialsResponse {
    availableMaterialsForStudent: StudyMaterial[];
}

interface GraphQLMaterialStatsResponse {
    materialStatistics: MaterialStats;
}

interface GraphQLDownloadListResponse {
    materialDownloadList: DownloadRecord[];
}

interface GraphQLStudyMaterialResponse {
    studyMaterial: StudyMaterial;
}

interface GraphQLAllMaterialsResponse {
    studyMaterials: StudyMaterial[];
}

interface GraphQLUpdateMaterialResponse {
    updateStudyMaterial: MutationResult;
}

interface GraphQLDeleteMaterialResponse {
    deleteStudyMaterial: MutationResult;
}

interface GraphQLRecordEventResponse {
    recordMaterialView?: MutationResult;
    recordMaterialDownload?: MutationResult;
}

interface RestListEnvelope<T> {
    count?: number;
    results?: T[];
}

interface RestUploadResponse {
    success?: boolean;
    message?: string;
    material?: StudyMaterialWire;
}

interface RestMutationResponse {
    success?: boolean;
    message?: string;
    material?: StudyMaterialWire;
}

interface AiTutorRawSource {
    chunk_id?: string;
    snippet?: string;
    material_id?: number;
    score?: number;
}

interface RestAiTutorResponse {
    answer?: string;
    sources?: unknown[];
}

function toMaterialType(value: string | undefined): MaterialType {
    const valid: MaterialType[] = ['NOTES', 'REFERENCE', 'SLIDES', 'BOOK', 'PAPER', 'TUTORIAL', 'OTHER'];
    const candidate = (value ?? '').toUpperCase() as MaterialType;
    return valid.includes(candidate) ? candidate : 'OTHER';
}

function toMaterialStatus(value: string | undefined): MaterialStatus {
    const valid: MaterialStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    const candidate = (value ?? '').toUpperCase() as MaterialStatus;
    return valid.includes(candidate) ? candidate : 'DRAFT';
}

function toVectorizationStatus(value: string | undefined): VectorizationStatus {
    const valid: VectorizationStatus[] = ['PENDING', 'PROCESSING', 'INDEXED', 'FAILED'];
    const candidate = (value ?? '').toUpperCase() as VectorizationStatus;
    return valid.includes(candidate) ? candidate : 'PENDING';
}

function deriveFileExtension(filePath: string): string {
    const idx = filePath.lastIndexOf('.');
    if (idx === -1) return '';
    return filePath.slice(idx).toLowerCase();
}

function safeMessageFromStatus(status: number | undefined): string {
    if (status === 400) return 'Validation failed. Please review your input.';
    if (status === 401) return 'Your session has expired. Please login again.';
    if (status === 403) return 'You do not have permission for this action.';
    if (status === 404) return 'Requested study material was not found.';
    if (status === 429) return 'Too many requests. Please try again shortly.';
    if (status === 503) return 'AI tutor is currently unavailable. Please try again later.';
    return 'Something went wrong. Please try again.';
}

function extractErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
            response?: {
                status?: number;
                data?: {
                    detail?: string;
                    message?: string | string[];
                };
            };
        };

        const detail = apiError.response?.data?.detail;
        const message = apiError.response?.data?.message;

        if (Array.isArray(message) && message.length > 0) {
            return message.join(', ');
        }

        if (typeof message === 'string' && message.trim().length > 0) {
            return message;
        }

        if (typeof detail === 'string' && detail.trim().length > 0) {
            return detail;
        }

        return safeMessageFromStatus(apiError.response?.status);
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return 'Unexpected error occurred.';
}

function normalizeAiSource(source: unknown): string {
    if (typeof source === 'string') {
        return source;
    }

    if (source && typeof source === 'object') {
        const raw = source as AiTutorRawSource;
        const snippet = typeof raw.snippet === 'string' ? raw.snippet.trim() : '';
        const chunkId = typeof raw.chunk_id === 'string' ? raw.chunk_id : '';
        const score = typeof raw.score === 'number' ? raw.score : undefined;

        if (snippet) {
            return snippet;
        }

        if (chunkId && score !== undefined) {
            return `${chunkId} (score: ${score.toFixed(2)})`;
        }

        if (chunkId) {
            return chunkId;
        }
    }

    return 'Reference source';
}

function normalizeDownloadRecord(raw: DownloadRecordWire): DownloadRecord {
    const studentName = raw.studentName ?? raw.student_name ?? raw.student?.name ?? 'Unknown Student';
    const studentRollNumber = raw.studentRollNumber ?? raw.student_roll_number ?? raw.student?.register_number ?? raw.student?.roll_number ?? 'N/A';

    return {
        id: raw.id ?? 0,
        studentName,
        studentRollNumber,
        downloadedAt: raw.downloadedAt ?? raw.downloaded_at ?? EMPTY_DATE,
        ipAddress: raw.ipAddress ?? raw.ip_address ?? 'Unknown',
    };
}

function normalizeMaterialStats(raw: MaterialStatsWire): MaterialStats {
    return {
        materialId: raw.materialId ?? raw.material_id ?? 0,
        totalDownloads: raw.totalDownloads ?? raw.total_downloads ?? 0,
        uniqueDownloads: raw.uniqueDownloads ?? raw.unique_downloads ?? 0,
        totalViews: raw.totalViews ?? raw.total_views ?? 0,
        uniqueViews: raw.uniqueViews ?? raw.unique_views ?? 0,
        recentDownloads: (raw.recentDownloads ?? raw.recent_downloads ?? []).map(normalizeDownloadRecord),
    };
}

function normalizeTeachingAssignment(raw: TeachingAssignmentWire): TeachingAssignment {
    return {
        subjectId: raw.subjectId ?? raw.subject_id ?? 0,
        subjectName: raw.subjectName ?? raw.subject_name ?? '',
        subjectCode: raw.subjectCode ?? raw.subject_code ?? '',
        sectionId: raw.sectionId ?? raw.section_id ?? 0,
        sectionName: raw.sectionName ?? raw.section_name ?? '',
    };
}

function normalizeStudyMaterial(raw: StudyMaterialWire): StudyMaterial {
    const subjectObject = typeof raw.subject === 'object' ? raw.subject : undefined;
    const sectionObject = typeof raw.section === 'object' ? raw.section : undefined;
    const facultyObject = typeof raw.faculty === 'object' ? raw.faculty : undefined;

    const filePath = raw.fileUrl ?? raw.file_url ?? raw.file ?? '';
    const normalizedUrl = getMediaUrl(filePath) ?? '#';
    const bytes = raw.file_size ?? 0;
    const sizeMb = raw.fileSizeMb ?? raw.file_size_mb ?? (bytes > 0 ? bytes / (1024 * 1024) : 0);

    return {
        id: raw.id ?? 0,
        title: raw.title ?? '',
        description: raw.description ?? '',
        materialType: toMaterialType(raw.materialType ?? raw.material_type),
        status: toMaterialStatus(raw.status),
        subject: {
            id: subjectObject?.id ?? (typeof raw.subject === 'number' ? raw.subject : 0),
            name: subjectObject?.name ?? '',
            code: subjectObject?.code ?? '',
        },
        section: {
            id: sectionObject?.id ?? (typeof raw.section === 'number' ? raw.section : 0),
            name: sectionObject?.name ?? '',
        },
        faculty: facultyObject
            ? {
                id: facultyObject.id ?? 0,
                fullName: facultyObject.fullName ?? facultyObject.name ?? '',
            }
            : undefined,
        fileUrl: normalizedUrl,
        fileSizeMb: Number(sizeMb.toFixed(2)),
        fileExtension: raw.fileExtension ?? raw.file_extension ?? deriveFileExtension(filePath),
        viewCount: raw.viewCount ?? raw.view_count ?? 0,
        downloadCount: raw.downloadCount ?? raw.download_count ?? 0,
        uploadedAt: raw.uploadedAt ?? raw.uploaded_at ?? EMPTY_DATE,
        publishedAt: raw.publishedAt ?? raw.published_at ?? null,
        updatedAt: raw.updatedAt ?? raw.updated_at ?? EMPTY_DATE,
        vectorizationStatus: toVectorizationStatus(raw.vectorizationStatus ?? raw.vectorization_status),
        vectorDocumentId: raw.vectorDocumentId ?? raw.vector_document_id ?? null,
        lastIndexedAt: raw.lastIndexedAt ?? raw.last_indexed_at ?? null,
        vectorErrorMessage: raw.vectorErrorMessage ?? raw.vector_error_message ?? null,
    };
}

function toRestFilters(filters?: {
    subjectId?: number;
    sectionId?: number;
    materialType?: string;
    status?: string;
}): Record<string, string | number> {
    if (!filters) return {};
    const mapped: Record<string, string | number> = {};
    if (filters.subjectId) mapped.subject_id = filters.subjectId;
    if (filters.sectionId) mapped.section_id = filters.sectionId;
    if (filters.materialType) mapped.material_type = filters.materialType;
    if (filters.status) mapped.status = filters.status;
    return mapped;
}

function shouldUseRest(): boolean {
    return STUDY_MATERIALS_API_MODE === 'rest';
}

async function restStudyMaterial(materialId: number | string): Promise<StudyMaterial> {
    const { data } = await api.get<StudyMaterialWire>(`/study-materials/${materialId}/`);
    return normalizeStudyMaterial(data);
}

async function restStudyMaterials(filters?: {
    subjectId?: number;
    sectionId?: number;
    materialType?: string;
    status?: string;
}): Promise<StudyMaterial[]> {
    const { data } = await api.get<RestListEnvelope<StudyMaterialWire>>('/study-materials/', {
        params: toRestFilters(filters),
    });
    return (data.results ?? []).map(normalizeStudyMaterial);
}

async function restMyUploadedMaterials(status?: string): Promise<StudyMaterial[]> {
    if (status) {
        const allowedStatuses: MaterialStatus[] = ['ARCHIVED', 'DRAFT', 'PUBLISHED'];
        if (!allowedStatuses.includes(status as MaterialStatus)) {
            throw new Error('Invalid status filter. Allowed values: ARCHIVED, DRAFT, PUBLISHED.');
        }
    }

    const { data } = await api.get<RestListEnvelope<StudyMaterialWire>>('/study-materials/my-uploaded/', {
        params: status ? { status } : undefined,
    });
    return (data.results ?? []).map(normalizeStudyMaterial);
}

async function restMaterialStatistics(materialId: number | string): Promise<MaterialStats> {
    const { data } = await api.get<MaterialStatsWire>(`/study-materials/${materialId}/statistics/`);
    return normalizeMaterialStats(data);
}

async function restMaterialDownloadList(materialId: number | string): Promise<DownloadRecord[]> {
    const { data } = await api.get<RestListEnvelope<DownloadRecordWire>>(`/study-materials/${materialId}/downloads/`);
    return (data.results ?? []).map(normalizeDownloadRecord);
}

async function restMyFacultySubjectsSections(): Promise<TeachingAssignment[]> {
    const { data } = await api.get<RestListEnvelope<TeachingAssignmentWire>>('/study-materials/faculty/subjects-sections/');
    return (data.results ?? []).map(normalizeTeachingAssignment);
}

async function restAvailableMaterialsForStudent(): Promise<StudyMaterial[]> {
    const { data } = await api.get<RestListEnvelope<StudyMaterialWire>>('/study-materials/available-for-student/');
    return (data.results ?? []).map(normalizeStudyMaterial);
}

async function restUploadStudyMaterial(input: UploadMaterialInput): Promise<UploadMaterialResult> {
    const formData = new FormData();
    formData.append('subject', input.subjectId.toString());
    formData.append('section', input.sectionId.toString());
    formData.append('title', input.title);
    formData.append('material_type', input.materialType);
    formData.append('status', input.status);

    if (input.description) {
        formData.append('description', input.description);
    }

    if (input.file) {
        formData.append('file', input.file);
    }

    const { data } = await api.post<StudyMaterialWire | RestUploadResponse>('/study-materials/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    const payload = 'material' in data ? data.material : data;
    const normalized = normalizeStudyMaterial({
        ...(payload ?? {}),
        vectorization_status: 'PENDING',
    });

    return {
        success: true,
        message: ('message' in data && data.message) ? data.message : 'Study material uploaded successfully',
        material: {
            id: normalized.id,
            title: normalized.title,
            fileUrl: normalized.fileUrl,
            uploadedAt: normalized.uploadedAt,
            vectorizationStatus: normalized.vectorizationStatus,
        },
    };
}

async function restUpdateStudyMaterial(input: UpdateMaterialInput): Promise<MutationResult> {
    const formData = new FormData();
    const payload: Record<string, string> = {};

    if (input.title) payload.title = input.title;
    if (input.description !== undefined) payload.description = input.description;
    if (input.materialType) payload.material_type = input.materialType;
    if (input.status) payload.status = input.status;

    if (input.file) {
        formData.append('file', input.file);
    }

    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

    const hasFile = Boolean(input.file);
    const { data } = hasFile
        ? await api.patch<RestMutationResponse>(`/study-materials/${input.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        : await api.patch<RestMutationResponse>(`/study-materials/${input.id}/`, payload);

    return {
        success: data.success ?? true,
        message: data.message ?? 'Study material updated successfully',
    };
}

async function restDeleteStudyMaterial(materialId: number | string): Promise<MutationResult> {
    const { data } = await api.delete<RestMutationResponse>(`/study-materials/${materialId}/`);
    return {
        success: data.success ?? true,
        message: data.message ?? 'Study material deleted successfully',
    };
}

async function restRecordMaterialDownload(materialId: number | string): Promise<MutationResult> {
    const { data } = await api.post<RestMutationResponse>(`/study-materials/${materialId}/record-download/`, {});
    return {
        success: data.success ?? true,
        message: data.message ?? 'Download recorded successfully',
    };
}

async function restRecordMaterialView(materialId: number | string): Promise<MutationResult> {
    const { data } = await api.post<RestMutationResponse>(`/study-materials/${materialId}/record-view/`, {});
    return {
        success: data.success ?? true,
        message: data.message ?? 'View recorded successfully',
    };
}

async function restAskAiTutor(materialId: number | string, message: string): Promise<AiTutorResponse> {
    const payload = {
        material_id: ensureInt(materialId) ?? 0,
        message,
    };

    const { data } = await api.post<RestAiTutorResponse>('/study-materials/ai/chat/', payload);
    return {
        answer: data.answer ?? '',
        sources: Array.isArray(data.sources) ? data.sources.map(normalizeAiSource) : [],
    };
}

async function graphqlStudyMaterial(materialId: number | string): Promise<StudyMaterial> {
    const { data } = await client.query<GraphQLStudyMaterialResponse>({
        query: GET_STUDY_MATERIAL,
        variables: { id: ensureInt(materialId) ?? 0 },
        fetchPolicy: 'network-only',
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return {
        ...data.studyMaterial,
        fileUrl: getMediaUrl(data.studyMaterial.fileUrl) ?? data.studyMaterial.fileUrl,
    };
}

async function graphqlStudyMaterials(filters?: {
    subjectId?: number;
    sectionId?: number;
    materialType?: string;
    status?: string;
}): Promise<StudyMaterial[]> {
    const { data } = await client.query<GraphQLAllMaterialsResponse>({
        query: GET_ALL_MATERIALS,
        variables: {
            subjectId: filters?.subjectId,
            sectionId: filters?.sectionId,
            materialType: filters?.materialType,
            status: filters?.status,
        },
        fetchPolicy: 'network-only',
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return data.studyMaterials.map((item) => ({
        ...item,
        fileUrl: getMediaUrl(item.fileUrl) ?? item.fileUrl,
    }));
}

async function graphqlMyUploadedMaterials(status?: string): Promise<StudyMaterial[]> {
    const { data } = await client.query<GraphQLUploadedMaterialsResponse>({
        query: GET_MY_UPLOADED_MATERIALS,
        variables: { status },
        fetchPolicy: 'network-only',
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return data.myUploadedMaterials.map((item) => ({
        ...item,
        fileUrl: getMediaUrl(item.fileUrl) ?? item.fileUrl,
    }));
}

async function graphqlMaterialStatistics(materialId: number | string): Promise<MaterialStats> {
    const { data } = await client.query<GraphQLMaterialStatsResponse>({
        query: GET_MATERIAL_STATS,
        variables: { materialId: formatId(materialId) },
        fetchPolicy: 'network-only',
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return data.materialStatistics;
}

async function graphqlMaterialDownloadList(materialId: number | string): Promise<DownloadRecord[]> {
    const { data } = await client.query<GraphQLDownloadListResponse>({
        query: GET_MATERIAL_DOWNLOAD_LIST,
        variables: { materialId: formatId(materialId) },
        fetchPolicy: 'network-only',
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return data.materialDownloadList;
}

async function graphqlMyFacultySubjectsSections(): Promise<TeachingAssignment[]> {
    const { data } = await client.query<GraphQLTeachingAssignmentsResponse>({
        query: GET_MY_TEACHING_ASSIGNMENTS,
        fetchPolicy: 'network-only',
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return data.myFacultySubjectsSections;
}

async function graphqlAvailableMaterialsForStudent(): Promise<StudyMaterial[]> {
    const { data } = await client.query<GraphQLStudentMaterialsResponse>({
        query: GET_AVAILABLE_MATERIALS_FOR_STUDENT,
        fetchPolicy: 'network-only',
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return data.availableMaterialsForStudent.map((item) => ({
        ...item,
        fileUrl: getMediaUrl(item.fileUrl) ?? item.fileUrl,
    }));
}

async function graphqlUpdateStudyMaterial(input: UpdateMaterialInput): Promise<MutationResult> {
    const { data } = await client.mutate<GraphQLUpdateMaterialResponse>({
        mutation: UPDATE_STUDY_MATERIAL,
        variables: { input },
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return data.updateStudyMaterial;
}

async function graphqlDeleteStudyMaterial(materialId: number | string): Promise<MutationResult> {
    const { data } = await client.mutate<GraphQLDeleteMaterialResponse>({
        mutation: DELETE_STUDY_MATERIAL,
        variables: { materialId: formatId(materialId) },
    });

    if (!data) {
        throw new Error('No data returned');
    }

    return data.deleteStudyMaterial;
}

async function graphqlRecordMaterialView(materialId: number | string): Promise<MutationResult> {
    const { data } = await client.mutate<GraphQLRecordEventResponse>({
        mutation: RECORD_MATERIAL_VIEW,
        variables: { input: { materialId: ensureInt(materialId) ?? 0 } },
    });

    return data?.recordMaterialView ?? {
        success: true,
        message: 'View recorded',
    };
}

async function graphqlRecordMaterialDownload(materialId: number | string): Promise<MutationResult> {
    const { data } = await client.mutate<GraphQLRecordEventResponse>({
        mutation: RECORD_MATERIAL_DOWNLOAD,
        variables: { input: { materialId: ensureInt(materialId) ?? 0 } },
    });

    return data?.recordMaterialDownload ?? {
        success: true,
        message: 'Download recorded',
    };
}

export const getStudyMaterialsApiMode = (): ApiMode => STUDY_MATERIALS_API_MODE;

export async function studyMaterial(materialId: number | string): Promise<StudyMaterial> {
    try {
        return shouldUseRest() ? await restStudyMaterial(materialId) : await graphqlStudyMaterial(materialId);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function studyMaterials(filters?: {
    subjectId?: number;
    sectionId?: number;
    materialType?: string;
    status?: string;
}): Promise<StudyMaterial[]> {
    try {
        return shouldUseRest() ? await restStudyMaterials(filters) : await graphqlStudyMaterials(filters);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function myUploadedMaterials(status?: string): Promise<StudyMaterial[]> {
    try {
        return shouldUseRest() ? await restMyUploadedMaterials(status) : await graphqlMyUploadedMaterials(status);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function materialStatistics(materialId: number | string): Promise<MaterialStats> {
    try {
        return shouldUseRest() ? await restMaterialStatistics(materialId) : await graphqlMaterialStatistics(materialId);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function materialDownloadList(materialId: number | string): Promise<DownloadRecord[]> {
    try {
        return shouldUseRest() ? await restMaterialDownloadList(materialId) : await graphqlMaterialDownloadList(materialId);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function myFacultySubjectsSections(): Promise<TeachingAssignment[]> {
    try {
        return shouldUseRest() ? await restMyFacultySubjectsSections() : await graphqlMyFacultySubjectsSections();
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function availableMaterialsForStudent(): Promise<StudyMaterial[]> {
    try {
        return shouldUseRest() ? await restAvailableMaterialsForStudent() : await graphqlAvailableMaterialsForStudent();
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function uploadStudyMaterial(input: UploadMaterialInput): Promise<UploadMaterialResult> {
    try {
        return await restUploadStudyMaterial(input);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function updateStudyMaterial(input: UpdateMaterialInput): Promise<MutationResult> {
    try {
        return shouldUseRest() ? await restUpdateStudyMaterial(input) : await graphqlUpdateStudyMaterial(input);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function deleteStudyMaterial(materialId: number | string): Promise<MutationResult> {
    try {
        return shouldUseRest() ? await restDeleteStudyMaterial(materialId) : await graphqlDeleteStudyMaterial(materialId);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function recordMaterialDownload(materialId: number | string): Promise<MutationResult> {
    try {
        return shouldUseRest() ? await restRecordMaterialDownload(materialId) : await graphqlRecordMaterialDownload(materialId);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function recordMaterialView(materialId: number | string): Promise<MutationResult> {
    try {
        return shouldUseRest() ? await restRecordMaterialView(materialId) : await graphqlRecordMaterialView(materialId);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function askAiTutor(materialId: number | string, message: string): Promise<AiTutorResponse> {
    try {
        return await restAskAiTutor(materialId, message);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
