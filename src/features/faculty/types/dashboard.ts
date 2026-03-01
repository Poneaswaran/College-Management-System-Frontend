// ============================================
// Faculty Dashboard Types
// ============================================

export interface TodayClass {
    id: number;
    subjectName: string;
    subjectCode: string;
    sectionName: string;
    roomNumber: string;
    startTime: string;
    endTime: string;
    periodNumber: number;
}

export interface AttendanceOverviewItem {
    subjectName: string;
    subjectCode: string;
    attendancePercentage: number;
}

export interface FacultyRecentActivity {
    id: number;
    activityType: 'GRADED_ASSIGNMENT' | 'MARKED_ATTENDANCE' | string;
    title: string;
    description: string;
    timestamp: string;
}

export interface FacultyDashboardData {
    facultyName: string;
    departmentName: string;
    totalStudents: number;
    activeCourses: number;
    pendingReviews: number;
    todayClassCount: number;
    todayClasses: TodayClass[];
    attendanceOverview: AttendanceOverviewItem[];
    recentActivities: FacultyRecentActivity[];
}

export interface FacultyDashboardResponse {
    facultyDashboard: FacultyDashboardData;
}
