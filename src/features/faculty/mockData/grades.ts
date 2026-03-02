import type {
    FacultyGradesData,
    FacultyGradeDetailData,
    StudentGradeRecord,
    GradeDistributionItem,
    LetterGrade,
} from '../types/grades';

// ============================================
// Mock data for /faculty/grades route
// Used as fallback while backend is being built
// ============================================

// ——— Helper: derive letter grade from percentage (10-point GPA pattern) ———
function deriveLetterGrade(pct: number | null, isAbsent: boolean): LetterGrade | null {
    if (isAbsent) return 'ABSENT';
    if (pct === null) return null;
    if (pct >= 91) return 'O';
    if (pct >= 81) return 'A+';
    if (pct >= 71) return 'A';
    if (pct >= 61) return 'B+';
    if (pct >= 51) return 'B';
    if (pct >= 41) return 'C';
    return 'F';
}

function deriveGradePoint(grade: LetterGrade | null): number | null {
    const map: Record<LetterGrade, number> = {
        'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0,
        'ABSENT': 0, 'WITHHELD': 0,
    };
    return grade ? map[grade] : null;
}

function makeStudent(
    idx: number,
    sectionPrefix: string,
    internal: number | null,
    external: number | null,
    internalMax: number,
    externalMax: number,
    isAbsent = false,
): StudentGradeRecord {
    const total = isAbsent ? null : (internal ?? 0) + (external ?? 0);
    const maxTotal = internalMax + externalMax;
    const pct = total !== null ? Math.round((total / maxTotal) * 100) : null;
    const grade = deriveLetterGrade(pct, isAbsent);
    return {
        studentId: `STU${sectionPrefix}${String(idx).padStart(3, '0')}`,
        registerNumber: `22CSE${sectionPrefix}${String(idx).padStart(3, '0')}`,
        rollNumber: `${sectionPrefix}${String(idx).padStart(2, '0')}`,
        studentName: [
            'Aakash Patel', 'Bhavya Sharma', 'Chitra Nair', 'Deepak Kumar', 'Eswari Devi',
            'Faisal Ahmad', 'Geetha Rajan', 'Harish Menon', 'Iswarya Balaji', 'Jagadeesh R',
            'Karthika Siva', 'Lokesh Yadav', 'Meenakshi K', 'Naveen Raj', 'Oviya S',
            'Praveen B', 'Qusaim Noor', 'Ranjith Kumar', 'Surya Priya', 'Tamilarasan V',
        ][idx % 20],
        profilePhoto: null,
        internalMark: isAbsent ? null : internal,
        externalMark: isAbsent ? null : external,
        totalMark: total,
        percentage: pct,
        letterGrade: grade,
        gradePoint: deriveGradePoint(grade),
        isPass: grade !== null ? !(['F', 'ABSENT', 'WITHHELD'].includes(grade)) : null,
        isAbsent,
        isDirty: false,
    };
}

// ——— Prebuilt student lists for each course section ———

const CS301A_STUDENTS: StudentGradeRecord[] = [
    makeStudent(1, 'A', 38, 56, 50, 100),
    makeStudent(2, 'A', 45, 72, 50, 100),
    makeStudent(3, 'A', 42, 60, 50, 100),
    makeStudent(4, 'A', 28, 35, 50, 100),  // fail
    makeStudent(5, 'A', 50, 85, 50, 100),
    makeStudent(6, 'A', 47, 78, 50, 100),
    makeStudent(7, 'A', null, null, 50, 100, true),  // absent
    makeStudent(8, 'A', 35, 50, 50, 100),
    makeStudent(9, 'A', 49, 88, 50, 100),
    makeStudent(10, 'A', 41, 62, 50, 100),
    makeStudent(11, 'A', 46, 74, 50, 100),
    makeStudent(12, 'A', 43, 68, 50, 100),
    makeStudent(13, 'A', 48, 80, 50, 100),
    makeStudent(14, 'A', 32, 42, 50, 100),
    makeStudent(15, 'A', 50, 91, 50, 100),
    makeStudent(16, 'A', 38, 55, 50, 100),
    makeStudent(17, 'A', 44, 70, 50, 100),
    makeStudent(18, 'A', 40, 65, 50, 100),
    makeStudent(19, 'A', 29, 38, 50, 100), // fail
    makeStudent(20, 'A', 50, 82, 50, 100),
];

