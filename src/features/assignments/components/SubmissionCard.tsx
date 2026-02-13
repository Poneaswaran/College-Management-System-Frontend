/**
 * Submission Card Component
 * Displays submission information with grading details
 */

import React from 'react';
import type { Submission } from '../types';
import { StatusBadge } from './StatusBadge';
import { getMediaUrl } from '../../../lib/constants';

interface SubmissionCardProps {
  submission: Submission;
  onView?: (submission: Submission) => void;
  onGrade?: (submission: Submission) => void;
  showActions?: boolean;
  variant?: 'faculty' | 'student';
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  onView,
  onGrade,
  showActions = true,
  variant = 'student',
}) => {
  const submittedDate = new Date(submission.submittedAt);
  const formattedDate = submittedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {variant === 'faculty' && (
            <>
              <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-1">
                {submission.studentName}
              </h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {submission.studentRegisterNumber}
              </p>
            </>
          )}
          {variant === 'student' && 'assignmentTitle' in submission && (
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-1">
              {(submission as never)['assignmentTitle']}
            </h3>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={submission.status} />
          {submission.isLate && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
              Late Submission
            </span>
          )}
        </div>
      </div>

      {/* Submission details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted-foreground)]">Submitted:</span>
          <span className="font-medium text-[var(--color-foreground)]">{formattedDate}</span>
        </div>

        {submission.hasAttachment && (
          <div className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
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
            <span>File attached</span>
            {submission.attachmentUrl && (
              <a
                href={getMediaUrl(submission.attachmentUrl) || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline ml-1"
              >
                Download
              </a>
            )}
          </div>
        )}
      </div>

      {/* Grading information */}
      {submission.grade && (
        <div className="bg-[var(--color-muted)] rounded-lg p-3 mb-4">
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="text-center">
              <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Marks</p>
              <p className={`text-lg font-bold ${getGradeColor(submission.grade.percentage)}`}>
                {submission.grade.marksObtained}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Percentage</p>
              <p className={`text-lg font-bold ${getGradeColor(submission.grade.percentage)}`}>
                {submission.grade.percentage.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Grade</p>
              <p className={`text-lg font-bold ${getGradeColor(submission.grade.percentage)}`}>
                {submission.grade.gradeLetter}
              </p>
            </div>
          </div>

          {submission.grade.feedback && (
            <div className="pt-2 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Feedback:</p>
              <p className="text-sm text-[var(--color-foreground)]">{submission.grade.feedback}</p>
            </div>
          )}

          {submission.grade.gradedAt && (
            <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
              Graded on {new Date(submission.grade.gradedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Submission text preview */}
      {submission.submissionText && (
        <div className="mb-4">
          <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Submission:</p>
          <p className="text-sm text-[var(--color-foreground)] line-clamp-3">
            {submission.submissionText}
          </p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-3 border-t border-[var(--color-border)]">
          {onView && (
            <button
              onClick={() => onView(submission)}
              className="flex-1 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-md hover:bg-[var(--color-primary)]/20 transition-colors"
            >
              View Details
            </button>
          )}
          {onGrade && variant === 'faculty' && submission.status === 'SUBMITTED' && (
            <button
              onClick={() => onGrade(submission)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:opacity-90 transition-opacity"
            >
              Grade Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};
