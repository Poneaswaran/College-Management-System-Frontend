import { useState, useCallback } from 'react';
import {
    fetchHODAttendanceReport,
    fetchHODStudentAttendanceDetail,
    fetchHODClassAttendanceDetail,
} from '../api/attendanceReports';
import type {
    HODAttendanceReportData,
    StudentAttendanceDetail,
    ClassAttendanceDetail,
    ViewMode,
    AttendanceRiskLevel,
    AttendanceReportQueryVars,
} from '../types/attendanceReports';

interface UseHODAttendanceReportsReturn {
    // Overview
    reportData: HODAttendanceReportData | null;
    loading: boolean;
    error: string | null;
    loadReport: (vars?: AttendanceReportQueryVars) => Promise<void>;

    // View mode toggle
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;

    // Filters
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    riskFilter: AttendanceRiskLevel | 'ALL';
    setRiskFilter: (v: AttendanceRiskLevel | 'ALL') => void;
    semesterFilter: number | null;
    setSemesterFilter: (v: number | null) => void;
    subjectFilter: number | null;
    setSubjectFilter: (v: number | null) => void;
    periodFilter: number | null;
    setPeriodFilter: (v: number | null) => void;

    // Drill-down: student
    studentDetail: StudentAttendanceDetail | null;
    studentDetailLoading: boolean;
    studentDetailError: string | null;
    loadStudentDetail: (studentId: number) => Promise<void>;
    clearStudentDetail: () => void;

    // Drill-down: class
    classDetail: ClassAttendanceDetail | null;
    classDetailLoading: boolean;
    classDetailError: string | null;
    loadClassDetail: (sectionId: number) => Promise<void>;
    clearClassDetail: () => void;
}

export const useHODAttendanceReports = (): UseHODAttendanceReportsReturn => {
    // Overview state
    const [reportData, setReportData] = useState<HODAttendanceReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // View mode
    const [viewMode, setViewMode] = useState<ViewMode>('STUDENTS');

    // Filters
    const [searchTerm, setSearchTerm]       = useState('');
    const [riskFilter, setRiskFilter]       = useState<AttendanceRiskLevel | 'ALL'>('ALL');
    const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
    const [subjectFilter, setSubjectFilter] = useState<number | null>(null);
    const [periodFilter, setPeriodFilter]   = useState<number | null>(null);

    // Student drill-down
    const [studentDetail, setStudentDetail]               = useState<StudentAttendanceDetail | null>(null);
    const [studentDetailLoading, setStudentDetailLoading] = useState(false);
    const [studentDetailError, setStudentDetailError]     = useState<string | null>(null);

    // Class drill-down
    const [classDetail, setClassDetail]             = useState<ClassAttendanceDetail | null>(null);
    const [classDetailLoading, setClassDetailLoading] = useState(false);
    const [classDetailError, setClassDetailError]   = useState<string | null>(null);

    // ─── Load overview ────────────────────────────────────────────────────────

    const loadReport = useCallback(async (vars: AttendanceReportQueryVars = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchHODAttendanceReport(vars);
            setReportData(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load attendance report');
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Load student detail ──────────────────────────────────────────────────

    const loadStudentDetail = useCallback(async (studentId: number) => {
        setStudentDetailLoading(true);
        setStudentDetailError(null);
        try {
            const data = await fetchHODStudentAttendanceDetail(
                studentId,
                semesterFilter ?? undefined,
            );
            setStudentDetail(data);
        } catch (err: unknown) {
            setStudentDetailError(err instanceof Error ? err.message : 'Failed to load student detail');
        } finally {
            setStudentDetailLoading(false);
        }
    }, [semesterFilter]);

    const clearStudentDetail = useCallback(() => {
        setStudentDetail(null);
        setStudentDetailError(null);
    }, []);

    // ─── Load class detail ────────────────────────────────────────────────────

    const loadClassDetail = useCallback(async (sectionId: number) => {
        setClassDetailLoading(true);
        setClassDetailError(null);
        try {
            const data = await fetchHODClassAttendanceDetail(
                sectionId,
                semesterFilter ?? undefined,
                subjectFilter ?? undefined,
            );
            setClassDetail(data);
        } catch (err: unknown) {
            setClassDetailError(err instanceof Error ? err.message : 'Failed to load class detail');
        } finally {
            setClassDetailLoading(false);
        }
    }, [semesterFilter, subjectFilter]);

    const clearClassDetail = useCallback(() => {
        setClassDetail(null);
        setClassDetailError(null);
    }, []);

    return {
        reportData,
        loading,
        error,
        loadReport,
        viewMode,
        setViewMode,
        searchTerm,
        setSearchTerm,
        riskFilter,
        setRiskFilter,
        semesterFilter,
        setSemesterFilter,
        subjectFilter,
        setSubjectFilter,
        periodFilter,
        setPeriodFilter,
        studentDetail,
        studentDetailLoading,
        studentDetailError,
        loadStudentDetail,
        clearStudentDetail,
        classDetail,
        classDetailLoading,
        classDetailError,
        loadClassDetail,
        clearClassDetail,
    };
};
