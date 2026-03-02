import { client } from '../../../lib/graphql';
import { ensureInt } from '../../../utils/graphql-helpers';
import {
    GET_HOD_ATTENDANCE_REPORT,
    GET_HOD_STUDENT_ATTENDANCE_DETAIL,
    GET_HOD_CLASS_ATTENDANCE_DETAIL,
} from '../graphql/attendanceReports';
import type {
    HODAttendanceReportData,
    HODAttendanceReportResponse,
    StudentAttendanceDetail,
    HODStudentAttendanceDetailResponse,
    ClassAttendanceDetail,
    HODClassAttendanceDetailResponse,
    AttendanceReportQueryVars,
} from '../types/attendanceReports';

export const fetchHODAttendanceReport = async (
    vars: AttendanceReportQueryVars = {},
): Promise<HODAttendanceReportData> => {
    const { data } = await client.query<HODAttendanceReportResponse>({
        query: GET_HOD_ATTENDANCE_REPORT,
        variables: {
            ...(vars.departmentId ? { departmentId: ensureInt(vars.departmentId) } : {}),
            ...(vars.semesterId   ? { semesterId:   ensureInt(vars.semesterId)   } : {}),
            ...(vars.subjectId    ? { subjectId:    ensureInt(vars.subjectId)    } : {}),
            ...(vars.periodNumber ? { periodNumber: ensureInt(vars.periodNumber) } : {}),
            ...(vars.dateFrom     ? { dateFrom: vars.dateFrom }                    : {}),
            ...(vars.dateTo       ? { dateTo:   vars.dateTo   }                    : {}),
        },
        fetchPolicy: 'network-only',
    });

    if (!data) throw new Error('No data returned from hodAttendanceReport');
    return data.hodAttendanceReport;
};

export const fetchHODStudentAttendanceDetail = async (
    studentId: number,
    semesterId?: number,
    dateFrom?: string,
    dateTo?: string,
): Promise<StudentAttendanceDetail> => {
    const { data } = await client.query<HODStudentAttendanceDetailResponse>({
        query: GET_HOD_STUDENT_ATTENDANCE_DETAIL,
        variables: {
            studentId: ensureInt(studentId),
            ...(semesterId ? { semesterId: ensureInt(semesterId) } : {}),
            ...(dateFrom   ? { dateFrom }                          : {}),
            ...(dateTo     ? { dateTo }                            : {}),
        },
        fetchPolicy: 'network-only',
    });

    if (!data) throw new Error('No data returned from hodStudentAttendanceDetail');
    return data.hodStudentAttendanceDetail;
};

export const fetchHODClassAttendanceDetail = async (
    sectionId: number,
    semesterId?: number,
    subjectId?: number,
    dateFrom?: string,
    dateTo?: string,
): Promise<ClassAttendanceDetail> => {
    const { data } = await client.query<HODClassAttendanceDetailResponse>({
        query: GET_HOD_CLASS_ATTENDANCE_DETAIL,
        variables: {
            sectionId: ensureInt(sectionId),
            ...(semesterId ? { semesterId: ensureInt(semesterId) } : {}),
            ...(subjectId  ? { subjectId:  ensureInt(subjectId)  } : {}),
            ...(dateFrom   ? { dateFrom }                          : {}),
            ...(dateTo     ? { dateTo }                            : {}),
        },
        fetchPolicy: 'network-only',
    });

    if (!data) throw new Error('No data returned from hodClassAttendanceDetail');
    return data.hodClassAttendanceDetail;
};
