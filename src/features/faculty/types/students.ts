export interface FacultyStudent {
    id: string;
    fullName: string;
    email: string;
    registerNumber: string;
    departmentName: string;
    semesterSection: string;
    attendancePercentage: number;
    gpa: number;
    status: 'ACTIVE' | 'INACTIVE' | 'ALUMNI';
}

export interface FacultyStudentsResponse {
    facultyStudents: {
        totalCount: number;
        students: FacultyStudent[];
    };
}
