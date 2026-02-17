/**
 * Faculty Attendance API Layer
 * Handles all GraphQL queries and mutations for attendance management
 */

import { client } from '../../lib/graphql';
import { ensureInt } from '../../utils/graphql-helpers';

import type {
    AttendanceSession,
    StudentAttendanceRecord,
    StudentAttendanceHistoryRecord,
    AttendanceReport,
    OpenSessionInput,
    BlockSessionInput,
    ManualMarkAttendanceInput,
    OpenSessionResponse,
    CloseSessionResponse,
    BlockSessionResponse,
    ReopenSessionResponse,
    ManualMarkResponse,
    BulkMarkPresentResponse,
    RecalculateReportResponse,
} from './types';

import {
    FACULTY_SESSIONS_TODAY_QUERY,
    GET_ATTENDANCE_SESSION_QUERY,
    SECTION_ATTENDANCE_FOR_SESSION_QUERY,
    LOW_ATTENDANCE_STUDENTS_QUERY,
    STUDENT_ATTENDANCE_HISTORY_QUERY,
    OPEN_ATTENDANCE_SESSION_MUTATION,
    CLOSE_ATTENDANCE_SESSION_MUTATION,
    BLOCK_ATTENDANCE_SESSION_MUTATION,
    REOPEN_BLOCKED_SESSION_MUTATION,
    MANUAL_MARK_ATTENDANCE_MUTATION,
    BULK_MARK_PRESENT_MUTATION,
    RECALCULATE_ATTENDANCE_REPORT_MUTATION,
} from './graphql/queries';

// ============================================
// QUERIES
// ============================================

/**
 * Get today's attendance sessions for the faculty
 */
export const fetchFacultySessionsToday = async (): Promise<AttendanceSession[]> => {
    const { data } = await client.query<{ facultySessionsToday: AttendanceSession[] }>({
        query: FACULTY_SESSIONS_TODAY_QUERY,
        fetchPolicy: 'network-only',
    });

    if (!data?.facultySessionsToday) {
        throw new Error('Failed to fetch today\'s sessions');
    }

    return data.facultySessionsToday;
};

/**
 * Get a specific attendance session
 */
export const fetchAttendanceSession = async (sessionId: number): Promise<AttendanceSession> => {
    const { data } = await client.query<{ attendanceSession: AttendanceSession }>({
        query: GET_ATTENDANCE_SESSION_QUERY,
        variables: { sessionId: ensureInt(sessionId) },
        fetchPolicy: 'network-only',
    });

    if (!data?.attendanceSession) {
        throw new Error('Failed to fetch attendance session');
    }

    return data.attendanceSession;
};

/**
 * Get all student attendance records for a session
 */
export const fetchSectionAttendanceForSession = async (
    sessionId: number
): Promise<StudentAttendanceRecord[]> => {
    const { data } = await client.query<{
        sectionAttendanceForSession: StudentAttendanceRecord[];
    }>({
        query: SECTION_ATTENDANCE_FOR_SESSION_QUERY,
        variables: { sessionId: ensureInt(sessionId) },
        fetchPolicy: 'network-only',
    });

    if (!data?.sectionAttendanceForSession) {
        throw new Error('Failed to fetch section attendance');
    }

    return data.sectionAttendanceForSession;
};

/**
 * Get students with low attendance for a subject
 */
export const fetchLowAttendanceStudents = async (
    subjectId: number,
    threshold?: number
): Promise<AttendanceReport[]> => {
    const { data } = await client.query<{ lowAttendanceStudents: AttendanceReport[] }>({
        query: LOW_ATTENDANCE_STUDENTS_QUERY,
        variables: {
            subjectId: ensureInt(subjectId),
            threshold,
        },
        fetchPolicy: 'network-only',
    });

    if (!data?.lowAttendanceStudents) {
        throw new Error('Failed to fetch low attendance students');
    }

    return data.lowAttendanceStudents;
};

/**
 * Get attendance history for a specific student
 */
