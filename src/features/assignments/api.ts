/**
 * Assignment Management API Layer
 * Handles all GraphQL queries and mutations for assignments
 */

import { client } from '../../lib/graphql';
import { ensureInt } from '../../utils/graphql-helpers';

import type {
  Assignment,
  Submission,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  SubmitAssignmentInput,
  GradeAssignmentInput,
  ReturnSubmissionInput,
  FacultyDashboardData,
  StudentDashboardData,
  AssignmentDetailData,
  CreateAssignmentResponse,
  SubmitAssignmentResponse,
  GradeAssignmentResponse,
  ReturnSubmissionResponse,

  Subject,
  Section,
  Semester,
  StudentAssignmentStatistics,
} from './types';
import {
  FACULTY_DASHBOARD_QUERY,
  STUDENT_DASHBOARD_QUERY,
  GET_FACULTY_ASSIGNMENTS_QUERY,
  GET_STUDENT_ASSIGNMENTS_QUERY,
  GET_ASSIGNMENT_DETAILS_QUERY,
  GET_MY_SUBMISSIONS_QUERY,
  GET_SUBMISSION_DETAILS_QUERY,
  HOD_DASHBOARD_QUERY,
  CREATE_ASSIGNMENT_MUTATION,
  UPDATE_ASSIGNMENT_MUTATION,
  PUBLISH_ASSIGNMENT_MUTATION,
  CLOSE_ASSIGNMENT_MUTATION,
  DELETE_ASSIGNMENT_MUTATION,
  SUBMIT_ASSIGNMENT_MUTATION,
  GRADE_ASSIGNMENT_MUTATION,
  RETURN_SUBMISSION_MUTATION,
  GET_SUBJECTS_QUERY,
  GET_SECTIONS_QUERY,
  GET_SEMESTERS_QUERY,
  GET_STUDENT_STATISTICS_QUERY,
} from './graphql/queries';

/**
 * Faculty Dashboard - Get assignments and pending grading
 */
