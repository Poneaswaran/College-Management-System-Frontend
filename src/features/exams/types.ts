export type ExamStatus = 'DRAFT' | 'SCHEDULED' | 'ONGOING' | 'COMPLETED';
export type ExamType = 'MIDTERM' | 'FINAL' | 'PRACTICAL' | 'UNIT_TEST';

export interface Exam {
    id: string;
    name: string;
    description: string;
    semesterId: string;
    departmentId: string;
    examType: ExamType;
    status: ExamStatus;
    maxMarks: number;
    passMarks: number;
    startDate: string;
    endDate: string;
}

export interface ExamSchedule {
    id: string;
    examId: string;
    sectionId: string;
    subjectId: string;
    subjectName?: string;
    subjectCode?: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    invigilatorId: string;
    invigilatorName?: string;
}

export interface ExamSeat {
    id: string;
    scheduleId: string;
    studentId: string;
    studentName: string;
    registerNumber: string;
    seatNumber: string;
}

export interface ExamResult {
    id: string;
    scheduleId: string;
    studentId: string;
    studentName: string;
    registerNumber: string;
    marksObtained: number | null;
    isAbsent: boolean;
    gradeLetter: string | null;
    status: string; // PASSED / FAILED / PENDING
    remarks: string;
}

export interface HallTicket {
    id: string;
    examId: string;
    studentId: string;
    issueDate: string;
    status: string;
}

export interface ExamResultStatistics {
    scheduleId: string;
    totalStudents: number;
    presentStudents: number;
    absentStudents: number;
    passedStudents: number;
    failedStudents: number;
    averageMarks: number;
    highestMarks: number;
}
