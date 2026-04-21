import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Calendar,
    FileText,
    User,
    LogOut,
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
    UserCheck,
    Building2,
    MapPin,
    Hash,
    Sparkles,
    ShieldCheck,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/auth.store';
import { useAuth } from '../../features/auth/hooks';
import { useSidebar } from '../../contexts/SidebarContext';
import { useTenantBranding } from '../../hooks/useTenantBranding';
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
    { icon: BookOpen, label: 'Courses', path: '/student/courses' },
    { icon: GraduationCap, label: 'Grades', path: '/student/grades' },
    { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments' },
    { icon: Upload, label: 'Study Materials', path: '/student/materials' },
    { icon: ClipboardCheck, label: 'Attendance', path: '/student/attendance' },
    { icon: FileCheck, label: 'Exams & Results', path: '/student/exams' },
    { icon: User, label: 'Profile', path: '/student/profile' },
];

const facultySidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/faculty/dashboard' },
    { icon: BookOpen, label: 'My Courses', path: '/faculty/courses' },
    { icon: Users, label: 'Student List', path: '/faculty/students' },
    {
        icon: ClipboardCheck,
        label: 'Attendance',
        isDropdown: true,
        children: [
            { icon: ClipboardCheck, label: 'Attendance Management', path: '/faculty/attendance' },
            { icon: UserCheck, label: 'Mark Attendance', path: '/faculty/mark-attendance' },
        ]
    },
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
            { icon: Calendar, label: 'Timetable Assignment', path: '/hod/academic-management/timetable-assignment' },
            { icon: Users, label: 'Faculty Workload', path: '/hod/faculty-workload' },
            { icon: FileText, label: 'Curriculum Overview', path: '/hod/curriculum' },
            { icon: Calendar, label: 'Timetable Approval', path: '/hod/timetable-approval-review' },
            { icon: Sparkles, label: 'AI Copilot', path: '/hod/academic/ai-copilot' },
            { icon: ShieldCheck, label: 'Schedule Audit', path: '/hod/academic/schedule-audit' },
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
            { icon: LayoutDashboard, label: 'Exam Dashboard', path: '/hod/exams' },
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
            { icon: FileCheck, label: 'Faculty Leave Approval', path: '/hod/faculty-leave-approval' }
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

const adminSidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin/dashboard' },
    {
        icon: Users,
        label: 'Onboarding',
        isDropdown: true,
        children: [
            { icon: Users, label: 'Student Onboarding', path: '/admin/onboarding/students' },
            { icon: UserCheck, label: 'Faculty Onboarding', path: '/admin/onboarding/faculty' },
        ]
    },
    {
        icon: BookOpen,
        label: 'Academic Management',
        isDropdown: true,
        children: [
            { icon: MapPin, label: 'Departments', path: '/admin/academic/departments' },
            { icon: BookOpen, label: 'Courses', path: '/admin/academic/courses' },
            { icon: Hash, label: 'Sections', path: '/admin/academic/sections' },
            { icon: Calendar, label: 'Create Semester', path: '/admin/academic/semesters/create' },
        ]
    },
    {
        icon: Building2,
        label: 'Venue Management',
        isDropdown: true,
        children: [
            { icon: Building2, label: 'Buildings', path: '/admin/buildings' },
            { icon: MapPin, label: 'Venue', path: '/admin/venue-management' },
            { icon: ClipboardCheck, label: 'Assign Classrooms', path: '/admin/venue-assignment' },
        ]
    },
    {
        icon: Calendar,
        label: 'Timetable Management',
        isDropdown: true,
        children: [
            { icon: Calendar, label: 'View Section Timetable', path: '/admin/timetable/section' },
            { icon: Users, label: 'View Faculty Timetable', path: '/admin/timetable/faculty' },
            { icon: FileText, label: 'Create Timetable', path: '/admin/timetable/create' },
            { icon: Settings, label: 'Manage Entries', path: '/admin/timetable/manage' },
        ]
    },
];

/**
 * Sidebar branding text — fetches institution name from the tenant API.
 * Shows skeleton shimmer lines while loading.
 */
