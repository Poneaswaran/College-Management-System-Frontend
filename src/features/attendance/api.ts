/**
 * Faculty Attendance API Layer
 * Handles all GraphQL queries and mutations for attendance management
 */

import { client } from '../../lib/graphql';
import { ensureInt } from '../../utils/graphql-helpers';

import type {
    AttendanceSession,
    StudentAttendanceRecord,
    StudentAttendanceDetail,
    StudentAttendanceDetailResponse,
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
    FacultyPunchInput,
    FacultyAttendanceHistory,
    GetFacultyAttendanceResponse,
} from './types';
import axiosApi from '../../lib/axios';

import {
    FACULTY_SESSIONS_TODAY_QUERY,
    GET_ATTENDANCE_SESSION_QUERY,
    SECTION_ATTENDANCE_FOR_SESSION_QUERY,
    GET_STUDENT_ATTENDANCE_DETAIL_QUERY,
    LOW_ATTENDANCE_STUDENTS_QUERY,
    STUDENT_ATTENDANCE_HISTORY_QUERY,
    OPEN_ATTENDANCE_SESSION_MUTATION,
    CLOSE_ATTENDANCE_SESSION_MUTATION,
    BLOCK_ATTENDANCE_SESSION_MUTATION,
    REOPEN_BLOCKED_SESSION_MUTATION,
    MANUAL_MARK_ATTENDANCE_MUTATION,
    BULK_MARK_PRESENT_MUTATION,
    RECALCULATE_ATTENDANCE_REPORT_MUTATION,
    GET_FACULTY_ATTENDANCE_HISTORY,
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
 * Get detailed attendance info for a single student in a session
 */
export const fetchStudentAttendanceDetail = async (
    sessionId: number,
    studentId: number
): Promise<StudentAttendanceDetail> => {
    const { data } = await client.query<StudentAttendanceDetailResponse>({
        query: GET_STUDENT_ATTENDANCE_DETAIL_QUERY,
        variables: {
            sessionId: ensureInt(sessionId),
            studentId: ensureInt(studentId),
        },
        fetchPolicy: 'network-only',
    });

    if (!data?.studentAttendanceDetail) {
        throw new Error('Failed to fetch student attendance detail');
    }

    return data.studentAttendanceDetail;
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

/**
 * Get faculty attendance history
 */
export const fetchFacultyAttendanceHistory = async (
    facultyId?: number,
    dateFrom?: string,
    dateTo?: string
): Promise<FacultyAttendanceHistory[]> => {
    const { data } = await client.query<GetFacultyAttendanceResponse>({
        query: GET_FACULTY_ATTENDANCE_HISTORY,
        variables: {
            facultyId: facultyId ? ensureInt(facultyId) : undefined,
            dateFrom,
            dateTo,
        },
        fetchPolicy: 'network-only',
    });

    if (!data?.facultyAttendanceHistory) {
        throw new Error('Failed to fetch faculty attendance history');
    }

    return data.facultyAttendanceHistory;
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

// ============================================
// FACULTY PUNCH (REST)
// ============================================

/**
 * Faculty punch-in
 */
export const facultyPunchIn = async (input: FacultyPunchInput): Promise<{ message: string }> => {
    const formData = new FormData();
    if (input.punch_in_photo) {
        formData.append('punch_in_photo', input.punch_in_photo);
    }
    formData.append('punch_in_latitude', input.latitude.toString());
    formData.append('punch_in_longitude', input.longitude.toString());
    if (input.notes) {
        formData.append('notes', input.notes);
    }

    const { data } = await axiosApi.post('/attendance/faculty/punch-in/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return data;
};

/**
 * Faculty punch-out
 */
export const facultyPunchOut = async (input: FacultyPunchInput): Promise<{ message: string }> => {
    const formData = new FormData();
    if (input.punch_out_photo) {
        formData.append('punch_out_photo', input.punch_out_photo);
    }
    formData.append('punch_out_latitude', input.latitude.toString());
    formData.append('punch_out_longitude', input.longitude.toString());
    if (input.notes) {
        formData.append('notes', input.notes);
    }

    const { data } = await axiosApi.post('/attendance/faculty/punch-out/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return data;
};
