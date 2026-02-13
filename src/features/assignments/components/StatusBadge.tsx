/**
 * Status Badge Component
 * Color-coded badges for assignment and submission statuses
 */

import React from 'react';
import type { AssignmentStatus, SubmissionStatus } from '../types';

interface StatusBadgeProps {
  status: AssignmentStatus | SubmissionStatus | 'OVERDUE' | 'PENDING';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'DRAFT':
        return {
          bg: 'bg-[var(--color-muted)]',
          text: 'text-[var(--color-muted-foreground)]',
          label: 'Draft',
        };
      case 'PUBLISHED':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          label: 'Published',
        };
      case 'CLOSED':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-700 dark:text-orange-400',
          label: 'Closed',
        };
      case 'GRADED':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          label: 'Graded',
        };
      case 'SUBMITTED':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          label: 'Submitted',
        };
      case 'RETURNED':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-700 dark:text-yellow-400',
          label: 'Returned',
        };
      case 'RESUBMITTED':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-400',
          label: 'Resubmitted',
        };
      case 'OVERDUE':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          label: 'Overdue',
        };
      case 'PENDING':
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          text: 'text-gray-700 dark:text-gray-400',
          label: 'Pending',
        };
      default:
        return {
          bg: 'bg-[var(--color-muted)]',
          text: 'text-[var(--color-muted-foreground)]',
          label: status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  );
};
