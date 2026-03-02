import { client } from '../../../lib/graphql';
import {
    GET_FACULTY_LEAVE_REQUESTS,
    APPROVE_LEAVE_REQUEST,
    REJECT_LEAVE_REQUEST,
} from '../graphql/leaveApproval';
import { MOCK_FACULTY_LEAVE_APPROVAL_DATA } from '../mockData/leaveApproval';
import type {
    FacultyLeaveApprovalData,
    FacultyLeaveApprovalResponse,
    ApproveLeavePayload,
    RejectLeavePayload,
} from '../types/leaveApproval';

interface ApproveLeaveResult {
    id: number;
    status: string;
    actionTakenOn: string;
    actionTakenBy: string;
    approvalRemark: string | null;
}

interface RejectLeaveResult {
    id: number;
    status: string;
    actionTakenOn: string;
    actionTakenBy: string;
    rejectionRemark: string | null;
}

interface ApproveLeaveResponse {
    approveLeaveRequest: ApproveLeaveResult;
}

interface RejectLeaveResponse {
    rejectLeaveRequest: RejectLeaveResult;
}

export const fetchFacultyLeaveRequests = async (
    departmentId?: number,
    academicYear?: string,
    status?: string,
): Promise<FacultyLeaveApprovalData> => {
    try {
        const { data } = await client.query<FacultyLeaveApprovalResponse>({
            query: GET_FACULTY_LEAVE_REQUESTS,
            variables: {
                ...(departmentId ? { departmentId } : {}),
                ...(academicYear ? { academicYear } : {}),
                ...(status ? { status } : {}),
            },
            fetchPolicy: 'network-only',
        });

        if (!data) throw new Error('No data returned');
        return data.facultyLeaveRequests;
    } catch {
        // Return mock data as fallback while backend endpoint is not yet ready
        return MOCK_FACULTY_LEAVE_APPROVAL_DATA;
    }
};

export const approveLeaveRequest = async (
    payload: ApproveLeavePayload,
): Promise<ApproveLeaveResult> => {
    try {
        const { data } = await client.mutate<ApproveLeaveResponse>({
            mutation: APPROVE_LEAVE_REQUEST,
            variables: {
                leaveRequestId: payload.leaveRequestId,
                remark: payload.remark ?? '',
            },
        });
        if (!data) throw new Error('No data returned');
        return data.approveLeaveRequest;
    } catch {
        // Mock optimistic response for development
        return {
            id: payload.leaveRequestId,
            status: 'APPROVED',
            actionTakenOn: new Date().toISOString().split('T')[0],
            actionTakenBy: 'HOD',
            approvalRemark: payload.remark ?? null,
        };
    }
};

export const rejectLeaveRequest = async (
    payload: RejectLeavePayload,
): Promise<RejectLeaveResult> => {
    try {
        const { data } = await client.mutate<RejectLeaveResponse>({
            mutation: REJECT_LEAVE_REQUEST,
            variables: {
                leaveRequestId: payload.leaveRequestId,
                remark: payload.remark,
            },
        });
        if (!data) throw new Error('No data returned');
        return data.rejectLeaveRequest;
    } catch {
        // Mock optimistic response for development
        return {
            id: payload.leaveRequestId,
            status: 'REJECTED',
            actionTakenOn: new Date().toISOString().split('T')[0],
            actionTakenBy: 'HOD',
            rejectionRemark: payload.remark,
        };
    }
};