const CS301B_STUDENTS: StudentGradeRecord[] = Array.from({ length: 18 }, (_, i) =>
    makeStudent(i + 1, 'B',
        [36, 44, 40, 27, 48, 46, 50, 34, 49, 39, 45, 42, 47, 31, 50, 37, 43, 41][i],
        [54, 70, 62, 33, 82, 75, null, 52, 89, 61, 73, 67, 79, 40, 93, 57, 69, 63][i],
        50, 100,
        i === 6,
    )
);

const CS501A_STUDENTS: StudentGradeRecord[] = Array.from({ length: 20 }, (_, i) =>
    makeStudent(i + 1, 'C',
        [35, 42, 38, 30, 47, 44, 49, 33, 48, 40, 45, 41, 46, 28, 50, 36, 43, 39, 31, 50][i],
        [52, 65, 58, 44, 76, 71, 83, 49, 81, 60, 72, 66, 77, 42, 90, 55, 68, 61, 45, 84][i],
        50, 100,
    )
);

function buildDistribution(students: StudentGradeRecord[]): GradeDistributionItem[] {
    const gradeOrder: LetterGrade[] = ['O', 'A+', 'A', 'B+', 'B', 'C', 'F', 'ABSENT'];
    const counts: Partial<Record<LetterGrade, number>> = {};
    students.forEach(s => {
        const g = s.letterGrade ?? (s.isAbsent ? 'ABSENT' : 'F');
        counts[g] = (counts[g] ?? 0) + 1;
    });
    const total = students.length;
    return gradeOrder
        .filter(g => (counts[g] ?? 0) > 0)
        .map(g => ({
            grade: g,
            count: counts[g] ?? 0,
            percentage: Math.round(((counts[g] ?? 0) / total) * 100),
        }));
}

function buildStats(students: StudentGradeRecord[], internalMax: number, externalMax: number) {
    const presented = students.filter(s => !s.isAbsent);
    const passed = presented.filter(s => s.isPass === true);
    const marks = presented.map(s => s.totalMark ?? 0);
    const maxMark = internalMax + externalMax;
    return {
        totalStudents: students.length,
        passCount: passed.length,
        failCount: presented.length - passed.length,
        absentCount: students.filter(s => s.isAbsent).length,
        passPercentage: presented.length ? Math.round((passed.length / presented.length) * 100) : 0,
        avgMark: marks.length ? Math.round((marks.reduce((a, b) => a + b, 0) / marks.length) * 10) / 10 : 0,
        highestMark: marks.length ? Math.max(...marks) : 0,
        lowestMark: marks.length ? Math.min(...marks) : 0,
        maxMark,
        gradeDistribution: buildDistribution(students),
    };
}

// ——— Main mock data ———

