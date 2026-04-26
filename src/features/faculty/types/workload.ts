// ============================================
// Faculty Workload Types
// ============================================

export type WorkloadStatus = 'OVERLOADED' | 'OPTIMAL' | 'UNDERLOADED';

export interface CourseAssignment {
    id: number;
    subjectName: string;
    subjectCode: string;
    sectionName: string;
    semester: number;
    hoursPerWeek: number;
    studentCount: number;
    department: string;
}

export interface FacultyWorkloadItem {
    id: number;
    facultyName: string;
    employeeId: string;
    designation: string;
    department: string;
    profilePhoto: string | null;
    totalHoursPerWeek: number;
    maxHoursPerWeek: number;
    courseAssignments: CourseAssignment[];
    status: WorkloadStatus;
    attendanceAvg: number;
    pendingGradingCount: number;
}

export interface WorkloadSummaryStats {
    totalFaculty: number;
    overloadedCount: number;
    optimalCount: number;
    underloadedCount: number;
    avgHoursPerWeek: number;
    totalCourseSections: number;
}

export interface FacultyWorkloadData {
    summaryStats: WorkloadSummaryStats;
    facultyWorkloads: FacultyWorkloadItem[];
    departmentName: string;
    semesterLabel: string;
    aiInsights?: string | null;
}

export interface FacultyWorkloadResponse {
    facultyWorkload: FacultyWorkloadData;
}
