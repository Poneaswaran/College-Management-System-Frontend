export interface Subject {
    id: number;
    name: string;
    code?: string;
    semesterNumber?: number;
}

export interface Faculty {
    id: number;
    name: string;
    employeeCode?: string;
}

export interface Section {
    id: number;
    name: string;
    code?: string;
}

export interface Room {
    id: number;
    name: string;
    code?: string;
}

export interface PeriodDefinition {
    id: number;
    name: string;
    day?: string;
    startTime?: string;
    endTime?: string;
    semesterId?: number;
}

export interface Semester {
    id: number;
    name: string;
}

export interface TimetableEntry {
    id: number;
    day?: string;
    notes?: string;
    period: PeriodDefinition;
    subject: Subject;
    faculty: Faculty;
    section?: Section;
    room: Room;
}

export interface TimetableFilters {
    semesters: Semester[];
    sections: Section[];
    subjects: Subject[];
    faculties: Faculty[];
    rooms: Room[];
    periods: PeriodDefinition[];
}

export interface CreateTimetableEntryInput {
    subject_id: number;
    faculty_id: number;
    period_definition_id: number;
    room_id: number;
    notes?: string;
}

export interface CreateBulkTimetablePayload {
    section_id: number;
    semester_id: number;
    entries: CreateTimetableEntryInput[];
}

export interface CreateSingleEntryPayload extends CreateTimetableEntryInput {
    section_id: number;
    semester_id: number;
}
