/**
 * Faculty Attendance Management Types
 * TypeScript interfaces for Attendance Sessions, Records, and Reports
 */

// ============================================
// ENUMS / STATUS TYPES
// ============================================

export type SessionStatus = 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'BLOCKED' | 'CANCELLED';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT';

// ============================================
// ENTITY TYPES
// ============================================

export interface PeriodDefinition {
    periodNumber: number;
    startTime: string;
    endTime: string;
    dayOfWeek: string;
}

export interface TimetableSubject {
    id: number;
    name: string;
    code: string;
}

export interface TimetableSection {
    id: number;
    name: string;
    year: number;
}

export interface TimetableEntry {
    id: number;
    subject: TimetableSubject;
    section: TimetableSection;
    periodDefinition: PeriodDefinition;
}

export interface AttendanceSession {
    id: number;
    date: string;
    status: SessionStatus;
    attendanceWindowMinutes: number;
    cancellationReason?: string;
    openedAt?: string;
    closedAt?: string;
    isActive: boolean;
    canMarkAttendance: boolean;
    timeRemaining?: number;
    totalStudents: number;
    presentCount: number;
    attendancePercentage: number;
    subjectName: string;
    sectionName: string;
    periodInfo: string;
    statusMessage?: string;
    facultyName?: string;
    periodTime?: string;
    timetableEntry?: TimetableEntry;
}

export interface StudentInfo {
    id: number;
    firstName: string;
    lastName: string;
    registerNumber: string;
    email?: string;
    profilePhotoUrl?: string;
}

export interface StudentAttendanceRecord {
    id: number;
    status: AttendanceStatus;
    markedAt?: string;
    isManuallyMarked: boolean;
    isPresent: boolean;
    isLate?: boolean;
    notes?: string;
    studentName: string;
    registerNumber: string;
    student?: StudentInfo;
}

export interface StudentAttendanceHistoryRecord {
    id: number;
    status: AttendanceStatus;
    markedAt?: string;
    isManuallyMarked: boolean;
    isPresent: boolean;
    isLate?: boolean;
    notes?: string;
    date: string;
    subjectName: string;
}

export interface AttendanceReport {
    id: number;
    attendancePercentage: number;
    totalClasses: number;
    classesAttended: number;
    classesAbsent: number;
    isLate?: boolean;
    isBelowThreshold?: boolean;
    lastCalculated?: string;
    student?: StudentInfo;
    subject?: {
        name: string;
        code: string;
    };
}

// ============================================
// GRAPHQL INPUT TYPES
// ============================================

export interface OpenSessionInput {
    timetableEntryId: number;
    date: string;
    attendanceWindowMinutes?: number;
}

export interface BlockSessionInput {
    sessionId: number;
    cancellationReason: string;
}

export interface ManualMarkAttendanceInput {
    sessionId: number;
    studentId: number;
    status: AttendanceStatus;
    notes?: string;
}

// ============================================
// GRAPHQL RESPONSE TYPES
// ============================================

export interface OpenSessionResponse {
    openAttendanceSession: AttendanceSession;
}

export interface CloseSessionResponse {
    closeAttendanceSession: AttendanceSession;
}

export interface BlockSessionResponse {
    blockAttendanceSession: {
        id: number;
        status: SessionStatus;
        cancellationReason: string;
        blockedAt: string;
        blockedBy: { email: string };
    };
}

export interface ReopenSessionResponse {
    reopenBlockedSession: {
        id: number;
        status: SessionStatus;
        cancellationReason?: string;
    };
}

export interface ManualMarkResponse {
    manualMarkAttendance: StudentAttendanceRecord;
}

export interface BulkMarkPresentResponse {
    bulkMarkPresent: StudentAttendanceRecord[];
}

export interface RecalculateReportResponse {
    recalculateAttendanceReport: AttendanceReport;
}
