import api from '../../../services/api';
import { MOCK_FACULTY_LEAVE_APPROVAL_DATA } from '../mockData/leaveApproval';
import type {
    FacultyLeaveApprovalData,
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

export const fetchFacultyLeaveRequests = async (
    departmentId?: number,
    academicYear?: string,
    status?: string,
): Promise<FacultyLeaveApprovalData> => {
    try {
        const { data } = await api.get('/leave/approvals/');
        // Mapping REST response to the frontend types if needed
        return {
            ...data,
            leaveRequests: data.leaveRequests.map((req: any) => ({
                id: req.id,
                facultyName: req.faculty_name,
                designation: 'Faculty', // Add this to serializer if needed
                employeeId: req.faculty.toString(),
                leaveType: req.leave_type_code,
                startDate: req.start_date,
                endDate: req.end_date,
                totalDays: req.total_days,
                appliedOn: req.created_at,
                status: req.status === 'SUBMITTED' ? 'PENDING' : req.status,
                reason: req.reason,
                ai_summary: req.ai_summary,
                casualLeaveBalance: 0, // Fetch separately if needed
                sickLeaveBalance: 0,
                earnedLeaveBalance: 0
            }))
        };
    } catch (err) {
        console.error('Error fetching leave requests:', err);
        return MOCK_FACULTY_LEAVE_APPROVAL_DATA;
    }
};

export const approveLeaveRequest = async (
    payload: ApproveLeavePayload,
): Promise<ApproveLeaveResult> => {
    const { data } = await api.post('/leave/approvals/', {
        request_id: payload.leaveRequestId,
        action: 'APPROVE',
        remarks: payload.remark ?? ''
    });
    return {
        id: data.id,
        status: 'APPROVED',
        actionTakenOn: new Date().toISOString().split('T')[0],
        actionTakenBy: 'HOD',
        approvalRemark: payload.remark ?? null,
    };
};

export const rejectLeaveRequest = async (
    payload: RejectLeavePayload,
): Promise<RejectLeaveResult> => {
    const { data } = await api.post('/leave/approvals/', {
        request_id: payload.leaveRequestId,
        action: 'REJECT',
        remarks: payload.remark
    });
    return {
        id: data.id,
        status: 'REJECTED',
        actionTakenOn: new Date().toISOString().split('T')[0],
        actionTakenBy: 'HOD',
        rejectionRemark: payload.remark,
    };
};
