/**
 * Assignment Card Component
 * Reusable card for displaying assignment information
 */

import React from 'react';
import type { Assignment } from '../types';
import { StatusBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';

interface AssignmentCardProps {
  assignment: Assignment;
  onView?: (assignment: Assignment) => void;
  onSubmit?: (assignment: Assignment) => void;
  showActions?: boolean;
  variant?: 'faculty' | 'student';
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onView,
  onSubmit,
  showActions = true,
  variant = 'student',
}) => {
  const dueDate = new Date(assignment.dueDate);
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusForBadge = () => {
    if (assignment.isOverdue && variant === 'student') return 'OVERDUE';
    return assignment.status;
  };

  // Handle both nested subject and legacy subjectName
  const subjectName = assignment.subject?.name || assignment.subjectName || '';
  const sectionName = assignment.sectionName || '';
  const facultyName = assignment.facultyName || '';

  return (
    <div
      className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 hover:shadow-md transition-shadow ${
        assignment.isOverdue && variant === 'student' ? 'border-red-500' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-1">
            {assignment.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
            <span>{subjectName}</span>
            {variant === 'faculty' && sectionName && (
              <>
                <span>•</span>
                <span>{sectionName}</span>
              </>
            )}
            {variant === 'student' && facultyName && (
              <>
                <span>•</span>
                <span>{facultyName}</span>
              </>
            )}
          </div>
        </div>
        <StatusBadge status={getStatusForBadge()} />
      </div>

      {/* Description (truncated) */}
      {assignment.description && (
        <p className="text-sm text-[var(--color-muted-foreground)] mb-3 line-clamp-2">
          {assignment.description}
        </p>
      )}

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted-foreground)]">Due Date:</span>
          <span className="font-medium text-[var(--color-foreground)]">{formattedDate}</span>
        </div>

        {!assignment.isOverdue && assignment.status === 'PUBLISHED' && (
          <CountdownTimer dueDate={assignment.dueDate} isOverdue={assignment.isOverdue} />
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted-foreground)]">Max Marks:</span>
          <span className="font-medium text-[var(--color-foreground)]">
            {assignment.maxMarks}
          </span>
        </div>

        {assignment.weightage && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">Weightage:</span>
            <span className="font-medium text-[var(--color-foreground)]">
              {assignment.weightage}%
            </span>
          </div>
        )}

        {variant === 'faculty' && assignment.statistics && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">Submissions:</span>
            <span className="font-medium text-[var(--color-foreground)]">
              {assignment.statistics.totalSubmissions} / {assignment.statistics.totalStudents} (
              {assignment.statistics.submissionPercentage.toFixed(0)}%)
            </span>
          </div>
        )}

        {variant === 'faculty' && assignment.statistics && assignment.statistics.pendingGrading > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-600 dark:text-red-400">Pending Grading:</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              {assignment.statistics.pendingGrading}
            </span>
          </div>
        )}
      </div>

      {/* Attachment indicator */}
      {assignment.attachmentUrl && (
        <div className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)] mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          <span>Attachment available</span>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-3 border-t border-[var(--color-border)]">
          {onView && (
            <button
              onClick={() => onView(assignment)}
              className="flex-1 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-md hover:bg-[var(--color-primary)]/20 transition-colors"
            >
              View Details
            </button>
          )}
          {onSubmit && variant === 'student' && assignment.canSubmit && (
            <button
              onClick={() => onSubmit(assignment)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:opacity-90 transition-opacity"
            >
              {assignment.isOverdue ? 'Submit Late' : 'Submit Now'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
