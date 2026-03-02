import { gql } from '@apollo/client';

export const GET_FACULTY_LEAVE_REQUESTS = gql`
    query GetFacultyLeaveRequests($departmentId: Int, $academicYear: String, $status: String) {
        facultyLeaveRequests(
            departmentId: $departmentId
            academicYear: $academicYear
            status: $status
        ) {
            departmentName
            academicYear
            summaryStats {
                totalRequests
                pendingCount
                approvedCount
                rejectedCount
                totalDaysRequested
                avgDaysPerRequest
            }
            leaveRequests {
                id
                facultyId
                facultyName
                employeeId
                designation
                department
                profilePhoto
                leaveType
                startDate
                endDate
                totalDays
                reason
                status
                appliedOn
                actionTakenOn
                actionTakenBy
                rejectionRemark
                approvalRemark
                casualLeaveBalance
                sickLeaveBalance
                earnedLeaveBalance
            }
        }
    }
`;

export const APPROVE_LEAVE_REQUEST = gql`
    mutation ApproveLeaveRequest($leaveRequestId: Int!, $remark: String) {
        approveLeaveRequest(leaveRequestId: $leaveRequestId, remark: $remark) {
            id
            status
            actionTakenOn
            actionTakenBy
            approvalRemark
        }
    }
`;

export const REJECT_LEAVE_REQUEST = gql`
    mutation RejectLeaveRequest($leaveRequestId: Int!, $remark: String!) {
        rejectLeaveRequest(leaveRequestId: $leaveRequestId, remark: $remark) {
            id
            status
            actionTakenOn
            actionTakenBy
            rejectionRemark
        }
    }
`;
