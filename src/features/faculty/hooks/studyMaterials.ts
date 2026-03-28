import { useState, useEffect, useCallback } from 'react';
import type { AiTutorResponse, StudyMaterial, TeachingAssignment, MaterialStats, UploadMaterialInput, UpdateMaterialInput } from '../types/studyMaterials';
import {
    askAiTutor,
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

    const hydrateMaterialRefs = useCallback((items: StudyMaterial[], teachingAssignments: TeachingAssignment[]): StudyMaterial[] => {
        return items.map((material) => {
            if (material.subject.name && material.subject.code && material.section.name) {
                return material;
            }

            const matchedAssignment = teachingAssignments.find(
                (assignment) => assignment.subjectId === material.subject.id && assignment.sectionId === material.section.id,
            );

            if (!matchedAssignment) {
                return material;
            }

            return {
                ...material,
                subject: {
                    id: material.subject.id,
                    name: material.subject.name || matchedAssignment.subjectName,
                    code: material.subject.code || matchedAssignment.subjectCode,
                },
                section: {
                    id: material.section.id,
                    name: material.section.name || matchedAssignment.sectionName,
                },
            };
        });
    }, []);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [materialsData, assignmentsData] = await Promise.all([
                fetchMyMaterials(statusFilter || undefined),
                fetchTeachingAssignments(),
            ]);
            setMaterials(hydrateMaterialRefs(materialsData, assignmentsData));
            setAssignments(assignmentsData);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to load study materials. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [hydrateMaterialRefs, statusFilter]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    useEffect(() => {
        const shouldPollIndexing = materials.some(
            (material) => material.vectorizationStatus === 'PENDING' || material.vectorizationStatus === 'PROCESSING',
        );

        if (!shouldPollIndexing) {
            return;
        }

        const intervalId = window.setInterval(() => {
            void loadData();
        }, 8000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [materials, loadData]);

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
            const assignment = assignments.find(
                (item) => item.subjectId === input.subjectId && item.sectionId === input.sectionId,
            );
            const fileName = input.file?.name ?? input.fileName ?? '';
            const extensionPart = fileName.includes('.') ? fileName.split('.').pop() : '';
            const fileExtension = extensionPart ? `.${extensionPart.toLowerCase()}` : '';

            const optimisticMaterial: StudyMaterial = {
                id: result.material.id,
                title: result.material.title,
                description: input.description,
                materialType: input.materialType,
                status: input.status,
                subject: {
                    id: input.subjectId,
                    name: assignment?.subjectName ?? '',
                    code: assignment?.subjectCode ?? '',
                },
                section: {
                    id: input.sectionId,
                    name: assignment?.sectionName ?? '',
                },
                fileUrl: result.material.fileUrl,
                fileSizeMb: input.file ? Number((input.file.size / (1024 * 1024)).toFixed(2)) : 0,
                fileExtension,
                viewCount: 0,
                downloadCount: 0,
                uploadedAt: result.material.uploadedAt,
                publishedAt: input.status === 'PUBLISHED' ? result.material.uploadedAt : null,
                updatedAt: result.material.uploadedAt,
                vectorizationStatus: result.material.vectorizationStatus ?? 'PENDING',
                vectorDocumentId: null,
                lastIndexedAt: null,
                vectorErrorMessage: null,
            };

            setMaterials((current) => [optimisticMaterial, ...current.filter((item) => item.id !== optimisticMaterial.id)]);
            setShowUploadModal(false);
            void loadData();
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

    const askMaterialQuestion = async (materialId: number, message: string): Promise<AiTutorResponse> => {
        return askAiTutor(materialId, message);
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
        askMaterialQuestion,
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