export const fetchStudentAttendanceHistory = async (
    studentId: number,
    subjectId?: number,
    startDate?: string,
    endDate?: string
): Promise<StudentAttendanceHistoryRecord[]> => {
    const { data } = await client.query<{
        studentAttendanceHistory: StudentAttendanceHistoryRecord[];
    }>({
        query: STUDENT_ATTENDANCE_HISTORY_QUERY,
        variables: {
            studentId: ensureInt(studentId),
            subjectId: ensureInt(subjectId),
            startDate,
            endDate,
        },
        fetchPolicy: 'network-only',
    });

    if (!data?.studentAttendanceHistory) {
        throw new Error('Failed to fetch student attendance history');
    }

    return data.studentAttendanceHistory;
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Open an attendance session
 */
export const openAttendanceSession = async (
    input: OpenSessionInput
): Promise<AttendanceSession> => {
    const { data } = await client.mutate<OpenSessionResponse>({
        mutation: OPEN_ATTENDANCE_SESSION_MUTATION,
        variables: {
            input: {
                ...input,
                timetableEntryId: ensureInt(input.timetableEntryId),
                attendanceWindowMinutes: input.attendanceWindowMinutes ? ensureInt(input.attendanceWindowMinutes) : undefined,
            },
        },
    });

    if (!data?.openAttendanceSession) {
        throw new Error('Failed to open attendance session');
    }

    return data.openAttendanceSession;
};

/**
 * Close an attendance session
 */
export const closeAttendanceSession = async (
    sessionId: number
): Promise<AttendanceSession> => {
    const { data } = await client.mutate<CloseSessionResponse>({
        mutation: CLOSE_ATTENDANCE_SESSION_MUTATION,
        variables: { sessionId: ensureInt(sessionId) },
    });

    if (!data?.closeAttendanceSession) {
        throw new Error('Failed to close attendance session');
    }

    return data.closeAttendanceSession;
};

/**
 * Block/cancel an attendance session
 */
export const blockAttendanceSession = async (
    input: BlockSessionInput
): Promise<BlockSessionResponse['blockAttendanceSession']> => {
    const { data } = await client.mutate<BlockSessionResponse>({
        mutation: BLOCK_ATTENDANCE_SESSION_MUTATION,
        variables: {
            input: {
                ...input,
                sessionId: ensureInt(input.sessionId),
            },
        },
    });

    if (!data?.blockAttendanceSession) {
        throw new Error('Failed to block attendance session');
    }

    return data.blockAttendanceSession;
};

/**
 * Reopen a blocked/cancelled session
 */
export const reopenBlockedSession = async (
    sessionId: number
): Promise<ReopenSessionResponse['reopenBlockedSession']> => {
    const { data } = await client.mutate<ReopenSessionResponse>({
        mutation: REOPEN_BLOCKED_SESSION_MUTATION,
        variables: { sessionId: ensureInt(sessionId) },
    });

    if (!data?.reopenBlockedSession) {
        throw new Error('Failed to reopen session');
    }

    return data.reopenBlockedSession;
};

/**
 * Manually mark attendance for a student
 */
export const manualMarkAttendance = async (
    input: ManualMarkAttendanceInput
): Promise<StudentAttendanceRecord> => {
    const { data } = await client.mutate<ManualMarkResponse>({
        mutation: MANUAL_MARK_ATTENDANCE_MUTATION,
        variables: {
            input: {
                ...input,
                sessionId: ensureInt(input.sessionId),
                studentId: ensureInt(input.studentId),
            },
        },
    });

    if (!data?.manualMarkAttendance) {
        throw new Error('Failed to manually mark attendance');
    }

    return data.manualMarkAttendance;
};

/**
 * Bulk mark students as present
 */
export const bulkMarkPresent = async (
    sessionId: number,
    studentIds: number[]
): Promise<StudentAttendanceRecord[]> => {
    const { data } = await client.mutate<BulkMarkPresentResponse>({
        mutation: BULK_MARK_PRESENT_MUTATION,
        variables: {
            sessionId: ensureInt(sessionId),
            studentIds: studentIds.map((id) => ensureInt(id)!),
        },
    });

    if (!data?.bulkMarkPresent) {
        throw new Error('Failed to bulk mark present');
    }

    return data.bulkMarkPresent;
};

/**
 * Recalculate attendance report
 */
export const recalculateAttendanceReport = async (
    reportId: number
): Promise<AttendanceReport> => {
    const { data } = await client.mutate<RecalculateReportResponse>({
        mutation: RECALCULATE_ATTENDANCE_REPORT_MUTATION,
        variables: { reportId: ensureInt(reportId) },
    });

    if (!data?.recalculateAttendanceReport) {
        throw new Error('Failed to recalculate report');
    }

    return data.recalculateAttendanceReport;
};
