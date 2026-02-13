/**
 * Assignment Management Custom Hooks
 * Encapsulates business logic and API calls
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  setLoading,
  setError,
  setAssignments,
  addAssignment,
  updateAssignment as updateAssignmentAction,
  removeAssignment,
  setSelectedAssignment,
  setSubmissions,
  setMySubmissions,
  updateSubmission as updateSubmissionAction,
  setPendingGrading,
  removePendingGrading,
  setStatistics,
  setFilters,
  resetFilters,
  selectAssignments,
  selectSelectedAssignment,
  selectSubmissions,
  selectMySubmissions,
  selectPendingGrading,
  selectStatistics,
  selectFilters,
  selectLoading,
  selectError,
  selectFilteredAssignments,
  selectOverdueAssignments,
  selectPendingSubmissionCount,
  selectGradedSubmissionsCount,
} from './slice';
import {
  fetchFacultyDashboard,
  fetchStudentDashboard,
  fetchFacultyAssignments,
  fetchStudentAssignments,
  fetchAssignmentDetails,
  fetchMySubmissions,
  fetchSubmissionDetails,
  fetchHODDashboard,
  createAssignment as createAssignmentApi,
  updateAssignment as updateAssignmentApi,
  publishAssignment as publishAssignmentApi,
  closeAssignment as closeAssignmentApi,
  deleteAssignment as deleteAssignmentApi,
  submitAssignment as submitAssignmentApi,
  gradeSubmission as gradeSubmissionApi,
  returnSubmission as returnSubmissionApi,
  uploadFile as uploadFileApi,
  fetchSubjects,
  fetchSections,
  fetchSemesters,
} from './api';
import type {
  CreateAssignmentInput,
  UpdateAssignmentInput,
  SubmitAssignmentInput,
  GradeAssignmentInput,
  ReturnSubmissionInput,
  AssignmentFilters,
} from './types';

/**
 * Main hook for assignment management
 */
