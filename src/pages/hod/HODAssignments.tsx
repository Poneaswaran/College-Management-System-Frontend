/**
 * HOD Assignments Dashboard
 * View all department assignments and analytics
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssignments } from '../../features/assignments/hooks';
import { AssignmentCard } from '../../features/assignments/components/AssignmentCard';
import type { Assignment } from '../../features/assignments/types';

export const HODAssignments: React.FC = () => {
  const navigate = useNavigate();
  const { loadHODDashboard, assignments, loading } = useAssignments();

  useEffect(() => {
    loadHODDashboard();
  }, [loadHODDashboard]);

  const handleViewAssignment = (assignment: Assignment) => {
    navigate(`/hod/assignments/${assignment.id}`);
  };

  const calculateDepartmentStats = () => {
    const totalAssignments = assignments.length;
    const totalSubmissions = assignments.reduce(
      (sum, a) => sum + (a.statistics?.totalSubmissions || 0),
      0
    );
    const averageSubmissionRate =
      assignments.length > 0
        ? (
            assignments.reduce((sum, a) => sum + (a.statistics?.submissionPercentage || 0), 0) /
            assignments.length
          ).toFixed(1)
        : 0;

    return { totalAssignments, totalSubmissions, averageSubmissionRate };
  };

  const stats = calculateDepartmentStats();

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
            Department Assignments
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Monitor all assignments and faculty performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">Total Assignments</h3>
            <p className="text-2xl font-bold text-[var(--color-foreground)]">{stats.totalAssignments}</p>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">Total Submissions</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalSubmissions}
            </p>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">
              Avg Submission Rate
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.averageSubmissionRate}%
            </p>
          </div>
        </div>

        {/* Assignments Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-muted-foreground)]">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-muted-foreground)]">No assignments found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onView={handleViewAssignment}
                variant="faculty"
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HODAssignments;
