import { useState, useEffect, useCallback } from 'react';
import type { StudyMaterial, TeachingAssignment, MaterialStats, UploadMaterialInput, UpdateMaterialInput } from '../types/studyMaterials';
import {
    fetchMyMaterials,
    fetchTeachingAssignments,
    fetchMaterialStats,
    uploadMaterial,
    updateMaterial,
    deleteMaterial,
    fetchStudentMaterials,
    fetchAllMaterials,
    recordMaterialView,
    recordMaterialDownload,
} from '../api/studyMaterials';
import type { HODMaterialFilters } from '../api/studyMaterials';

// ============================================
// Faculty hook
// ============================================

export function useFacultyMaterials() {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal / UI state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
    const [stats, setStats] = useState<MaterialStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [materialsData, assignmentsData] = await Promise.all([
                fetchMyMaterials(),
                fetchTeachingAssignments(),
            ]);
            setMaterials(materialsData);
            setAssignments(assignmentsData);
        } catch {
            setError('Failed to load study materials. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const filteredMaterials = materials.filter((m) => {
        if (statusFilter && m.status !== statusFilter) return false;
        if (typeFilter && m.materialType !== typeFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                m.title.toLowerCase().includes(q) ||
                m.subject.name.toLowerCase().includes(q) ||
                m.subject.code.toLowerCase().includes(q) ||
                m.section.name.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleUpload = async (input: UploadMaterialInput): Promise<boolean> => {
        const result = await uploadMaterial(input);
        if (result.success) {
            await loadData();
            setShowUploadModal(false);
        }
        return result.success;
    };

    const handleUpdate = async (input: UpdateMaterialInput): Promise<boolean> => {
        const result = await updateMaterial(input);
        if (result.success) {
            await loadData();
            setShowEditModal(false);
            setSelectedMaterial(null);
        }
        return result.success;
    };

    const handleDelete = async (materialId: number): Promise<boolean> => {
        const result = await deleteMaterial(materialId);
        if (result.success) {
            setMaterials((prev) => prev.filter((m) => m.id !== materialId));
            setDeleteConfirmId(null);
        }
        return result.success;
    };

    const openStatsModal = async (material: StudyMaterial) => {
        setSelectedMaterial(material);
        setShowStatsModal(true);
        setStatsLoading(true);
        try {
            const data = await fetchMaterialStats(material.id);
            setStats(data);
        } finally {
            setStatsLoading(false);
        }
    };

    const openEditModal = (material: StudyMaterial) => {
        setSelectedMaterial(material);
        setShowEditModal(true);
    };

    const closeModals = () => {
        setShowUploadModal(false);
        setShowEditModal(false);
        setShowStatsModal(false);
        setSelectedMaterial(null);
        setStats(null);
        setDeleteConfirmId(null);
    };

    return {
        materials: filteredMaterials,
        allMaterials: materials,
        assignments,
        loading,
        error,
        refresh: loadData,
        // Modal state
        showUploadModal,
        showEditModal,
        showStatsModal,
        selectedMaterial,
        stats,
        statsLoading,
        deleteConfirmId,
        setShowUploadModal,
        setShowEditModal,
        setDeleteConfirmId,
        closeModals,
        // Filters
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        searchQuery,
        setSearchQuery,
        // Actions
        handleUpload,
        handleUpdate,
        handleDelete,
        openStatsModal,
        openEditModal,
    };
}

// ============================================
// Student hook
// ============================================

export function useStudentMaterials() {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subjectFilter, setSubjectFilter] = useState<string>('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchStudentMaterials();
            setMaterials(data);
        } catch {
            setError('Failed to load materials. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const filteredMaterials = materials.filter((m) => {
        if (subjectFilter && String(m.subject.id) !== subjectFilter) return false;
        if (typeFilter && m.materialType !== typeFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                m.title.toLowerCase().includes(q) ||
                m.subject.name.toLowerCase().includes(q) ||
                m.faculty?.fullName?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleViewMaterial = async (material: StudyMaterial) => {
        setSelectedMaterial(material);
        await recordMaterialView(material.id);
    };

    const handleDownload = async (material: StudyMaterial) => {
        await recordMaterialDownload(material.id);
        if (material.fileUrl && material.fileUrl !== '#') {
            window.open(material.fileUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // Build unique subjects list for filter dropdown
    const uniqueSubjects = materials
        .map((m) => m.subject)
        .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

    return {
        materials: filteredMaterials,
        loading,
        error,
        refresh: loadData,
        subjectFilter,
        setSubjectFilter,
        typeFilter,
        setTypeFilter,
        searchQuery,
        setSearchQuery,
        selectedMaterial,
        setSelectedMaterial,
        uniqueSubjects,
        handleViewMaterial,
        handleDownload,
    };
}

// ============================================
// HOD hook
// ============================================

export function useHODMaterials() {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<MaterialStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
    const [showStatsModal, setShowStatsModal] = useState(false);

    const [filters, setFilters] = useState<HODMaterialFilters>({});
    const [searchQuery, setSearchQuery] = useState<string>('');

    const loadData = useCallback(async (f: HODMaterialFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllMaterials(f);
            setMaterials(data);
        } catch {
            setError('Failed to load department materials. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData(filters);
    }, [loadData, filters]);

    const filteredMaterials = searchQuery
        ? materials.filter((m) => {
            const q = searchQuery.toLowerCase();
            return (
                m.title.toLowerCase().includes(q) ||
                m.subject.name.toLowerCase().includes(q) ||
                m.faculty?.fullName?.toLowerCase().includes(q) ||
                m.section.name.toLowerCase().includes(q)
            );
        })
        : materials;

    const applyFilter = (key: keyof HODMaterialFilters, value: string | number | undefined) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const openStatsModal = async (material: StudyMaterial) => {
        setSelectedMaterial(material);
        setShowStatsModal(true);
        setStatsLoading(true);
        try {
            const data = await fetchMaterialStats(material.id);
            setStats(data);
        } finally {
            setStatsLoading(false);
        }
    };

    // Summary aggregations
    const summaryStats = {
        total: materials.length,
        published: materials.filter((m) => m.status === 'PUBLISHED').length,
        thisMonth: materials.filter((m) => {
            const d = new Date(m.uploadedAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length,
        mostDownloaded: materials.reduce((max, m) => (m.downloadCount > max ? m.downloadCount : max), 0),
    };

    // Unique subjects / sections from materials
    const uniqueSubjects = materials
        .map((m) => m.subject)
        .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

    const uniqueSections = materials
        .map((m) => m.section)
        .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

    return {
        materials: filteredMaterials,
        loading,
        error,
        refresh: () => loadData(filters),
        filters,
        applyFilter,
        searchQuery,
        setSearchQuery,
        summaryStats,
        uniqueSubjects,
        uniqueSections,
        selectedMaterial,
        stats,
        statsLoading,
        showStatsModal,
        setShowStatsModal,
        openStatsModal,
    };
}
