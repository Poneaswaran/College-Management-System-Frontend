import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import NotFound from '../pages/not-found/NotFound';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentAttendance from '../pages/student/StudentAttendance';
import MarkAttendance from '../pages/student/MarkAttendance';
import AttendanceHistory from '../pages/student/AttendanceHistory';

export function AppRouter() {
    return (
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
    );
}
