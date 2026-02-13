/**
 * Student Submissions Page
 * View all submitted assignments with grades
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmissions } from '../../features/assignments/hooks';
import { SubmissionCard } from '../../features/assignments/components/SubmissionCard';
import type { Submission } from '../../features/assignments/types';

export const MySubmissions: React.FC = () => {
  const navigate = useNavigate();
  const { loadMySubmissions, mySubmissions, gradedCount, loading } = useSubmissions();

  useEffect(() => {
    loadMySubmissions();
  }, [loadMySubmissions]);

  const handleViewSubmission = (submission: Submission) => {
    navigate(`/student/submissions/${submission.id}`);
  };

  const calculateAveragePercentage = () => {
    const gradedSubmissions = mySubmissions.filter((s) => s.grade);
    if (gradedSubmissions.length === 0) return 0;
    const total = gradedSubmissions.reduce((sum, s) => sum + (s.grade?.percentage || 0), 0);
    return (total / gradedSubmissions.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">My Submissions</h1>
          <p className="text-[var(--color-muted-foreground)]">Track your submitted assignments and grades</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">Total Submissions</h3>
            <p className="text-2xl font-bold text-[var(--color-foreground)]">{mySubmissions.length}</p>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">Graded</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{gradedCount}</p>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">Average Score</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{calculateAveragePercentage()}%</p>
          </div>
        </div>

        {/* Submissions Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-muted-foreground)]">Loading submissions...</p>
          </div>
        ) : mySubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-muted-foreground)]">No submissions yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mySubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onView={handleViewSubmission}
                variant="student"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
