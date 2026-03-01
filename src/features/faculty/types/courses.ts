export interface FacultyCourse {
    id: string;
    subjectCode: string;
    subjectName: string;
    sectionName: string;
    semesterName: string;
    studentsCount: number;
    assignmentsCount: number;
    classesCompleted: number;
    classesTotal: number;
    avgAttendance: number;
    scheduleSummary: string;
    roomNumber: string;
}

export interface FacultyCoursesData {
    totalCourses: number;
    totalStudents: number;
    avgAttendance: number;
    totalAssignments: number;
    courses: FacultyCourse[];
}

export interface FacultyCoursesResponse {
    facultyCourses: FacultyCoursesData;
}
