import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Lazy load route components for code splitting
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const NotFound = lazy(() => import('../pages/not-found/NotFound'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const StudentOnboarding = lazy(() => import('../pages/admin/StudentOnboarding'));
const FacultyOnboarding = lazy(() => import('../pages/admin/FacultyOnboarding'));
const VenueManagement = lazy(() => import('../pages/admin/VenueManagement'));
const BuildingManagement = lazy(() => import('../pages/admin/BuildingManagement'));
const AssignedClassrooms = lazy(() => import('../pages/admin/AssignedClassrooms'));
const DepartmentManagement = lazy(() => import('../pages/admin/DepartmentManagement'));
const CourseManagement = lazy(() => import('../pages/admin/CourseManagement'));
const SectionManagement = lazy(() => import('../pages/admin/SectionManagement'));
const CreateSemester = lazy(() => import('../pages/admin/CreateSemester'));
const ViewSectionTimetable = lazy(() => import('../pages/admin/timetable/view-section'));
const ViewFacultyTimetable = lazy(() => import('../pages/admin/timetable/view-faculty'));
const CreateTimetable = lazy(() => import('../pages/admin/timetable/create'));
const ManageTimetable = lazy(() => import('../pages/admin/timetable/manage'));
const TimetableGrid = lazy(() => import('../pages/admin/timetable/grid'));
const IDCardManagement = lazy(() => import('../pages/admin/IDCardManagement'));
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
const FacultyAnnouncements = lazy(() => import('../pages/faculty/FacultyAnnouncements'));
const HODDashboard = lazy(() => import('../pages/hod/HODDashboard'));

// Assignment Management Pages - Faculty
const CreateAssignment = lazy(() => import('../pages/faculty/CreateAssignment'));
const FacultyAssignments = lazy(() => import('../pages/faculty/FacultyAssignments'));
const StudyMaterials = lazy(() => import('../pages/faculty/StudyMaterials'));

// Attendance & Leave Management Pages - Faculty
const AttendanceManagement = lazy(() => import('../pages/faculty/AttendanceManagement'));
const FacultyMarkAttendance = lazy(() => import('../pages/faculty/MarkAttendance'));
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
const HODCurriculum = lazy(() => import('../pages/hod/HODCurriculum'));
const HODFacultyList = lazy(() => import('../pages/hod/HODFacultyList'));
const HODStudentList = lazy(() => import('../pages/hod/HODStudentList'));
const HODGrievances = lazy(() => import('../pages/hod/HODGrievances'));
const HODTimetableAssignment = lazy(() => import('../pages/hod/AcademicManagement/TimetableAssignment'));
const HODTimeTableAICopilot = lazy(() => import('../pages/hod/AcademicManagement/AICopilot'));
const HODTimeTableScheduleAudit = lazy(() => import('../pages/hod/AcademicManagement/ScheduleAudit'));
const HODStudentPerformance = lazy(() => import('../pages/hod/HODStudentPerformance'));
const HODPostNotices = lazy(() => import('../pages/hod/HODPostNotices'));

// HOD Faculty Leave Approval
const HODFacultyLeaveApproval = lazy(() => import('../pages/hod/HODFacultyLeaveApproval'));
const LeavePolicyConfig = lazy(() => import('../pages/hod/LeavePolicyConfig'));
const HODLeaveSettings = lazy(() => import('../pages/hod/LeaveSettings'));
const HODTimetableApprovalReview = lazy(() => import('../pages/hod/HODTimetableApprovalReview'));

// HOD Profile
const HODProfile = lazy(() => import('../pages/hod/HODProfile'));
const HODArrears = lazy(() => import('../pages/hod/HODArrears'));

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
          <Route path="/faculty/announcements" element={<FacultyAnnouncements />} />
          <Route path="/faculty/assignments" element={<FacultyAssignments />} />
          <Route path="/faculty/assignments/create" element={<CreateAssignment />} />
          <Route path="/faculty/materials" element={<StudyMaterials />} />
          <Route path="/faculty/attendance" element={<AttendanceManagement />} />
          <Route path="/faculty/mark-attendance" element={<FacultyMarkAttendance />} />
          <Route path="/faculty/leave" element={<LeaveApplication />} />
          <Route path="/faculty/grades" element={<FacultyGrades />} />
          <Route path="/faculty/grades/:id" element={<FacultyGradeDetail />} />
          <Route path="/faculty/exams" element={<FacultyExams />} />
          <Route path="/faculty/profile" element={<FacultyProfile />} />
          <Route path="/hod/dashboard" element={<HODDashboard />} />
          <Route path="/hod/courses" element={<HODCourses />} />
          <Route path="/hod/curriculum" element={<HODCurriculum />} />
          <Route path="/hod/academic-management/timetable-assignment" element={<HODTimetableAssignment />} />
          <Route path="/hod/academic/ai-copilot" element={<HODTimeTableAICopilot />} />
          <Route path="/hod/academic/schedule-audit" element={<HODTimeTableScheduleAudit />} />
          <Route path="/hod/faculty-list" element={<HODFacultyList />} />
          <Route path="/hod/students" element={<HODStudentList />} />
          <Route path="/hod/grievances" element={<HODGrievances />} />
          <Route path="/hod/student-performance" element={<HODStudentPerformance />} />
          <Route path="/hod/assignments" element={<HODAssignments />} />
          <Route path="/hod/exams" element={<HODExams />} />
          <Route path="/hod/pass-fail-reports" element={<HODPassFailReports />} />
          <Route path="/hod/faculty-workload" element={<HODFacultyWorkload />} />
          <Route path="/hod/attendance-reports" element={<HODAttendanceReports />} />
          <Route path="/hod/post-notices" element={<HODPostNotices />} />
          <Route path="/hod/attendance-reports/:type/:id" element={<HODAttendanceReportDetail />} />
          <Route path="/hod/faculty-leave-approval" element={<HODFacultyLeaveApproval />} />
          <Route path="/hod/leave-policy-config" element={<LeavePolicyConfig />} />
          <Route path="/hod/leave-settings" element={<HODLeaveSettings />} />
          <Route path="/hod/timetable-approval-review" element={<HODTimetableApprovalReview />} />
          <Route path="/hod/profile" element={<HODProfile />} />
          <Route path="/hod/arrears" element={<HODArrears />} />
          <Route path="/hod/study-materials" element={<HODStudyMaterials />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
          
          {/* Admin Routes - Protected by ADMIN role */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/onboarding/students"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <StudentOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/onboarding/faculty"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <FacultyOnboarding />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/venue-management"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <VenueManagement />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/buildings"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <BuildingManagement />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/venue-assignment"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AssignedClassrooms />
              </ProtectedRoute>
            }
          />

          {/* Academic Management Routes */}
          <Route
            path="/admin/academic/departments"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DepartmentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/academic/courses"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/academic/sections"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <SectionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/academic/semesters/create"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CreateSemester />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timetable/section"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ViewSectionTimetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timetable/faculty"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ViewFacultyTimetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timetable/create"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CreateTimetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timetable/manage"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ManageTimetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timetable/grid"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <TimetableGrid />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/id-cards/:type"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <IDCardManagement />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
