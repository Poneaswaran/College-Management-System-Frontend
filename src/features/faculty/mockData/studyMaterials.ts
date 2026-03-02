import type { StudyMaterial, TeachingAssignment, MaterialStats, DownloadRecord } from '../types/studyMaterials';

// ============================================
// Mock data for Study Materials module
// Used as fallback when backend is unavailable
// ============================================

export const MOCK_TEACHING_ASSIGNMENTS: TeachingAssignment[] = [
    { subject_id: 1, subject_name: 'Data Structures & Algorithms', subject_code: 'CS301', section_id: 1, section_name: 'CSE-A' },
    { subject_id: 1, subject_name: 'Data Structures & Algorithms', subject_code: 'CS301', section_id: 2, section_name: 'CSE-B' },
    { subject_id: 2, subject_name: 'Database Management Systems', subject_code: 'CS401', section_id: 1, section_name: 'CSE-A' },
    { subject_id: 3, subject_name: 'Design & Analysis of Algorithms', subject_code: 'CS501', section_id: 3, section_name: 'CSE-C' },
    { subject_id: 4, subject_name: 'Operating Systems', subject_code: 'CS302', section_id: 1, section_name: 'CSE-A' },
];

export const MOCK_FACULTY_MATERIALS: StudyMaterial[] = [
    {
        id: 1,
        title: 'DSA – Unit I: Arrays, Stacks & Queues',
        description: 'Comprehensive lecture notes covering linear data structures, complexity analysis, and implementation patterns.',
        material_type: 'NOTES',
        status: 'PUBLISHED',
        subject: { id: 1, name: 'Data Structures & Algorithms', code: 'CS301' },
        section: { id: 1, name: 'CSE-A' },
        file_url: '#',
        file_size_mb: 3.2,
        file_extension: '.pdf',
        view_count: 142,
        download_count: 98,
        uploaded_at: '2026-02-10T09:30:00Z',
        published_at: '2026-02-10T09:31:00Z',
        updated_at: '2026-02-10T09:31:00Z',
    },
    {
        id: 2,
        title: 'DSA – Unit II: Trees & Graphs',
        description: 'Binary trees, BST, AVL trees, graph traversal (BFS/DFS), shortest path algorithms.',
        material_type: 'NOTES',
        status: 'PUBLISHED',
        subject: { id: 1, name: 'Data Structures & Algorithms', code: 'CS301' },
        section: { id: 2, name: 'CSE-B' },
        file_url: '#',
        file_size_mb: 4.8,
        file_extension: '.pdf',
        view_count: 211,
        download_count: 164,
        uploaded_at: '2026-02-14T11:00:00Z',
        published_at: '2026-02-14T11:01:00Z',
        updated_at: '2026-02-14T11:01:00Z',
    },
    {
        id: 3,
        title: 'DBMS – ER Modelling & Normalisation Slides',
        description: 'Presentation slides from lectures 4–7 covering ER diagrams, relational model and 1NF–BCNF normalisation.',
        material_type: 'SLIDES',
        status: 'PUBLISHED',
        subject: { id: 2, name: 'Database Management Systems', code: 'CS401' },
        section: { id: 1, name: 'CSE-A' },
        file_url: '#',
        file_size_mb: 6.1,
        file_extension: '.pptx',
        view_count: 88,
        download_count: 54,
        uploaded_at: '2026-02-18T14:20:00Z',
        published_at: '2026-02-18T14:21:00Z',
        updated_at: '2026-02-18T14:21:00Z',
    },
    {
        id: 4,
        title: 'DBMS – Lab Manual (All Experiments)',
        description: 'Step-by-step lab exercises for SQL DDL, DML, stored procedures, triggers, and JDBC connectivity.',
        material_type: 'TUTORIAL',
        status: 'PUBLISHED',
        subject: { id: 2, name: 'Database Management Systems', code: 'CS401' },
        section: { id: 1, name: 'CSE-A' },
        file_url: '#',
        file_size_mb: 1.9,
        file_extension: '.pdf',
        view_count: 301,
        download_count: 289,
        uploaded_at: '2026-01-25T08:00:00Z',
        published_at: '2026-01-25T08:01:00Z',
        updated_at: '2026-01-25T08:01:00Z',
    },
    {
        id: 5,
        title: 'DAA – Algorithm Design Paradigms (Draft)',
        description: 'Work-in-progress notes on Divide & Conquer, Greedy, Dynamic Programming and Branch & Bound. Not ready for distribution.',
        material_type: 'NOTES',
        status: 'DRAFT',
        subject: { id: 3, name: 'Design & Analysis of Algorithms', code: 'CS501' },
        section: { id: 3, name: 'CSE-C' },
        file_url: '#',
        file_size_mb: 2.4,
        file_extension: '.docx',
        view_count: 0,
        download_count: 0,
        uploaded_at: '2026-02-28T16:45:00Z',
        published_at: null,
        updated_at: '2026-02-28T16:45:00Z',
    },
    {
        id: 6,
        title: 'OS – Process Scheduling Reference',
        description: 'Textbook chapter extract on scheduling algorithms: FCFS, SJF, Round-Robin, Priority Scheduling.',
        material_type: 'REFERENCE',
        status: 'PUBLISHED',
        subject: { id: 4, name: 'Operating Systems', code: 'CS302' },
        section: { id: 1, name: 'CSE-A' },
        file_url: '#',
        file_size_mb: 8.3,
        file_extension: '.pdf',
        view_count: 55,
        download_count: 41,
        uploaded_at: '2026-02-05T10:10:00Z',
        published_at: '2026-02-05T10:11:00Z',
        updated_at: '2026-02-05T10:11:00Z',
    },
    {
        id: 7,
        title: 'DSA – Previous Year Question Papers (2021–2025)',
        description: 'Compiled question papers from university examinations for last 5 years.',
        material_type: 'PAPER',
        status: 'ARCHIVED',
        subject: { id: 1, name: 'Data Structures & Algorithms', code: 'CS301' },
        section: { id: 1, name: 'CSE-A' },
        file_url: '#',
        file_size_mb: 12.7,
        file_extension: '.zip',
        view_count: 412,
        download_count: 398,
        uploaded_at: '2025-11-01T07:00:00Z',
        published_at: '2025-11-01T07:01:00Z',
        updated_at: '2026-01-01T00:00:00Z',
    },
];

