/**
 * Assignment Management Redux Slice
 * Manages global state for assignments, submissions, and filters
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AssignmentState,
  Assignment,
  Submission,
  PendingGrading,
  StudentAssignmentStatistics,
  AssignmentFilters,
} from './types';
import type { RootState } from '../../store';

const initialState: AssignmentState = {
  assignments: [],
  selectedAssignment: null,
  submissions: [],
  mySubmissions: [],
  pendingGrading: [],
  statistics: null,
  filters: {
    status: 'ALL',
  },
  loading: false,
  error: null,
};

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Assignments
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
      state.loading = false;
      state.error = null;
    },

    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments.unshift(action.payload);
    },

    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const index = state.assignments.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
      if (state.selectedAssignment?.id === action.payload.id) {
        state.selectedAssignment = action.payload;
      }
    },

    removeAssignment: (state, action: PayloadAction<number>) => {
      state.assignments = state.assignments.filter((a) => a.id !== action.payload);
      if (state.selectedAssignment?.id === action.payload) {
        state.selectedAssignment = null;
      }
    },

    setSelectedAssignment: (state, action: PayloadAction<Assignment | null>) => {
      state.selectedAssignment = action.payload;
    },

    // Submissions
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload;
      state.loading = false;
      state.error = null;
    },

    setMySubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.mySubmissions = action.payload;
      state.loading = false;
      state.error = null;
    },

    updateSubmission: (state, action: PayloadAction<Submission>) => {
      const index = state.submissions.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.submissions[index] = action.payload;
      }

      const myIndex = state.mySubmissions.findIndex((s) => s.id === action.payload.id);
      if (myIndex !== -1) {
        state.mySubmissions[myIndex] = action.payload;
      }
    },

    // Pending grading
    setPendingGrading: (state, action: PayloadAction<PendingGrading[]>) => {
      state.pendingGrading = action.payload;
    },

    removePendingGrading: (state, action: PayloadAction<number>) => {
      state.pendingGrading = state.pendingGrading.filter(
        (p) => p.id !== action.payload
      );
    },

    // Statistics
    setStatistics: (state, action: PayloadAction<StudentAssignmentStatistics>) => {
      state.statistics = action.payload;
    },

    // Filters
    setFilters: (state, action: PayloadAction<AssignmentFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters: (state) => {
      state.filters = { status: 'ALL' };
    },

    // Reset state
    resetAssignments: () => initialState,
  },
});

// Actions
export const {
  setLoading,
  setError,
  clearError,
  setAssignments,
  addAssignment,
  updateAssignment,
  removeAssignment,
  setSelectedAssignment,
  setSubmissions,
  setMySubmissions,
  updateSubmission,
  setPendingGrading,
  removePendingGrading,
  setStatistics,
  setFilters,
  resetFilters,
  resetAssignments,
} = assignmentSlice.actions;

// Selectors
export const selectAssignments = (state: RootState) => state.assignments.assignments;
export const selectSelectedAssignment = (state: RootState) =>
  state.assignments.selectedAssignment;
export const selectSubmissions = (state: RootState) => state.assignments.submissions;
export const selectMySubmissions = (state: RootState) =>
  state.assignments.mySubmissions;
export const selectPendingGrading = (state: RootState) =>
  state.assignments.pendingGrading;
export const selectStatistics = (state: RootState) => state.assignments.statistics;
export const selectFilters = (state: RootState) => state.assignments.filters;
export const selectLoading = (state: RootState) => state.assignments.loading;
export const selectError = (state: RootState) => state.assignments.error;

// Filtered selectors
export const selectFilteredAssignments = (state: RootState) => {
  const { assignments, filters } = state.assignments;
  let filtered = assignments;

  if (filters.status && filters.status !== 'ALL') {
    filtered = filtered.filter((a) => a.status === filters.status);
  }

  if (filters.subjectId) {
    filtered = filtered.filter((a) => a.subjectId === filters.subjectId);
  }

  if (filters.sectionId) {
    filtered = filtered.filter((a) => a.sectionId === filters.sectionId);
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((a) => new Date(a.dueDate) >= new Date(filters.dateFrom!));
  }

  if (filters.dateTo) {
    filtered = filtered.filter((a) => new Date(a.dueDate) <= new Date(filters.dateTo!));
  }

  return filtered;
};

export const selectOverdueAssignments = (state: RootState) => {
  return state.assignments.assignments.filter((a) => a.isOverdue && a.canSubmit);
};

export const selectPendingSubmissionCount = (state: RootState) => {
  return state.assignments.assignments.filter(
    (a) => a.status === 'PUBLISHED' && a.canSubmit && !a.isOverdue
  ).length;
};

export const selectGradedSubmissionsCount = (state: RootState) => {
  return state.assignments.mySubmissions.filter((s) => s.grade).length;
};

export default assignmentSlice.reducer;
