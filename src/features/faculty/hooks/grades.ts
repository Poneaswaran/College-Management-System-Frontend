import { useState, useCallback, useEffect } from 'react';
import {
    fetchFacultyGrades,
    fetchFacultyGradeDetail,
    saveGradesDraft,
    submitGrades,
} from '../api/grades';
import type {
    FacultyGradesData,
    FacultyGradeDetailData,
    GradeStatus,
    StudentGradeRecord,
    StudentGradeInput,
} from '../types/grades';

// ============================================
// useFacultyGrades — list/overview hook
// ============================================

interface UseFacultyGradesReturn {
    gradesData: FacultyGradesData | null;
    loading: boolean;
    error: string | null;
    loadGrades: (semesterId?: number) => Promise<void>;
    statusFilter: GradeStatus | 'ALL';
    setStatusFilter: (status: GradeStatus | 'ALL') => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const useFacultyGrades = (): UseFacultyGradesReturn => {
    const [gradesData, setGradesData] = useState<FacultyGradesData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<GradeStatus | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const loadGrades = useCallback(async (semesterId?: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFacultyGrades(semesterId);
            setGradesData(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load grades');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        gradesData,
        loading,
        error,
        loadGrades,
        statusFilter,
        setStatusFilter,
        searchTerm,
        setSearchTerm,
    };
};

// ============================================
// useFacultyGradeDetail — detail/edit hook
// ============================================

interface UseFacultyGradeDetailReturn {
    detailData: FacultyGradeDetailData | null;
    loading: boolean;
    error: string | null;
    saving: boolean;
    submitting: boolean;
    saveMessage: string | null;
    loadDetail: (courseSectionId: number) => Promise<void>;
    updateStudentMark: (studentId: string, field: 'internalMark' | 'externalMark', value: number | null) => void;
    toggleAbsent: (studentId: string) => void;
    handleSaveDraft: () => Promise<void>;
    handleSubmit: () => Promise<void>;
}

export const useFacultyGradeDetail = (courseSectionId: number): UseFacultyGradeDetailReturn => {
    const [detailData, setDetailData] = useState<FacultyGradeDetailData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const loadDetail = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFacultyGradeDetail(id);
            setDetailData(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load grade detail');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (courseSectionId) loadDetail(courseSectionId);
    }, [courseSectionId, loadDetail]);

    const updateStudentMark = useCallback((
        studentId: string,
        field: 'internalMark' | 'externalMark',
        value: number | null,
    ) => {
        setDetailData(prev => {
            if (!prev) return prev;
            const internalMax = prev.courseSection.internalMaxMark;
            const externalMax = prev.courseSection.externalMaxMark;
            const students = prev.students.map((s): StudentGradeRecord => {
                if (s.studentId !== studentId) return s;
                const updated = { ...s, [field]: value, isDirty: true };
                const internal = field === 'internalMark' ? value : s.internalMark;
                const external = field === 'externalMark' ? value : s.externalMark;
                const total = (internal ?? 0) + (external ?? 0);
                const pct = Math.round((total / (internalMax + externalMax)) * 100);
                return { ...updated, totalMark: total, percentage: pct };
            });
            return { ...prev, students };
        });
    }, []);

    const toggleAbsent = useCallback((studentId: string) => {
        setDetailData(prev => {
            if (!prev) return prev;
            const students = prev.students.map((s): StudentGradeRecord => {
                if (s.studentId !== studentId) return s;
                const isAbsent = !s.isAbsent;
                return {
                    ...s,
                    isAbsent,
                    internalMark: isAbsent ? null : s.internalMark,
                    externalMark: isAbsent ? null : s.externalMark,
                    totalMark: isAbsent ? null : s.totalMark,
                    percentage: isAbsent ? null : s.percentage,
                    letterGrade: isAbsent ? 'ABSENT' : s.letterGrade,
                    isDirty: true,
                };
            });
            return { ...prev, students };
        });
    }, []);

    const buildGradeInputs = (): StudentGradeInput[] => {
        if (!detailData) return [];
        return detailData.students.map(s => ({
            studentId: s.studentId,
            internalMark: s.isAbsent ? null : s.internalMark,
            externalMark: s.isAbsent ? null : s.externalMark,
            isAbsent: s.isAbsent,
        }));
    };

    const handleSaveDraft = useCallback(async () => {
        if (!detailData) return;
        setSaving(true);
        setSaveMessage(null);
        try {
            const result = await saveGradesDraft({
                courseSectionId,
                grades: buildGradeInputs(),
            });
            setSaveMessage(result.message);
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (err: unknown) {
            setSaveMessage(err instanceof Error ? err.message : 'Failed to save draft');
        } finally {
            setSaving(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailData, courseSectionId]);

    const handleSubmit = useCallback(async () => {
        if (!detailData) return;
        setSubmitting(true);
        setSaveMessage(null);
        try {
            const result = await submitGrades({
                courseSectionId,
                grades: buildGradeInputs(),
            });
            setSaveMessage(result.message);
            setDetailData(prev =>
                prev
                    ? { ...prev, courseSection: { ...prev.courseSection, status: result.status } }
                    : prev
            );
        } catch (err: unknown) {
            setSaveMessage(err instanceof Error ? err.message : 'Failed to submit grades');
        } finally {
            setSubmitting(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailData, courseSectionId]);

    return {
        detailData,
        loading,
        error,
        saving,
        submitting,
        saveMessage,
        loadDetail,
        updateStudentMark,
        toggleAbsent,
        handleSaveDraft,
        handleSubmit,
    };
};
