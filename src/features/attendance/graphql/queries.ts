/**
 * Faculty Attendance GraphQL Queries and Mutations
 */

import { gql } from '@apollo/client';

// ============================================
// QUERIES
// ============================================

export const FACULTY_SESSIONS_TODAY_QUERY = gql`
  query FacultySessionsToday {
    facultySessionsToday {
      id
      date
      status
      attendanceWindowMinutes
      cancellationReason
      openedAt
      closedAt
      isActive
      canMarkAttendance
      timeRemaining
      totalStudents
      presentCount
      attendancePercentage
      subjectName
      sectionName
      periodInfo
      statusMessage
      timetableEntry {
        id
        subject {
          id
          name
          code
        }
        section {
          id
          name
          year
        }
        periodDefinition {
          periodNumber
          startTime
          endTime
          dayOfWeek
        }
      }
    }
  }
`;

export const GET_ATTENDANCE_SESSION_QUERY = gql`
  query GetAttendanceSession($sessionId: Int!) {
    attendanceSession(sessionId: $sessionId) {
      id
      date
      status
      attendanceWindowMinutes
      openedAt
      closedAt
      totalStudents
      presentCount
      attendancePercentage
      subjectName
      sectionName
      facultyName
      periodTime
    }
  }
`;

export const SECTION_ATTENDANCE_FOR_SESSION_QUERY = gql`
  query SectionAttendanceForSession($sessionId: Int!) {
    sectionAttendanceForSession(sessionId: $sessionId) {
      id
      status
      markedAt
      isManuallyMarked
      isPresent
      isLate
      notes
      studentName
      registerNumber
      student {
        id
        firstName
        lastName
        registerNumber
        profilePhotoUrl
      }
    }
  }
`;

export const LOW_ATTENDANCE_STUDENTS_QUERY = gql`
  query LowAttendanceStudents($subjectId: Int!, $threshold: Float) {
    lowAttendanceStudents(subjectId: $subjectId, threshold: $threshold) {
      id
      attendancePercentage
      totalClasses
      classesAttended
      classesAbsent
      isLate
      isBelowThreshold
      student {
        id
        firstName
        lastName
        registerNumber
        email
      }
      subject {
        name
        code
      }
    }
  }
`;

export const STUDENT_ATTENDANCE_HISTORY_QUERY = gql`
  query StudentAttendanceHistory(
    $studentId: Int!
    $subjectId: Int
    $startDate: Date
    $endDate: Date
  ) {
    studentAttendanceHistory(
      studentId: $studentId
      subjectId: $subjectId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      status
      markedAt
      isManuallyMarked
      isPresent
      isLate
      notes
      date
      subjectName
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const OPEN_ATTENDANCE_SESSION_MUTATION = gql`
  mutation OpenAttendanceSession($input: OpenSessionInput!) {
    openAttendanceSession(input: $input) {
      id
      status
      openedAt
      attendanceWindowMinutes
      subjectName
      sectionName
      periodInfo
      canMarkAttendance
    }
  }
`;

export const CLOSE_ATTENDANCE_SESSION_MUTATION = gql`
  mutation CloseAttendanceSession($sessionId: Int!) {
    closeAttendanceSession(sessionId: $sessionId) {
      id
      status
      closedAt
      totalStudents
      presentCount
      attendancePercentage
    }
  }
`;

export const BLOCK_ATTENDANCE_SESSION_MUTATION = gql`
  mutation BlockAttendanceSession($input: BlockSessionInput!) {
    blockAttendanceSession(input: $input) {
      id
      status
      cancellationReason
      blockedAt
      blockedBy {
        email
      }
    }
  }
`;

export const REOPEN_BLOCKED_SESSION_MUTATION = gql`
  mutation ReopenBlockedSession($sessionId: Int!) {
    reopenBlockedSession(sessionId: $sessionId) {
      id
      status
      cancellationReason
    }
  }
`;

export const MANUAL_MARK_ATTENDANCE_MUTATION = gql`
  mutation ManualMarkAttendance($input: ManualMarkAttendanceInput!) {
    manualMarkAttendance(input: $input) {
      id
      status
      isManuallyMarked
      notes
      studentName
      registerNumber
    }
  }
`;

export const BULK_MARK_PRESENT_MUTATION = gql`
  mutation BulkMarkPresent($sessionId: Int!, $studentIds: [Int!]!) {
    bulkMarkPresent(sessionId: $sessionId, studentIds: $studentIds) {
      id
      status
      studentName
      registerNumber
    }
  }
`;

export const RECALCULATE_ATTENDANCE_REPORT_MUTATION = gql`
  mutation RecalculateAttendanceReport($reportId: Int!) {
    recalculateAttendanceReport(reportId: $reportId) {
      id
      attendancePercentage
      totalClasses
      classesAttended
      classesAbsent
      lastCalculated
    }
  }
`;