export const MOCK_FACULTY_GRADES_DATA: FacultyGradesData = {
    summary: {
        totalCourses: 4,
        totalSubmitted: 1,
        totalDraft: 2,
        totalPendingApproval: 1,
        totalApproved: 0,
        totalRejected: 0,
        currentSemesterLabel: 'Semester V — Jan–May 2026',
    },
    courseSections: [
        {
            id: 201,
            subjectCode: 'CS301',
            subjectName: 'Data Structures & Algorithms',
            sectionName: 'CSE-A',
            semester: 5,
            semesterLabel: 'Semester V — Jan–May 2026',
            department: 'CSE',
            examType: 'INTERNAL',
            examDate: '2026-02-15',
            internalMaxMark: 50,
            externalMaxMark: 100,
            totalMaxMark: 150,
            passMark: 75,
            studentCount: 20,
            submittedCount: 20,
            status: 'DRAFT',
            lastModifiedAt: '2026-02-18T10:30:00Z',
            submittedAt: null,
        },
        {
            id: 202,
            subjectCode: 'CS301',
            subjectName: 'Data Structures & Algorithms',
            sectionName: 'CSE-B',
            semester: 5,
            semesterLabel: 'Semester V — Jan–May 2026',
            department: 'CSE',
            examType: 'INTERNAL',
            examDate: '2026-02-15',
            internalMaxMark: 50,
            externalMaxMark: 100,
            totalMaxMark: 150,
            passMark: 75,
            studentCount: 18,
            submittedCount: 18,
            status: 'SUBMITTED',
            lastModifiedAt: '2026-02-19T09:00:00Z',
            submittedAt: '2026-02-19T09:00:00Z',
        },
        {
            id: 203,
            subjectCode: 'CS501',
            subjectName: 'Design & Analysis of Algorithms',
            sectionName: 'CSE-A',
            semester: 5,
            semesterLabel: 'Semester V — Jan–May 2026',
            department: 'CSE',
            examType: 'INTERNAL',
            examDate: '2026-02-17',
            internalMaxMark: 50,
            externalMaxMark: 100,
            totalMaxMark: 150,
            passMark: 75,
            studentCount: 20,
            submittedCount: 15,
            status: 'DRAFT',
            lastModifiedAt: '2026-02-20T14:00:00Z',
            submittedAt: null,
        },
        {
            id: 204,
            subjectCode: 'CS301L',
            subjectName: 'Competitive Programming Lab',
            sectionName: 'CSE-A',
            semester: 5,
            semesterLabel: 'Semester V — Jan–May 2026',
            department: 'CSE',
            examType: 'LAB',
            examDate: '2026-02-20',
            internalMaxMark: 25,
            externalMaxMark: 50,
            totalMaxMark: 75,
            passMark: 38,
            studentCount: 20,
            submittedCount: 20,
            status: 'APPROVED',
            lastModifiedAt: '2026-02-22T11:00:00Z',
            submittedAt: '2026-02-21T16:30:00Z',
        },
    ],
};

// ——— Detail mock data per course section ———

export const MOCK_GRADE_DETAILS: Record<number, FacultyGradeDetailData> = {
    201: {
        courseSection: MOCK_FACULTY_GRADES_DATA.courseSections[0],
        stats: buildStats(CS301A_STUDENTS, 50, 100),
        students: CS301A_STUDENTS,
    },
    202: {
        courseSection: MOCK_FACULTY_GRADES_DATA.courseSections[1],
        stats: buildStats(CS301B_STUDENTS, 50, 100),
        students: CS301B_STUDENTS,
    },
    203: {
        courseSection: MOCK_FACULTY_GRADES_DATA.courseSections[2],
        stats: buildStats(CS501A_STUDENTS, 50, 100),
        students: CS501A_STUDENTS,
    },
    204: {
        courseSection: MOCK_FACULTY_GRADES_DATA.courseSections[3],
        stats: {
            totalStudents: 20,
            passCount: 18,
            failCount: 1,
            absentCount: 1,
            passPercentage: 90,
            avgMark: 58.4,
            highestMark: 72,
            lowestMark: 28,
            gradeDistribution: [
                { grade: 'O', count: 4, percentage: 20 },
                { grade: 'A+', count: 5, percentage: 25 },
                { grade: 'A', count: 5, percentage: 25 },
                { grade: 'B+', count: 3, percentage: 15 },
                { grade: 'B', count: 1, percentage: 5 },
                { grade: 'F', count: 1, percentage: 5 },
                { grade: 'ABSENT', count: 1, percentage: 5 },
            ],
        },
        students: Array.from({ length: 20 }, (_, i) =>
            makeStudent(i + 1, 'D',
                [20, 23, 22, 12, 25, 24, null, 18, 25, 21, 24, 22, 25, 15, 25, 19, 23, 21, 16, 25][i],
                [38, 45, 42, 28, 50, 48, null, 34, 49, 40, 46, 43, 48, 30, 50, 36, 44, 40, 31, 47][i],
                25, 50,
                i === 6,
            )
        ),
    },
};
