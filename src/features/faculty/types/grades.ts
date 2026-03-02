// ============================================
// Faculty Grade Submission Types
// ============================================

export type GradeStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type ExamType = 'INTERNAL' | 'EXTERNAL' | 'QUIZ' | 'LAB' | 'ASSIGNMENT';
export type LetterGrade = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F' | 'ABSENT' | 'WITHHELD';

// ——— Per-student grade record ———
export interface StudentGradeRecord {
    studentId: string;
    registerNumber: string;
    rollNumber: string;
    studentName: string;
    profilePhoto: string | null;

    // marks
    internalMark: number | null;   // out of internalMaxMark
    externalMark: number | null;   // out of externalMaxMark
    totalMark: number | null;
    percentage: number | null;

    // derived
    letterGrade: LetterGrade | null;
    gradePoint: number | null;      // 0–10 scale
    isPass: boolean | null;
    isAbsent: boolean;

    // edit state (frontend-only for draft mode)
    isDirty?: boolean;
}

// ——— A single course/section exam entry context ———
export interface GradeCourseSection {
    id: number;
    subjectCode: string;
    subjectName: string;
    sectionName: string;
    semester: number;
    semesterLabel: string;
    department: string;
    examType: ExamType;
    examDate: string;           // ISO date
    internalMaxMark: number;
    externalMaxMark: number;
    totalMaxMark: number;
    passMark: number;
    studentCount: number;
    submittedCount: number;
    status: GradeStatus;
    lastModifiedAt: string | null;  // ISO datetime
    submittedAt: string | null;
}

// ——— Aggregated statistics for a course section ———
export interface CourseSectionGradeStats {
    totalStudents: number;
    passCount: number;
    failCount: number;
    absentCount: number;
    passPercentage: number;
    avgMark: number;
    highestMark: number;
    lowestMark: number;
    gradeDistribution: GradeDistributionItem[];
}

export interface GradeDistributionItem {
    grade: LetterGrade;
    count: number;
    percentage: number;
}

// ——— Summary stats shown at the top ———
export interface FacultyGradeSummary {
    totalCourses: number;
    totalSubmitted: number;
    totalDraft: number;
    totalPendingApproval: number;
    totalApproved: number;
    totalRejected: number;
    currentSemesterLabel: string;
}

// ——— Top-level data returned by the main query ———
export interface FacultyGradesData {
    summary: FacultyGradeSummary;
    courseSections: GradeCourseSection[];
}

// ——— Detail data for a single course section ———
export interface FacultyGradeDetailData {
    courseSection: GradeCourseSection;
    stats: CourseSectionGradeStats;
    students: StudentGradeRecord[];
}

// ——— GraphQL response wrappers ———
export interface FacultyGradesResponse {
    facultyGrades: FacultyGradesData;
}

export interface FacultyGradeDetailResponse {
    facultyGradeDetail: FacultyGradeDetailData;
}

// ——— Mutation input types ———
export interface StudentGradeInput {
    studentId: string;
    internalMark: number | null;
    externalMark: number | null;
    isAbsent: boolean;
}

export interface SaveGradesDraftInput {
    courseSectionId: number;
    grades: StudentGradeInput[];
}

export interface SubmitGradesInput {
    courseSectionId: number;
    grades: StudentGradeInput[];
}

export interface SaveGradesDraftResponse {
    saveGradesDraft: {
        success: boolean;
        message: string;
        updatedAt: string;
    };
}

export interface SubmitGradesResponse {
    submitGrades: {
        success: boolean;
        message: string;
        submittedAt: string;
        status: GradeStatus;
    };
}
