import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Calendar,
    FileText,
    User,
    LogOut,
    Home,
    ClipboardCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Student Dashboard', path: '/student/dashboard' },
    { icon: Home, label: 'Overview', path: '/student/overview' },
    { icon: BookOpen, label: 'Courses', path: '/student/courses' },
    { icon: GraduationCap, label: 'Grades', path: '/student/grades' },
    { icon: Calendar, label: 'Schedule', path: '/student/schedule' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments' },
    { icon: ClipboardCheck, label: 'Attendance', path: '/student/attendance' },
    { icon: User, label: 'Profile', path: '/student/profile' },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-64 h-screen bg-white border-r border-[var(--color-border)] flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
            {/* Logo Section */}
            <div className="p-6 border-b border-[var(--color-border)] flex items-center gap-3">
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white">
                    <BookOpen size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm leading-tight text-[var(--color-foreground)]">UNIVERSITY OF</span>
                    <span className="font-bold text-sm leading-tight text-[var(--color-foreground)]">KNOWLEDGE</span>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-primary)]'
                                }`}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-[var(--color-border)]">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-error)] rounded-lg transition-colors">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
