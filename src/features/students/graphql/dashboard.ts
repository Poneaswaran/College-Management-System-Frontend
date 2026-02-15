import { gql } from '@apollo/client';

export const STUDENT_DASHBOARD_QUERY = gql`
  query StudentDashboard($registerNumber: String!) {
    studentDashboard(registerNumber: $registerNumber) {
      studentName
      registerNumber
      profilePhotoUrl
      
      assignmentsDueThisWeek {
        id
        title
        subjectName
        subjectCode
        dueDate
        maxMarks
        isSubmitted
        submissionDate
      }
      totalPendingAssignments
      totalOverdueAssignments
      
      recentActivities {
        id
        activityType
        title
        description
        timestamp
        icon
      }
      
      courseProgress {
        subjectCode
        subjectName
        totalAssignments
        completedAssignments
        percentage
      }
      overallProgressPercentage
      currentGpa
      
      nextClass {
        subjectName
        subjectCode
        facultyName
        roomNumber
        startTime
        endTime
        dayName
      }
      todayClasses {
        subjectName
        subjectCode
        facultyName
        roomNumber
        startTime
        endTime
      }
    }
  }
`;
