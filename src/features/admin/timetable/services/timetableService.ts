import api from '../../../../services/api';
import type {
    CreateBulkTimetablePayload,
    CreateSingleEntryPayload,
    Faculty,
    PeriodDefinition,
    Room,
    Section,
    Semester,
    Subject,
    TimetableEntry,
    TimetableFilters,
} from '../types';

interface TimetableApiResponse {
    entries?: unknown;
    timetable?: unknown;
    results?: unknown;
    data?: unknown;
}

type TimetableApiPayload = TimetableApiResponse | unknown[];

type GenericRecord = Record<string, unknown>;

const asRecord = (value: unknown): GenericRecord => {
    if (typeof value === 'object' && value !== null) {
        return value as GenericRecord;
    }
    return {};
};

const asArray = (value: unknown): GenericRecord[] => {
    if (Array.isArray(value)) {
        return value.map((item) => asRecord(item));
    }
    return [];
};

const asNumber = (value: unknown): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
};

const asText = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return fallback;
};

const resolveName = (record: GenericRecord): string => {
    return asText(
        record.name ?? record.title ?? record.label ?? record.code ?? record.employee_name,
        'Unknown'
    );
};

const mapSubject = (item: GenericRecord): Subject => ({
    id: asNumber(item.id ?? item.subject_id),
    name: asText(item.subject_name ?? item.name, resolveName(item)),
    code: asText(item.subject_code ?? item.code),
    semesterNumber: asNumber(item.semester_number),
});

const mapFaculty = (item: GenericRecord): Faculty => ({
    id: asNumber(item.id ?? item.faculty_id),
    name: asText(item.faculty_name ?? item.name, resolveName(item)),
    employeeCode: asText(item.employee_code ?? item.code),
});

const mapSection = (item: GenericRecord): Section => ({
    id: asNumber(item.id ?? item.section_id),
    name: asText(item.section_name ?? item.name, resolveName(item)),
    code: asText(item.code),
});

const mapRoom = (item: GenericRecord): Room => ({
    id: asNumber(item.id ?? item.room_id),
    name: asText(item.room_name ?? item.name, resolveName(item)),
    code: asText(item.code),
});

const mapPeriod = (item: GenericRecord): PeriodDefinition => ({
    id: asNumber(item.id),
    name: asText(
        item.name ?? item.period_name,
        `Period ${asText(item.period_number, asText(item.id, ''))}`.trim()
    ),
    day: asText(item.day ?? item.day_name),
    startTime: asText(item.start_time ?? item.startTime),
    endTime: asText(item.end_time ?? item.endTime),
    semesterId: asNumber(item.semester_id ?? item.semester_number),
});

const mapSemester = (item: GenericRecord): Semester => ({
    id: asNumber(item.id ?? item.semester_id ?? item.semester_number),
    name: asText(
        item.name ?? item.semester_name,
        `Semester ${asText(item.semester_number, asText(item.id, ''))}`.trim()
    ),
});

const mapEntry = (item: GenericRecord): TimetableEntry => {
    const period = asRecord(item.period);
    const subject = asRecord(item.subject);
    const faculty = asRecord(item.faculty);
    const section = asRecord(item.section);
    const room = asRecord(item.room);

    const resolvedPeriod: PeriodDefinition = Object.keys(period).length > 0
        ? mapPeriod(period)
        : {
            id: asNumber(item.period_definition_id ?? item.period_id ?? item.period_number),
            name: `Period ${asText(item.period_number, asText(item.period_definition_id ?? item.period_id, ''))}`.trim(),
            day: asText(item.day_name ?? item.day),
            startTime: asText(item.start_time ?? item.startTime),
            endTime: asText(item.end_time ?? item.endTime),
            semesterId: asNumber(item.semester_id ?? item.semester_number),
        };

    const resolvedSubject: Subject = Object.keys(subject).length > 0
        ? mapSubject(subject)
        : {
            id: asNumber(item.subject_id),
            name: asText(item.subject_name, 'Unknown'),
            code: asText(item.subject_code),
            semesterNumber: asNumber(item.semester_number ?? item.semester_id),
        };

    const resolvedFaculty: Faculty = Object.keys(faculty).length > 0
        ? mapFaculty(faculty)
        : {
            id: asNumber(item.faculty_id),
            name: asText(item.faculty_name, 'Unknown'),
            employeeCode: asText(item.faculty_code ?? item.employee_code),
        };

    const resolvedRoom: Room = Object.keys(room).length > 0
        ? mapRoom(room)
        : {
            id: asNumber(item.room_id),
            name: asText(item.room_name, 'Unknown'),
            code: asText(item.room_code),
        };

    const resolvedSection: Section | undefined = Object.keys(section).length > 0
        ? mapSection(section)
        : (asNumber(item.section_id) > 0
            ? {
                id: asNumber(item.section_id),
                name: asText(item.section_name, 'Unknown'),
                code: asText(item.section_code),
            }
            : undefined);

    return {
        id: asNumber(item.id),
        day: asText(item.day ?? item.day_name ?? resolvedPeriod.day),
        notes: asText(item.notes),
        period: resolvedPeriod,
        subject: resolvedSubject,
        faculty: resolvedFaculty,
        section: resolvedSection,
        room: resolvedRoom,
    };
};

