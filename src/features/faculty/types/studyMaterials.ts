// ============================================
// Study Materials Types
// ============================================

export type MaterialType = 'NOTES' | 'REFERENCE' | 'SLIDES' | 'BOOK' | 'PAPER' | 'TUTORIAL' | 'OTHER';
export type MaterialStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

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
    full_name: string;
}

export interface StudyMaterial {
    id: number;
    title: string;
    description: string;
    material_type: MaterialType;
    status: MaterialStatus;
    subject: SubjectRef;
    section: SectionRef;
    faculty?: FacultyRef;           // present in HOD/student views
    file_url: string;
    file_size_mb: number;
    file_extension: string;
    view_count: number;
    download_count: number;
    uploaded_at: string;            // ISO datetime
    published_at: string | null;
    updated_at: string;
}

export interface TeachingAssignment {
    subject_id: number;
    subject_name: string;
    subject_code: string;
    section_id: number;
    section_name: string;
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export interface DownloadRecord {
    id: number;
    student_name: string;
    student_roll_number: string;
    downloaded_at: string;
    ip_address: string;
}

export interface MaterialStats {
    material_id: number;
    total_downloads: number;
    unique_downloads: number;
    total_views: number;
    unique_views: number;
    recent_downloads: DownloadRecord[];
}

// ─── API Shapes ───────────────────────────────────────────────────────────────

export interface UploadMaterialInput {
    subject_id: number;
    section_id: number;
    title: string;
    description: string;
    material_type: MaterialType;
    file_data: string;              // Base64 data URI
    file_name: string;
    status: MaterialStatus;
}

export interface UpdateMaterialInput {
    id: number;
    title?: string;
    description?: string;
    material_type?: MaterialType;
    status?: MaterialStatus;
    file_data?: string;
    file_name?: string;
}

export interface MutationResult {
    success: boolean;
    message: string;
}

export interface UploadMaterialResult extends MutationResult {
    material: { id: number; title: string; file_url: string; uploaded_at: string };
}
