import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Lazy load route components for code splitting
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const NotFound = lazy(() => import('../pages/not-found/NotFound'));
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const StudentAttendance = lazy(() => import('../pages/student/StudentAttendance'));
const MarkAttendance = lazy(() => import('../pages/student/MarkAttendance'));
const AttendanceHistory = lazy(() => import('../pages/student/AttendanceHistory'));
const StudentProfile = lazy(() => import('../pages/student/StudentProfile'));
const Timetable = lazy(() => import('../pages/student/Timetable'));
const StudentCourses = lazy(() => import('../pages/student/StudentCourses'));
const Grades = lazy(() => import('../pages/student/Grades'));
const FacultyDashboard = lazy(() => import('../pages/faculty/FacultyDashboard'));
const FacultyCourses = lazy(() => import('../pages/faculty/FacultyCourses'));
const StudentList = lazy(() => import('../pages/faculty/StudentList'));
const FacultyProfile = lazy(() => import('../pages/faculty/FacultyProfile'));
const HODDashboard = lazy(() => import('../pages/hod/HODDashboard'));

// Assignment Management Pages - Faculty
const CreateAssignment = lazy(() => import('../pages/faculty/CreateAssignment'));
const FacultyAssignments = lazy(() => import('../pages/faculty/FacultyAssignments'));
const StudyMaterials = lazy(() => import('../pages/faculty/StudyMaterials'));

// Attendance & Leave Management Pages - Faculty
const AttendanceManagement = lazy(() => import('../pages/faculty/AttendanceManagement'));
const LeaveApplication = lazy(() => import('../pages/faculty/LeaveApplication'));

// Grade Submission - Faculty
const FacultyGrades = lazy(() => import('../pages/faculty/FacultyGrades'));
const FacultyGradeDetail = lazy(() => import('../pages/faculty/FacultyGradeDetail'));

// Assignment Management Pages - Student
const StudentAssignments = lazy(() => import('../pages/student/StudentAssignments'));
const MySubmissions = lazy(() => import('../pages/student/MySubmissions'));

// Assignment Management Pages - HOD
const HODAssignments = lazy(() => import('../pages/hod/HODAssignments'));

// HOD Faculty Workload
const HODFacultyWorkload = lazy(() => import('../pages/hod/HODFacultyWorkload'));

// HOD Attendance Reports
const HODAttendanceReports = lazy(() => import('../pages/hod/HODAttendanceReports'));
const HODAttendanceReportDetail = lazy(() => import('../pages/hod/HODAttendanceReportDetail'));

// HOD Courses
const HODCourses = lazy(() => import('../pages/hod/HODCourses'));

// HOD Faculty Leave Approval
const HODFacultyLeaveApproval = lazy(() => import('../pages/hod/HODFacultyLeaveApproval'));

// HOD Profile
const HODProfile = lazy(() => import('../pages/hod/HODProfile'));

// Study Materials - Student & HOD
const StudentMaterials = lazy(() => import('../pages/student/StudentMaterials'));
const HODStudyMaterials = lazy(() => import('../pages/hod/HODStudyMaterials'));

// Exam Management Pages
const StudentExams = lazy(() => import('../pages/student/StudentExams'));
const FacultyExams = lazy(() => import('../pages/faculty/FacultyExams'));
const HODExams = lazy(() => import('../pages/hod/HODExams'));
const HODPassFailReports = lazy(() => import('../pages/hod/HODPassFailReports'));

// Notification Settings
const NotificationSettingsPage = lazy(() => import('../pages/settings/NotificationSettingsPage'));

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#2563eb'
  }}>
    Loading...
  </div>
);

export function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/mark-attendance" element={<MarkAttendance />} />
          <Route path="/student/attendance-history" element={<AttendanceHistory />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/timetable" element={<Timetable />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/grades" element={<Grades />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/submissions" element={<MySubmissions />} />
          <Route path="/student/exams" element={<StudentExams />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/courses" element={<FacultyCourses />} />
          <Route path="/faculty/students" element={<StudentList />} />
          <Route path="/faculty/assignments" element={<FacultyAssignments />} />
          <Route path="/faculty/assignments/create" element={<CreateAssignment />} />
          <Route path="/faculty/materials" element={<StudyMaterials />} />
          <Route path="/faculty/attendance" element={<AttendanceManagement />} />
          <Route path="/faculty/leave" element={<LeaveApplication />} />
          <Route path="/faculty/grades" element={<FacultyGrades />} />
          <Route path="/faculty/grades/:id" element={<FacultyGradeDetail />} />
          <Route path="/faculty/exams" element={<FacultyExams />} />
          <Route path="/faculty/profile" element={<FacultyProfile />} />
          <Route path="/hod/dashboard" element={<HODDashboard />} />
          <Route path="/hod/courses" element={<HODCourses />} />
          <Route path="/hod/assignments" element={<HODAssignments />} />
          <Route path="/hod/exams" element={<HODExams />} />
          <Route path="/hod/pass-fail-reports" element={<HODPassFailReports />} />
          <Route path="/hod/faculty-workload" element={<HODFacultyWorkload />} />
          <Route path="/hod/attendance-reports" element={<HODAttendanceReports />} />
          <Route path="/hod/attendance-reports/:type/:id" element={<HODAttendanceReportDetail />} />
          <Route path="/hod/faculty-leave-approval" element={<HODFacultyLeaveApproval />} />
          <Route path="/hod/profile" element={<HODProfile />} />
          <Route path="/hod/study-materials" element={<HODStudyMaterials />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
