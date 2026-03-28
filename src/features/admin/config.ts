import { Users, Building2, BookOpen, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Admin Sidebar Configuration
 * Defines the menu structure for the admin dashboard
 */

export interface AdminSidebarMenuItem {
  key: string;
  label: string;
  path?: string;
  icon?: LucideIcon;
  children?: AdminSidebarMenuItem[];
}

export interface AdminSidebarSection {
  key: string;
  label: string;
  icon: LucideIcon;
  children: AdminSidebarMenuItem[];
}

export const ADMIN_SIDEBAR_CONFIG: AdminSidebarSection[] = [
  {
    key: 'onboarding',
    label: 'Onboarding',
    icon: Users,
    children: [
      {
        key: 'student-onboarding',
        label: 'Student Onboarding',
        path: '/admin/onboarding/students'
      },
      {
        key: 'faculty-onboarding',
        label: 'Faculty Onboarding',
        path: '/admin/onboarding/faculty'
      }
    ]
  },
  {
    key: 'academic-management',
    label: 'Academic Management',
    icon: BookOpen,
    children: [
      {
        key: 'departments',
        label: 'Departments',
        path: '/admin/academic/departments'
      },
      {
        key: 'courses',
        label: 'Courses',
        path: '/admin/academic/courses'
      },
      {
        key: 'sections',
        label: 'Sections',
        path: '/admin/academic/sections'
      },
      {
        key: 'create-semester',
        label: 'Create Semester',
        path: '/admin/academic/semesters/create'
      }
    ]
  },
  {
    key: 'venue-management',
    label: 'Venue Management',
    icon: Building2,
    children: [
      {
        key: 'buildings',
        label: 'Buildings',
        path: '/admin/buildings'
      },
      {
        key: 'venue',
        label: 'Venue',
        path: '/admin/venue-management'
      },
      {
        key: 'venue-assignment',
        label: 'Assign Classrooms',
        path: '/admin/venue-assignment'
      }
    ]
  },
  {
    key: 'timetable-management',
    label: 'Timetable Management',
    icon: CalendarDays,
    children: [
      {
        key: 'timetable-view-section',
        label: 'View Section Timetable',
        path: '/admin/timetable/section'
      },
      {
        key: 'timetable-view-faculty',
        label: 'View Faculty Timetable',
        path: '/admin/timetable/faculty'
      },
      {
        key: 'timetable-create',
        label: 'Create Timetable',
        path: '/admin/timetable/create'
      },
      {
        key: 'timetable-manage',
        label: 'Manage Entries',
        path: '/admin/timetable/manage'
      }
    ]
  }
];

/**
 * Future sidebar sections (placeholder for scalability)
 * These can be uncommented and modified as per requirements
 */
/*
  {
    key: 'reports',
    label: 'Reports',
    icon: BarChart3,
    children: [
      { key: 'attendance-reports', label: 'Attendance Reports', path: '/admin/reports/attendance' },
      { key: 'academic-reports', label: 'Academic Reports', path: '/admin/reports/academic' }
    ]
  },
  {
    key: 'system',
    label: 'System Management',
    icon: Settings,
    children: [
      { key: 'users', label: 'Users & Roles', path: '/admin/system/users' },
      { key: 'audit', label: 'Audit Logs', path: '/admin/system/audit' }
    ]
  }
*/