export const fetchFacultyDashboard = async (): Promise<FacultyDashboardData> => {
  const { data } = await client.query<FacultyDashboardData>({
    query: FACULTY_DASHBOARD_QUERY,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('Failed to fetch faculty dashboard data');
  }

  return data;
};

/**
 * Student Dashboard - Get assignments and statistics
 */
export const fetchStudentDashboard = async (): Promise<StudentDashboardData> => {
  const { data } = await client.query<StudentDashboardData>({
    query: STUDENT_DASHBOARD_QUERY,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('Failed to fetch student dashboard data');
  }

  return data;
};

/**
 * Get faculty assignments with optional filters
 */
export const fetchFacultyAssignments = async (
  subjectId?: number,
  status?: string
): Promise<Assignment[]> => {
  const { data } = await client.query<{ assignments: Assignment[] }>({
    query: GET_FACULTY_ASSIGNMENTS_QUERY,
    variables: {
      subjectId: ensureInt(subjectId),
      status
    },
    fetchPolicy: 'network-only',
  });

  if (!data?.assignments) {
    throw new Error('Failed to fetch assignments');
  }

  return data.assignments;
};

/**
 * Get student assignments
 */
export const fetchStudentAssignments = async (): Promise<{
  myAssignments: Assignment[];
  pendingAssignments: Assignment[];
}> => {
  const { data } = await client.query<{
    myAssignments: Assignment[];
    pendingAssignments: Assignment[];
  }>({
    query: GET_STUDENT_ASSIGNMENTS_QUERY,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('Failed to fetch student assignments');
  }

  return data;
};

/**
 * Get assignment details with submissions (faculty view)
 */
export const fetchAssignmentDetails = async (
  id: number
): Promise<AssignmentDetailData> => {
  const { data } = await client.query<AssignmentDetailData>({
    query: GET_ASSIGNMENT_DETAILS_QUERY,
    variables: { id: ensureInt(id) },
    fetchPolicy: 'network-only',
  });

  if (!data?.assignment) {
    throw new Error('Failed to fetch assignment details');
  }

  return data;
};

/**
 * Get student submissions
 */
export const fetchMySubmissions = async (): Promise<Submission[]> => {
  const { data } = await client.query<{ mySubmissions: Submission[] }>({
    query: GET_MY_SUBMISSIONS_QUERY,
    fetchPolicy: 'network-only',
  });

  if (!data?.mySubmissions) {
    throw new Error('Failed to fetch submissions');
  }

  return data.mySubmissions;
};

/**
 * Get submission details for grading
 */
export const fetchSubmissionDetails = async (id: number): Promise<Submission> => {
  const { data } = await client.query<{ submission: Submission }>({
    query: GET_SUBMISSION_DETAILS_QUERY,
    variables: { id: ensureInt(id) },
    fetchPolicy: 'network-only',
  });

  if (!data?.submission) {
    throw new Error('Failed to fetch submission details');
  }

  return data.submission;
};

/**
 * HOD Dashboard - Get all department assignments
 */
export const fetchHODDashboard = async (): Promise<Assignment[]> => {
  const { data } = await client.query<{ assignments: Assignment[] }>({
    query: HOD_DASHBOARD_QUERY,
    fetchPolicy: 'network-only',
  });

  if (!data?.assignments) {
    throw new Error('Failed to fetch HOD dashboard data');
  }

  return data.assignments;
};

/**
 * Create a new assignment
 */
export const createAssignment = async (
  input: CreateAssignmentInput
): Promise<Assignment> => {
  const { data } = await client.mutate<CreateAssignmentResponse>({
    mutation: CREATE_ASSIGNMENT_MUTATION,
    variables: { input },
  });

  if (!data?.createAssignment) {
    throw new Error('Failed to create assignment');
  }

  return data.createAssignment as Assignment;
};

/**
 * Update an existing assignment
 */
export const updateAssignment = async (
  input: UpdateAssignmentInput
): Promise<Assignment> => {
  const { data } = await client.mutate<{ updateAssignment: Assignment }>({
    mutation: UPDATE_ASSIGNMENT_MUTATION,
    variables: { input },
  });

  if (!data?.updateAssignment) {
    throw new Error('Failed to update assignment');
  }

  return data.updateAssignment;
};

/**
 * Publish an assignment (make it visible to students)
 */
export const publishAssignment = async (id: number): Promise<Assignment> => {
  const { data } = await client.mutate<{ publishAssignment: Assignment }>({
    mutation: PUBLISH_ASSIGNMENT_MUTATION,
    variables: { assignmentId: ensureInt(id) },
  });

  if (!data?.publishAssignment) {
    throw new Error('Failed to publish assignment');
  }

  return data.publishAssignment;
};

/**
 * Close an assignment (stop accepting submissions)
 */
export const closeAssignment = async (id: number): Promise<Assignment> => {
  const { data } = await client.mutate<{ closeAssignment: Assignment }>({
    mutation: CLOSE_ASSIGNMENT_MUTATION,
    variables: { id: ensureInt(id) },
  });

  if (!data?.closeAssignment) {
    throw new Error('Failed to close assignment');
  }

  return data.closeAssignment;
};

/**
 * Delete an assignment
 */
export const deleteAssignment = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  const { data } = await client.mutate<{
    deleteAssignment: { success: boolean; message: string };
  }>({
    mutation: DELETE_ASSIGNMENT_MUTATION,
    variables: { id: ensureInt(id) },
  });

  if (!data?.deleteAssignment) {
    throw new Error('Failed to delete assignment');
  }

  return data.deleteAssignment;
};

/**
 * Submit an assignment (student)
 */
export const submitAssignment = async (
  input: SubmitAssignmentInput
): Promise<SubmitAssignmentResponse['submitAssignment']> => {
  const { data } = await client.mutate<SubmitAssignmentResponse>({
    mutation: SUBMIT_ASSIGNMENT_MUTATION,
    variables: { input },
  });

  if (!data?.submitAssignment) {
    throw new Error('Failed to submit assignment');
  }

  return data.submitAssignment;
};

/**
 * Grade a submission (faculty)
 */
export const gradeSubmission = async (
  input: GradeAssignmentInput
): Promise<GradeAssignmentResponse['gradeAssignment']> => {
  const { data } = await client.mutate<GradeAssignmentResponse>({
    mutation: GRADE_ASSIGNMENT_MUTATION,
    variables: { input },
  });

  if (!data?.gradeAssignment) {
    throw new Error('Failed to grade submission');
  }

  return data.gradeAssignment;
};

/**
 * Return submission for revision (faculty)
 */
export const returnSubmission = async (
  input: ReturnSubmissionInput
): Promise<ReturnSubmissionResponse['returnSubmission']> => {
  const { data } = await client.mutate<ReturnSubmissionResponse>({
    mutation: RETURN_SUBMISSION_MUTATION,
    variables: { input },
  });

  if (!data?.returnSubmission) {
    throw new Error('Failed to return submission');
  }

  return data.returnSubmission;
};



/**
 * Get subjects (for dropdown)
 */
export const fetchSubjects = async (): Promise<Subject[]> => {
  const { data } = await client.query<{ subjects: Subject[] }>({
    query: GET_SUBJECTS_QUERY,
    fetchPolicy: 'network-only',
  });

  if (!data?.subjects) {
    throw new Error('Failed to fetch subjects');
  }

  return data.subjects;
};

/**
 * Get sections (for dropdown)
 */
export const fetchSections = async (subjectId?: number): Promise<Section[]> => {
  const { data } = await client.query<{ sections: Section[] }>({
    query: GET_SECTIONS_QUERY,
    variables: { subjectId: ensureInt(subjectId) },
    fetchPolicy: 'network-only',
  });

  if (!data?.sections) {
    throw new Error('Failed to fetch sections');
  }

  return data.sections;
};

/**
 * Get semesters (for dropdown)
 */
export const fetchSemesters = async (): Promise<Semester[]> => {
  const { data } = await client.query<{ semesters: Semester[] }>({
    query: GET_SEMESTERS_QUERY,
    fetchPolicy: 'network-only',
  });

  if (!data?.semesters) {
    throw new Error('Failed to fetch semesters');
  }

  return data.semesters;
};

/**
 * Get student statistics (optional semester filter)
 */
export const fetchStudentStatistics = async (
  semesterId?: number
): Promise<StudentAssignmentStatistics> => {
  const { data } = await client.query<{
    studentAssignmentStatistics: StudentAssignmentStatistics;
  }>({
    query: GET_STUDENT_STATISTICS_QUERY,
    variables: { semesterId: ensureInt(semesterId) },
    fetchPolicy: 'network-only',
  });

  if (!data?.studentAssignmentStatistics) {
    throw new Error('Failed to fetch statistics');
  }

  return data.studentAssignmentStatistics;
};
