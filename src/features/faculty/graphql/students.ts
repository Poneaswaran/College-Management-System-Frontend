import { gql } from '@apollo/client';

export const GET_FACULTY_STUDENTS = gql`
  query GetFacultyStudents($search: String, $departmentId: Int, $page: Int = 1, $pageSize: Int = 10) {
    facultyStudents(
      search: $search
      departmentId: $departmentId
      page: $page
      pageSize: $pageSize
    ) {
      totalCount
      students {
        id
        fullName
        email
        registerNumber
        departmentName
        semesterSection
        attendancePercentage
        gpa
        status
      }
    }
  }
`;
