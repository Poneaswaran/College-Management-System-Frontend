import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Calendar,
    FileText,
    User,
    LogOut,
    Home,
    ClipboardCheck,
    Users,
    Upload,
    Bell,
    FileCheck,
    BarChart3,
    Settings,
    Briefcase,
    TrendingUp,
    FolderCheck,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/auth.store';
import { useAuth } from '../../features/auth/hooks';
import { useSidebar } from '../../contexts/SidebarContext';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface MenuItem {
    icon: LucideIcon;
    label: string;
    path: string;
}

interface DropdownMenuItem {
    icon: LucideIcon;
    label: string;
    isDropdown: true;
    children: MenuItem[];
}

type SidebarItem = MenuItem | DropdownMenuItem;

const studentSidebarItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Student Dashboard', path: '/student/dashboard' },
    { icon: Home, label: 'Overview', path: '/student/overview' },
    { icon: BookOpen, label: 'Courses', path: '/student/courses' },
    { icon: GraduationCap, label: 'Grades', path: '/student/grades' },
    { icon: Calendar, label: 'Schedule', path: '/student/schedule' },
    { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments' },
    { icon: ClipboardCheck, label: 'Attendance', path: '/student/attendance' },
    { icon: User, label: 'Profile', path: '/student/profile' },
];

const facultySidebarItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/faculty/dashboard' },
    { icon: BookOpen, label: 'My Courses', path: '/faculty/courses' },
    { icon: Users, label: 'Student List', path: '/faculty/students' },
    { icon: ClipboardCheck, label: 'Attendance Management', path: '/faculty/attendance' },
    { icon: GraduationCap, label: 'Grade Submission', path: '/faculty/grades' },
    { icon: FileText, label: 'Assignments Management', path: '/faculty/assignments' },
    { icon: Upload, label: 'Study Materials Upload', path: '/faculty/materials' },
    { icon: FileCheck, label: 'Exam Management', path: '/faculty/exams' },
    { icon: Bell, label: 'Announcements', path: '/faculty/announcements' },
    { icon: Calendar, label: 'Leave Application', path: '/faculty/leave' },
    { icon: User, label: 'Profile', path: '/faculty/profile' },
];

