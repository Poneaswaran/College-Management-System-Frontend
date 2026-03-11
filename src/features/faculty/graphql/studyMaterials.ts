import { gql } from '@apollo/client';

// ============================================
// Faculty Queries
// ============================================

export const GET_MY_TEACHING_ASSIGNMENTS = gql`
    query GetMyTeachingAssignments {
        myFacultySubjectsSections {
            subjectId
            subjectName
            subjectCode
            sectionId
            sectionName
        }
    }
`;

export const GET_MY_UPLOADED_MATERIALS = gql`
    query GetMyUploadedMaterials($status: String) {
        myUploadedMaterials(status: $status) {
            id
            title
            description
            materialType
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
            fileUrl
            fileSizeMb
            fileExtension
            viewCount
            downloadCount
            uploadedAt
            publishedAt
            updatedAt
        }
    }
`;

export const GET_MATERIAL_STATS = gql`
    query GetMaterialStats($materialId: ID!) {
        materialStatistics(materialId: $materialId) {
            materialId
            totalDownloads
            uniqueDownloads
            totalViews
            uniqueViews
            recentDownloads {
                id
                studentName
                studentRollNumber
                downloadedAt
                ipAddress
            }
        }
    }
`;

export const GET_MATERIAL_DOWNLOAD_LIST = gql`
    query GetMaterialDownloadList($materialId: ID!) {
        materialDownloadList(materialId: $materialId) {
            id
            studentName
            studentRollNumber
            downloadedAt
            ipAddress
        }
    }
`;

export const GET_STUDY_MATERIAL = gql`
    query GetStudyMaterial($id: Int!) {
        studyMaterial(id: $id) {
            id
            title
            description
            materialType
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
                fullName
            }
            fileUrl
            fileSizeMb
            fileExtension
            viewCount
            downloadCount
            uploadedAt
            publishedAt
            updatedAt
        }
    }
`;

// ============================================
// Student Queries
// ============================================

export const GET_AVAILABLE_MATERIALS_FOR_STUDENT = gql`
    query GetAvailableMaterialsForStudent {
        availableMaterialsForStudent {
            id
            title
            description
            materialType
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
                fullName
            }
            fileUrl
            fileSizeMb
            fileExtension
            viewCount
            downloadCount
            uploadedAt
            publishedAt
            updatedAt
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
        studyMaterials(
            subjectId: $subjectId
            sectionId: $sectionId
            materialType: $materialType
            status: $status
        ) {
            id
            title
            description
            materialType
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
                fullName
            }
            fileUrl
            fileSizeMb
            fileExtension
            viewCount
            downloadCount
            uploadedAt
            publishedAt
            updatedAt
        }
    }
`;

// ============================================
// Mutations
// ============================================

export const UPLOAD_STUDY_MATERIAL = gql`
    mutation UploadStudyMaterial($input: UploadStudyMaterialInput!) {
        uploadStudyMaterial(input: $input) {
            success
            message
            material {
                id
                title
                fileUrl
                uploadedAt
            }
        }
    }
`;

export const UPDATE_STUDY_MATERIAL = gql`
    mutation UpdateStudyMaterial($input: UpdateStudyMaterialInput!) {
        updateStudyMaterial(input: $input) {
            success
            message
            material {
                id
                title
                updatedAt
            }
        }
    }
`;

export const DELETE_STUDY_MATERIAL = gql`
    mutation DeleteStudyMaterial($materialId: ID!) {
        deleteStudyMaterial(materialId: $materialId) {
            success
            message
        }
    }
`;

export const RECORD_MATERIAL_VIEW = gql`
    mutation RecordMaterialView($input: RecordMaterialViewInput!) {
        recordMaterialView(input: $input) {
            success
            message
        }
    }
`;

export const RECORD_MATERIAL_DOWNLOAD = gql`
    mutation RecordMaterialDownload($input: RecordMaterialDownloadInput!) {
        recordMaterialDownload(input: $input) {
            success
            message
            material {
                id
                downloadCount
            }
        }
    }
`;
