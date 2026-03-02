import { useState, useCallback } from 'react';
import {
    fetchFacultyLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
} from '../api/leaveApproval';
import type {
    FacultyLeaveApprovalData,
    FacultyLeaveRequest,
    LeaveFilterStatus,
    LeaveType,
    ApproveLeavePayload,
    RejectLeavePayload,
} from '../types/leaveApproval';

type LeaveTypeFilter = LeaveType | 'ALL';

interface UseLeaveApprovalReturn {
    leaveData: FacultyLeaveApprovalData | null;
    loading: boolean;
    actionLoading: boolean;
    error: string | null;
    actionError: string | null;
    loadLeaveRequests: (departmentId?: number, academicYear?: string) => Promise<void>;
    approveLeave: (payload: ApproveLeavePayload) => Promise<void>;
    rejectLeave: (payload: RejectLeavePayload) => Promise<void>;
    statusFilter: LeaveFilterStatus;
    setStatusFilter: (status: LeaveFilterStatus) => void;
    typeFilter: LeaveTypeFilter;
    setTypeFilter: (type: LeaveTypeFilter) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredRequests: FacultyLeaveRequest[];
}

export const useLeaveApproval = (): UseLeaveApprovalReturn => {
    const [leaveData, setLeaveData] = useState<FacultyLeaveApprovalData | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState<LeaveFilterStatus>('ALL');
    const [typeFilter, setTypeFilter] = useState<LeaveTypeFilter>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const loadLeaveRequests = useCallback(
        async (departmentId?: number, academicYear?: string) => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchFacultyLeaveRequests(departmentId, academicYear);
                setLeaveData(data);
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : 'Failed to load leave requests';
                setError(message);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const approveLeave = useCallback(
        async (payload: ApproveLeavePayload) => {
            setActionLoading(true);
            setActionError(null);
            try {
                await approveLeaveRequest(payload);
                // Optimistically update local state
                setLeaveData((prev) => {
                    if (!prev) return prev;
                    const now = new Date().toISOString().split('T')[0];
                    return {
                        ...prev,
                        summaryStats: {
                            ...prev.summaryStats,
                            pendingCount: prev.summaryStats.pendingCount - 1,
                            approvedCount: prev.summaryStats.approvedCount + 1,
                        },
                        leaveRequests: prev.leaveRequests.map((req) =>
                            req.id === payload.leaveRequestId
                                ? {
                                      ...req,
                                      status: 'APPROVED' as const,
                                      actionTakenOn: now,
                                      actionTakenBy: 'HOD',
                                      approvalRemark: payload.remark ?? null,
                                  }
                                : req,
                        ),
                    };
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : 'Failed to approve leave request';
                setActionError(message);
                throw err;
            } finally {
                setActionLoading(false);
            }
        },
        [],
    );

    const rejectLeave = useCallback(
        async (payload: RejectLeavePayload) => {
            setActionLoading(true);
            setActionError(null);
            try {
                await rejectLeaveRequest(payload);
                // Optimistically update local state
                setLeaveData((prev) => {
                    if (!prev) return prev;
                    const now = new Date().toISOString().split('T')[0];
                    return {
                        ...prev,
                        summaryStats: {
                            ...prev.summaryStats,
                            pendingCount: prev.summaryStats.pendingCount - 1,
                            rejectedCount: prev.summaryStats.rejectedCount + 1,
                        },
                        leaveRequests: prev.leaveRequests.map((req) =>
                            req.id === payload.leaveRequestId
                                ? {
                                      ...req,
                                      status: 'REJECTED' as const,
                                      actionTakenOn: now,
                                      actionTakenBy: 'HOD',
                                      rejectionRemark: payload.remark,
                                  }
                                : req,
                        ),
                    };
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : 'Failed to reject leave request';
                setActionError(message);
                throw err;
            } finally {
                setActionLoading(false);
            }
        },
        [],
    );

    // Derived filtered + searched list
    const filteredRequests: FacultyLeaveRequest[] = (leaveData?.leaveRequests ?? []).filter(
        (req) => {
            const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
            const matchesType = typeFilter === 'ALL' || req.leaveType === typeFilter;
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                !term ||
                req.facultyName.toLowerCase().includes(term) ||
                req.employeeId.toLowerCase().includes(term) ||
                req.designation.toLowerCase().includes(term) ||
                req.reason.toLowerCase().includes(term);
            return matchesStatus && matchesType && matchesSearch;
        },
    );

    return {
        leaveData,
        loading,
        actionLoading,
        error,
        actionError,
        loadLeaveRequests,
        approveLeave,
        rejectLeave,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        searchTerm,
        setSearchTerm,
        filteredRequests,
    };
};
