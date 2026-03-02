// ============================================
// HOD Attendance Reports — Types
// ============================================

export type ViewMode = 'STUDENTS' | 'DEPARTMENTS' | 'CLASSES';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export type AttendanceRiskLevel = 'GOOD' | 'WARNING' | 'CRITICAL';

// ─── Period / Timetable ───────────────────────────────────────────────────────

export interface PeriodSlot {
    periodNumber: number;
    startTime: string; // "09:00"
    endTime: string;   // "09:50"
    label: string;     // "Period 1 (09:00–09:50)"
}

export interface TimetablePeriodFilter {
    semesterId: number | null;
    semesterLabel: string;
    subjectId: number | null;
    subjectName: string;
    periodSlot: PeriodSlot | null;
    dateRange: { from: string; to: string } | null;
}

// ─── Student View ─────────────────────────────────────────────────────────────

export interface StudentAttendanceSummary {
    studentId: number;
    studentName: string;
    registerNumber: string;
    rollNumber: string;
    className: string;      // e.g. "CSE-A  Sem 3"
    sectionId: number;
    year: number;
    semester: number;
    totalClasses: number;
    attended: number;
    absent: number;
    late: number;
    percentage: number;
    riskLevel: AttendanceRiskLevel;
    lastAbsentDate: string | null;
}

// ─── Class View ───────────────────────────────────────────────────────────────

export interface ClassAttendanceSummary {
    sectionId: number;
    className: string;      // e.g. "CSE-A"
    semester: number;
    year: number;
    totalStudents: number;
    avgPercentage: number;
    criticalCount: number;  // < 60%
    warningCount: number;   // 60–74%
    goodCount: number;      // ≥ 75%
    totalClassesConducted: number;
    subjectBreakdown: SubjectClassAttendance[];
}

export interface SubjectClassAttendance {
    subjectId: number;
    subjectName: string;
    subjectCode: string;
    facultyName: string;
    totalClasses: number;
    avgPercentage: number;
}

// ─── Department View ──────────────────────────────────────────────────────────

export interface DepartmentAttendanceSummary {
    departmentId: number;
    departmentName: string;
    departmentCode: string;
    totalStudents: number;
    avgPercentage: number;
    criticalCount: number;
    warningCount: number;
    goodCount: number;
    classBreakdown: ClassAttendanceSummary[];
}

// ─── Drill-Down: Student Detail ───────────────────────────────────────────────

export interface StudentPeriodRecord {
    date: string;           // "2026-01-15"
    subjectName: string;
    subjectCode: string;
    periodLabel: string;
    status: AttendanceStatus;
    markedBy: string;
    isManuallyMarked: boolean;
}

export interface StudentAttendanceDetail {
    studentId: number;
    studentName: string;
    registerNumber: string;
    rollNumber: string;
    className: string;
    semester: number;
    year: number;
    subjectSummaries: SubjectAttendanceDetail[];
    periodRecords: StudentPeriodRecord[];
}

export interface SubjectAttendanceDetail {
    subjectId: number;
    subjectName: string;
    subjectCode: string;
    facultyName: string;
    totalClasses: number;
    attended: number;
    absent: number;
    late: number;
    percentage: number;
    riskLevel: AttendanceRiskLevel;
}

// ─── Drill-Down: Class Detail ─────────────────────────────────────────────────

export interface ClassAttendanceDetail {
    sectionId: number;
    className: string;
    semester: number;
    year: number;
    students: StudentAttendanceSummary[];
    subjectBreakdown: SubjectClassAttendance[];
}

// ─── Top-level Data Envelope ──────────────────────────────────────────────────

export interface AttendanceReportSummaryStats {
    totalStudents: number;
    overallAvgPercentage: number;
    criticalCount: number;      // < 60%
    warningCount: number;       // 60–74%
    goodCount: number;          // ≥ 75%
    totalClassesConducted: number;
    departmentName: string;
    semesterLabel: string;
    periodFilter: string;       // human-readable description of active filter
}

export interface HODAttendanceReportData {
    summaryStats: AttendanceReportSummaryStats;
    students: StudentAttendanceSummary[];
    classes: ClassAttendanceSummary[];
    departments: DepartmentAttendanceSummary[];
    availablePeriods: PeriodSlot[];
    availableSemesters: { id: number; label: string }[];
    availableSubjects: { id: number; name: string; code: string }[];
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface HODAttendanceReportResponse {
    hodAttendanceReport: HODAttendanceReportData;
}

export interface HODStudentAttendanceDetailResponse {
    hodStudentAttendanceDetail: StudentAttendanceDetail;
}

export interface HODClassAttendanceDetailResponse {
    hodClassAttendanceDetail: ClassAttendanceDetail;
}

// ─── Query Variables ──────────────────────────────────────────────────────────

export interface AttendanceReportQueryVars {
    departmentId?: number;
    semesterId?: number;
    subjectId?: number;
    periodNumber?: number;
    dateFrom?: string;
    dateTo?: string;
}