export const useAssignments = () => {
  const dispatch = useDispatch<AppDispatch>();

  const assignments = useSelector(selectAssignments);
  const selectedAssignment = useSelector(selectSelectedAssignment);
  const filteredAssignments = useSelector(selectFilteredAssignments);
  const overdueAssignments = useSelector(selectOverdueAssignments);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  /**
   * Load faculty dashboard data
   */
  const loadFacultyDashboard = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await fetchFacultyDashboard();
      dispatch(setAssignments(data.myAssignments));
      dispatch(setPendingGrading(data.pendingGrading));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  /**
   * Load student dashboard data
   */
  const loadStudentDashboard = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await fetchStudentDashboard();
      dispatch(setAssignments(data.myAssignments));
      dispatch(setStatistics(data.studentAssignmentStatistics));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  /**
   * Load faculty assignments with filters
   */
  const loadFacultyAssignments = useCallback(
    async (subjectId?: number, status?: string) => {
      try {
        dispatch(setLoading(true));
        const data = await fetchFacultyAssignments(subjectId, status);
        dispatch(setAssignments(data));
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load assignments';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Load student assignments
   */
  const loadStudentAssignments = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await fetchStudentAssignments();
      dispatch(setAssignments(data.myAssignments));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load assignments';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  /**
   * Load assignment details with submissions
   */
  const loadAssignmentDetails = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        const data = await fetchAssignmentDetails(id);
        dispatch(setSelectedAssignment(data.assignment));
        if (data.assignmentSubmissions) {
          dispatch(setSubmissions(data.assignmentSubmissions));
        }
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load assignment';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Load HOD dashboard
   */
  const loadHODDashboard = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await fetchHODDashboard();
      dispatch(setAssignments(data));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  /**
   * Create a new assignment
   */
  const createAssignment = useCallback(
    async (input: CreateAssignmentInput) => {
      try {
        dispatch(setLoading(true));
        const assignment = await createAssignmentApi(input);
        dispatch(addAssignment(assignment));
        return assignment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create assignment';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Update an assignment
   */
  const updateAssignment = useCallback(
    async (input: UpdateAssignmentInput) => {
      try {
        dispatch(setLoading(true));
        const assignment = await updateAssignmentApi(input);
        dispatch(updateAssignmentAction(assignment));
        return assignment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update assignment';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Publish an assignment
   */
  const publishAssignment = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        const assignment = await publishAssignmentApi(id);
        dispatch(updateAssignmentAction(assignment));
        return assignment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to publish assignment';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Close an assignment
   */
  const closeAssignment = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        const assignment = await closeAssignmentApi(id);
        dispatch(updateAssignmentAction(assignment));
        return assignment;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to close assignment';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Delete an assignment
   */
  const deleteAssignmentById = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        const result = await deleteAssignmentApi(id);
        dispatch(removeAssignment(id));
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete assignment';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Update filters
   */
  const updateFilters = useCallback(
    (filters: AssignmentFilters) => {
      dispatch(setFilters(filters));
    },
    [dispatch]
  );

  /**
   * Reset filters
   */
  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  /**
   * Select an assignment
   */
  const selectAssignment = useCallback(
    (assignment: typeof selectedAssignment) => {
      dispatch(setSelectedAssignment(assignment));
    },
    [dispatch]
  );

  return {
    assignments,
    selectedAssignment,
    filteredAssignments,
    overdueAssignments,
    filters,
    loading,
    error,
    loadFacultyDashboard,
    loadStudentDashboard,
    loadFacultyAssignments,
    loadStudentAssignments,
    loadAssignmentDetails,
    loadHODDashboard,
    createAssignment,
    updateAssignment,
    publishAssignment,
    closeAssignment,
    deleteAssignment: deleteAssignmentById,
    updateFilters,
    clearFilters,
    selectAssignment,
  };
};

/**
 * Hook for submission management
 */
export const useSubmissions = () => {
  const dispatch = useDispatch<AppDispatch>();

  const submissions = useSelector(selectSubmissions);
  const mySubmissions = useSelector(selectMySubmissions);
  const gradedCount = useSelector(selectGradedSubmissionsCount);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  /**
   * Load student submissions
   */
  const loadMySubmissions = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await fetchMySubmissions();
      dispatch(setMySubmissions(data));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load submissions';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  /**
   * Load submission details
   */
  const loadSubmissionDetails = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        const data = await fetchSubmissionDetails(id);
        dispatch(setLoading(false));
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load submission';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Submit an assignment
   */
  const submitAssignment = useCallback(
    async (input: SubmitAssignmentInput) => {
      try {
        dispatch(setLoading(true));
        const result = await submitAssignmentApi(input);
        dispatch(setLoading(false));
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to submit assignment';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return {
    submissions,
    mySubmissions,
    gradedCount,
    loading,
    error,
    loadMySubmissions,
    loadSubmissionDetails,
    submitAssignment,
  };
};

/**
 * Hook for grading management
 */
export const useGrading = () => {
  const dispatch = useDispatch<AppDispatch>();

  const pendingGrading = useSelector(selectPendingGrading);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  /**
   * Grade a submission
   */
  const gradeSubmission = useCallback(
    async (input: GradeAssignmentInput) => {
      try {
        dispatch(setLoading(true));
        const result = await gradeSubmissionApi(input);
        
        // Update submission in state with grade
        const gradedSubmission = {
          id: input.submissionId,
          grade: result.grade,
        };
        dispatch(updateSubmissionAction(gradedSubmission as never));
        dispatch(removePendingGrading(input.submissionId));
        
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to grade submission';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Return submission for revision
   */
  const returnForRevision = useCallback(
    async (input: ReturnSubmissionInput) => {
      try {
        dispatch(setLoading(true));
        const result = await returnSubmissionApi(input);
        dispatch(updateSubmissionAction(result as never));
        dispatch(removePendingGrading(input.submissionId));
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to return submission';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return {
    pendingGrading,
    loading,
    error,
    gradeSubmission,
    returnForRevision,
  };
};

/**
 * Hook for file upload
 */
export const useFileUpload = () => {
  const dispatch = useDispatch<AppDispatch>();

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        dispatch(setLoading(true));
        const result = await uploadFileApi(file);
        dispatch(setLoading(false));
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return { uploadFile };
};

/**
 * Hook for dropdowns data
 */
export const useAssignmentDropdowns = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loadSubjects = useCallback(async () => {
    try {
      return await fetchSubjects();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subjects';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  const loadSections = useCallback(
    async (subjectId?: number) => {
      try {
        return await fetchSections(subjectId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load sections';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  const loadSemesters = useCallback(async () => {
    try {
      return await fetchSemesters();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load semesters';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  return {
    loadSubjects,
    loadSections,
    loadSemesters,
  };
};

/**
 * Hook for pending submission count (for dashboard badges)
 */
export const usePendingSubmissions = () => {
  const pendingCount = useSelector(selectPendingSubmissionCount);
  return { pendingCount };
};

/**
 * Hook for assignment statistics
 */
export const useAssignmentStatistics = () => {
  const statistics = useSelector(selectStatistics);
  return { statistics };
};
