import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date (isoformat) */
  Date: { input: string; output: string; }
  /** Date with time (isoformat) */
  DateTime: { input: string; output: string; }
  /** Decimal (fixed-point) */
  Decimal: { input: string; output: string; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](https://ecma-international.org/wp-content/uploads/ECMA-404_2nd_edition_december_2017.pdf). */
  JSON: { input: Record<string, unknown>; output: Record<string, unknown>; }
  /** Time (isoformat) */
  Time: { input: string; output: string; }
  /** Represents a file upload. */
  Upload: { input: File; output: File; }
};

export type AcademicYearType = {
  __typename?: 'AcademicYearType';
  endDate: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  isCurrent: Scalars['Boolean']['output'];
  startDate: Scalars['Date']['output'];
  yearCode: Scalars['String']['output'];
};

export type AdminUpdateStudentProfileInput = {
  aadharNumber?: InputMaybe<Scalars['String']['input']>;
  academicStatus?: InputMaybe<Scalars['String']['input']>;
  admissionDate?: InputMaybe<Scalars['Date']['input']>;
  idProofNumber?: InputMaybe<Scalars['String']['input']>;
  idProofType?: InputMaybe<Scalars['String']['input']>;
  rollNumber?: InputMaybe<Scalars['String']['input']>;
  sectionId?: InputMaybe<Scalars['Int']['input']>;
  semester?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type AssignSeatingInput = {
  roomId?: InputMaybe<Scalars['Int']['input']>;
  scheduleId: Scalars['Int']['input'];
  seatNumber: Scalars['String']['input'];
  studentId: Scalars['Int']['input'];
};

export type AssignmentDueType = {
  __typename?: 'AssignmentDueType';
  dueDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isSubmitted: Scalars['Boolean']['output'];
  maxMarks: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  subjectCode: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
  submissionDate?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type AssignmentGradeType = {
  __typename?: 'AssignmentGradeType';
  feedback?: Maybe<Scalars['String']['output']>;
  gradeLetter: Scalars['String']['output'];
  gradedAt: Scalars['DateTime']['output'];
  gradedBy: UserType;
  id: Scalars['ID']['output'];
  marksObtained: Scalars['Decimal']['output'];
  maxMarks: Scalars['Decimal']['output'];
  percentage: Scalars['Float']['output'];
  submission: AssignmentSubmissionType;
  updatedAt: Scalars['DateTime']['output'];
};

export type AssignmentStatisticsType = {
  __typename?: 'AssignmentStatisticsType';
  averageMarks: Scalars['Float']['output'];
  averagePercentage: Scalars['Float']['output'];
  gradedCount: Scalars['Int']['output'];
  lateSubmissions: Scalars['Int']['output'];
  notSubmitted: Scalars['Int']['output'];
  pendingGrading: Scalars['Int']['output'];
  submissionPercentage: Scalars['Float']['output'];
  totalStudents: Scalars['Int']['output'];
  totalSubmissions: Scalars['Int']['output'];
};

export type AssignmentSubmissionType = {
  __typename?: 'AssignmentSubmissionType';
  assignment: AssignmentType;
  assignmentTitle: Scalars['String']['output'];
  attachmentUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  grade?: Maybe<AssignmentGradeType>;
  gradedAt?: Maybe<Scalars['DateTime']['output']>;
  gradedBy?: Maybe<UserType>;
  hasAttachment: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isLate: Scalars['Boolean']['output'];
  status: Scalars['String']['output'];
  student: StudentProfileType;
  studentName: Scalars['String']['output'];
  studentRegisterNumber: Scalars['String']['output'];
  submissionText?: Maybe<Scalars['String']['output']>;
  submittedAt: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AssignmentType = {
  __typename?: 'AssignmentType';
  allowLateSubmission: Scalars['Boolean']['output'];
  assignmentType: Scalars['String']['output'];
  attachmentFilename?: Maybe<Scalars['String']['output']>;
  attachmentUrl?: Maybe<Scalars['String']['output']>;
  canSubmit: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: UserType;
  description: Scalars['String']['output'];
  dueDate: Scalars['DateTime']['output'];
  facultyName: Scalars['String']['output'];
  gradedSubmissions: Scalars['Int']['output'];
  hasAttachment: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isOverdue: Scalars['Boolean']['output'];
  lateSubmissionDeadline?: Maybe<Scalars['DateTime']['output']>;
  maxMarks: Scalars['Decimal']['output'];
  pendingSubmissions: Scalars['Int']['output'];
  publishedDate?: Maybe<Scalars['DateTime']['output']>;
  section: SectionType;
  sectionName: Scalars['String']['output'];
  semester: SemesterType;
  statistics: AssignmentStatisticsType;
  status: Scalars['String']['output'];
  subject: SubjectType;
  subjectName: Scalars['String']['output'];
  submissionPercentage: Scalars['Float']['output'];
  submissions: Array<AssignmentSubmissionType>;
  timeRemaining?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  totalSubmissions: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  weightage: Scalars['Decimal']['output'];
};

export type AttendanceReportType = {
  __typename?: 'AttendanceReportType';
  absentCount: Scalars['Int']['output'];
  attendancePercentage: Scalars['Decimal']['output'];
  classesNeededFor75: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isBelowThreshold: Scalars['Boolean']['output'];
  lastCalculated: Scalars['DateTime']['output'];
  lateCount: Scalars['Int']['output'];
  percentageDisplay: Scalars['String']['output'];
  presentCount: Scalars['Int']['output'];
  registerNumber: Scalars['String']['output'];
  semester: SemesterType;
  semesterInfo: Scalars['String']['output'];
  statusMessage: Scalars['String']['output'];
  student: StudentProfileType;
  studentName: Scalars['String']['output'];
  subject: SubjectType;
  subjectName: Scalars['String']['output'];
  totalClasses: Scalars['Int']['output'];
};

export type AttendanceSessionType = {
  __typename?: 'AttendanceSessionType';
  attendancePercentage: Scalars['Float']['output'];
  attendanceWindowMinutes: Scalars['Int']['output'];
  blockedAt?: Maybe<Scalars['DateTime']['output']>;
  blockedBy?: Maybe<UserType>;
  canMarkAttendance: Scalars['Boolean']['output'];
  cancellationReason?: Maybe<Scalars['String']['output']>;
  closedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['Date']['output'];
  facultyName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  openedAt?: Maybe<Scalars['DateTime']['output']>;
  openedBy?: Maybe<UserType>;
  periodInfo: Scalars['String']['output'];
  periodTime: Scalars['String']['output'];
  presentCount: Scalars['Int']['output'];
  sectionName: Scalars['String']['output'];
  status: Scalars['String']['output'];
  statusMessage: Scalars['String']['output'];
  studentAttendances: Array<StudentAttendanceType>;
  subjectName: Scalars['String']['output'];
  timeRemaining: Scalars['Int']['output'];
  timetableEntry: TimetableEntryType;
  totalStudents: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BlockSessionInput = {
  cancellationReason: Scalars['String']['input'];
  sessionId: Scalars['Int']['input'];
};

export type BulkEnterMarksInput = {
  results: Array<BulkMarkEntry>;
  scheduleId: Scalars['Int']['input'];
};

export type BulkEnterMarksResponse = {
  __typename?: 'BulkEnterMarksResponse';
  count: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type BulkHallTicketResponse = {
  __typename?: 'BulkHallTicketResponse';
  count: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type BulkMarkEntry = {
  isAbsent?: Scalars['Boolean']['input'];
  marksObtained: Scalars['Decimal']['input'];
  remarks?: Scalars['String']['input'];
  studentId: Scalars['Int']['input'];
};

export type CourseGradeInput = {
  examDate?: InputMaybe<Scalars['Date']['input']>;
  examMarks: Scalars['Float']['input'];
  examMaxMarks?: Scalars['Float']['input'];
  examType?: Scalars['String']['input'];
  internalMarks: Scalars['Float']['input'];
  internalMaxMarks?: Scalars['Float']['input'];
  isPublished?: Scalars['Boolean']['input'];
  remarks?: InputMaybe<Scalars['String']['input']>;
  semesterId: Scalars['Int']['input'];
  studentRegisterNumber: Scalars['String']['input'];
  subjectId: Scalars['Int']['input'];
};

export type CourseGradeMutationResponse = {
  __typename?: 'CourseGradeMutationResponse';
  grade?: Maybe<CourseGradeType>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CourseGradeType = {
  __typename?: 'CourseGradeType';
  courseCode: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  credits: Scalars['Float']['output'];
  examDate?: Maybe<Scalars['Date']['output']>;
  examMarks: Scalars['Float']['output'];
  examMaxMarks: Scalars['Float']['output'];
  examType: Scalars['String']['output'];
  grade: Scalars['String']['output'];
  gradePoints: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  internalMarks: Scalars['Float']['output'];
  internalMaxMarks: Scalars['Float']['output'];
  isPublished: Scalars['Boolean']['output'];
  percentage: Scalars['Float']['output'];
  remarks: Scalars['String']['output'];
  semester: SemesterType;
  subject: SubjectType;
  totalMarks: Scalars['Float']['output'];
  totalMaxMarks: Scalars['Float']['output'];
};

export type CourseOverviewType = {
  __typename?: 'CourseOverviewType';
  avgAttendance: Scalars['Float']['output'];
  avgProgress: Scalars['Float']['output'];
  totalCourses: Scalars['Int']['output'];
  totalCredits: Scalars['Float']['output'];
};

export type CourseProgressType = {
  __typename?: 'CourseProgressType';
  completedAssignments: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  subjectCode: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
  totalAssignments: Scalars['Int']['output'];
};

export type CourseScheduleType = {
  __typename?: 'CourseScheduleType';
  dayName: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type CourseType = {
  __typename?: 'CourseType';
  code: Scalars['String']['output'];
  department: DepartmentType;
  durationYears: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CreateAssignmentInput = {
  allowLateSubmission?: Scalars['Boolean']['input'];
  assignmentType: Scalars['String']['input'];
  attachmentData?: InputMaybe<Scalars['String']['input']>;
  attachmentFilename?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  dueDate: Scalars['DateTime']['input'];
  lateSubmissionDeadline?: InputMaybe<Scalars['DateTime']['input']>;
  maxMarks: Scalars['Decimal']['input'];
  sectionId: Scalars['Int']['input'];
  semesterId: Scalars['Int']['input'];
  subjectId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  weightage: Scalars['Decimal']['input'];
};

export type CreateExamInput = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
  endDate: Scalars['Date']['input'];
  examType: Scalars['String']['input'];
  instructions?: Scalars['String']['input'];
  maxMarks?: Scalars['Decimal']['input'];
  name: Scalars['String']['input'];
  passMarksPercentage?: Scalars['Decimal']['input'];
  semesterId: Scalars['Int']['input'];
  startDate: Scalars['Date']['input'];
};

export type CreateExamResponse = {
  __typename?: 'CreateExamResponse';
  exam?: Maybe<ExamType>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CreateExamScheduleInput = {
  date: Scalars['Date']['input'];
  durationMinutes?: Scalars['Int']['input'];
  endTime: Scalars['Time']['input'];
  examId: Scalars['Int']['input'];
  invigilatorId?: InputMaybe<Scalars['Int']['input']>;
  maxMarks?: InputMaybe<Scalars['Decimal']['input']>;
  notes?: Scalars['String']['input'];
  roomId?: InputMaybe<Scalars['Int']['input']>;
  sectionId: Scalars['Int']['input'];
  shift?: Scalars['String']['input'];
  startTime: Scalars['Time']['input'];
  subjectId: Scalars['Int']['input'];
};

export type CreateScheduleResponse = {
  __typename?: 'CreateScheduleResponse';
  message: Scalars['String']['output'];
  schedule?: Maybe<ExamScheduleType>;
  success: Scalars['Boolean']['output'];
};

export type CreateUserInput = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  isActive?: Scalars['Boolean']['input'];
  isStaff?: Scalars['Boolean']['input'];
  password: Scalars['String']['input'];
  registerNumber?: InputMaybe<Scalars['String']['input']>;
  roleId: Scalars['Int']['input'];
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  user: UserType;
};

export type DepartmentType = {
  __typename?: 'DepartmentType';
  code: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type EnrolledCourseType = {
  __typename?: 'EnrolledCourseType';
  attendancePercentage: Scalars['Float']['output'];
  classSchedule: Array<CourseScheduleType>;
  completedAssignments: Scalars['Int']['output'];
  courseProgress: Scalars['Float']['output'];
  credits: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  facultyEmail?: Maybe<Scalars['String']['output']>;
  facultyName: Scalars['String']['output'];
  grade?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  subjectCode: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
  subjectType: Scalars['String']['output'];
  totalAssignments: Scalars['Int']['output'];
};

export type EnterMarksInput = {
  isAbsent?: Scalars['Boolean']['input'];
  marksObtained: Scalars['Decimal']['input'];
  remarks?: Scalars['String']['input'];
  scheduleId: Scalars['Int']['input'];
  studentId: Scalars['Int']['input'];
};

export type EnterMarksResponse = {
  __typename?: 'EnterMarksResponse';
  message: Scalars['String']['output'];
  result?: Maybe<ExamResultType>;
  success: Scalars['Boolean']['output'];
};

export type ExamMutationResponse = {
  __typename?: 'ExamMutationResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ExamResultStatisticsType = {
  __typename?: 'ExamResultStatisticsType';
  absent: Scalars['Int']['output'];
  averageMarks: Scalars['Float']['output'];
  failed: Scalars['Int']['output'];
  highestMarks: Scalars['Float']['output'];
  lowestMarks: Scalars['Float']['output'];
  passPercentage: Scalars['Float']['output'];
  passed: Scalars['Int']['output'];
  resultsEntered: Scalars['Int']['output'];
  totalStudents: Scalars['Int']['output'];
};

export type ExamResultType = {
  __typename?: 'ExamResultType';
  createdAt: Scalars['DateTime']['output'];
  enteredBy?: Maybe<UserType>;
  gradeLetter: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAbsent: Scalars['Boolean']['output'];
  isPass: Scalars['Boolean']['output'];
  marksObtained?: Maybe<Scalars['Decimal']['output']>;
  maxMarks: Scalars['Decimal']['output'];
  percentage?: Maybe<Scalars['Decimal']['output']>;
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  remarks: Scalars['String']['output'];
  schedule: ExamScheduleType;
  status: Scalars['String']['output'];
  student: StudentProfileType;
  studentRegisterNumber: Scalars['String']['output'];
  subjectCode: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  verifiedBy?: Maybe<UserType>;
};

export type ExamScheduleType = {
  __typename?: 'ExamScheduleType';
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['Date']['output'];
  durationMinutes: Scalars['Int']['output'];
  effectiveMaxMarks: Scalars['Decimal']['output'];
  endTime: Scalars['Time']['output'];
  exam: ExamType;
  id: Scalars['ID']['output'];
  invigilator?: Maybe<UserType>;
  notes: Scalars['String']['output'];
  results: Array<ExamResultType>;
  resultsEnteredCount: Scalars['Int']['output'];
  room?: Maybe<RoomType>;
  seatingArrangements: Array<ExamSeatingType>;
  section: SectionType;
  shift: Scalars['String']['output'];
  shiftDisplay: Scalars['String']['output'];
  startTime: Scalars['Time']['output'];
  studentCount: Scalars['Int']['output'];
  subject: SubjectType;
  subjectCode: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
};

export type ExamSeatingType = {
  __typename?: 'ExamSeatingType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isPresent: Scalars['Boolean']['output'];
  markedAt?: Maybe<Scalars['DateTime']['output']>;
  room?: Maybe<RoomType>;
  roomNumber?: Maybe<Scalars['String']['output']>;
  schedule: ExamScheduleType;
  seatNumber: Scalars['String']['output'];
  student: StudentProfileType;
  studentRegisterNumber: Scalars['String']['output'];
};

export type ExamType = {
  __typename?: 'ExamType';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserType>;
  department?: Maybe<DepartmentType>;
  durationDays: Scalars['Int']['output'];
  endDate: Scalars['Date']['output'];
  examType: Scalars['String']['output'];
  examTypeDisplay: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instructions: Scalars['String']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isOngoing: Scalars['Boolean']['output'];
  isUpcoming: Scalars['Boolean']['output'];
  maxMarks: Scalars['Decimal']['output'];
  name: Scalars['String']['output'];
  passMarksPercentage: Scalars['Decimal']['output'];
  schedules: Array<ExamScheduleType>;
  semester: SemesterType;
  startDate: Scalars['Date']['output'];
  status: Scalars['String']['output'];
  statusDisplay: Scalars['String']['output'];
  totalStudents: Scalars['Int']['output'];
  totalSubjects: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ExportGradesType = {
  __typename?: 'ExportGradesType';
  fileBase64?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type FacultyAttendanceOverviewType = {
  __typename?: 'FacultyAttendanceOverviewType';
  attendancePercentage: Scalars['Float']['output'];
  subjectCode: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
};

export type FacultyDashboardType = {
  __typename?: 'FacultyDashboardType';
  activeCourses: Scalars['Int']['output'];
  attendanceOverview: Array<FacultyAttendanceOverviewType>;
  departmentName?: Maybe<Scalars['String']['output']>;
  facultyName: Scalars['String']['output'];
  pendingReviews: Scalars['Int']['output'];
  recentActivities: Array<FacultyRecentActivityType>;
  todayClassCount: Scalars['Int']['output'];
  todayClasses: Array<FacultyTodayClassType>;
  totalStudents: Scalars['Int']['output'];
};

export type FacultyProfileResponse = {
  __typename?: 'FacultyProfileResponse';
  message: Scalars['String']['output'];
  profile?: Maybe<FacultyProfileType>;
};

export type FacultyProfileType = {
  __typename?: 'FacultyProfileType';
  createdAt: Scalars['DateTime']['output'];
  department?: Maybe<DepartmentType>;
  designation: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  joiningDate: Scalars['Date']['output'];
  officeHours: Scalars['String']['output'];
  qualifications: Scalars['String']['output'];
  specialization: Scalars['String']['output'];
  teachingLoad: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserType;
};

export type FacultyRecentActivityType = {
  __typename?: 'FacultyRecentActivityType';
  activityType: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  timestamp: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type FacultyTodayClassType = {
  __typename?: 'FacultyTodayClassType';
  endTime: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  periodNumber: Scalars['Int']['output'];
  roomNumber?: Maybe<Scalars['String']['output']>;
  sectionName: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
  subjectCode: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
};

export type GenerateHallTicketInput = {
  examId: Scalars['Int']['input'];
  sectionId?: InputMaybe<Scalars['Int']['input']>;
  studentId?: InputMaybe<Scalars['Int']['input']>;
};

export type GradeAssignmentInput = {
  feedback?: InputMaybe<Scalars['String']['input']>;
  gradingRubric?: InputMaybe<Scalars['String']['input']>;
  marksObtained: Scalars['Decimal']['input'];
  submissionId: Scalars['Int']['input'];
};

export type GradeAssignmentResponse = {
  __typename?: 'GradeAssignmentResponse';
  grade?: Maybe<AssignmentGradeType>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GradeOverviewType = {
  __typename?: 'GradeOverviewType';
  cgpa: Scalars['Float']['output'];
  cgpaStatus: Scalars['String']['output'];
  creditsEarned: Scalars['Float']['output'];
  performanceTrend: Scalars['String']['output'];
  semesterGpas: Array<SemesterGpaType>;
  totalCredits: Scalars['Float']['output'];
};

export type HallTicketResponse = {
  __typename?: 'HallTicketResponse';
  hallTicket?: Maybe<HallTicketType>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type HallTicketType = {
  __typename?: 'HallTicketType';
  downloadedAt?: Maybe<Scalars['DateTime']['output']>;
  exam: ExamType;
  generatedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ineligibilityReason: Scalars['String']['output'];
  isEligible: Scalars['Boolean']['output'];
  status: Scalars['String']['output'];
  student: StudentProfileType;
  studentRegisterNumber: Scalars['String']['output'];
  ticketNumber: Scalars['String']['output'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String']['output'];
  message: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: UserType;
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ManualMarkAttendanceInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['Int']['input'];
  status: Scalars['String']['input'];
  studentId: Scalars['Int']['input'];
};

export type MarkAttendanceInput = {
  deviceInfo?: InputMaybe<Scalars['JSON']['input']>;
  imageData: Scalars['String']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  sessionId: Scalars['ID']['input'];
};

export type MarkAttendanceResponse = {
  __typename?: 'MarkAttendanceResponse';
  attendance: StudentAttendanceType;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminUpdateStudentProfile: StudentProfileResponse;
  assignSeat: ExamMutationResponse;
  autoAssignSeating: ExamMutationResponse;
  blockAttendanceSession: AttendanceSessionType;
  bulkDismissNotifications: Scalars['Int']['output'];
  bulkEnterMarks: BulkEnterMarksResponse;
  bulkGenerateHallTickets: BulkHallTicketResponse;
  bulkMarkPresent: Array<StudentAttendanceType>;
  closeAssignment: AssignmentType;
  closeAttendanceSession: AttendanceSessionType;
  createAssignment: AssignmentType;
  createCourseGrade: CourseGradeMutationResponse;
  createExam: CreateExamResponse;
  createExamSchedule: CreateScheduleResponse;
  createTimetableEntry: TimetableEntryType;
  createUser: CreateUserResponse;
  deleteAssignment: Scalars['Boolean']['output'];
  deleteExam: ExamMutationResponse;
  deleteExamSchedule: ExamMutationResponse;
  deleteTimetableEntry: Scalars['Boolean']['output'];
  dismissNotification: Scalars['Boolean']['output'];
  enterMarks: EnterMarksResponse;
  generateHallTicket: HallTicketResponse;
  generatePeriods: Scalars['String']['output'];
  gradeAssignment: GradeAssignmentResponse;
  login: LoginResponse;
  logout: LogoutResponse;
  logoutAllSessions: LogoutResponse;
  manualMarkAttendance: StudentAttendanceType;
  markAllNotificationsRead: Scalars['Int']['output'];
  markAttendance: MarkAttendanceResponse;
  markExamAttendance: ExamMutationResponse;
  markNotificationRead?: Maybe<NotificationType>;
  openAttendanceSession: AttendanceSessionType;
  publishAssignment: AssignmentType;
  publishGrade: CourseGradeMutationResponse;
  publishResults: ExamMutationResponse;
  recalculateAttendanceReport: AttendanceReportType;
  refreshToken: LoginResponse;
  reopenBlockedSession: AttendanceSessionType;
  requestParentOtp: ParentOtpRequestResponse;
  resetNotificationPreferences: Array<NotificationPreferenceType>;
  returnSubmission: AssignmentSubmissionType;
  revokeHallTicket: ExamMutationResponse;
  submitAssignment: SubmitAssignmentResponse;
  swapTimetableSlots: Scalars['String']['output'];
  updateAssignment: AssignmentType;
  updateCourseGrade: CourseGradeMutationResponse;
  updateExam: CreateExamResponse;
  updateExamStatus: ExamMutationResponse;
  updateFacultyProfile: FacultyProfileResponse;
  updateNotificationPreference?: Maybe<NotificationPreferenceType>;
  updateStudentProfile: StudentProfileResponse;
  updateStudentProfileWithPhoto: StudentProfileResponse;
  updateTimetableEntry: TimetableEntryType;
  verifyParentOtp: ParentVerifyResponse;
  verifyResults: ExamMutationResponse;
};


export type MutationAdminUpdateStudentProfileArgs = {
  data: AdminUpdateStudentProfileInput;
  registerNumber: Scalars['String']['input'];
};


export type MutationAssignSeatArgs = {
  input: AssignSeatingInput;
};


export type MutationAutoAssignSeatingArgs = {
  roomId?: InputMaybe<Scalars['Int']['input']>;
  scheduleId: Scalars['Int']['input'];
};


export type MutationBlockAttendanceSessionArgs = {
  input: BlockSessionInput;
};


export type MutationBulkDismissNotificationsArgs = {
  notificationIds: Array<Scalars['Int']['input']>;
};


export type MutationBulkEnterMarksArgs = {
  input: BulkEnterMarksInput;
};


export type MutationBulkGenerateHallTicketsArgs = {
  examId: Scalars['Int']['input'];
  sectionId: Scalars['Int']['input'];
};


export type MutationBulkMarkPresentArgs = {
  sessionId: Scalars['Int']['input'];
  studentIds: Array<Scalars['Int']['input']>;
};


export type MutationCloseAssignmentArgs = {
  assignmentId: Scalars['Int']['input'];
};


export type MutationCloseAttendanceSessionArgs = {
  sessionId: Scalars['Int']['input'];
};


export type MutationCreateAssignmentArgs = {
  input: CreateAssignmentInput;
};


export type MutationCreateCourseGradeArgs = {
  input: CourseGradeInput;
};


export type MutationCreateExamArgs = {
  input: CreateExamInput;
};


export type MutationCreateExamScheduleArgs = {
  input: CreateExamScheduleInput;
};


export type MutationCreateTimetableEntryArgs = {
  facultyId: Scalars['Int']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  periodDefinitionId: Scalars['Int']['input'];
  roomId?: InputMaybe<Scalars['Int']['input']>;
  sectionId: Scalars['Int']['input'];
  semesterId: Scalars['Int']['input'];
  subjectId: Scalars['Int']['input'];
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteAssignmentArgs = {
  assignmentId: Scalars['Int']['input'];
};


export type MutationDeleteExamArgs = {
  examId: Scalars['Int']['input'];
};


export type MutationDeleteExamScheduleArgs = {
  scheduleId: Scalars['Int']['input'];
};


export type MutationDeleteTimetableEntryArgs = {
  entryId: Scalars['Int']['input'];
};


export type MutationDismissNotificationArgs = {
  notificationId: Scalars['Int']['input'];
};


export type MutationEnterMarksArgs = {
  input: EnterMarksInput;
};


export type MutationGenerateHallTicketArgs = {
  input: GenerateHallTicketInput;
};


export type MutationGeneratePeriodsArgs = {
  semesterId: Scalars['Int']['input'];
};


export type MutationGradeAssignmentArgs = {
  input: GradeAssignmentInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationLogoutArgs = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationManualMarkAttendanceArgs = {
  input: ManualMarkAttendanceInput;
};


export type MutationMarkAllNotificationsReadArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMarkAttendanceArgs = {
  input: MarkAttendanceInput;
};


export type MutationMarkExamAttendanceArgs = {
  isPresent: Scalars['Boolean']['input'];
  scheduleId: Scalars['Int']['input'];
  studentId: Scalars['Int']['input'];
};


export type MutationMarkNotificationReadArgs = {
  notificationId: Scalars['Int']['input'];
};


export type MutationOpenAttendanceSessionArgs = {
  input: OpenSessionInput;
};


export type MutationPublishAssignmentArgs = {
  assignmentId: Scalars['Int']['input'];
};


export type MutationPublishGradeArgs = {
  gradeId: Scalars['Int']['input'];
};


export type MutationPublishResultsArgs = {
  examId: Scalars['Int']['input'];
};


export type MutationRecalculateAttendanceReportArgs = {
  reportId: Scalars['Int']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationReopenBlockedSessionArgs = {
  sessionId: Scalars['Int']['input'];
};


export type MutationRequestParentOtpArgs = {
  registerNumber: Scalars['String']['input'];
};


export type MutationReturnSubmissionArgs = {
  input: ReturnSubmissionInput;
};


export type MutationRevokeHallTicketArgs = {
  hallTicketId: Scalars['Int']['input'];
};


export type MutationSubmitAssignmentArgs = {
  input: SubmitAssignmentInput;
};


export type MutationSwapTimetableSlotsArgs = {
  entry1Id: Scalars['Int']['input'];
  entry2Id: Scalars['Int']['input'];
};


export type MutationUpdateAssignmentArgs = {
  input: UpdateAssignmentInput;
};


export type MutationUpdateCourseGradeArgs = {
  gradeId: Scalars['Int']['input'];
  input: CourseGradeInput;
};


export type MutationUpdateExamArgs = {
  input: UpdateExamInput;
};


export type MutationUpdateExamStatusArgs = {
  examId: Scalars['Int']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateFacultyProfileArgs = {
  data: UpdateFacultyProfileInput;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateNotificationPreferenceArgs = {
  category: Scalars['String']['input'];
  isEmailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isSseEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateStudentProfileArgs = {
  data: UpdateStudentProfileInput;
  registerNumber: Scalars['String']['input'];
};


export type MutationUpdateStudentProfileWithPhotoArgs = {
  data: UpdateStudentProfileWithPhotoInput;
  profilePicture?: InputMaybe<Scalars['Upload']['input']>;
  profilePictureBase64?: InputMaybe<Scalars['String']['input']>;
  registerNumber: Scalars['String']['input'];
};


export type MutationUpdateTimetableEntryArgs = {
  entryId: Scalars['Int']['input'];
  facultyId?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  roomId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationVerifyParentOtpArgs = {
  otp: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  registerNumber: Scalars['String']['input'];
  relationship?: InputMaybe<Scalars['String']['input']>;
};


export type MutationVerifyResultsArgs = {
  scheduleId: Scalars['Int']['input'];
};

export type NextClassType = {
  __typename?: 'NextClassType';
  dayName: Scalars['String']['output'];
  dayOfWeek: Scalars['Int']['output'];
  endTime: Scalars['String']['output'];
  facultyName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  periodNumber: Scalars['Int']['output'];
  roomNumber?: Maybe<Scalars['String']['output']>;
  startTime: Scalars['String']['output'];
  subjectCode: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  hasMore: Scalars['Boolean']['output'];
  notifications: Array<NotificationType>;
  totalCount: Scalars['Int']['output'];
  unreadCount: Scalars['Int']['output'];
};

export type NotificationPreferenceType = {
  __typename?: 'NotificationPreferenceType';
  category: Scalars['String']['output'];
  isEmailEnabled: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
  isSseEnabled: Scalars['Boolean']['output'];
};

export type NotificationStats = {
  __typename?: 'NotificationStats';
  byCategory: Scalars['JSON']['output'];
  readCount: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  unreadCount: Scalars['Int']['output'];
};

export type NotificationType = {
  __typename?: 'NotificationType';
  actionUrl: Scalars['String']['output'];
  actorName?: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  metadata: Scalars['JSON']['output'];
  notificationType: Scalars['String']['output'];
  priority: Scalars['String']['output'];
  readAt?: Maybe<Scalars['DateTime']['output']>;
  timeAgo: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type OpenSessionInput = {
  attendanceWindowMinutes?: InputMaybe<Scalars['Int']['input']>;
  date: Scalars['Date']['input'];
  timetableEntryId: Scalars['Int']['input'];
};

export type ParentOtpRequestResponse = {
  __typename?: 'ParentOtpRequestResponse';
  maskedContact?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type ParentVerifyResponse = {
  __typename?: 'ParentVerifyResponse';
  accessToken: Scalars['String']['output'];
  message: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: UserType;
};

export type PeriodDefinitionType = {
  __typename?: 'PeriodDefinitionType';
  dayName: Scalars['String']['output'];
  dayOfWeek: Scalars['Int']['output'];
  durationMinutes: Scalars['Int']['output'];
  endTime: Scalars['Time']['output'];
  id: Scalars['Int']['output'];
  periodNumber: Scalars['Int']['output'];
  semester: SemesterType;
  startTime: Scalars['Time']['output'];
};

export type Query = {
  __typename?: 'Query';
  academicYear?: Maybe<AcademicYearType>;
  academicYears: Array<AcademicYearType>;
  activeSessionsForStudent: Array<AttendanceSessionType>;
  allReportsForStudent: Array<AttendanceReportType>;
  assignment?: Maybe<AssignmentType>;
  assignmentSubmissions: Array<AssignmentSubmissionType>;
  assignments: Array<AssignmentType>;
  attendanceReport?: Maybe<AttendanceReportType>;
  attendanceSession?: Maybe<AttendanceSessionType>;
  courseOverview?: Maybe<CourseOverviewType>;
  courses: Array<CourseType>;
  currentAcademicYear?: Maybe<AcademicYearType>;
  currentSemester?: Maybe<SemesterType>;
  departments: Array<DepartmentType>;
  exam?: Maybe<ExamType>;
  examResultStatistics: ExamResultStatisticsType;
  examResults: Array<ExamResultType>;
  examSchedule?: Maybe<ExamScheduleType>;
  examSchedules: Array<ExamScheduleType>;
  exams: Array<ExamType>;
  exportGrades: ExportGradesType;
  faculties: Array<FacultyProfileType>;
  facultyDashboard?: Maybe<FacultyDashboardType>;
  facultySchedule: Array<TimetableEntryType>;
  facultySessionsToday: Array<AttendanceSessionType>;
  gradeOverview?: Maybe<GradeOverviewType>;
  hallTickets: Array<HallTicketType>;
  lowAttendanceStudents: Array<AttendanceReportType>;
  me?: Maybe<UserType>;
  myAssignments: Array<AssignmentType>;
  myCourses: Array<EnrolledCourseType>;
  myExamSchedule: Array<ExamScheduleType>;
  myFacultyProfile?: Maybe<FacultyProfileType>;
  myGrades: Array<CourseGradeType>;
  myHallTicket?: Maybe<HallTicketType>;
  myNotificationPreferences: Array<NotificationPreferenceType>;
  myNotifications: NotificationConnection;
  myProfile?: Maybe<StudentProfileType>;
  myResults: Array<ExamResultType>;
  mySeat?: Maybe<ExamSeatingType>;
  mySubmissions: Array<AssignmentSubmissionType>;
  myTimetable: Array<TimetableEntryType>;
  notificationById?: Maybe<NotificationType>;
  notificationStats: NotificationStats;
  overdueAssignments: Array<AssignmentType>;
  pendingAssignments: Array<AssignmentType>;
  pendingGrading: Array<AssignmentSubmissionType>;
  periodDefinitions: Array<PeriodDefinitionType>;
  roles: Array<RoleType>;
  roomSchedule: Array<TimetableEntryType>;
  rooms: Array<RoomType>;
  seatingArrangement: Array<ExamSeatingType>;
  sectionAttendanceForSession: Array<StudentAttendanceType>;
  sectionTimetable: Array<TimetableEntryType>;
  sections: Array<SectionType>;
  semester?: Maybe<SemesterType>;
  semesterGrades: Array<CourseGradeType>;
  semesters: Array<SemesterType>;
  studentAssignmentStatistics: StudentAssignmentStatisticsType;
  studentAttendanceHistory: Array<StudentAttendanceType>;
  studentDashboard?: Maybe<StudentDashboardType>;
  studentProfile?: Maybe<StudentProfileType>;
  studentProfiles: Array<StudentProfileType>;
  subjects: Array<SubjectType>;
  submission?: Maybe<AssignmentSubmissionType>;
  timetableStatistics?: Maybe<TimetableStatisticsType>;
  unreadCount: Scalars['Int']['output'];
  upcomingExams: Array<ExamType>;
  users: Array<UserType>;
};


export type QueryAcademicYearArgs = {
  id: Scalars['Int']['input'];
};


export type QueryAllReportsForStudentArgs = {
  studentId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAssignmentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryAssignmentSubmissionsArgs = {
  assignmentId: Scalars['Int']['input'];
};


export type QueryAssignmentsArgs = {
  sectionId?: InputMaybe<Scalars['Int']['input']>;
  semesterId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subjectId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAttendanceReportArgs = {
  studentId?: InputMaybe<Scalars['Int']['input']>;
  subjectId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAttendanceSessionArgs = {
  sessionId: Scalars['Int']['input'];
};


export type QueryCourseOverviewArgs = {
  registerNumber: Scalars['String']['input'];
};


export type QueryCoursesArgs = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryExamArgs = {
  id: Scalars['Int']['input'];
};


export type QueryExamResultStatisticsArgs = {
  scheduleId: Scalars['Int']['input'];
};


export type QueryExamResultsArgs = {
  scheduleId: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExamScheduleArgs = {
  id: Scalars['Int']['input'];
};


export type QueryExamSchedulesArgs = {
  examId: Scalars['Int']['input'];
  sectionId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryExamsArgs = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
  examType?: InputMaybe<Scalars['String']['input']>;
  semesterId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExportGradesArgs = {
  registerNumber: Scalars['String']['input'];
  semesterId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFacultiesArgs = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFacultyScheduleArgs = {
  facultyId: Scalars['Int']['input'];
  semesterId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGradeOverviewArgs = {
  registerNumber: Scalars['String']['input'];
};


export type QueryHallTicketsArgs = {
  examId: Scalars['Int']['input'];
  sectionId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLowAttendanceStudentsArgs = {
  subjectId: Scalars['Int']['input'];
  threshold?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryMyCoursesArgs = {
  registerNumber: Scalars['String']['input'];
};


export type QueryMyExamScheduleArgs = {
  examId: Scalars['Int']['input'];
};


export type QueryMyGradesArgs = {
  registerNumber: Scalars['String']['input'];
  semesterId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyHallTicketArgs = {
  examId: Scalars['Int']['input'];
};


export type QueryMyNotificationsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryMyProfileArgs = {
  registerNumber: Scalars['String']['input'];
};


export type QueryMyResultsArgs = {
  examId?: InputMaybe<Scalars['Int']['input']>;
  semesterId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMySeatArgs = {
  scheduleId: Scalars['Int']['input'];
};


export type QueryMyTimetableArgs = {
  registerNumber: Scalars['String']['input'];
};


export type QueryNotificationByIdArgs = {
  notificationId: Scalars['Int']['input'];
};


export type QueryPeriodDefinitionsArgs = {
  dayOfWeek?: InputMaybe<Scalars['Int']['input']>;
  semesterId: Scalars['Int']['input'];
};


export type QueryRolesArgs = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRoomScheduleArgs = {
  dayOfWeek?: InputMaybe<Scalars['Int']['input']>;
  roomId: Scalars['Int']['input'];
  semesterId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRoomsArgs = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  roomType?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySeatingArrangementArgs = {
  scheduleId: Scalars['Int']['input'];
};


export type QuerySectionAttendanceForSessionArgs = {
  sessionId: Scalars['Int']['input'];
};


export type QuerySectionTimetableArgs = {
  sectionId: Scalars['Int']['input'];
  semesterId?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySectionsArgs = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
  subjectId?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySemesterArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySemesterGradesArgs = {
  registerNumber: Scalars['String']['input'];
  semesterId: Scalars['Int']['input'];
};


export type QuerySemestersArgs = {
  academicYearId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStudentAssignmentStatisticsArgs = {
  semesterId?: InputMaybe<Scalars['Int']['input']>;
  studentId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStudentAttendanceHistoryArgs = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  studentId?: InputMaybe<Scalars['Int']['input']>;
  subjectId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStudentDashboardArgs = {
  registerNumber: Scalars['String']['input'];
};


export type QueryStudentProfileArgs = {
  registerNumber: Scalars['String']['input'];
};


export type QueryStudentProfilesArgs = {
  academicStatus?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  departmentId?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySubjectsArgs = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  semesterNumber?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySubmissionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTimetableStatisticsArgs = {
  registerNumber: Scalars['String']['input'];
};


export type QueryUnreadCountArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};

export type RecentActivityType = {
  __typename?: 'RecentActivityType';
  activityType: Scalars['String']['output'];
  description: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  timestamp: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ReturnSubmissionInput = {
  feedback: Scalars['String']['input'];
  submissionId: Scalars['Int']['input'];
};

export type RoleType = {
  __typename?: 'RoleType';
  code: Scalars['String']['output'];
  department?: Maybe<DepartmentType>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  isGlobal: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type RoomType = {
  __typename?: 'RoomType';
  building: Scalars['String']['output'];
  capacity: Scalars['Int']['output'];
  department?: Maybe<DepartmentType>;
  facilities: Scalars['JSON']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  roomNumber: Scalars['String']['output'];
  roomType: Scalars['String']['output'];
};

export type SectionType = {
  __typename?: 'SectionType';
  course: CourseType;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  semesterId?: Maybe<Scalars['Int']['output']>;
  year: Scalars['Int']['output'];
};

export type SemesterGpaType = {
  __typename?: 'SemesterGPAType';
  creditsEarned: Scalars['Float']['output'];
  gpa: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  semester: SemesterType;
  semesterName: Scalars['String']['output'];
  totalCredits: Scalars['Float']['output'];
};

export type SemesterType = {
  __typename?: 'SemesterType';
  academicYear: AcademicYearType;
  displayName: Scalars['String']['output'];
  endDate: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  isCurrent: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
  startDate: Scalars['Date']['output'];
  year: Scalars['String']['output'];
};

export type StudentAssignmentStatisticsType = {
  __typename?: 'StudentAssignmentStatisticsType';
  averageMarks: Scalars['Float']['output'];
  averagePercentage: Scalars['Float']['output'];
  gradedCount: Scalars['Int']['output'];
  overdueCount: Scalars['Int']['output'];
  pendingGrading: Scalars['Int']['output'];
  pendingSubmission: Scalars['Int']['output'];
  submissionPercentage: Scalars['Float']['output'];
  totalAssignments: Scalars['Int']['output'];
  totalSubmitted: Scalars['Int']['output'];
};

export type StudentAttendanceType = {
  __typename?: 'StudentAttendanceType';
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['Date']['output'];
  deviceInfo: Scalars['JSON']['output'];
  hasImage: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isLate: Scalars['Boolean']['output'];
  isManuallyMarked: Scalars['Boolean']['output'];
  isPresent: Scalars['Boolean']['output'];
  latitude?: Maybe<Scalars['Decimal']['output']>;
  longitude?: Maybe<Scalars['Decimal']['output']>;
  markedAt?: Maybe<Scalars['DateTime']['output']>;
  markedBy?: Maybe<UserType>;
  notes?: Maybe<Scalars['String']['output']>;
  registerNumber: Scalars['String']['output'];
  session: AttendanceSessionType;
  status: Scalars['String']['output'];
  statusBadge: Scalars['String']['output'];
  student: StudentProfileType;
  studentName: Scalars['String']['output'];
  subjectName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type StudentDashboardType = {
  __typename?: 'StudentDashboardType';
  assignmentsDueThisWeek: Array<AssignmentDueType>;
  courseProgress: Array<CourseProgressType>;
  currentGpa?: Maybe<Scalars['Float']['output']>;
  nextClass?: Maybe<NextClassType>;
  overallProgressPercentage: Scalars['Float']['output'];
  profilePhotoUrl?: Maybe<Scalars['String']['output']>;
  recentActivities: Array<RecentActivityType>;
  registerNumber: Scalars['String']['output'];
  studentName: Scalars['String']['output'];
  todayClasses: Array<NextClassType>;
  totalOverdueAssignments: Scalars['Int']['output'];
  totalPendingAssignments: Scalars['Int']['output'];
};

export type StudentProfileResponse = {
  __typename?: 'StudentProfileResponse';
  message: Scalars['String']['output'];
  profile: StudentProfileType;
};

export type StudentProfileType = {
  __typename?: 'StudentProfileType';
  aadharNumber?: Maybe<Scalars['String']['output']>;
  academicStatus: Scalars['String']['output'];
  address?: Maybe<Scalars['String']['output']>;
  admissionDate?: Maybe<Scalars['Date']['output']>;
  course: CourseType;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['Date']['output']>;
  department: DepartmentType;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  guardianEmail?: Maybe<Scalars['String']['output']>;
  guardianName?: Maybe<Scalars['String']['output']>;
  guardianPhone?: Maybe<Scalars['String']['output']>;
  guardianRelationship?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  idProofNumber?: Maybe<Scalars['String']['output']>;
  idProofType?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  profileCompleted: Scalars['Boolean']['output'];
  profilePhoto?: Maybe<Scalars['String']['output']>;
  profilePhotoUrl?: Maybe<Scalars['String']['output']>;
  registerNumber: Scalars['String']['output'];
  rollNumber?: Maybe<Scalars['String']['output']>;
  section?: Maybe<SectionType>;
  semester: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: UserType;
  year: Scalars['Int']['output'];
};

export type SubjectType = {
  __typename?: 'SubjectType';
  code: Scalars['String']['output'];
  credits: Scalars['Float']['output'];
  department: DepartmentType;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  semesterNumber: Scalars['Int']['output'];
  subjectType: Scalars['String']['output'];
};

export type SubmitAssignmentInput = {
  assignmentId: Scalars['Int']['input'];
  submissionText?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitAssignmentResponse = {
  __typename?: 'SubmitAssignmentResponse';
  message: Scalars['String']['output'];
  submission?: Maybe<AssignmentSubmissionType>;
  success: Scalars['Boolean']['output'];
};

export type TimetableEntryType = {
  __typename?: 'TimetableEntryType';
  faculty?: Maybe<UserType>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  notes: Scalars['String']['output'];
  periodDefinition: PeriodDefinitionType;
  room?: Maybe<RoomType>;
  section: SectionType;
  semester: SemesterType;
  subject: SubjectType;
};

export type TimetableStatisticsType = {
  __typename?: 'TimetableStatisticsType';
  labSessions: Scalars['Int']['output'];
  theoryClasses: Scalars['Int']['output'];
  totalClasses: Scalars['Int']['output'];
  tutorialClasses: Scalars['Int']['output'];
};

export type UpdateAssignmentInput = {
  allowLateSubmission?: InputMaybe<Scalars['Boolean']['input']>;
  assignmentId: Scalars['Int']['input'];
  attachmentData?: InputMaybe<Scalars['String']['input']>;
  attachmentFilename?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  lateSubmissionDeadline?: InputMaybe<Scalars['DateTime']['input']>;
  maxMarks?: InputMaybe<Scalars['Decimal']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  weightage?: InputMaybe<Scalars['Decimal']['input']>;
};

export type UpdateExamInput = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  examId: Scalars['Int']['input'];
  instructions?: InputMaybe<Scalars['String']['input']>;
  maxMarks?: InputMaybe<Scalars['Decimal']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  passMarksPercentage?: InputMaybe<Scalars['Decimal']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type UpdateFacultyProfileInput = {
  departmentId?: InputMaybe<Scalars['Int']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  officeHours?: InputMaybe<Scalars['String']['input']>;
  qualifications?: InputMaybe<Scalars['String']['input']>;
  specialization?: InputMaybe<Scalars['String']['input']>;
  teachingLoad?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateStudentProfileInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  guardianEmail?: InputMaybe<Scalars['String']['input']>;
  guardianName?: InputMaybe<Scalars['String']['input']>;
  guardianPhone?: InputMaybe<Scalars['String']['input']>;
  guardianRelationship?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStudentProfileWithPhotoInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  guardianEmail?: InputMaybe<Scalars['String']['input']>;
  guardianName?: InputMaybe<Scalars['String']['input']>;
  guardianPhone?: InputMaybe<Scalars['String']['input']>;
  guardianRelationship?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  department?: Maybe<DepartmentType>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  registerNumber?: Maybe<Scalars['String']['output']>;
  role: RoleType;
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken: string, refreshToken: string, message: string, user: { __typename?: 'UserType', id: number, email?: string | null, registerNumber?: string | null, role: { __typename?: 'RoleType', code: string } } } };

export type LogoutMutationVariables = Exact<{
  accessToken: Scalars['String']['input'];
}>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', success: boolean, message: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'UserType', id: number, email?: string | null, registerNumber?: string | null, role: { __typename?: 'RoleType', id: number, name: string, code: string }, department?: { __typename?: 'DepartmentType', id: number, name: string, code: string } | null } | null };

export type FacultyDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type FacultyDashboardQuery = { __typename?: 'Query', facultyDashboard?: { __typename?: 'FacultyDashboardType', facultyName: string, departmentName?: string | null, totalStudents: number, activeCourses: number, pendingReviews: number, todayClassCount: number, todayClasses: Array<{ __typename?: 'FacultyTodayClassType', id: number, subjectName: string, subjectCode: string, sectionName: string, roomNumber?: string | null, startTime: string, endTime: string, periodNumber: number }>, attendanceOverview: Array<{ __typename?: 'FacultyAttendanceOverviewType', subjectName: string, subjectCode: string, attendancePercentage: number }>, recentActivities: Array<{ __typename?: 'FacultyRecentActivityType', id: number, activityType: string, title: string, description: string, timestamp: string }> } | null };

export type CoursesPageQueryVariables = Exact<{
  registerNumber: Scalars['String']['input'];
}>;


export type CoursesPageQuery = { __typename?: 'Query', courseOverview?: { __typename?: 'CourseOverviewType', totalCourses: number, totalCredits: number, avgProgress: number, avgAttendance: number } | null, myCourses: Array<{ __typename?: 'EnrolledCourseType', id: number, subjectCode: string, subjectName: string, subjectType: string, credits: number, facultyName: string, facultyEmail?: string | null, description: string, courseProgress: number, grade?: string | null, attendancePercentage: number, completedAssignments: number, totalAssignments: number, classSchedule: Array<{ __typename?: 'CourseScheduleType', dayName: string, startTime: string, endTime: string }> }> };

export type StudentDashboardQueryVariables = Exact<{
  registerNumber: Scalars['String']['input'];
}>;


export type StudentDashboardQuery = { __typename?: 'Query', studentDashboard?: { __typename?: 'StudentDashboardType', studentName: string, registerNumber: string, profilePhotoUrl?: string | null, totalPendingAssignments: number, totalOverdueAssignments: number, overallProgressPercentage: number, currentGpa?: number | null, assignmentsDueThisWeek: Array<{ __typename?: 'AssignmentDueType', id: number, title: string, subjectName: string, subjectCode: string, dueDate: string, maxMarks: number, isSubmitted: boolean, submissionDate?: string | null }>, recentActivities: Array<{ __typename?: 'RecentActivityType', id: number, activityType: string, title: string, description: string, timestamp: string, icon?: string | null }>, courseProgress: Array<{ __typename?: 'CourseProgressType', subjectCode: string, subjectName: string, totalAssignments: number, completedAssignments: number, percentage: number }>, nextClass?: { __typename?: 'NextClassType', subjectName: string, subjectCode: string, facultyName: string, roomNumber?: string | null, startTime: string, endTime: string, dayName: string } | null, todayClasses: Array<{ __typename?: 'NextClassType', subjectName: string, subjectCode: string, facultyName: string, roomNumber?: string | null, startTime: string, endTime: string }> } | null };

export type GradesPageDataQueryVariables = Exact<{
  registerNumber: Scalars['String']['input'];
  semesterId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GradesPageDataQuery = { __typename?: 'Query', gradeOverview?: { __typename?: 'GradeOverviewType', cgpa: number, cgpaStatus: string, totalCredits: number, creditsEarned: number, performanceTrend: string, semesterGpas: Array<{ __typename?: 'SemesterGPAType', id: number, semesterName: string, gpa: number, totalCredits: number, creditsEarned: number, semester: { __typename?: 'SemesterType', displayName: string, year: string, startDate: string, endDate: string } }> } | null, myGrades: Array<{ __typename?: 'CourseGradeType', id: number, totalMarks: number, totalMaxMarks: number, percentage: number, grade: string, gradePoints: number, examDate?: string | null, isPublished: boolean, subject: { __typename?: 'SubjectType', code: string, name: string, credits: number }, semester: { __typename?: 'SemesterType', displayName: string, year: string } }> };

export type ExportGradesQueryVariables = Exact<{
  registerNumber: Scalars['String']['input'];
  semesterId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ExportGradesQuery = { __typename?: 'Query', exportGrades: { __typename?: 'ExportGradesType', success: boolean, message: string, filename: string, fileBase64?: string | null } };

export type StudentProfileQueryVariables = Exact<{
  registerNumber: Scalars['String']['input'];
}>;


export type StudentProfileQuery = { __typename?: 'Query', studentProfile?: { __typename?: 'StudentProfileType', id: number, registerNumber: string, rollNumber?: string | null, fullName: string, lastName?: string | null, dateOfBirth?: string | null, gender?: string | null, phone: string, address?: string | null, aadharNumber?: string | null, idProofType?: string | null, idProofNumber?: string | null, guardianName?: string | null, guardianRelationship?: string | null, guardianPhone?: string | null, guardianEmail?: string | null, admissionDate?: string | null, academicStatus: string, year: number, semester: number, profilePhotoUrl?: string | null, profileCompleted: boolean, course: { __typename?: 'CourseType', code: string, name: string, durationYears: number, department: { __typename?: 'DepartmentType', code: string, name: string } }, section?: { __typename?: 'SectionType', name: string, year: number } | null, user: { __typename?: 'UserType', email?: string | null, registerNumber?: string | null } } | null };

export type UpdateStudentProfileMutationVariables = Exact<{
  registerNumber: Scalars['String']['input'];
  data: UpdateStudentProfileInput;
}>;


export type UpdateStudentProfileMutation = { __typename?: 'Mutation', updateStudentProfile: { __typename?: 'StudentProfileResponse', message: string, profile: { __typename?: 'StudentProfileType', id: number, registerNumber: string, fullName: string, lastName?: string | null, phone: string, dateOfBirth?: string | null, gender?: string | null, address?: string | null, guardianName?: string | null, guardianRelationship?: string | null, guardianPhone?: string | null, guardianEmail?: string | null, profilePhotoUrl?: string | null, profileCompleted: boolean } } };

export type UpdateStudentProfileWithPhotoMutationVariables = Exact<{
  registerNumber: Scalars['String']['input'];
  data: UpdateStudentProfileWithPhotoInput;
  profilePictureBase64?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateStudentProfileWithPhotoMutation = { __typename?: 'Mutation', updateStudentProfileWithPhoto: { __typename?: 'StudentProfileResponse', message: string, profile: { __typename?: 'StudentProfileType', id: number, registerNumber: string, fullName: string, lastName?: string | null, phone: string, dateOfBirth?: string | null, gender?: string | null, address?: string | null, guardianName?: string | null, guardianRelationship?: string | null, guardianPhone?: string | null, guardianEmail?: string | null, profilePhotoUrl?: string | null, profileCompleted: boolean, user: { __typename?: 'UserType', email?: string | null, registerNumber?: string | null }, course: { __typename?: 'CourseType', code: string, name: string }, section?: { __typename?: 'SectionType', name: string, year: number } | null } } };

export type TimetablePageQueryVariables = Exact<{
  registerNumber: Scalars['String']['input'];
}>;


export type TimetablePageQuery = { __typename?: 'Query', currentSemester?: { __typename?: 'SemesterType', id: number, number: number, displayName: string, year: string, startDate: string, endDate: string } | null, myTimetable: Array<{ __typename?: 'TimetableEntryType', id: number, subject: { __typename?: 'SubjectType', code: string, name: string, subjectType: string }, faculty?: { __typename?: 'UserType', email?: string | null, registerNumber?: string | null } | null, room?: { __typename?: 'RoomType', roomNumber: string, building: string } | null, periodDefinition: { __typename?: 'PeriodDefinitionType', dayOfWeek: number, dayName: string, startTime: string, endTime: string, periodNumber: number } }>, timetableStatistics?: { __typename?: 'TimetableStatisticsType', totalClasses: number, theoryClasses: number, labSessions: number, tutorialClasses: number } | null };

export type MyTimetableQueryVariables = Exact<{
  registerNumber: Scalars['String']['input'];
}>;


export type MyTimetableQuery = { __typename?: 'Query', myTimetable: Array<{ __typename?: 'TimetableEntryType', id: number, notes: string, subject: { __typename?: 'SubjectType', code: string, name: string, subjectType: string }, faculty?: { __typename?: 'UserType', email?: string | null, registerNumber?: string | null } | null, room?: { __typename?: 'RoomType', roomNumber: string, building: string } | null, periodDefinition: { __typename?: 'PeriodDefinitionType', dayOfWeek: number, dayName: string, startTime: string, endTime: string, periodNumber: number } }> };

export type TimetableStatisticsQueryVariables = Exact<{
  registerNumber: Scalars['String']['input'];
}>;


export type TimetableStatisticsQuery = { __typename?: 'Query', timetableStatistics?: { __typename?: 'TimetableStatisticsType', totalClasses: number, theoryClasses: number, labSessions: number, tutorialClasses: number } | null };

export type CurrentSemesterQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentSemesterQuery = { __typename?: 'Query', currentSemester?: { __typename?: 'SemesterType', id: number, number: number, displayName: string, year: string, startDate: string, endDate: string, isCurrent: boolean } | null };

export type MyNotificationsQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyNotificationsQuery = { __typename?: 'Query', myNotifications: { __typename?: 'NotificationConnection', totalCount: number, unreadCount: number, hasMore: boolean, notifications: Array<{ __typename?: 'NotificationType', id: number, notificationType: string, category: string, priority: string, title: string, message: string, actionUrl: string, metadata: Record<string, unknown>, isRead: boolean, readAt?: string | null, actorName?: string | null, createdAt: string, timeAgo: string }> } };

export type UnreadCountQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
}>;


export type UnreadCountQuery = { __typename?: 'Query', unreadCount: number };

export type MyNotificationPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyNotificationPreferencesQuery = { __typename?: 'Query', myNotificationPreferences: Array<{ __typename?: 'NotificationPreferenceType', category: string, isEnabled: boolean, isSseEnabled: boolean, isEmailEnabled: boolean }> };

export type NotificationStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationStatsQuery = { __typename?: 'Query', notificationStats: { __typename?: 'NotificationStats', totalCount: number, unreadCount: number, readCount: number, byCategory: Record<string, unknown> } };

export type NotificationByIdQueryVariables = Exact<{
  notificationId: Scalars['Int']['input'];
}>;


export type NotificationByIdQuery = { __typename?: 'Query', notificationById?: { __typename?: 'NotificationType', id: number, notificationType: string, category: string, priority: string, title: string, message: string, actionUrl: string, metadata: Record<string, unknown>, isRead: boolean, readAt?: string | null, actorName?: string | null, createdAt: string, timeAgo: string } | null };

export type MarkNotificationReadMutationVariables = Exact<{
  notificationId: Scalars['Int']['input'];
}>;


export type MarkNotificationReadMutation = { __typename?: 'Mutation', markNotificationRead?: { __typename?: 'NotificationType', id: number, isRead: boolean, readAt?: string | null } | null };

export type MarkAllNotificationsReadMutationVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
}>;


export type MarkAllNotificationsReadMutation = { __typename?: 'Mutation', markAllNotificationsRead: number };

export type DismissNotificationMutationVariables = Exact<{
  notificationId: Scalars['Int']['input'];
}>;


export type DismissNotificationMutation = { __typename?: 'Mutation', dismissNotification: boolean };

export type BulkDismissNotificationsMutationVariables = Exact<{
  notificationIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type BulkDismissNotificationsMutation = { __typename?: 'Mutation', bulkDismissNotifications: number };

export type UpdateNotificationPreferenceMutationVariables = Exact<{
  category: Scalars['String']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isSseEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isEmailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateNotificationPreferenceMutation = { __typename?: 'Mutation', updateNotificationPreference?: { __typename?: 'NotificationPreferenceType', category: string, isEnabled: boolean, isSseEnabled: boolean, isEmailEnabled: boolean } | null };

export type ResetNotificationPreferencesMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetNotificationPreferencesMutation = { __typename?: 'Mutation', resetNotificationPreferences: Array<{ __typename?: 'NotificationPreferenceType', category: string, isEnabled: boolean, isSseEnabled: boolean, isEmailEnabled: boolean }> };


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(data: {username: $username, password: $password}) {
    accessToken
    refreshToken
    message
    user {
      id
      email
      registerNumber
      role {
        code
      }
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout($accessToken: String!) {
  logout(accessToken: $accessToken) {
    success
    message
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *      accessToken: // value for 'accessToken'
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    registerNumber
    role {
      id
      name
      code
    }
    department {
      id
      name
      code
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
// @ts-ignore
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const FacultyDashboardDocument = gql`
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

/**
 * __useFacultyDashboardQuery__
 *
 * To run a query within a React component, call `useFacultyDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useFacultyDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFacultyDashboardQuery({
 *   variables: {
 *   },
 * });
 */
export function useFacultyDashboardQuery(baseOptions?: Apollo.QueryHookOptions<FacultyDashboardQuery, FacultyDashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FacultyDashboardQuery, FacultyDashboardQueryVariables>(FacultyDashboardDocument, options);
      }
export function useFacultyDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FacultyDashboardQuery, FacultyDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FacultyDashboardQuery, FacultyDashboardQueryVariables>(FacultyDashboardDocument, options);
        }
// @ts-ignore
export function useFacultyDashboardSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FacultyDashboardQuery, FacultyDashboardQueryVariables>): Apollo.UseSuspenseQueryResult<FacultyDashboardQuery, FacultyDashboardQueryVariables>;
export function useFacultyDashboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FacultyDashboardQuery, FacultyDashboardQueryVariables>): Apollo.UseSuspenseQueryResult<FacultyDashboardQuery | undefined, FacultyDashboardQueryVariables>;
export function useFacultyDashboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FacultyDashboardQuery, FacultyDashboardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FacultyDashboardQuery, FacultyDashboardQueryVariables>(FacultyDashboardDocument, options);
        }
export type FacultyDashboardQueryHookResult = ReturnType<typeof useFacultyDashboardQuery>;
export type FacultyDashboardLazyQueryHookResult = ReturnType<typeof useFacultyDashboardLazyQuery>;
export type FacultyDashboardSuspenseQueryHookResult = ReturnType<typeof useFacultyDashboardSuspenseQuery>;
export type FacultyDashboardQueryResult = Apollo.QueryResult<FacultyDashboardQuery, FacultyDashboardQueryVariables>;
export const CoursesPageDocument = gql`
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

/**
 * __useCoursesPageQuery__
 *
 * To run a query within a React component, call `useCoursesPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useCoursesPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCoursesPageQuery({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *   },
 * });
 */
export function useCoursesPageQuery(baseOptions: Apollo.QueryHookOptions<CoursesPageQuery, CoursesPageQueryVariables> & ({ variables: CoursesPageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CoursesPageQuery, CoursesPageQueryVariables>(CoursesPageDocument, options);
      }
export function useCoursesPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CoursesPageQuery, CoursesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CoursesPageQuery, CoursesPageQueryVariables>(CoursesPageDocument, options);
        }
// @ts-ignore
export function useCoursesPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CoursesPageQuery, CoursesPageQueryVariables>): Apollo.UseSuspenseQueryResult<CoursesPageQuery, CoursesPageQueryVariables>;
export function useCoursesPageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CoursesPageQuery, CoursesPageQueryVariables>): Apollo.UseSuspenseQueryResult<CoursesPageQuery | undefined, CoursesPageQueryVariables>;
export function useCoursesPageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CoursesPageQuery, CoursesPageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CoursesPageQuery, CoursesPageQueryVariables>(CoursesPageDocument, options);
        }
export type CoursesPageQueryHookResult = ReturnType<typeof useCoursesPageQuery>;
export type CoursesPageLazyQueryHookResult = ReturnType<typeof useCoursesPageLazyQuery>;
export type CoursesPageSuspenseQueryHookResult = ReturnType<typeof useCoursesPageSuspenseQuery>;
export type CoursesPageQueryResult = Apollo.QueryResult<CoursesPageQuery, CoursesPageQueryVariables>;
export const StudentDashboardDocument = gql`
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

/**
 * __useStudentDashboardQuery__
 *
 * To run a query within a React component, call `useStudentDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentDashboardQuery({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *   },
 * });
 */
export function useStudentDashboardQuery(baseOptions: Apollo.QueryHookOptions<StudentDashboardQuery, StudentDashboardQueryVariables> & ({ variables: StudentDashboardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudentDashboardQuery, StudentDashboardQueryVariables>(StudentDashboardDocument, options);
      }
export function useStudentDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentDashboardQuery, StudentDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudentDashboardQuery, StudentDashboardQueryVariables>(StudentDashboardDocument, options);
        }
// @ts-ignore
export function useStudentDashboardSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<StudentDashboardQuery, StudentDashboardQueryVariables>): Apollo.UseSuspenseQueryResult<StudentDashboardQuery, StudentDashboardQueryVariables>;
export function useStudentDashboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentDashboardQuery, StudentDashboardQueryVariables>): Apollo.UseSuspenseQueryResult<StudentDashboardQuery | undefined, StudentDashboardQueryVariables>;
export function useStudentDashboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentDashboardQuery, StudentDashboardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StudentDashboardQuery, StudentDashboardQueryVariables>(StudentDashboardDocument, options);
        }
export type StudentDashboardQueryHookResult = ReturnType<typeof useStudentDashboardQuery>;
export type StudentDashboardLazyQueryHookResult = ReturnType<typeof useStudentDashboardLazyQuery>;
export type StudentDashboardSuspenseQueryHookResult = ReturnType<typeof useStudentDashboardSuspenseQuery>;
export type StudentDashboardQueryResult = Apollo.QueryResult<StudentDashboardQuery, StudentDashboardQueryVariables>;
export const GradesPageDataDocument = gql`
    query GradesPageData($registerNumber: String!, $semesterId: Int) {
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

/**
 * __useGradesPageDataQuery__
 *
 * To run a query within a React component, call `useGradesPageDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGradesPageDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGradesPageDataQuery({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *      semesterId: // value for 'semesterId'
 *   },
 * });
 */
export function useGradesPageDataQuery(baseOptions: Apollo.QueryHookOptions<GradesPageDataQuery, GradesPageDataQueryVariables> & ({ variables: GradesPageDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GradesPageDataQuery, GradesPageDataQueryVariables>(GradesPageDataDocument, options);
      }
export function useGradesPageDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GradesPageDataQuery, GradesPageDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GradesPageDataQuery, GradesPageDataQueryVariables>(GradesPageDataDocument, options);
        }
// @ts-ignore
export function useGradesPageDataSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GradesPageDataQuery, GradesPageDataQueryVariables>): Apollo.UseSuspenseQueryResult<GradesPageDataQuery, GradesPageDataQueryVariables>;
export function useGradesPageDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GradesPageDataQuery, GradesPageDataQueryVariables>): Apollo.UseSuspenseQueryResult<GradesPageDataQuery | undefined, GradesPageDataQueryVariables>;
export function useGradesPageDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GradesPageDataQuery, GradesPageDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GradesPageDataQuery, GradesPageDataQueryVariables>(GradesPageDataDocument, options);
        }
export type GradesPageDataQueryHookResult = ReturnType<typeof useGradesPageDataQuery>;
export type GradesPageDataLazyQueryHookResult = ReturnType<typeof useGradesPageDataLazyQuery>;
export type GradesPageDataSuspenseQueryHookResult = ReturnType<typeof useGradesPageDataSuspenseQuery>;
export type GradesPageDataQueryResult = Apollo.QueryResult<GradesPageDataQuery, GradesPageDataQueryVariables>;
export const ExportGradesDocument = gql`
    query ExportGrades($registerNumber: String!, $semesterId: Int) {
  exportGrades(registerNumber: $registerNumber, semesterId: $semesterId) {
    success
    message
    filename
    fileBase64
  }
}
    `;

/**
 * __useExportGradesQuery__
 *
 * To run a query within a React component, call `useExportGradesQuery` and pass it any options that fit your needs.
 * When your component renders, `useExportGradesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExportGradesQuery({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *      semesterId: // value for 'semesterId'
 *   },
 * });
 */
export function useExportGradesQuery(baseOptions: Apollo.QueryHookOptions<ExportGradesQuery, ExportGradesQueryVariables> & ({ variables: ExportGradesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExportGradesQuery, ExportGradesQueryVariables>(ExportGradesDocument, options);
      }
export function useExportGradesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExportGradesQuery, ExportGradesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExportGradesQuery, ExportGradesQueryVariables>(ExportGradesDocument, options);
        }
// @ts-ignore
export function useExportGradesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ExportGradesQuery, ExportGradesQueryVariables>): Apollo.UseSuspenseQueryResult<ExportGradesQuery, ExportGradesQueryVariables>;
export function useExportGradesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ExportGradesQuery, ExportGradesQueryVariables>): Apollo.UseSuspenseQueryResult<ExportGradesQuery | undefined, ExportGradesQueryVariables>;
export function useExportGradesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ExportGradesQuery, ExportGradesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExportGradesQuery, ExportGradesQueryVariables>(ExportGradesDocument, options);
        }
export type ExportGradesQueryHookResult = ReturnType<typeof useExportGradesQuery>;
export type ExportGradesLazyQueryHookResult = ReturnType<typeof useExportGradesLazyQuery>;
export type ExportGradesSuspenseQueryHookResult = ReturnType<typeof useExportGradesSuspenseQuery>;
export type ExportGradesQueryResult = Apollo.QueryResult<ExportGradesQuery, ExportGradesQueryVariables>;
export const StudentProfileDocument = gql`
    query StudentProfile($registerNumber: String!) {
  studentProfile(registerNumber: $registerNumber) {
    id
    registerNumber
    rollNumber
    fullName
    lastName
    dateOfBirth
    gender
    phone
    address
    aadharNumber
    idProofType
    idProofNumber
    guardianName
    guardianRelationship
    guardianPhone
    guardianEmail
    admissionDate
    academicStatus
    year
    semester
    profilePhotoUrl
    profileCompleted
    course {
      code
      name
      durationYears
      department {
        code
        name
      }
    }
    section {
      name
      year
    }
    user {
      email
      registerNumber
    }
  }
}
    `;

/**
 * __useStudentProfileQuery__
 *
 * To run a query within a React component, call `useStudentProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentProfileQuery({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *   },
 * });
 */
export function useStudentProfileQuery(baseOptions: Apollo.QueryHookOptions<StudentProfileQuery, StudentProfileQueryVariables> & ({ variables: StudentProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudentProfileQuery, StudentProfileQueryVariables>(StudentProfileDocument, options);
      }
export function useStudentProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentProfileQuery, StudentProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudentProfileQuery, StudentProfileQueryVariables>(StudentProfileDocument, options);
        }
// @ts-ignore
export function useStudentProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<StudentProfileQuery, StudentProfileQueryVariables>): Apollo.UseSuspenseQueryResult<StudentProfileQuery, StudentProfileQueryVariables>;
export function useStudentProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentProfileQuery, StudentProfileQueryVariables>): Apollo.UseSuspenseQueryResult<StudentProfileQuery | undefined, StudentProfileQueryVariables>;
export function useStudentProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentProfileQuery, StudentProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StudentProfileQuery, StudentProfileQueryVariables>(StudentProfileDocument, options);
        }
export type StudentProfileQueryHookResult = ReturnType<typeof useStudentProfileQuery>;
export type StudentProfileLazyQueryHookResult = ReturnType<typeof useStudentProfileLazyQuery>;
export type StudentProfileSuspenseQueryHookResult = ReturnType<typeof useStudentProfileSuspenseQuery>;
export type StudentProfileQueryResult = Apollo.QueryResult<StudentProfileQuery, StudentProfileQueryVariables>;
export const UpdateStudentProfileDocument = gql`
    mutation UpdateStudentProfile($registerNumber: String!, $data: UpdateStudentProfileInput!) {
  updateStudentProfile(registerNumber: $registerNumber, data: $data) {
    profile {
      id
      registerNumber
      fullName
      lastName
      phone
      dateOfBirth
      gender
      address
      guardianName
      guardianRelationship
      guardianPhone
      guardianEmail
      profilePhotoUrl
      profileCompleted
    }
    message
  }
}
    `;
export type UpdateStudentProfileMutationFn = Apollo.MutationFunction<UpdateStudentProfileMutation, UpdateStudentProfileMutationVariables>;

/**
 * __useUpdateStudentProfileMutation__
 *
 * To run a mutation, you first call `useUpdateStudentProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStudentProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStudentProfileMutation, { data, loading, error }] = useUpdateStudentProfileMutation({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateStudentProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStudentProfileMutation, UpdateStudentProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStudentProfileMutation, UpdateStudentProfileMutationVariables>(UpdateStudentProfileDocument, options);
      }
export type UpdateStudentProfileMutationHookResult = ReturnType<typeof useUpdateStudentProfileMutation>;
export type UpdateStudentProfileMutationResult = Apollo.MutationResult<UpdateStudentProfileMutation>;
export type UpdateStudentProfileMutationOptions = Apollo.BaseMutationOptions<UpdateStudentProfileMutation, UpdateStudentProfileMutationVariables>;
export const UpdateStudentProfileWithPhotoDocument = gql`
    mutation UpdateStudentProfileWithPhoto($registerNumber: String!, $data: UpdateStudentProfileWithPhotoInput!, $profilePictureBase64: String) {
  updateStudentProfileWithPhoto(
    registerNumber: $registerNumber
    data: $data
    profilePictureBase64: $profilePictureBase64
  ) {
    profile {
      id
      registerNumber
      fullName
      lastName
      phone
      dateOfBirth
      gender
      address
      guardianName
      guardianRelationship
      guardianPhone
      guardianEmail
      profilePhotoUrl
      profileCompleted
      user {
        email
        registerNumber
      }
      course {
        code
        name
      }
      section {
        name
        year
      }
    }
    message
  }
}
    `;
export type UpdateStudentProfileWithPhotoMutationFn = Apollo.MutationFunction<UpdateStudentProfileWithPhotoMutation, UpdateStudentProfileWithPhotoMutationVariables>;

/**
 * __useUpdateStudentProfileWithPhotoMutation__
 *
 * To run a mutation, you first call `useUpdateStudentProfileWithPhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStudentProfileWithPhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStudentProfileWithPhotoMutation, { data, loading, error }] = useUpdateStudentProfileWithPhotoMutation({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *      data: // value for 'data'
 *      profilePictureBase64: // value for 'profilePictureBase64'
 *   },
 * });
 */
export function useUpdateStudentProfileWithPhotoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStudentProfileWithPhotoMutation, UpdateStudentProfileWithPhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStudentProfileWithPhotoMutation, UpdateStudentProfileWithPhotoMutationVariables>(UpdateStudentProfileWithPhotoDocument, options);
      }
export type UpdateStudentProfileWithPhotoMutationHookResult = ReturnType<typeof useUpdateStudentProfileWithPhotoMutation>;
export type UpdateStudentProfileWithPhotoMutationResult = Apollo.MutationResult<UpdateStudentProfileWithPhotoMutation>;
export type UpdateStudentProfileWithPhotoMutationOptions = Apollo.BaseMutationOptions<UpdateStudentProfileWithPhotoMutation, UpdateStudentProfileWithPhotoMutationVariables>;
export const TimetablePageDocument = gql`
    query TimetablePage($registerNumber: String!) {
  currentSemester {
    id
    number
    displayName
    year
    startDate
    endDate
  }
  myTimetable(registerNumber: $registerNumber) {
    id
    subject {
      code
      name
      subjectType
    }
    faculty {
      email
      registerNumber
    }
    room {
      roomNumber
      building
    }
    periodDefinition {
      dayOfWeek
      dayName
      startTime
      endTime
      periodNumber
    }
  }
  timetableStatistics(registerNumber: $registerNumber) {
    totalClasses
    theoryClasses
    labSessions
    tutorialClasses
  }
}
    `;

/**
 * __useTimetablePageQuery__
 *
 * To run a query within a React component, call `useTimetablePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimetablePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimetablePageQuery({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *   },
 * });
 */
export function useTimetablePageQuery(baseOptions: Apollo.QueryHookOptions<TimetablePageQuery, TimetablePageQueryVariables> & ({ variables: TimetablePageQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimetablePageQuery, TimetablePageQueryVariables>(TimetablePageDocument, options);
      }
export function useTimetablePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimetablePageQuery, TimetablePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimetablePageQuery, TimetablePageQueryVariables>(TimetablePageDocument, options);
        }
// @ts-ignore
export function useTimetablePageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TimetablePageQuery, TimetablePageQueryVariables>): Apollo.UseSuspenseQueryResult<TimetablePageQuery, TimetablePageQueryVariables>;
export function useTimetablePageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TimetablePageQuery, TimetablePageQueryVariables>): Apollo.UseSuspenseQueryResult<TimetablePageQuery | undefined, TimetablePageQueryVariables>;
export function useTimetablePageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TimetablePageQuery, TimetablePageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TimetablePageQuery, TimetablePageQueryVariables>(TimetablePageDocument, options);
        }
export type TimetablePageQueryHookResult = ReturnType<typeof useTimetablePageQuery>;
export type TimetablePageLazyQueryHookResult = ReturnType<typeof useTimetablePageLazyQuery>;
export type TimetablePageSuspenseQueryHookResult = ReturnType<typeof useTimetablePageSuspenseQuery>;
export type TimetablePageQueryResult = Apollo.QueryResult<TimetablePageQuery, TimetablePageQueryVariables>;
export const MyTimetableDocument = gql`
    query MyTimetable($registerNumber: String!) {
  myTimetable(registerNumber: $registerNumber) {
    id
    subject {
      code
      name
      subjectType
    }
    faculty {
      email
      registerNumber
    }
    room {
      roomNumber
      building
    }
    periodDefinition {
      dayOfWeek
      dayName
      startTime
      endTime
      periodNumber
    }
    notes
  }
}
    `;

/**
 * __useMyTimetableQuery__
 *
 * To run a query within a React component, call `useMyTimetableQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyTimetableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyTimetableQuery({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *   },
 * });
 */
export function useMyTimetableQuery(baseOptions: Apollo.QueryHookOptions<MyTimetableQuery, MyTimetableQueryVariables> & ({ variables: MyTimetableQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyTimetableQuery, MyTimetableQueryVariables>(MyTimetableDocument, options);
      }
export function useMyTimetableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyTimetableQuery, MyTimetableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyTimetableQuery, MyTimetableQueryVariables>(MyTimetableDocument, options);
        }
// @ts-ignore
export function useMyTimetableSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyTimetableQuery, MyTimetableQueryVariables>): Apollo.UseSuspenseQueryResult<MyTimetableQuery, MyTimetableQueryVariables>;
export function useMyTimetableSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyTimetableQuery, MyTimetableQueryVariables>): Apollo.UseSuspenseQueryResult<MyTimetableQuery | undefined, MyTimetableQueryVariables>;
export function useMyTimetableSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyTimetableQuery, MyTimetableQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyTimetableQuery, MyTimetableQueryVariables>(MyTimetableDocument, options);
        }
export type MyTimetableQueryHookResult = ReturnType<typeof useMyTimetableQuery>;
export type MyTimetableLazyQueryHookResult = ReturnType<typeof useMyTimetableLazyQuery>;
export type MyTimetableSuspenseQueryHookResult = ReturnType<typeof useMyTimetableSuspenseQuery>;
export type MyTimetableQueryResult = Apollo.QueryResult<MyTimetableQuery, MyTimetableQueryVariables>;
export const TimetableStatisticsDocument = gql`
    query TimetableStatistics($registerNumber: String!) {
  timetableStatistics(registerNumber: $registerNumber) {
    totalClasses
    theoryClasses
    labSessions
    tutorialClasses
  }
}
    `;

/**
 * __useTimetableStatisticsQuery__
 *
 * To run a query within a React component, call `useTimetableStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimetableStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimetableStatisticsQuery({
 *   variables: {
 *      registerNumber: // value for 'registerNumber'
 *   },
 * });
 */
export function useTimetableStatisticsQuery(baseOptions: Apollo.QueryHookOptions<TimetableStatisticsQuery, TimetableStatisticsQueryVariables> & ({ variables: TimetableStatisticsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>(TimetableStatisticsDocument, options);
      }
export function useTimetableStatisticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>(TimetableStatisticsDocument, options);
        }
// @ts-ignore
export function useTimetableStatisticsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>): Apollo.UseSuspenseQueryResult<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>;
export function useTimetableStatisticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>): Apollo.UseSuspenseQueryResult<TimetableStatisticsQuery | undefined, TimetableStatisticsQueryVariables>;
export function useTimetableStatisticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>(TimetableStatisticsDocument, options);
        }
export type TimetableStatisticsQueryHookResult = ReturnType<typeof useTimetableStatisticsQuery>;
export type TimetableStatisticsLazyQueryHookResult = ReturnType<typeof useTimetableStatisticsLazyQuery>;
export type TimetableStatisticsSuspenseQueryHookResult = ReturnType<typeof useTimetableStatisticsSuspenseQuery>;
export type TimetableStatisticsQueryResult = Apollo.QueryResult<TimetableStatisticsQuery, TimetableStatisticsQueryVariables>;
export const CurrentSemesterDocument = gql`
    query CurrentSemester {
  currentSemester {
    id
    number
    displayName
    year
    startDate
    endDate
    isCurrent
  }
}
    `;

/**
 * __useCurrentSemesterQuery__
 *
 * To run a query within a React component, call `useCurrentSemesterQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentSemesterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentSemesterQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentSemesterQuery(baseOptions?: Apollo.QueryHookOptions<CurrentSemesterQuery, CurrentSemesterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentSemesterQuery, CurrentSemesterQueryVariables>(CurrentSemesterDocument, options);
      }
export function useCurrentSemesterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentSemesterQuery, CurrentSemesterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentSemesterQuery, CurrentSemesterQueryVariables>(CurrentSemesterDocument, options);
        }
// @ts-ignore
export function useCurrentSemesterSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CurrentSemesterQuery, CurrentSemesterQueryVariables>): Apollo.UseSuspenseQueryResult<CurrentSemesterQuery, CurrentSemesterQueryVariables>;
export function useCurrentSemesterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentSemesterQuery, CurrentSemesterQueryVariables>): Apollo.UseSuspenseQueryResult<CurrentSemesterQuery | undefined, CurrentSemesterQueryVariables>;
export function useCurrentSemesterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentSemesterQuery, CurrentSemesterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentSemesterQuery, CurrentSemesterQueryVariables>(CurrentSemesterDocument, options);
        }
export type CurrentSemesterQueryHookResult = ReturnType<typeof useCurrentSemesterQuery>;
export type CurrentSemesterLazyQueryHookResult = ReturnType<typeof useCurrentSemesterLazyQuery>;
export type CurrentSemesterSuspenseQueryHookResult = ReturnType<typeof useCurrentSemesterSuspenseQuery>;
export type CurrentSemesterQueryResult = Apollo.QueryResult<CurrentSemesterQuery, CurrentSemesterQueryVariables>;
export const MyNotificationsDocument = gql`
    query MyNotifications($category: String, $isRead: Boolean, $limit: Int = 20, $offset: Int = 0) {
  myNotifications(
    category: $category
    isRead: $isRead
    limit: $limit
    offset: $offset
  ) {
    notifications {
      id
      notificationType
      category
      priority
      title
      message
      actionUrl
      metadata
      isRead
      readAt
      actorName
      createdAt
      timeAgo
    }
    totalCount
    unreadCount
    hasMore
  }
}
    `;

/**
 * __useMyNotificationsQuery__
 *
 * To run a query within a React component, call `useMyNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyNotificationsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      isRead: // value for 'isRead'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMyNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
      }
export function useMyNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
        }
// @ts-ignore
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>): Apollo.UseSuspenseQueryResult<MyNotificationsQuery, MyNotificationsQueryVariables>;
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>): Apollo.UseSuspenseQueryResult<MyNotificationsQuery | undefined, MyNotificationsQueryVariables>;
export function useMyNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyNotificationsQuery, MyNotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyNotificationsQuery, MyNotificationsQueryVariables>(MyNotificationsDocument, options);
        }
export type MyNotificationsQueryHookResult = ReturnType<typeof useMyNotificationsQuery>;
export type MyNotificationsLazyQueryHookResult = ReturnType<typeof useMyNotificationsLazyQuery>;
export type MyNotificationsSuspenseQueryHookResult = ReturnType<typeof useMyNotificationsSuspenseQuery>;
export type MyNotificationsQueryResult = Apollo.QueryResult<MyNotificationsQuery, MyNotificationsQueryVariables>;
export const UnreadCountDocument = gql`
    query UnreadCount($category: String) {
  unreadCount(category: $category)
}
    `;

/**
 * __useUnreadCountQuery__
 *
 * To run a query within a React component, call `useUnreadCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnreadCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnreadCountQuery({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useUnreadCountQuery(baseOptions?: Apollo.QueryHookOptions<UnreadCountQuery, UnreadCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UnreadCountQuery, UnreadCountQueryVariables>(UnreadCountDocument, options);
      }
export function useUnreadCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnreadCountQuery, UnreadCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UnreadCountQuery, UnreadCountQueryVariables>(UnreadCountDocument, options);
        }
// @ts-ignore
export function useUnreadCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UnreadCountQuery, UnreadCountQueryVariables>): Apollo.UseSuspenseQueryResult<UnreadCountQuery, UnreadCountQueryVariables>;
export function useUnreadCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnreadCountQuery, UnreadCountQueryVariables>): Apollo.UseSuspenseQueryResult<UnreadCountQuery | undefined, UnreadCountQueryVariables>;
export function useUnreadCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnreadCountQuery, UnreadCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UnreadCountQuery, UnreadCountQueryVariables>(UnreadCountDocument, options);
        }
export type UnreadCountQueryHookResult = ReturnType<typeof useUnreadCountQuery>;
export type UnreadCountLazyQueryHookResult = ReturnType<typeof useUnreadCountLazyQuery>;
export type UnreadCountSuspenseQueryHookResult = ReturnType<typeof useUnreadCountSuspenseQuery>;
export type UnreadCountQueryResult = Apollo.QueryResult<UnreadCountQuery, UnreadCountQueryVariables>;
export const MyNotificationPreferencesDocument = gql`
    query MyNotificationPreferences {
  myNotificationPreferences {
    category
    isEnabled
    isSseEnabled
    isEmailEnabled
  }
}
    `;

/**
 * __useMyNotificationPreferencesQuery__
 *
 * To run a query within a React component, call `useMyNotificationPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyNotificationPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyNotificationPreferencesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyNotificationPreferencesQuery(baseOptions?: Apollo.QueryHookOptions<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>(MyNotificationPreferencesDocument, options);
      }
export function useMyNotificationPreferencesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>(MyNotificationPreferencesDocument, options);
        }
// @ts-ignore
export function useMyNotificationPreferencesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>): Apollo.UseSuspenseQueryResult<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>;
export function useMyNotificationPreferencesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>): Apollo.UseSuspenseQueryResult<MyNotificationPreferencesQuery | undefined, MyNotificationPreferencesQueryVariables>;
export function useMyNotificationPreferencesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>(MyNotificationPreferencesDocument, options);
        }
export type MyNotificationPreferencesQueryHookResult = ReturnType<typeof useMyNotificationPreferencesQuery>;
export type MyNotificationPreferencesLazyQueryHookResult = ReturnType<typeof useMyNotificationPreferencesLazyQuery>;
export type MyNotificationPreferencesSuspenseQueryHookResult = ReturnType<typeof useMyNotificationPreferencesSuspenseQuery>;
export type MyNotificationPreferencesQueryResult = Apollo.QueryResult<MyNotificationPreferencesQuery, MyNotificationPreferencesQueryVariables>;
export const NotificationStatsDocument = gql`
    query NotificationStats {
  notificationStats {
    totalCount
    unreadCount
    readCount
    byCategory
  }
}
    `;

/**
 * __useNotificationStatsQuery__
 *
 * To run a query within a React component, call `useNotificationStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationStatsQuery(baseOptions?: Apollo.QueryHookOptions<NotificationStatsQuery, NotificationStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationStatsQuery, NotificationStatsQueryVariables>(NotificationStatsDocument, options);
      }
export function useNotificationStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationStatsQuery, NotificationStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationStatsQuery, NotificationStatsQueryVariables>(NotificationStatsDocument, options);
        }
// @ts-ignore
export function useNotificationStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NotificationStatsQuery, NotificationStatsQueryVariables>): Apollo.UseSuspenseQueryResult<NotificationStatsQuery, NotificationStatsQueryVariables>;
export function useNotificationStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotificationStatsQuery, NotificationStatsQueryVariables>): Apollo.UseSuspenseQueryResult<NotificationStatsQuery | undefined, NotificationStatsQueryVariables>;
export function useNotificationStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotificationStatsQuery, NotificationStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotificationStatsQuery, NotificationStatsQueryVariables>(NotificationStatsDocument, options);
        }
export type NotificationStatsQueryHookResult = ReturnType<typeof useNotificationStatsQuery>;
export type NotificationStatsLazyQueryHookResult = ReturnType<typeof useNotificationStatsLazyQuery>;
export type NotificationStatsSuspenseQueryHookResult = ReturnType<typeof useNotificationStatsSuspenseQuery>;
export type NotificationStatsQueryResult = Apollo.QueryResult<NotificationStatsQuery, NotificationStatsQueryVariables>;
export const NotificationByIdDocument = gql`
    query NotificationById($notificationId: Int!) {
  notificationById(notificationId: $notificationId) {
    id
    notificationType
    category
    priority
    title
    message
    actionUrl
    metadata
    isRead
    readAt
    actorName
    createdAt
    timeAgo
  }
}
    `;

/**
 * __useNotificationByIdQuery__
 *
 * To run a query within a React component, call `useNotificationByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationByIdQuery({
 *   variables: {
 *      notificationId: // value for 'notificationId'
 *   },
 * });
 */
export function useNotificationByIdQuery(baseOptions: Apollo.QueryHookOptions<NotificationByIdQuery, NotificationByIdQueryVariables> & ({ variables: NotificationByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationByIdQuery, NotificationByIdQueryVariables>(NotificationByIdDocument, options);
      }
export function useNotificationByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationByIdQuery, NotificationByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationByIdQuery, NotificationByIdQueryVariables>(NotificationByIdDocument, options);
        }
// @ts-ignore
export function useNotificationByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NotificationByIdQuery, NotificationByIdQueryVariables>): Apollo.UseSuspenseQueryResult<NotificationByIdQuery, NotificationByIdQueryVariables>;
export function useNotificationByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotificationByIdQuery, NotificationByIdQueryVariables>): Apollo.UseSuspenseQueryResult<NotificationByIdQuery | undefined, NotificationByIdQueryVariables>;
export function useNotificationByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotificationByIdQuery, NotificationByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotificationByIdQuery, NotificationByIdQueryVariables>(NotificationByIdDocument, options);
        }
export type NotificationByIdQueryHookResult = ReturnType<typeof useNotificationByIdQuery>;
export type NotificationByIdLazyQueryHookResult = ReturnType<typeof useNotificationByIdLazyQuery>;
export type NotificationByIdSuspenseQueryHookResult = ReturnType<typeof useNotificationByIdSuspenseQuery>;
export type NotificationByIdQueryResult = Apollo.QueryResult<NotificationByIdQuery, NotificationByIdQueryVariables>;
export const MarkNotificationReadDocument = gql`
    mutation MarkNotificationRead($notificationId: Int!) {
  markNotificationRead(notificationId: $notificationId) {
    id
    isRead
    readAt
  }
}
    `;
export type MarkNotificationReadMutationFn = Apollo.MutationFunction<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;

/**
 * __useMarkNotificationReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationReadMutation, { data, loading, error }] = useMarkNotificationReadMutation({
 *   variables: {
 *      notificationId: // value for 'notificationId'
 *   },
 * });
 */
export function useMarkNotificationReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>(MarkNotificationReadDocument, options);
      }
export type MarkNotificationReadMutationHookResult = ReturnType<typeof useMarkNotificationReadMutation>;
export type MarkNotificationReadMutationResult = Apollo.MutationResult<MarkNotificationReadMutation>;
export type MarkNotificationReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export const MarkAllNotificationsReadDocument = gql`
    mutation MarkAllNotificationsRead($category: String) {
  markAllNotificationsRead(category: $category)
}
    `;
export type MarkAllNotificationsReadMutationFn = Apollo.MutationFunction<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;

/**
 * __useMarkAllNotificationsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsReadMutation, { data, loading, error }] = useMarkAllNotificationsReadMutation({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useMarkAllNotificationsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>(MarkAllNotificationsReadDocument, options);
      }
export type MarkAllNotificationsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsReadMutation>;
export type MarkAllNotificationsReadMutationResult = Apollo.MutationResult<MarkAllNotificationsReadMutation>;
export type MarkAllNotificationsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsReadMutation, MarkAllNotificationsReadMutationVariables>;
export const DismissNotificationDocument = gql`
    mutation DismissNotification($notificationId: Int!) {
  dismissNotification(notificationId: $notificationId)
}
    `;
export type DismissNotificationMutationFn = Apollo.MutationFunction<DismissNotificationMutation, DismissNotificationMutationVariables>;

/**
 * __useDismissNotificationMutation__
 *
 * To run a mutation, you first call `useDismissNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissNotificationMutation, { data, loading, error }] = useDismissNotificationMutation({
 *   variables: {
 *      notificationId: // value for 'notificationId'
 *   },
 * });
 */
export function useDismissNotificationMutation(baseOptions?: Apollo.MutationHookOptions<DismissNotificationMutation, DismissNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DismissNotificationMutation, DismissNotificationMutationVariables>(DismissNotificationDocument, options);
      }
export type DismissNotificationMutationHookResult = ReturnType<typeof useDismissNotificationMutation>;
export type DismissNotificationMutationResult = Apollo.MutationResult<DismissNotificationMutation>;
export type DismissNotificationMutationOptions = Apollo.BaseMutationOptions<DismissNotificationMutation, DismissNotificationMutationVariables>;
export const BulkDismissNotificationsDocument = gql`
    mutation BulkDismissNotifications($notificationIds: [Int!]!) {
  bulkDismissNotifications(notificationIds: $notificationIds)
}
    `;
export type BulkDismissNotificationsMutationFn = Apollo.MutationFunction<BulkDismissNotificationsMutation, BulkDismissNotificationsMutationVariables>;

/**
 * __useBulkDismissNotificationsMutation__
 *
 * To run a mutation, you first call `useBulkDismissNotificationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkDismissNotificationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkDismissNotificationsMutation, { data, loading, error }] = useBulkDismissNotificationsMutation({
 *   variables: {
 *      notificationIds: // value for 'notificationIds'
 *   },
 * });
 */
export function useBulkDismissNotificationsMutation(baseOptions?: Apollo.MutationHookOptions<BulkDismissNotificationsMutation, BulkDismissNotificationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkDismissNotificationsMutation, BulkDismissNotificationsMutationVariables>(BulkDismissNotificationsDocument, options);
      }
export type BulkDismissNotificationsMutationHookResult = ReturnType<typeof useBulkDismissNotificationsMutation>;
export type BulkDismissNotificationsMutationResult = Apollo.MutationResult<BulkDismissNotificationsMutation>;
export type BulkDismissNotificationsMutationOptions = Apollo.BaseMutationOptions<BulkDismissNotificationsMutation, BulkDismissNotificationsMutationVariables>;
export const UpdateNotificationPreferenceDocument = gql`
    mutation UpdateNotificationPreference($category: String!, $isEnabled: Boolean, $isSseEnabled: Boolean, $isEmailEnabled: Boolean) {
  updateNotificationPreference(
    category: $category
    isEnabled: $isEnabled
    isSseEnabled: $isSseEnabled
    isEmailEnabled: $isEmailEnabled
  ) {
    category
    isEnabled
    isSseEnabled
    isEmailEnabled
  }
}
    `;
export type UpdateNotificationPreferenceMutationFn = Apollo.MutationFunction<UpdateNotificationPreferenceMutation, UpdateNotificationPreferenceMutationVariables>;

/**
 * __useUpdateNotificationPreferenceMutation__
 *
 * To run a mutation, you first call `useUpdateNotificationPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNotificationPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNotificationPreferenceMutation, { data, loading, error }] = useUpdateNotificationPreferenceMutation({
 *   variables: {
 *      category: // value for 'category'
 *      isEnabled: // value for 'isEnabled'
 *      isSseEnabled: // value for 'isSseEnabled'
 *      isEmailEnabled: // value for 'isEmailEnabled'
 *   },
 * });
 */
export function useUpdateNotificationPreferenceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNotificationPreferenceMutation, UpdateNotificationPreferenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNotificationPreferenceMutation, UpdateNotificationPreferenceMutationVariables>(UpdateNotificationPreferenceDocument, options);
      }
export type UpdateNotificationPreferenceMutationHookResult = ReturnType<typeof useUpdateNotificationPreferenceMutation>;
export type UpdateNotificationPreferenceMutationResult = Apollo.MutationResult<UpdateNotificationPreferenceMutation>;
export type UpdateNotificationPreferenceMutationOptions = Apollo.BaseMutationOptions<UpdateNotificationPreferenceMutation, UpdateNotificationPreferenceMutationVariables>;
export const ResetNotificationPreferencesDocument = gql`
    mutation ResetNotificationPreferences {
  resetNotificationPreferences {
    category
    isEnabled
    isSseEnabled
    isEmailEnabled
  }
}
    `;
export type ResetNotificationPreferencesMutationFn = Apollo.MutationFunction<ResetNotificationPreferencesMutation, ResetNotificationPreferencesMutationVariables>;

/**
 * __useResetNotificationPreferencesMutation__
 *
 * To run a mutation, you first call `useResetNotificationPreferencesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetNotificationPreferencesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetNotificationPreferencesMutation, { data, loading, error }] = useResetNotificationPreferencesMutation({
 *   variables: {
 *   },
 * });
 */
export function useResetNotificationPreferencesMutation(baseOptions?: Apollo.MutationHookOptions<ResetNotificationPreferencesMutation, ResetNotificationPreferencesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetNotificationPreferencesMutation, ResetNotificationPreferencesMutationVariables>(ResetNotificationPreferencesDocument, options);
      }
export type ResetNotificationPreferencesMutationHookResult = ReturnType<typeof useResetNotificationPreferencesMutation>;
export type ResetNotificationPreferencesMutationResult = Apollo.MutationResult<ResetNotificationPreferencesMutation>;
export type ResetNotificationPreferencesMutationOptions = Apollo.BaseMutationOptions<ResetNotificationPreferencesMutation, ResetNotificationPreferencesMutationVariables>;