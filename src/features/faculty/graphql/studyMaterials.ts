import { gql } from '@apollo/client';

// ============================================
// Faculty Queries
// ============================================

export const GET_MY_TEACHING_ASSIGNMENTS = gql`
    query GetMyTeachingAssignments {
        myFacultySubjectsSections {
            subject_id
            subject_name
            subject_code
            section_id
            section_name
        }
    }
`;

export const GET_MY_UPLOADED_MATERIALS = gql`
    query GetMyUploadedMaterials($status: String) {
        my_uploaded_materials(status: $status) {
            id
            title
            description
            material_type
            status
            subject {
                id
                name
                code
            }
            section {
                id
                name
            }
            file_url
            file_size_mb
            file_extension
            view_count
            download_count
            uploaded_at
            published_at
            updated_at
        }
    }
`;

export const GET_MATERIAL_STATS = gql`
    query GetMaterialStats($material_id: Int!) {
        material_statistics(material_id: $material_id) {
            material_id
            total_downloads
            unique_downloads
            total_views
            unique_views
            recent_downloads {
                id
                student_name
                student_roll_number
                downloaded_at
                ip_address
            }
        }
    }
`;

export const GET_MATERIAL_DOWNLOAD_LIST = gql`
    query GetMaterialDownloadList($material_id: Int!) {
        material_download_list(material_id: $material_id) {
            id
            student_name
            student_roll_number
            downloaded_at
            ip_address
        }
    }
`;

export const GET_STUDY_MATERIAL = gql`
    query GetStudyMaterial($id: Int!) {
        study_material(id: $id) {
            id
            title
            description
            material_type
            status
            subject {
                id
                name
                code
            }
            section {
                id
                name
            }
            faculty {
                id
                full_name
            }
            file_url
            file_size_mb
            file_extension
            view_count
            download_count
            uploaded_at
            published_at
            updated_at
        }
    }
`;

// ============================================
// Student Queries
// ============================================

export const GET_AVAILABLE_MATERIALS_FOR_STUDENT = gql`
    query GetAvailableMaterialsForStudent {
        available_materials_for_student {
            id
            title
            description
            material_type
            status
            subject {
                id
                name
                code
            }
            section {
                id
                name
            }
            faculty {
                id
                full_name
            }
            file_url
            file_size_mb
            file_extension
            view_count
            download_count
            uploaded_at
            published_at
            updated_at
        }
    }
`;

// ============================================
// HOD / Admin Queries
// ============================================

export const GET_ALL_MATERIALS = gql`
    query GetAllMaterials(
        $subjectId: Int
        $sectionId: Int
        $materialType: String
        $status: String
    ) {
        study_materials(
            subjectId: $subjectId
            sectionId: $sectionId
            materialType: $materialType
            status: $status
        ) {
            id
            title
            description
            material_type
            status
            subject {
                id
                name
                code
            }
            section {
                id
                name
            }
            faculty {
                id
                full_name
            }
            file_url
            file_size_mb
            file_extension
            view_count
            download_count
            uploaded_at
            published_at
            updated_at
        }
    }
`;

// ============================================
// Mutations
// ============================================

export const UPLOAD_STUDY_MATERIAL = gql`
    mutation UploadStudyMaterial($input: UploadStudyMaterialInput!) {
        upload_study_material(input: $input) {
            success
            message
            material {
                id
                title
                file_url
                uploaded_at
            }
        }
    }
`;

export const UPDATE_STUDY_MATERIAL = gql`
    mutation UpdateStudyMaterial($input: UpdateStudyMaterialInput!) {
        update_study_material(input: $input) {
            success
            message
            material {
                id
                title
                updated_at
            }
        }
    }
`;

export const DELETE_STUDY_MATERIAL = gql`
    mutation DeleteStudyMaterial($material_id: Int!) {
        delete_study_material(material_id: $material_id) {
            success
            message
        }
    }
`;

export const RECORD_MATERIAL_VIEW = gql`
    mutation RecordMaterialView($input: RecordMaterialViewInput!) {
        record_material_view(input: $input) {
            success
            message
        }
    }
`;

export const RECORD_MATERIAL_DOWNLOAD = gql`
    mutation RecordMaterialDownload($input: RecordMaterialDownloadInput!) {
        record_material_download(input: $input) {
            success
            message
            material {
                id
                download_count
            }
        }
    }
`;
