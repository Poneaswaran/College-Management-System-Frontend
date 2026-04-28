// ============================================
// Faculty Leave Approval Types
// ============================================

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LeaveType = 'CASUAL' | 'SICK' | 'EARNED' | 'DUTY' | 'MATERNITY' | 'PATERNITY';

export type LeaveFilterStatus = LeaveStatus | 'ALL';

export interface FacultyLeaveRequest {
    id: number;
    facultyId: string;
    facultyName: string;
    employeeId: string;
    designation: string;
    department: string;
    profilePhoto: string | null;
    leaveType: LeaveType;
    startDate: string; // ISO date string YYYY-MM-DD
    endDate: string;   // ISO date string YYYY-MM-DD
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    appliedOn: string; // ISO date string
    actionTakenOn: string | null;
    actionTakenBy: string | null;
    rejectionRemark: string | null;
    approvalRemark: string | null;
    ai_summary?: string | null;
    // Balance info for context
    casualLeaveBalance: number;
    sickLeaveBalance: number;
    earnedLeaveBalance: number;
}

export interface LeaveApprovalSummaryStats {
    totalRequests: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    totalDaysRequested: number;
    avgDaysPerRequest: number;
}

export interface FacultyLeaveApprovalData {
    departmentName: string;
    academicYear: string;
    summaryStats: LeaveApprovalSummaryStats;
    leaveRequests: FacultyLeaveRequest[];
}

export interface FacultyLeaveApprovalResponse {
    facultyLeaveRequests: FacultyLeaveApprovalData;
}

// Action payloads
export interface ApproveLeavePayload {
    leaveRequestId: number;
    remark?: string;
}

export interface RejectLeavePayload {
    leaveRequestId: number;
    remark: string;
}
