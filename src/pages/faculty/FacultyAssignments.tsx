/**
 * Faculty Assignments List Page
 * Displays all assignments created by faculty with filters
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { useAssignments } from '../../features/assignments/hooks';
import { AssignmentCard } from '../../features/assignments/components/AssignmentCard';
import type { Assignment, AssignmentStatus } from '../../features/assignments/types';

export const FacultyAssignments: React.FC = () => {
  const navigate = useNavigate();
  const { loadFacultyAssignments, filteredAssignments, updateFilters, loading } = useAssignments();
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadFacultyAssignments();
  }, [loadFacultyAssignments]);

  const handleStatusFilterChange = (status: AssignmentStatus | 'ALL') => {
    setStatusFilter(status);
    updateFilters({ status });
  };

  const handleViewAssignment = (assignment: Assignment) => {
    navigate(`/faculty/assignments/${assignment.id}`);
  };

  const handleCreateNew = () => {
    navigate('/faculty/assignments/create');
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <div className="flex-1 ml-64 py-8 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">My Assignments</h1>
            <p className="text-[var(--color-muted-foreground)]">Manage your assignments and submissions</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:opacity-90 transition-opacity"
          >
            + Create Assignment
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[var(--color-card)] rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['ALL', 'DRAFT', 'PUBLISHED', 'CLOSED', 'GRADED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === status
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/80'
                }`}
              >
                {status}
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
            <p className="text-[var(--color-muted-foreground)] mb-4">No assignments found</p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:opacity-90 transition-opacity"
            >
              Create Your First Assignment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onView={handleViewAssignment}
                variant="faculty"
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default FacultyAssignments;
