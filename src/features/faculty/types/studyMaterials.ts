// ============================================
// Study Materials Types
// ============================================

export type MaterialType = 'NOTES' | 'REFERENCE' | 'SLIDES' | 'BOOK' | 'PAPER' | 'TUTORIAL' | 'OTHER';
export type MaterialStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type VectorizationStatus = 'PENDING' | 'PROCESSING' | 'INDEXED' | 'FAILED';

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
    NOTES: 'Lecture Notes',
    REFERENCE: 'Reference Material',
    SLIDES: 'Presentation Slides',
    BOOK: 'E-Book / Textbook',
    PAPER: 'Research Paper',
    TUTORIAL: 'Tutorial',
    OTHER: 'Other',
};

export const MATERIAL_STATUS_LABELS: Record<MaterialStatus, string> = {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    ARCHIVED: 'Archived',
};

export const ALLOWED_EXTENSIONS = [
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    '.ppt', '.pptx',
    '.xls', '.xlsx',
    '.zip', '.rar', '.7z',
    '.jpg', '.jpeg', '.png', '.gif',
    '.mp4', '.avi', '.mkv', '.webm',
] as const;

export const MAX_FILE_SIZE_MB = 50;

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface SubjectRef {
    id: number;
    name: string;
    code: string;
}

export interface SectionRef {
    id: number;
    name: string;
}

export interface FacultyRef {
    id: number;
    fullName: string;
}

export interface StudyMaterial {
    id: number;
    title: string;
    description: string;
    materialType: MaterialType;
    status: MaterialStatus;
    subject: SubjectRef;
    section: SectionRef;
    faculty?: FacultyRef;           // present in HOD/student views
    fileUrl: string;
    fileSizeMb: number;
    fileExtension: string;
    viewCount: number;
    downloadCount: number;
    uploadedAt: string;            // ISO datetime
    publishedAt: string | null;
    updatedAt: string;
    vectorizationStatus?: VectorizationStatus;
    vectorDocumentId?: string | null;
    lastIndexedAt?: string | null;
    vectorErrorMessage?: string | null;
}

export interface TeachingAssignment {
    subjectId: number;
    subjectName: string;
    subjectCode: string;
    sectionId: number;
    sectionName: string;
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export interface DownloadRecord {
    id: number;
    studentName: string;
    studentRollNumber: string;
    downloadedAt: string;
    ipAddress: string;
}

export interface MaterialStats {
    materialId: number;
    totalDownloads: number;
    uniqueDownloads: number;
    totalViews: number;
    uniqueViews: number;
    recentDownloads: DownloadRecord[];
}

// ─── API Shapes ───────────────────────────────────────────────────────────────

export interface UploadMaterialInput {
    subjectId: number;
    sectionId: number;
    title: string;
    description: string;
    materialType: MaterialType;
    fileData?: string;              // Base64 data URI (optional now)
    fileName?: string;
    file?: File;                    // Added actual File object for REST API
    status: MaterialStatus;
}

export interface UpdateMaterialInput {
    id: number;
    title?: string;
    description?: string;
    materialType?: MaterialType;
    status?: MaterialStatus;
    fileData?: string;
    fileName?: string;
    file?: File;
}

export interface MutationResult {
    success: boolean;
    message: string;
}

export interface UploadMaterialResult extends MutationResult {
    material: { id: number; title: string; fileUrl: string; uploadedAt: string; vectorizationStatus?: VectorizationStatus };
}

export interface AiTutorResponse {
    answer: string;
    sources: string[];
}
