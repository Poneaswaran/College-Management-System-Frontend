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
const HODDashboard = lazy(() => import('../pages/hod/HODDashboard'));

// Assignment Management Pages - Faculty
const CreateAssignment = lazy(() => import('../pages/faculty/CreateAssignment'));
const FacultyAssignments = lazy(() => import('../pages/faculty/FacultyAssignments'));
const StudyMaterials = lazy(() => import('../pages/faculty/StudyMaterials'));

// Attendance Management Pages - Faculty
const AttendanceManagement = lazy(() => import('../pages/faculty/AttendanceManagement'));

// Assignment Management Pages - Student
const StudentAssignments = lazy(() => import('../pages/student/StudentAssignments'));
const MySubmissions = lazy(() => import('../pages/student/MySubmissions'));

// Assignment Management Pages - HOD
const HODAssignments = lazy(() => import('../pages/hod/HODAssignments'));

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
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/courses" element={<FacultyCourses />} />
          <Route path="/faculty/students" element={<StudentList />} />
          <Route path="/faculty/assignments" element={<FacultyAssignments />} />
          <Route path="/faculty/assignments/create" element={<CreateAssignment />} />
          <Route path="/faculty/materials" element={<StudyMaterials />} />
          <Route path="/faculty/attendance" element={<AttendanceManagement />} />
          <Route path="/hod/dashboard" element={<HODDashboard />} />
          <Route path="/hod/assignments" element={<HODAssignments />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