// Student's view (section-filtered, no draft/archived)
export const MOCK_STUDENT_MATERIALS: StudyMaterial[] = MOCK_FACULTY_MATERIALS
    .filter((m) => m.status === 'PUBLISHED' && m.section.id === 1)
    .map((m) => ({ ...m, faculty: { id: 1, full_name: 'Dr. Anitha Rajan' } }));

// HOD view includes all, with faculty names
export const MOCK_HOD_MATERIALS: StudyMaterial[] = MOCK_FACULTY_MATERIALS.map((m) => ({
    ...m,
    faculty: { id: 1, full_name: 'Dr. Anitha Rajan' },
}));

const MOCK_DOWNLOADS: DownloadRecord[] = [
    { id: 1, student_name: 'Arun Kumar', student_roll_number: '21CSE001', downloaded_at: '2026-02-28T10:15:00Z', ip_address: '192.168.1.45' },
    { id: 2, student_name: 'Bharathi S', student_roll_number: '21CSE002', downloaded_at: '2026-02-27T14:30:00Z', ip_address: '192.168.1.46' },
    { id: 3, student_name: 'Chandru M', student_roll_number: '21CSE003', downloaded_at: '2026-02-26T09:00:00Z', ip_address: '192.168.1.47' },
    { id: 4, student_name: 'Divya R', student_roll_number: '21CSE004', downloaded_at: '2026-02-25T11:45:00Z', ip_address: '192.168.1.48' },
    { id: 5, student_name: 'Ezhil P', student_roll_number: '21CSE005', downloaded_at: '2026-02-24T16:20:00Z', ip_address: '192.168.1.49' },
];

export function getMockStats(materialId: number): MaterialStats {
    const mat = MOCK_FACULTY_MATERIALS.find((m) => m.id === materialId);
    return {
        material_id: materialId,
        total_downloads: mat?.download_count ?? 0,
        unique_downloads: Math.floor((mat?.download_count ?? 0) * 0.85),
        total_views: mat?.view_count ?? 0,
        unique_views: Math.floor((mat?.view_count ?? 0) * 0.78),
        recent_downloads: MOCK_DOWNLOADS,
    };
}
