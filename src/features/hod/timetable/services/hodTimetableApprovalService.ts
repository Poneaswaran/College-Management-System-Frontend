import api from '../../../../services/api';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface TimetableSlot {
    day: string;
    period: string;
    courseCode: string;
    courseTitle: string;
    facultyName: string;
    section: string;
    room: string;
}

export interface HODTimetableApprovalRequest {
    id: number;
    status: ApprovalStatus;
    submittedBy: string;
    submittedAt: string;
    semester: string;
    academicYear: string;
    changeSummary: string;
    note: string;
    reviewNote: string;
    slots: TimetableSlot[];
}

interface TimetableApprovalRequestApi {
    id: number;
    status: ApprovalStatus;
    submitted_by_name?: string;
    created_at?: string;
    semester_label?: string;
    academic_year?: string;
    change_summary?: string;
    note?: string;
    review_note?: string;
    slots?: unknown;
}

const toStringValue = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number') {
        return String(value);
    }
    return fallback;
};

const toSlotList = (value: unknown): TimetableSlot[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map((slot) => {
        if (typeof slot !== 'object' || slot === null) {
            return {
                day: '',
                period: '',
                courseCode: '',
                courseTitle: '',
                facultyName: '',
                section: '',
                room: '',
            };
        }

        const mapped = slot as Record<string, unknown>;

        return {
            day: toStringValue(mapped.day),
            period: toStringValue(mapped.period),
            courseCode: toStringValue(mapped.courseCode),
            courseTitle: toStringValue(mapped.courseTitle),
            facultyName: toStringValue(mapped.facultyName),
            section: toStringValue(mapped.section),
            room: toStringValue(mapped.room),
        };
    });
};

const mapRequest = (item: TimetableApprovalRequestApi): HODTimetableApprovalRequest => ({
    id: item.id,
    status: item.status,
    submittedBy: toStringValue(item.submitted_by_name, 'Unknown'),
    submittedAt: toStringValue(item.created_at),
    semester: toStringValue(item.semester_label, 'N/A'),
    academicYear: toStringValue(item.academic_year, 'N/A'),
    changeSummary: toStringValue(item.change_summary),
    note: toStringValue(item.note),
    reviewNote: toStringValue(item.review_note),
    slots: toSlotList(item.slots),
});

export async function getHODTimetableApprovalRequests(status?: ApprovalStatus): Promise<HODTimetableApprovalRequest[]> {
    const response = await api.get<TimetableApprovalRequestApi[]>('/api/timetable/hod/approval-requests/', {
        params: status ? { status } : undefined,
    });

    if (!Array.isArray(response.data)) {
        return [];
    }

    return response.data.map(mapRequest);
}

export async function updateHODTimetableApprovalStatus(
    requestId: number,
    status: ApprovalStatus,
    reviewNote?: string,
): Promise<HODTimetableApprovalRequest> {
    const response = await api.patch<TimetableApprovalRequestApi>(
        `/api/timetable/hod/approval-requests/${requestId}/status/`,
        {
            status,
            review_note: reviewNote ?? '',
        },
    );

    return mapRequest(response.data);
}
