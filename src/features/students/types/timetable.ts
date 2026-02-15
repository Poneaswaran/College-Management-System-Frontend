export interface Subject {
  code: string;
  name: string;
  subjectType: string;
}

export interface Faculty {
  email: string;
  registerNumber: string;
}

export interface Room {
  roomNumber: string;
  building: string;
}

export interface PeriodDefinition {
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  periodNumber: number;
}

export interface TimetableEntry {
  id: string;
  subject: Subject;
  faculty: Faculty;
  room: Room;
  periodDefinition: PeriodDefinition;
  notes?: string;
}

export interface TimetableStatistics {
  totalClasses: number;
  theoryClasses: number;
  labSessions: number;
  tutorialClasses: number;
}

export interface CurrentSemester {
  id: string;
  number: number;
  displayName: string;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface TimetablePageResponse {
  currentSemester: CurrentSemester;
  myTimetable: TimetableEntry[];
  timetableStatistics: TimetableStatistics;
}
