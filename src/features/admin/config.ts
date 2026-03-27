import { Users } from 'lucide-react';
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
