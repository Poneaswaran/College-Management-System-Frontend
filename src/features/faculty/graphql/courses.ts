import { gql } from '@apollo/client';

export const GET_FACULTY_COURSES = gql`
  query GetFacultyCourses {
    facultyCourses {
      totalCourses
      totalStudents
      avgAttendance
      totalAssignments
      courses {
        id
        subjectCode
        subjectName
        sectionName
        semesterName
        studentsCount
        assignmentsCount
        classesCompleted
        classesTotal
        avgAttendance
        scheduleSummary
        roomNumber
      }
    }
  }
`;