const resolveTimetableEntries = (payload: TimetableApiPayload): TimetableEntry[] => {
    if (Array.isArray(payload)) {
        return payload.map((item) => mapEntry(asRecord(item)));
    }

    const normalizedPayload = asRecord(payload);
    const typedPayload = normalizedPayload as TimetableApiResponse;
    const nestedData = asRecord(typedPayload.data);
    const listSource = typedPayload.entries ?? typedPayload.timetable ?? typedPayload.results ?? nestedData.entries ?? nestedData.results;
    return asArray(listSource).map(mapEntry);
};

export const getSectionTimetable = async (section_id: number, semester_id: number): Promise<TimetableEntry[]> => {
    const response = await api.get<TimetableApiPayload>('/timetable/sections/view/', {
        params: { section_id, semester_id },
    });
    return resolveTimetableEntries(response.data);
};

export const getFacultyTimetable = async (faculty_id: number, semester_id: number): Promise<TimetableEntry[]> => {
    const response = await api.get<TimetableApiPayload>('/timetable/faculty/view/', {
        params: { faculty_id, semester_id },
    });
    return resolveTimetableEntries(response.data);
};

interface TimetableFiltersQuery {
    semester_id?: number;
    section_id?: number;
}

export const getFilters = async (query?: TimetableFiltersQuery): Promise<TimetableFilters> => {
    const params: Record<string, string | number> = { type: 'timetable' };
    if (query?.semester_id) params.semester_id = query.semester_id;
    if (query?.section_id) params.section_id = query.section_id;

    const response = await api.get<Record<string, unknown>>('/core/filters/', {
        params,
    });

    const root = asRecord(response.data);
    const nestedData = asRecord(root.data);
    const nestedFilters = asRecord(root.filters ?? nestedData.filters);

    const subjectsRaw = asArray(root.subjects ?? nestedData.subjects ?? nestedFilters.subjects);
    const sectionsRaw = asArray(root.sections ?? nestedData.sections ?? nestedFilters.sections);
    const facultiesRaw = asArray(
        root.faculties ?? root.faculty ?? nestedData.faculties ?? nestedData.faculty ?? nestedFilters.faculties
    );
    const roomsRaw = asArray(root.rooms ?? nestedData.rooms ?? nestedFilters.rooms);
    const periodsRaw = asArray(root.periods ?? nestedData.periods ?? nestedFilters.periods);
    const semestersRaw = asArray(root.semesters ?? nestedData.semesters ?? nestedFilters.semesters);

    const subjects = subjectsRaw.map(mapSubject);
    const sections = sectionsRaw.map(mapSection);
    const faculties = facultiesRaw.map(mapFaculty);
    const rooms = roomsRaw.map(mapRoom);
    const periods = periodsRaw.map(mapPeriod);

    const semesters = semestersRaw.length > 0
        ? semestersRaw.map(mapSemester)
        : (() => {
            const semesterNumbers = Array.from(
                new Set(
                    subjectsRaw
                        .map((subject) => asNumber(subject.semester_number))
                        .filter((value) => value > 0)
                )
            ).sort((a, b) => a - b);

            return semesterNumbers.map((number) => ({
                id: number,
                name: `Semester ${number}`,
            }));
        })();

    return {
        semesters,
        sections,
        subjects,
        faculties,
        rooms,
        periods,
    };
};

export const createBulkTimetable = async (payload: CreateBulkTimetablePayload): Promise<void> => {
    await api.post('/timetable/sections/create-timetable/', payload);
};

export const createSingleEntry = async (payload: CreateSingleEntryPayload): Promise<void> => {
    await api.post('/timetable/sections/create-entry/', payload);
};

// --- Timetable Grid Configuration ---

export interface PeriodSlot {
    slot_number: number;
    slot_type: 'class' | 'lunch' | 'break' | 'free';
    start_time: string;
    end_time: string;
    label: string;
}

export interface TimetableGrid {
    id?: number;
    department: number;
    academic_year: string;
    effective_from: string;
    is_active?: boolean;
    slots: PeriodSlot[];
    day_start?: string;
    day_end?: string;
}

export const getTimetableGrids = async (department_id?: number): Promise<TimetableGrid[]> => {
    const response = await api.get('/timetable/grid/', {
        params: department_id ? { department: department_id } : undefined
    });
    return response.data;
};

export const createTimetableGrid = async (payload: TimetableGrid): Promise<TimetableGrid> => {
    const response = await api.post('/timetable/grid/', payload);
    return response.data;
};

export const getGridPreview = async (grid_id: number): Promise<any[]> => {
    const response = await api.get(`/timetable/grid/${grid_id}/preview/`);
    return response.data;
};

export interface GridAIChatPayload {
    session_id: string;
    message: string;
    department_id: number;
}

export interface GridAIChatResponse {
    reply: string;
    state: string;
    resolved_grid: TimetableGrid | null;
}

export const sendGridAIChat = async (payload: GridAIChatPayload): Promise<GridAIChatResponse> => {
    const response = await api.post('/timetable/admin/ai-chat/', payload);
    return response.data;
};
