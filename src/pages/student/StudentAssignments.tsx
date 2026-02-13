/**
 * Student Assignments Page
 * View all available assignments and submit work
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAssignments } from '../../features/assignments/hooks';
import { AssignmentCard } from '../../features/assignments/components/AssignmentCard';
import type { Assignment } from '../../features/assignments/types';

export const StudentAssignments: React.FC = () => {
  const navigate = useNavigate();
  const { loadStudentAssignments, assignments, overdueAssignments, loading } = useAssignments();
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    loadStudentAssignments();
  }, [loadStudentAssignments]);

  const handleViewAssignment = (assignment: Assignment) => {
    navigate(`/student/assignments/${assignment.id}`);
  };

  const handleSubmitAssignment = (assignment: Assignment) => {
    navigate(`/student/assignments/${assignment.id}/submit`);
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'overdue') return a.isOverdue;
    if (filter === 'pending') return a.canSubmit && !a.isOverdue;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <div className="flex-1 ml-64 py-8 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">Assignments</h1>
          <p className="text-[var(--color-muted-foreground)]">View and submit your assignments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">Total Assignments</h3>
            <p className="text-2xl font-bold text-[var(--color-foreground)]">{assignments.length}</p>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">Pending</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {assignments.filter((a) => a.canSubmit && !a.isOverdue).length}
            </p>
          </div>
          <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4">
            <h3 className="text-sm text-[var(--color-muted-foreground)] mb-1">Overdue</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueAssignments.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'pending', 'overdue'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                  filter === f
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/80'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-muted-foreground)]">Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-muted-foreground)]">No assignments found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onView={handleViewAssignment}
                onSubmit={handleSubmitAssignment}
                variant="student"
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments;
