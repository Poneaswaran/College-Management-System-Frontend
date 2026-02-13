/**
 * Assignment Management Types
 * TypeScript interfaces for Assignment, Submission, and Grade entities
 */

export type AssignmentType = 'INDIVIDUAL' | 'GROUP' | 'LAB' | 'PROJECT' | 'QUIZ';

export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'GRADED';

export type SubmissionStatus = 'SUBMITTED' | 'GRADED' | 'RETURNED' | 'RESUBMITTED';

export interface AssignmentStatistics {
  totalStudents: number;
  totalSubmissions: number;
  notSubmitted: number;
  submissionPercentage: number;
  gradedCount: number;
  pendingGrading: number;
  lateSubmissions: number;
  averageMarks: number;
  averagePercentage: number;
}

export interface Grade {
  id: number;
  marksObtained: number;
  percentage: number;
  gradeLetter: string;
  feedback?: string;
  gradedAt: string;
  gradedBy?: string;
}

export interface Submission {
  id: number;
  submittedAt: string;
  status: SubmissionStatus;
  submissionText?: string;
  submissionFile?: string;
  assignment?: {
    id: number;
    title: string;
    maxMarks: number;
  };
  grade?: Grade;
  // Legacy fields for backward compatibility
  studentName?: string;
  studentRegisterNumber?: string;
  isLate?: boolean;
  hasAttachment?: boolean;
  attachmentUrl?: string;
  assignmentTitle?: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: {
    id: number;
    name: string;
    code: string;
  };
  subjectId?: number;
  sectionId?: number;
  semesterId?: number;
  dueDate: string;
  maxMarks: number;
  weightage?: number;
  assignmentType: AssignmentType;
  status: AssignmentStatus;
  isOverdue: boolean;
  canSubmit?: boolean;
  allowLateSubmission?: boolean;
  lateSubmissionDeadline?: string;
  attachmentUrl?: string;
  createdAt?: string;
  timeRemaining?: string;
  statistics?: AssignmentStatistics;
  // Legacy fields for backward compatibility
  subjectName?: string;
  sectionName?: string;
  facultyName?: string;
}

export interface PendingGrading {
  id: number;
  assignmentTitle: string;
  studentName: string;
  studentRegisterNumber: string;
  submittedAt: string;
  isLate: boolean;
}

export interface StudentAssignmentStatistics {
  totalAssignments: number;
  totalSubmitted: number;
  pendingSubmission: number;
  submissionPercentage: number;
  gradedCount: number;
  pendingGrading: number;
  overdueCount: number;
  averageMarks: number;
  averagePercentage: number;
}

// GraphQL Input Types
export interface CreateAssignmentInput {
  subjectId: number;
  sectionId: number;
  semesterId: number;
  title: string;
  description: string;
  assignmentType: AssignmentType;
  dueDate: string;
  maxMarks: number;
  weightage: number;
  allowLateSubmission: boolean;
  lateSubmissionDeadline?: string;
  attachmentUrl?: string;
}

export interface UpdateAssignmentInput {
  id: number;
  title?: string;
  description?: string;
  dueDate?: string;
  maxMarks?: number;
  weightage?: number;
  allowLateSubmission?: boolean;
  lateSubmissionDeadline?: string;
}

export interface SubmitAssignmentInput {
  assignmentId: number;
  submissionText?: string;
  attachmentUrl?: string;
}

export interface GradeAssignmentInput {
  submissionId: number;
  marksObtained: number;
  feedback?: string;
}

export interface ReturnSubmissionInput {
  submissionId: number;
  feedback: string;
}

// GraphQL Response Types
export interface CreateAssignmentResponse {
  createAssignment: {
    id: number;
    title: string;
    status: AssignmentStatus;
    subjectName: string;
    sectionName: string;
    dueDate: string;
    maxMarks: number;
  };
}

export interface SubmitAssignmentResponse {
  submitAssignment: {
    success: boolean;
    message: string;
    submission: {
      id: number;
      submittedAt: string;
      isLate: boolean;
      status: SubmissionStatus;
    };
  };
}

export interface GradeAssignmentResponse {
  gradeAssignment: {
    success: boolean;
    message: string;
    grade: Grade;
  };
}

export interface ReturnSubmissionResponse {
  returnSubmission: {
    id: number;
    status: SubmissionStatus;
  };
}

// Query Response Types
export interface FacultyDashboardData {
  myAssignments: Assignment[];
  pendingGrading: PendingGrading[];
}

export interface StudentDashboardData {
  myAssignments: Assignment[];
  overdueAssignments: Assignment[];
  studentAssignmentStatistics: StudentAssignmentStatistics;
}

export interface AssignmentDetailData {
  assignment: Assignment;
  assignmentSubmissions?: Submission[];
}

// Filter and State Types
export interface AssignmentFilters {
  status?: AssignmentStatus | 'ALL';
  subjectId?: number;
  sectionId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface AssignmentState {
  assignments: Assignment[];
  selectedAssignment: Assignment | null;
  submissions: Submission[];
  mySubmissions: Submission[];
  pendingGrading: PendingGrading[];
  statistics: StudentAssignmentStatistics | null;
  filters: AssignmentFilters;
  loading: boolean;
  error: string | null;
}

// File Upload Types
export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

// Subject and Section Types (for dropdowns)
export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface Section {
  id: number;
  name: string;
  semesterId: number;
}

export interface Semester {
  id: number;
  name: string;
  year: number;
}
