/**
 * Create Assignment Page (Faculty)
 * Form for creating new assignments with all required fields
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssignments, useAssignmentDropdowns, useFileUpload } from '../../features/assignments/hooks';
import type { CreateAssignmentInput, AssignmentType, Subject, Section, Semester } from '../../features/assignments/types';

const ASSIGNMENT_TYPES: { value: AssignmentType; label: string }[] = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'GROUP', label: 'Group' },
  { value: 'LAB', label: 'Lab' },
  { value: 'PROJECT', label: 'Project' },
  { value: 'QUIZ', label: 'Quiz' },
];

export const CreateAssignment: React.FC = () => {
  const navigate = useNavigate();
  const { createAssignment, publishAssignment, loading, error } = useAssignments();
  const { loadSubjects, loadSections, loadSemesters } = useAssignmentDropdowns();
  const { uploadFile } = useFileUpload();

  // Form state
  const [formData, setFormData] = useState<Partial<CreateAssignmentInput>>({
    title: '',
    description: '',
    assignmentType: 'INDIVIDUAL',
    maxMarks: 100,
    weightage: 10,
    allowLateSubmission: false,
  });

  // Dropdown data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  // UI state
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isDraft, setIsDraft] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectsData, semestersData] = await Promise.all([
          loadSubjects(),
          loadSemesters(),
        ]);
        setSubjects(subjectsData);
        setSemesters(semestersData);
      } catch (err) {
        console.error('Failed to load dropdown data:', err);
      }
    };
    loadData();
  }, [loadSubjects, loadSemesters]);

  // Load sections when subject changes
  useEffect(() => {
    if (formData.subjectId) {
      loadSections(formData.subjectId)
        .then(setSections)
        .catch(console.error);
    } else {
      setTimeout(() => setSections([]), 0);
    }
  }, [formData.subjectId, loadSections]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value) || 0
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadError('Only PDF, DOC, DOCX, and ZIP files are allowed');
        return;
      }

      setFile(selectedFile);
      setUploadError('');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.subjectId) errors.subjectId = 'Subject is required';
    if (!formData.sectionId) errors.sectionId = 'Section is required';
    if (!formData.semesterId) errors.semesterId = 'Semester is required';
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.dueDate) errors.dueDate = 'Due date is required';
    if (!formData.maxMarks || formData.maxMarks <= 0) errors.maxMarks = 'Max marks must be greater than 0';
    if (!formData.weightage || formData.weightage <= 0 || formData.weightage > 100) {
      errors.weightage = 'Weightage must be between 1 and 100';
    }

    // Validate due date is in future
    if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
      errors.dueDate = 'Due date must be in the future';
    }

    // Validate late submission deadline
    if (formData.allowLateSubmission) {
      if (!formData.lateSubmissionDeadline) {
        errors.lateSubmissionDeadline = 'Late submission deadline is required';
      } else if (
        formData.dueDate &&
        new Date(formData.lateSubmissionDeadline) <= new Date(formData.dueDate)
      ) {
        errors.lateSubmissionDeadline = 'Late deadline must be after due date';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, shouldPublish = false) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsDraft(!shouldPublish);

      // Upload file if selected
      let attachmentUrl = formData.attachmentUrl;
      if (file) {
        setUploading(true);
        try {
          const uploadResult = await uploadFile(file);
          attachmentUrl = uploadResult.fileUrl;
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : 'Failed to upload file');
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      // Create assignment
      const input: CreateAssignmentInput = {
        subjectId: formData.subjectId!,
        sectionId: formData.sectionId!,
        semesterId: formData.semesterId!,
        title: formData.title!,
        description: formData.description!,
        assignmentType: formData.assignmentType!,
        dueDate: formData.dueDate!,
        maxMarks: formData.maxMarks!,
        weightage: formData.weightage!,
        allowLateSubmission: formData.allowLateSubmission!,
        lateSubmissionDeadline: formData.lateSubmissionDeadline,
        attachmentUrl,
      };

      const createdAssignment = await createAssignment(input);

      // Publish if requested
      if (shouldPublish) {
        await publishAssignment(createdAssignment.id);
      }

      // Navigate to assignment list
      navigate('/faculty/assignments');
    } catch (err) {
      console.error('Failed to create assignment:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
            Create New Assignment
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Fill in the details below to create a new assignment for your students.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-[var(--color-card)] rounded-lg shadow-md p-6">
          {/* Subject, Section, Semester */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="subjectId" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subjectId"
                name="subjectId"
                value={formData.subjectId || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  validationErrors.subjectId ? 'border-red-500' : 'border-[var(--color-border)]'
                } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
              {validationErrors.subjectId && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.subjectId}</p>
              )}
            </div>

            <div>
              <label htmlFor="sectionId" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Section <span className="text-red-500">*</span>
              </label>
              <select
                id="sectionId"
                name="sectionId"
                value={formData.sectionId || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  validationErrors.sectionId ? 'border-red-500' : 'border-[var(--color-border)]'
                } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
                required
                disabled={!formData.subjectId}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              {validationErrors.sectionId && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.sectionId}</p>
              )}
            </div>

            <div>
              <label htmlFor="semesterId" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                id="semesterId"
                name="semesterId"
                value={formData.semesterId || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  validationErrors.semesterId ? 'border-red-500' : 'border-[var(--color-border)]'
                } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
              {validationErrors.semesterId && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.semesterId}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                validationErrors.title ? 'border-red-500' : 'border-[var(--color-border)]'
              } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
              placeholder="e.g., Data Structures Assignment 1"
              required
            />
            {validationErrors.title && <p className="text-xs text-red-500 mt-1">{validationErrors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-3 py-2 border ${
                validationErrors.description ? 'border-red-500' : 'border-[var(--color-border)]'
              } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
              placeholder="Provide detailed instructions for the assignment..."
              required
            />
            {validationErrors.description && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.description}</p>
            )}
          </div>

          {/* Assignment Type and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="assignmentType" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Assignment Type
              </label>
              <select
                id="assignmentType"
                name="assignmentType"
                value={formData.assignmentType || 'INDIVIDUAL'}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {ASSIGNMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  validationErrors.dueDate ? 'border-red-500' : 'border-[var(--color-border)]'
                } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
                required
              />
              {validationErrors.dueDate && <p className="text-xs text-red-500 mt-1">{validationErrors.dueDate}</p>}
            </div>
          </div>

          {/* Max Marks and Weightage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="maxMarks" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Max Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="maxMarks"
                name="maxMarks"
                value={formData.maxMarks || ''}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border ${
                  validationErrors.maxMarks ? 'border-red-500' : 'border-[var(--color-border)]'
                } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
                required
              />
              {validationErrors.maxMarks && <p className="text-xs text-red-500 mt-1">{validationErrors.maxMarks}</p>}
            </div>

            <div>
              <label htmlFor="weightage" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                Weightage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="weightage"
                name="weightage"
                value={formData.weightage || ''}
                onChange={handleInputChange}
                min="1"
                max="100"
                className={`w-full px-3 py-2 border ${
                  validationErrors.weightage ? 'border-red-500' : 'border-[var(--color-border)]'
                } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
                required
              />
              {validationErrors.weightage && <p className="text-xs text-red-500 mt-1">{validationErrors.weightage}</p>}
            </div>
          </div>

          {/* Late Submission */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="allowLateSubmission"
                checked={formData.allowLateSubmission || false}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm font-medium text-[var(--color-foreground)]">Allow Late Submission</span>
            </label>

            {formData.allowLateSubmission && (
              <div className="mt-4">
                <label htmlFor="lateSubmissionDeadline" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                  Late Submission Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="lateSubmissionDeadline"
                  name="lateSubmissionDeadline"
                  value={formData.lateSubmissionDeadline || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    validationErrors.lateSubmissionDeadline ? 'border-red-500' : 'border-[var(--color-border)]'
                  } rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
                  required={formData.allowLateSubmission}
                />
                {validationErrors.lateSubmissionDeadline && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.lateSubmissionDeadline}</p>
                )}
              </div>
            )}
          </div>

          {/* File Attachment */}
          <div className="mb-6">
            <label htmlFor="attachment" className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
              Attachment (Optional)
            </label>
            <input
              type="file"
              id="attachment"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.zip"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
              Accepted formats: PDF, DOC, DOCX, ZIP (Max 10MB)
            </p>
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            {file && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Selected: {file.name}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => navigate('/faculty/assignments')}
              className="px-6 py-2 text-sm font-medium text-[var(--color-foreground)] bg-[var(--color-muted)] rounded-md hover:bg-[var(--color-muted)]/80 transition-colors"
              disabled={loading || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-[var(--color-foreground)] bg-[var(--color-muted)] rounded-md hover:bg-[var(--color-muted)]/80 transition-colors"
              disabled={loading || uploading}
            >
              {loading && isDraft ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="flex-1 px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={loading || uploading}
            >
              {uploading
                ? 'Uploading...'
                : loading && !isDraft
                ? 'Publishing...'
                : 'Save & Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
