import { gql } from 'graphql-tag';

export const GRADES_PAGE_QUERY = gql`
  query GradesPageData($registerNumber: String!, $semesterId: Int) {
    # Top section - Overview cards
    gradeOverview(registerNumber: $registerNumber) {
      cgpa
      cgpaStatus
      totalCredits
      creditsEarned
      performanceTrend
      semesterGpas {
        id
        semesterName
        gpa
        totalCredits
        creditsEarned
        semester {
          displayName
          year
          startDate
          endDate
        }
      }
    }
    
    # Bottom section - Grades table
    myGrades(registerNumber: $registerNumber, semesterId: $semesterId) {
      id
      subject {
        code
        name
        credits
      }
      totalMarks
      totalMaxMarks
      percentage
      grade
      gradePoints
      semester {
        displayName
        year
      }
      examDate
      isPublished
    }
  }
`;

export const EXPORT_GRADES_QUERY = gql`
  query ExportGrades($registerNumber: String!, $semesterId: Int) {
    exportGrades(registerNumber: $registerNumber, semesterId: $semesterId) {
      success
      message
      filename
      fileBase64
    }
  }
`;
