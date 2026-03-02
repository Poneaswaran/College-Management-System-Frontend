// ============================================
// HOD Profile Types
// ============================================

export type AcademicStatus = 'ACTIVE' | 'ON_LEAVE' | 'RETIRED';

export interface ResearchPublication {
    id: number;
    title: string;
    journal: string;
    year: number;
    type: 'JOURNAL' | 'CONFERENCE' | 'BOOK_CHAPTER';
    doi?: string;
}

export interface DepartmentStat {
    label: string;
    value: string | number;
}

export interface HODProfile {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;         // YYYY-MM-DD
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    address: string;
    profilePhoto: string | null;

    // Professional
    employeeId: string;
    designation: string;
    joiningDate: string;         // YYYY-MM-DD
    hodSince: string;            // YYYY-MM-DD
    academicStatus: AcademicStatus;
    qualifications: string;
    specialization: string;
    experience: string;
    researchInterests: string[];

    // Department
    department: {
        name: string;
        code: string;
        vision: string;
    };

    // Stats shown on profile
    departmentStats: {
        totalFaculty: number;
        totalStudents: number;
        activeCourses: number;
        researchProjects: number;
    };

    // Publications
    publications: ResearchPublication[];
}

export interface HODProfileResponse {
    hodProfile: HODProfile;
}

export interface UpdateHODProfileInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    researchInterests?: string[];
}
