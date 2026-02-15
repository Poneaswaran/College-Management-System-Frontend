import { gql } from 'graphql-tag';

export const COURSES_PAGE_QUERY = gql`
  query CoursesPage($registerNumber: String!) {
    courseOverview(registerNumber: $registerNumber) {
      totalCourses
      totalCredits
      avgProgress
      avgAttendance
    }
    
    myCourses(registerNumber: $registerNumber) {
      id
      subjectCode
      subjectName
      subjectType
      credits
      facultyName
      facultyEmail
      description
      courseProgress
      grade
      attendancePercentage
      completedAssignments
      totalAssignments
      classSchedule {
        dayName
        startTime
        endTime
      }
    }
  }
`;
