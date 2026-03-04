import { StudyMaterial, TeachingAssignment, MaterialStats, DownloadRecord } from '../types/studyMaterials';

// ============================================
// Mock data for Study Materials module
// Used as fallback when backend is unavailable
// ============================================

export const MOCK_TEACHING_ASSIGNMENTS: TeachingAssignment[] = [
    { subjectId: 1, subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301', sectionId: 1, sectionName: 'CSE-A' },
    { subjectId: 1, subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301', sectionId: 2, sectionName: 'CSE-B' },
    { subjectId: 2, subjectName: 'Database Management Systems', subjectCode: 'CS401', sectionId: 1, sectionName: 'CSE-A' },
    { subjectId: 3, subjectName: 'Design & Analysis of Algorithms', subjectCode: 'CS501', sectionId: 3, sectionName: 'CSE-C' },
    { subjectId: 4, subjectName: 'Operating Systems', subjectCode: 'CS302', sectionId: 1, sectionName: 'CSE-A' },
];

export const MOCK_FACULTY_MATERIALS: StudyMaterial[] = [
    {
        id: 1,
        title: 'DSA – Unit I: Arrays, Stacks & Queues',
        description: 'Comprehensive lecture notes covering linear data structures, complexity analysis, and implementation patterns.',
        materialType: 'NOTES',
        status: 'PUBLISHED',
        subject: { id: 1, name: 'Data Structures & Algorithms', code: 'CS301' },
        section: { id: 1, name: 'CSE-A' },
        fileUrl: '#',
        fileSizeMb: 3.2,
        fileExtension: '.pdf',
        viewCount: 142,
        downloadCount: 98,
        uploadedAt: '2026-02-10T09:30:00Z',
        publishedAt: '2026-02-10T09:31:00Z',
        updatedAt: '2026-02-10T09:31:00Z',
    },
    {
        id: 2,
        title: 'DSA – Unit II: Trees & Graphs',
        description: 'Binary trees, BST, AVL trees, graph traversal (BFS/DFS), shortest path algorithms.',
        materialType: 'NOTES',
        status: 'PUBLISHED',
        subject: { id: 1, name: 'Data Structures & Algorithms', code: 'CS301' },
        section: { id: 2, name: 'CSE-B' },
        fileUrl: '#',
        fileSizeMb: 4.8,
        fileExtension: '.pdf',
        viewCount: 211,
        downloadCount: 164,
        uploadedAt: '2026-02-14T11:00:00Z',
        publishedAt: '2026-02-14T11:01:00Z',
        updatedAt: '2026-02-14T11:01:00Z',
    },
    {
        id: 3,
        title: 'DBMS – ER Modelling & Normalisation Slides',
        description: 'Presentation slides from lectures 4–7 covering ER diagrams, relational model and 1NF–BCNF normalisation.',
        materialType: 'SLIDES',
        status: 'PUBLISHED',
        subject: { id: 2, name: 'Database Management Systems', code: 'CS401' },
        section: { id: 1, name: 'CSE-A' },
        fileUrl: '#',
        fileSizeMb: 6.1,
        fileExtension: '.pptx',
        viewCount: 88,
        downloadCount: 54,
        uploadedAt: '2026-02-18T14:20:00Z',
        publishedAt: '2026-02-18T14:21:00Z',
        updatedAt: '2026-02-18T14:21:00Z',
    },
    {
        id: 4,
        title: 'DBMS – Lab Manual (All Experiments)',
        description: 'Step-by-step lab exercises for SQL DDL, DML, stored procedures, triggers, and JDBC connectivity.',
        materialType: 'TUTORIAL',
        status: 'PUBLISHED',
        subject: { id: 2, name: 'Database Management Systems', code: 'CS401' },
        section: { id: 1, name: 'CSE-A' },
        fileUrl: '#',
        fileSizeMb: 1.9,
        fileExtension: '.pdf',
        viewCount: 301,
        downloadCount: 289,
        uploadedAt: '2026-01-25T08:00:00Z',
        publishedAt: '2026-01-25T08:01:00Z',
        updatedAt: '2026-01-25T08:01:00Z',
    },
    {
        id: 5,
        title: 'DAA – Algorithm Design Paradigms (Draft)',
        description: 'Work-in-progress notes on Divide & Conquer, Greedy, Dynamic Programming and Branch & Bound. Not ready for distribution.',
        materialType: 'NOTES',
        status: 'DRAFT',
        subject: { id: 3, name: 'Design & Analysis of Algorithms', code: 'CS501' },
        section: { id: 3, name: 'CSE-C' },
        fileUrl: '#',
        fileSizeMb: 2.4,
        fileExtension: '.docx',
        viewCount: 0,
        downloadCount: 0,
        uploadedAt: '2026-02-28T16:45:00Z',
        publishedAt: null,
        updatedAt: '2026-02-28T16:45:00Z',
    },
    {
        id: 6,
        title: 'OS – Process Scheduling Reference',
        description: 'Textbook chapter extract on scheduling algorithms: FCFS, SJF, Round-Robin, Priority Scheduling.',
        materialType: 'REFERENCE',
        status: 'PUBLISHED',
        subject: { id: 4, name: 'Operating Systems', code: 'CS302' },
        section: { id: 1, name: 'CSE-A' },
        fileUrl: '#',
        fileSizeMb: 8.3,
        fileExtension: '.pdf',
        viewCount: 55,
        downloadCount: 41,
        uploadedAt: '2026-02-05T10:10:00Z',
        publishedAt: '2026-02-05T10:11:00Z',
        updatedAt: '2026-02-05T10:11:00Z',
    },
    {
        id: 7,
        title: 'DSA – Previous Year Question Papers (2021–2025)',
        description: 'Compiled question papers from university examinations for last 5 years.',
        materialType: 'PAPER',
        status: 'ARCHIVED',
        subject: { id: 1, name: 'Data Structures & Algorithms', code: 'CS301' },
        section: { id: 1, name: 'CSE-A' },
        fileUrl: '#',
        fileSizeMb: 12.7,
        fileExtension: '.zip',
        viewCount: 412,
        downloadCount: 398,
        uploadedAt: '2025-11-01T07:00:00Z',
        publishedAt: '2025-11-01T07:01:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    },
];

// Student's view (section-filtered, no draft/archived)
export const MOCK_STUDENT_MATERIALS: StudyMaterial[] = MOCK_FACULTY_MATERIALS
    .filter((m) => m.status === 'PUBLISHED' && m.section.id === 1)
    .map((m) => ({ ...m, faculty: { id: 1, fullName: 'Dr. Anitha Rajan' } }));

// HOD view includes all, with faculty names
export const MOCK_HOD_MATERIALS: StudyMaterial[] = MOCK_FACULTY_MATERIALS.map((m) => ({
    ...m,
    faculty: { id: 1, fullName: 'Dr. Anitha Rajan' },
}));

const MOCK_DOWNLOADS: DownloadRecord[] = [
    { id: 1, studentName: 'Arun Kumar', studentRollNumber: '21CSE001', downloadedAt: '2026-02-28T10:15:00Z', ipAddress: '192.168.1.45' },
    { id: 2, studentName: 'Bharathi S', studentRollNumber: '21CSE002', downloadedAt: '2026-02-27T14:30:00Z', ipAddress: '192.168.1.46' },
    { id: 3, studentName: 'Chandru M', studentRollNumber: '21CSE003', downloadedAt: '2026-02-26T09:00:00Z', ipAddress: '192.168.1.47' },
    { id: 4, studentName: 'Divya R', studentRollNumber: '21CSE004', downloadedAt: '2026-02-25T11:45:00Z', ipAddress: '192.168.1.48' },
    { id: 5, studentName: 'Ezhil P', studentRollNumber: '21CSE005', downloadedAt: '2026-02-24T16:20:00Z', ipAddress: '192.168.1.49' },
];

export function getMockStats(materialId: number): MaterialStats {
    const mat = MOCK_FACULTY_MATERIALS.find((m) => m.id === materialId);
    return {
        materialId: materialId,
        totalDownloads: mat?.downloadCount ?? 0,
        uniqueDownloads: Math.floor((mat?.downloadCount ?? 0) * 0.85),
        totalViews: mat?.viewCount ?? 0,
        uniqueViews: Math.floor((mat?.viewCount ?? 0) * 0.78),
        recentDownloads: MOCK_DOWNLOADS,
    };
}