const hodSidebarItems: SidebarItem[] = [
    {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/hod/dashboard'
    },
    {
        icon: BookOpen,
        label: 'Academic Management',
        isDropdown: true,
        children: [
            { icon: BookOpen, label: 'Department Courses', path: '/hod/courses' },
            { icon: Briefcase, label: 'Subject Allocation', path: '/hod/subject-allocation' },
            { icon: Users, label: 'Faculty Workload', path: '/hod/faculty-workload' },
            { icon: FileText, label: 'Curriculum Overview', path: '/hod/curriculum' },
            { icon: Calendar, label: 'Timetable Approval', path: '/hod/timetable-approval' },
        ]
    },
    {
        icon: Users,
        label: 'Faculty Management',
        isDropdown: true,
        children: [
            { icon: Users, label: 'Faculty List', path: '/hod/faculty-list' },
            { icon: TrendingUp, label: 'Performance Reports', path: '/hod/faculty-performance' },
            { icon: FileCheck, label: 'Leave Approvals', path: '/hod/leave-approvals' },
            { icon: BarChart3, label: 'Workload Distribution', path: '/hod/workload-distribution' },
        ]
    },
    {
        icon: GraduationCap,
        label: 'Student Management',
        isDropdown: true,
        children: [
            { icon: Users, label: 'Student List', path: '/hod/students' },
            { icon: ClipboardCheck, label: 'Attendance Reports', path: '/hod/attendance-reports' },
            { icon: TrendingUp, label: 'Performance Analytics', path: '/hod/student-performance' },
            { icon: FileText, label: 'Backlog / Arrear List', path: '/hod/arrears' },
            { icon: FileCheck, label: 'Student Grievances', path: '/hod/grievances' },
        ]
    },
    {
        icon: FileCheck,
        label: 'Examination Management',
        isDropdown: true,
        children: [
            { icon: Calendar, label: 'Exam Schedule Approval', path: '/hod/exam-schedule' },
            { icon: BarChart3, label: 'Result Analysis', path: '/hod/result-analysis' },
            { icon: TrendingUp, label: 'Pass/Fail Reports', path: '/hod/pass-fail-reports' },
            { icon: GraduationCap, label: 'Department Rank List', path: '/hod/rank-list' },
        ]
    },
    {
        icon: BarChart3,
        label: 'Reports & Analytics',
        isDropdown: true,
        children: [
            { icon: ClipboardCheck, label: 'Attendance Trends', path: '/hod/attendance-trends' },
            { icon: TrendingUp, label: 'Result Trends', path: '/hod/result-trends' },
            { icon: FileText, label: 'Subject Performance', path: '/hod/subject-performance' },
            { icon: Users, label: 'Faculty Performance', path: '/hod/faculty-performance-analytics' },
            { icon: BarChart3, label: 'Department Comparison', path: '/hod/department-comparison' },
        ]
    },
    {
        icon: Bell,
        label: 'Announcements',
        isDropdown: true,
        children: [
            { icon: Bell, label: 'Post Department Notices', path: '/hod/post-notices' },
            { icon: Bell, label: 'View College Notices', path: '/hod/view-notices' },
        ]
    },
    {
        icon: FolderCheck,
        label: 'Approvals',
        isDropdown: true,
        children: [
            { icon: FileCheck, label: 'Faculty Leave Approval', path: '/hod/faculty-leave-approval' },
            { icon: FileCheck, label: 'Event Approval', path: '/hod/event-approval' },
            { icon: FileCheck, label: 'Project Approval', path: '/hod/project-approval' },
            { icon: FileCheck, label: 'Timetable Approval', path: '/hod/timetable-approval-review' },
        ]
    },
    {
        icon: Settings,
        label: 'Settings',
        isDropdown: true,
        children: [
            { icon: User, label: 'Profile', path: '/hod/profile' },
            { icon: Settings, label: 'Department Settings', path: '/hod/department-settings' },
        ]
    },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const { logout } = useAuth();
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    const handleLogout = async () => {
        await logout();
        navigate('/auth/login');
    };

    // Determine which sidebar items to show based on role
    let sidebarItems: SidebarItem[] = studentSidebarItems;
    if (user?.role?.code === 'FACULTY') {
        sidebarItems = facultySidebarItems;
    } else if (user?.role?.code === 'HOD') {
        sidebarItems = hodSidebarItems;
    }

    const toggleDropdown = (label: string) => {
        if (!isCollapsed) {
            setOpenDropdowns(prev => ({
                ...prev,
                [label]: !prev[label]
            }));
        }
    };

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-white dark:bg-[var(--color-card)] border-r border-[var(--color-border)] flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-all duration-300`}>
            {/* Logo Section */}
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white">
                        <BookOpen size={20} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-sm leading-tight text-[var(--color-foreground)]">UNIVERSITY OF</span>
                            <span className="font-bold text-sm leading-tight text-[var(--color-foreground)]">KNOWLEDGE</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 hover:bg-[var(--color-background-secondary)] rounded transition-colors"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item, index) => {
                    const Icon = item.icon;

                    // Check if this is a dropdown item
                    if ('isDropdown' in item && item.isDropdown && 'children' in item) {
                        const isOpen = openDropdowns[item.label];
                        const hasActiveChild = item.children?.some(child => location.pathname === child.path);

                        return (
                            <div key={item.label + index}>
                                <button
                                    onClick={() => toggleDropdown(item.label)}
                                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${hasActiveChild
                                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                                        : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-primary)]'
                                        }`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} />
                                        {!isCollapsed && item.label}
                                    </div>
                                    {!isCollapsed && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                                </button>
                                {isOpen && item.children && !isCollapsed && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        {item.children.map((child) => {
                                            const isActive = location.pathname === child.path;
                                            const ChildIcon = child.icon;
                                            return (
                                                <Link
                                                    key={child.path}
                                                    to={child.path}
                                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                        ? 'bg-[var(--color-primary)] text-white'
                                                        : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-primary)]'
                                                        }`}
                                                >
                                                    <ChildIcon size={18} />
                                                    {child.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Regular menu item
                    if ('path' in item) {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-primary)]'
                                    }`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon size={20} />
                                {!isCollapsed && item.label}
                            </Link>
                        );
                    }

                    return null;
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-[var(--color-border)]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-error)] rounded-lg transition-colors"
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <LogOut size={20} />
                    {!isCollapsed && 'Logout'}
                </button>
            </div>
        </aside>
    );
}