function SidebarBrandingText() {
    const { branding, loading } = useTenantBranding();

    if (loading) {
        return (
            <div className="flex flex-col min-w-0 gap-1">
                <span
                    className="h-3.5 w-24 rounded bg-[var(--color-border)] animate-pulse"
                    aria-hidden="true"
                />
                <span
                    className="h-3.5 w-16 rounded bg-[var(--color-border)] animate-pulse"
                    aria-hidden="true"
                />
            </div>
        );
    }

    // Split short_name into two lines if it has multiple words, otherwise show full name
    const displayName = branding?.short_name || 'CMS';
    const words = displayName.split(' ');
    const line1 = words.length > 1 ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : displayName;
    const line2 = words.length > 1 ? words.slice(Math.ceil(words.length / 2)).join(' ') : '';

    return (
        <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm leading-tight text-[var(--color-foreground)] truncate">
                {line1}
            </span>
            {line2 && (
                <span className="font-bold text-sm leading-tight text-[var(--color-foreground)] truncate">
                    {line2}
                </span>
            )}
        </div>
    );
}

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const { logout } = useAuth();
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
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
    } else if (user?.role?.code === 'ADMIN') {
        sidebarItems = adminSidebarItems;
    }

    const toggleDropdown = (label: string) => {
        if (!isCollapsed || isMobileOpen) {
            setOpenDropdowns(prev => ({
                ...prev,
                [label]: !prev[label]
            }));
        }
    };

    // Close mobile sidebar when navigating
    const handleNavClick = () => {
        if (isMobileOpen) setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

        <aside className={[
            // Base styles
            'h-screen bg-[var(--color-card)] border-r border-[var(--color-border)] flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-all duration-300',
            // Desktop width
            isCollapsed ? 'w-20' : 'w-64',
            // Mobile: hidden by default, visible when open (translate instead of display to keep transitions)
            'max-lg:w-72 max-lg:shadow-2xl',
            isMobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
        ].join(' ')}>
            {/* Logo Section */}
            <div className="p-4 lg:p-6 border-b border-[var(--color-border)] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white shrink-0">
                        <BookOpen size={20} />
                    </div>
                    {(!isCollapsed || isMobileOpen) && (
                        <SidebarBrandingText />
                    )}
                </div>
                {/* Desktop collapse toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex p-1 hover:bg-[var(--color-background-secondary)] rounded transition-colors shrink-0"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
                {/* Mobile close button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden p-1 hover:bg-[var(--color-background-secondary)] rounded transition-colors shrink-0"
                    aria-label="Close navigation"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item, index) => {
                    const Icon = item.icon;
                    // Show labels when not collapsed OR when mobile drawer is open
                    const showLabel = !isCollapsed || isMobileOpen;

                    // Check if this is a dropdown item
                    if ('isDropdown' in item && item.isDropdown && 'children' in item) {
                        const isOpen = openDropdowns[item.label];
                        const hasActiveChild = item.children?.some(child => location.pathname === child.path);

                        return (
                            <div key={item.label + index}>
                                <button
                                    onClick={() => toggleDropdown(item.label)}
                                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${hasActiveChild
                                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                                        : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-primary)]'
                                        }`}
                                    title={!showLabel ? item.label : ''}
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className="shrink-0" />
                                        {showLabel && <span className="truncate">{item.label}</span>}
                                    </div>
                                    {showLabel && (isOpen ? <ChevronDown size={16} className="shrink-0" /> : <ChevronRight size={16} className="shrink-0" />)}
                                </button>
                                {isOpen && item.children && showLabel && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        {item.children.map((child) => {
                                            const isActive = location.pathname === child.path;
                                            const ChildIcon = child.icon;
                                            return (
                                                <Link
                                                    key={child.path}
                                                    to={child.path}
                                                    onClick={handleNavClick}
                                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${isActive
                                                        ? 'bg-[var(--color-primary)] text-white'
                                                        : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-primary)]'
                                                        }`}
                                                >
                                                    <ChildIcon size={18} className="shrink-0" />
                                                    <span className="truncate">{child.label}</span>
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
                                onClick={handleNavClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${isActive
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-primary)]'
                                    }`}
                                title={!showLabel ? item.label : ''}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon size={20} className="shrink-0" />
                                {showLabel && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    }

                    return null;
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-[var(--color-border)] shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-error)] rounded-lg transition-colors min-h-[44px]"
                    title={!isCollapsed && !isMobileOpen ? 'Logout' : ''}
                    aria-label="Logout"
                >
                    <LogOut size={20} className="shrink-0" />
                    {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
                </button>
            </div>
        </aside>
        </>
    );
}