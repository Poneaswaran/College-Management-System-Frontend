/**
 * Assignment Management GraphQL Queries and Mutations
 */

import { gql } from '@apollo/client';

export const FACULTY_DASHBOARD_QUERY = gql`
  query FacultyDashboard {
    myAssignments {
      id
      title
      subjectName
      sectionName
      dueDate
      status
      statistics {
        totalStudents
        totalSubmissions
        submissionPercentage
        pendingGrading
      }
    }
    
    pendingGrading {
      id
      assignmentTitle
      studentName
      studentRegisterNumber
      submittedAt
      isLate
    }
  }
`;

export const STUDENT_DASHBOARD_QUERY = gql`
  query StudentDashboard {
    myAssignments {
      id
      title
      subjectName
      dueDate
      maxMarks
      isOverdue
      canSubmit
      timeRemaining
      status
    }
    
    overdueAssignments {
      id
      title
      subjectName
      dueDate
    }
    
    studentAssignmentStatistics {
      totalAssignments
      totalSubmitted
      pendingSubmission
      submissionPercentage
      overdueCount
      averagePercentage
    }
  }
`;

export const GET_FACULTY_ASSIGNMENTS_QUERY = gql`
  query GetFacultyAssignments($subjectId: Int, $status: String) {
    assignments(subjectId: $subjectId, status: $status) {
      id
      title
      subjectName
      sectionName
      dueDate
      status
      isOverdue
      totalSubmissions
      statistics {
        submissionPercentage
        pendingGrading
      }
    }
  }
`;

export const GET_STUDENT_ASSIGNMENTS_QUERY = gql`
  query GetStudentAssignments {
    myAssignments {
      id
      title
      description
      subjectName
      sectionName
      facultyName
      dueDate
      maxMarks
      weightage
      isOverdue
      canSubmit
      timeRemaining
    }
    
    pendingAssignments {
      id
      title
      subjectName
      dueDate
      maxMarks
    }
  }
`;

export const GET_ASSIGNMENT_DETAILS_QUERY = gql`
  query GetAssignmentDetails($id: Int!) {
    assignment(id: $id) {
      id
      title
      description
      subjectName
      sectionName
      facultyName
      dueDate
      maxMarks
      weightage
      status
      isOverdue
      canSubmit
      allowLateSubmission
      lateSubmissionDeadline
      assignmentType
      attachmentUrl
      statistics {
        totalStudents
        totalSubmissions
        notSubmitted
        submissionPercentage
        gradedCount
        pendingGrading
        lateSubmissions
        averageMarks
        averagePercentage
      }
    }
    
    assignmentSubmissions(assignmentId: $id) {
      id
      studentName
      studentRegisterNumber
      submittedAt
      isLate
      status
      submissionText
      hasAttachment
      attachmentUrl
      grade {
        marksObtained
        percentage
        gradeLetter
        feedback
        gradedAt
      }
    }
  }
`;

export const GET_MY_SUBMISSIONS_QUERY = gql`
  query GetMySubmissions {
    mySubmissions {
      id
      assignmentTitle
      submittedAt
      isLate
      status
      submissionText
      hasAttachment
      attachmentUrl
      grade {
        marksObtained
        percentage
        gradeLetter
        feedback
        gradedAt
      }
    }
  }
`;

export const GET_SUBMISSION_DETAILS_QUERY = gql`
  query GetSubmissionDetails($id: Int!) {
    submission(id: $id) {
      id
      studentName
      studentRegisterNumber
      assignmentTitle
      submittedAt
      isLate
      status
      submissionText
      hasAttachment
      attachmentUrl
      grade {
        id
        marksObtained
        percentage
        gradeLetter
        feedback
        gradedAt
        gradedBy
      }
    }
  }
`;

export const HOD_DASHBOARD_QUERY = gql`
  query HODDashboard {
    assignments(sectionId: null) {
      id
      title
      subjectName
      sectionName
      facultyName
      dueDate
      status
      statistics {
        submissionPercentage
        averagePercentage
      }
    }
  }
`;

export const CREATE_ASSIGNMENT_MUTATION = gql`
  mutation CreateAssignment($input: CreateAssignmentInput!) {
    createAssignment(input: $input) {
      id
      title
      status
      subjectName
      sectionName
      dueDate
      maxMarks
    }
  }
`;

export const UPDATE_ASSIGNMENT_MUTATION = gql`
  mutation UpdateAssignment($input: UpdateAssignmentInput!) {
    updateAssignment(input: $input) {
      id
      title
      description
      dueDate
      maxMarks
      weightage
      status
    }
  }
`;

export const PUBLISH_ASSIGNMENT_MUTATION = gql`
  mutation PublishAssignment($id: Int!) {
    publishAssignment(id: $id) {
      id
      status
    }
  }
`;

export const CLOSE_ASSIGNMENT_MUTATION = gql`
  mutation CloseAssignment($id: Int!) {
    closeAssignment(id: $id) {
      id
      status
    }
  }
`;

export const DELETE_ASSIGNMENT_MUTATION = gql`
  mutation DeleteAssignment($id: Int!) {
    deleteAssignment(id: $id) {
      success
      message
    }
  }
`;

export const SUBMIT_ASSIGNMENT_MUTATION = gql`
  mutation SubmitAssignment($input: SubmitAssignmentInput!) {
    submitAssignment(input: $input) {
      success
      message
      submission {
        id
        submittedAt
        isLate
        status
      }
    }
  }
`;

export const GRADE_ASSIGNMENT_MUTATION = gql`
  mutation GradeAssignment($input: GradeAssignmentInput!) {
    gradeAssignment(input: $input) {
      success
      message
      grade {
        id
        marksObtained
        percentage
        gradeLetter
        feedback
        gradedAt
      }
    }
  }
`;

export const RETURN_SUBMISSION_MUTATION = gql`
  mutation ReturnSubmission($input: ReturnSubmissionInput!) {
    returnSubmission(input: $input) {
      id
      status
    }
  }
`;

export const GET_SUBJECTS_QUERY = gql`
  query GetSubjects {
    subjects {
      id
      name
      code
    }
  }
`;

export const GET_SECTIONS_QUERY = gql`
  query GetSections($subjectId: Int) {
    sections(subjectId: $subjectId) {
      id
      name
      semesterId
    }
  }
`;

export const GET_SEMESTERS_QUERY = gql`
  query GetSemesters {
    semesters {
      id
      name
      year
    }
  }
`;
