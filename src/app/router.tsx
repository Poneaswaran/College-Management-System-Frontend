import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load route components for code splitting
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const NotFound = lazy(() => import('../pages/not-found/NotFound'));
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const StudentAttendance = lazy(() => import('../pages/student/StudentAttendance'));
const MarkAttendance = lazy(() => import('../pages/student/MarkAttendance'));
const AttendanceHistory = lazy(() => import('../pages/student/AttendanceHistory'));

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
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/attendance" element={<StudentAttendance />} />
                <Route path="/student/mark-attendance" element={<MarkAttendance />} />
                <Route path="/student/attendance-history" element={<AttendanceHistory />} />
                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
