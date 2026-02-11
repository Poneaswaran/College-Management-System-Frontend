import { gql } from '@apollo/client';

// Get active sessions for student
export const GET_ACTIVE_SESSIONS = gql`
  query GetActiveSessions {
    activeSessionsForStudent {
      id
      subjectName
      sectionName
      periodTime
      facultyName
      canMarkAttendance
      timeRemaining
      statusMessage
      openedAt
    }
  }
`;

// Mark attendance with image
export const MARK_ATTENDANCE = gql`
  mutation MarkAttendance(
    $sessionId: ID!
    $imageData: String!
    $latitude: Float
    $longitude: Float
  ) {
    markAttendance(input: {
      sessionId: $sessionId
      imageData: $imageData
      latitude: $latitude
      longitude: $longitude
    }) {
      attendance {
        id
        status
        markedAt
      }
      message
      success
    }
  }
`;

// Get attendance history
export const GET_ATTENDANCE_HISTORY = gql`
  query GetAttendanceHistory(
    $registerNumber: String!
    $subjectId: Int
    $startDate: Date
    $endDate: Date
  ) {
    studentAttendanceHistory(
      registerNumber: $registerNumber
      subjectId: $subjectId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      sessionDate
      subjectName
      status
      markedAt
      isLate
      isManuallyMarked
      notes
      periodTime
    }
  }
`;

// Get attendance report for one subject
export const GET_ATTENDANCE_REPORT = gql`
  query GetAttendanceReport(
    $registerNumber: String!
    $subjectId: Int!
  ) {
    attendanceReport(
      registerNumber: $registerNumber
      subjectId: $subjectId
    ) {
      studentName
      registerNumber
      subjectName
      totalClasses
      classesPresent
      classesAbsent
      classesLate
      attendancePercentage
      isBelowThreshold
      lastUpdated
    }
  }
`;

// Get all subject reports
export const GET_ALL_REPORTS = gql`
  query GetAllReports($registerNumber: String!) {
    allReportsForStudent(registerNumber: $registerNumber) {
      subjectName
      totalClasses
      classesPresent
      classesAbsent
      attendancePercentage
      isBelowThreshold
    }
  }
`;
