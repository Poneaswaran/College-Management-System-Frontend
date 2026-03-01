import { gql } from '@apollo/client';

export const FACULTY_DASHBOARD_QUERY = gql`
  query FacultyDashboard {
    facultyDashboard {
      facultyName
      departmentName

      totalStudents
      activeCourses
      pendingReviews

      todayClassCount
      todayClasses {
        id
        subjectName
        subjectCode
        sectionName
        roomNumber
        startTime
        endTime
        periodNumber
      }

      attendanceOverview {
        subjectName
        subjectCode
        attendancePercentage
      }

      recentActivities {
        id
        activityType
        title
        description
        timestamp
      }
    }
  }
`;
