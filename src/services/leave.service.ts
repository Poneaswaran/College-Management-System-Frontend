import api from './api';

export interface LeaveType {
    id: number;
    name: string;
    code: string;
    description: string;
    is_paid: boolean;
    allows_half_day: boolean;
    annual_quota: number;
    requires_attachment: boolean;
}

export interface LeaveBalance {
    id: number;
    leave_type: number;
    leave_type_name: string;
    leave_type_code: string;
    total_granted: number;
    used: number;
    pending: number;
    remaining: number;
}

export interface LeaveRequest {
    id: number;
    faculty: number;
    faculty_name: string;
    leave_type: number;
    leave_type_name: string;
    start_date: string;
    end_date: string;
    duration_type: 'FULL' | 'HALF_MORNING' | 'HALF_AFTERNOON';
    reason: string;
    attachment: string | null;
    substitution_note: string;
    is_emergency: boolean;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'WITHDRAWN';
    hod_remarks: string;
    created_at: string;
    total_days: number;
}

export const getLeaveTypes = async (): Promise<LeaveType[]> => {
    const response = await api.get('/leave/types/');
    return response.data;
};

export const getLeaveBalances = async (): Promise<LeaveBalance[]> => {
    const response = await api.get('/leave/balances/');
    return response.data;
};

export const getMyLeaveRequests = async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leave/requests/');
    return response.data;
};

export const applyLeave = async (data: Record<string, unknown>): Promise<LeaveRequest> => {
    const response = await api.post('/leave/requests/', data);
    return response.data;
};

export const getHODPendingApprovals = async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leave/approvals/');
    return response.data;
};

export const handleLeaveApproval = async (requestId: number, action: 'APPROVE' | 'REJECT', remarks: string): Promise<LeaveRequest> => {
    const response = await api.post('/leave/approvals/', { request_id: requestId, action, remarks });
    return response.data;
};

export interface WeekendSetting {
    day: number;
    is_weekend: boolean;
}

export const getWeekendSettings = async (): Promise<WeekendSetting[]> => {
    const response = await api.get('/leave/settings/weekends/');
    return response.data;
};

export const updateWeekendSettings = async (weekends: number[]): Promise<unknown> => {
    const response = await api.post('/leave/settings/weekends/', { weekends });
    return response.data;
};

export interface LeavePolicy {
    id: number;
    scope: 'tenant' | 'school' | 'department';
    tenant?: number;
    school?: number;
    department?: number;
    leave_type: number;
    annual_quota?: number;
    carry_forward?: boolean;
    max_carry_forward?: number;
    allows_half_day?: boolean;
    requires_attachment?: boolean;
    min_notice_days?: number;
    max_consecutive_days?: number;
    effective_from: string;
    effective_to?: string;
    is_active: boolean;
}

export interface ResolvedPolicy {
    annual_quota: number;
    carry_forward: boolean;
    max_carry_forward: number;
    allows_half_day: boolean;
    requires_attachment: boolean;
    min_notice_days: number;
    max_consecutive_days: number | null;
    source_scope: string;
}

export const leavePolicyApi = {
    list: (params?: Record<string, string>) =>
        api.get('/leave/policies/', { params }),
    create: (data: Partial<LeavePolicy>) =>
        api.post('/leave/policies/', data),
    update: (id: number, data: Partial<LeavePolicy>) =>
        api.patch(`/leave/policies/${id}/`, data),
    delete: (id: number) =>
        api.delete(`/leave/policies/${id}/`),
    resolve: async (facultyId: number, leaveTypeId: number, asOf?: string): Promise<ResolvedPolicy> => {
        const response = await api.get('/leave/policies/resolve/', {
            params: { faculty_id: facultyId, leave_type_id: leaveTypeId, as_of: asOf }
        });
        return response.data;
    },
};
