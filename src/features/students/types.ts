export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    enrollmentNo: string;
}

export interface Department {
    code: string;
    name: string;
}

export interface Course {
    code: string;
    name: string;
    durationYears: number;
    department: Department;
}

export interface Section {
    name: string;
    year: number;
}

export interface User {
    email: string;
    registerNumber: string;
}

export interface StudentProfile {
    id: string;
    registerNumber: string;
    rollNumber: string;
    fullName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    address: string;
    aadharNumber: string;
    idProofType: string;
    idProofNumber: string;
    guardianName: string;
    guardianRelationship: string;
    guardianPhone: string;
    guardianEmail: string;
    admissionDate: string;
    academicStatus: string;
    year: number;
    semester: number;
    profilePhotoUrl?: string;
    profileCompleted: boolean;
    course: Course;
    section: Section;
    user: User;
}

export interface UpdateStudentProfileInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    guardianName?: string;
    guardianRelationship?: string;
    guardianPhone?: string;
    guardianEmail?: string;
}

export interface UpdateStudentProfileWithPhotoInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    guardianName?: string;
    guardianRelationship?: string;
    guardianPhone?: string;
    guardianEmail?: string;
}

export interface UpdateProfileResponse {
    profile: StudentProfile;
    message: string;
}

export interface UpdateStudentProfileMutationResponse {
    updateStudentProfile: UpdateProfileResponse;
}

export interface UpdateStudentProfileWithPhotoMutationResponse {
    updateStudentProfileWithPhoto: UpdateProfileResponse;
}
