import type {
    HODAttendanceReportData,
    StudentAttendanceDetail,
    ClassAttendanceDetail,
} from '../types/attendanceReports';

// ============================================
// Mock data for /hod/attendance-reports route
// Used as fallback while backend is not ready
// ============================================

// ─── Helpers ─────────────────────────────────────────────────────────────────

const risk = (pct: number) =>
    pct >= 75 ? ('GOOD' as const) : pct >= 60 ? ('WARNING' as const) : ('CRITICAL' as const);

// ─── Students (40 students across 4 sections × 2 semesters) ──────────────────

const buildStudent = (
    id: number,
    name: string,
    regNo: string,
    roll: string,
    className: string,
    sectionId: number,
    year: number,
    semester: number,
    total: number,
    attended: number,
    lastAbsent: string | null,
) => {
    const absent = total - attended;
    const late = Math.min(Math.floor(absent * 0.3), 3);
    const pct = Math.round((attended / total) * 100);
    return {
        studentId: id,
        studentName: name,
        registerNumber: regNo,
        rollNumber: roll,
        className,
        sectionId,
        year,
        semester,
        totalClasses: total,
        attended,
        absent,
        late,
        percentage: pct,
        riskLevel: risk(pct),
        lastAbsentDate: lastAbsent,
    };
};

export const MOCK_STUDENTS = [
    // CSE-A Sem 3 (sectionId 1)
    buildStudent(1,  'Aarav Krishnamurthy',  '21CSE001', 'A01', 'CSE-A · Sem 3', 1, 2, 3, 80, 74, '2026-02-28'),
    buildStudent(2,  'Bhavana Suresh',       '21CSE002', 'A02', 'CSE-A · Sem 3', 1, 2, 3, 80, 62, '2026-02-25'),
    buildStudent(3,  'Chetan Pandurangan',   '21CSE003', 'A03', 'CSE-A · Sem 3', 1, 2, 3, 80, 48, '2026-03-01'),
    buildStudent(4,  'Divya Nallathambi',    '21CSE004', 'A04', 'CSE-A · Sem 3', 1, 2, 3, 80, 78, null),
    buildStudent(5,  'Eshan Rajan',          '21CSE005', 'A05', 'CSE-A · Sem 3', 1, 2, 3, 80, 80, null),
    buildStudent(6,  'Fathima Azeez',        '21CSE006', 'A06', 'CSE-A · Sem 3', 1, 2, 3, 80, 56, '2026-03-01'),
    buildStudent(7,  'Gowtham Selvaraj',     '21CSE007', 'A07', 'CSE-A · Sem 3', 1, 2, 3, 80, 70, '2026-02-20'),
    buildStudent(8,  'Harini Venkatraman',   '21CSE008', 'A08', 'CSE-A · Sem 3', 1, 2, 3, 80, 76, '2026-02-10'),
    buildStudent(9,  'Ishaan Pillai',        '21CSE009', 'A09', 'CSE-A · Sem 3', 1, 2, 3, 80, 44, '2026-03-02'),
    buildStudent(10, 'Janani Balakrishnan',  '21CSE010', 'A10', 'CSE-A · Sem 3', 1, 2, 3, 80, 78, null),

    // CSE-B Sem 3 (sectionId 2)
    buildStudent(11, 'Karan Murugesan',      '21CSE011', 'B01', 'CSE-B · Sem 3', 2, 2, 3, 80, 72, '2026-02-22'),
    buildStudent(12, 'Lakshmi Sundar',       '21CSE012', 'B02', 'CSE-B · Sem 3', 2, 2, 3, 80, 60, '2026-02-28'),
    buildStudent(13, 'Madhavan Iyer',        '21CSE013', 'B03', 'CSE-B · Sem 3', 2, 2, 3, 80, 78, null),
    buildStudent(14, 'Nithya Ramanujam',     '21CSE014', 'B04', 'CSE-B · Sem 3', 2, 2, 3, 80, 80, null),
    buildStudent(15, 'Om Prakash Venkat',    '21CSE015', 'B05', 'CSE-B · Sem 3', 2, 2, 3, 80, 50, '2026-03-01'),
    buildStudent(16, 'Pooja Devi Srinivasan','21CSE016', 'B06', 'CSE-B · Sem 3', 2, 2, 3, 80, 64, '2026-02-24'),
    buildStudent(17, 'Rahul Arumugam',       '21CSE017', 'B07', 'CSE-B · Sem 3', 2, 2, 3, 80, 76, '2026-02-14'),
    buildStudent(18, 'Sangeetha Annamalai',  '21CSE018', 'B08', 'CSE-B · Sem 3', 2, 2, 3, 80, 58, '2026-02-28'),
    buildStudent(19, 'Tarun Bose',           '21CSE019', 'B09', 'CSE-B · Sem 3', 2, 2, 3, 80, 40, '2026-03-02'),
    buildStudent(20, 'Uma Priyadarshini',    '21CSE020', 'B10', 'CSE-B · Sem 3', 2, 2, 3, 80, 77, null),

    // CSE-A Sem 5 (sectionId 3)
    buildStudent(21, 'Vijay Shankar',        '20CSE001', 'C01', 'CSE-A · Sem 5', 3, 3, 5, 75, 68, '2026-02-20'),
    buildStudent(22, 'Wasim Akram Ali',      '20CSE002', 'C02', 'CSE-A · Sem 5', 3, 3, 5, 75, 75, null),
    buildStudent(23, 'Yamini Chandrasekhar', '20CSE003', 'C03', 'CSE-A · Sem 5', 3, 3, 5, 75, 44, '2026-03-01'),
    buildStudent(24, 'Zara Banu Shaikali',   '20CSE004', 'C04', 'CSE-A · Sem 5', 3, 3, 5, 75, 72, '2026-02-18'),
    buildStudent(25, 'Abirami Natarajan',    '20CSE005', 'C05', 'CSE-A · Sem 5', 3, 3, 5, 75, 56, '2026-02-27'),
    buildStudent(26, 'Balaji Ganesan',       '20CSE006', 'C06', 'CSE-A · Sem 5', 3, 3, 5, 75, 73, null),
    buildStudent(27, 'Chandru Dhinakaran',   '20CSE007', 'C07', 'CSE-A · Sem 5', 3, 3, 5, 75, 60, '2026-02-21'),
    buildStudent(28, 'Deepika Rangarajan',   '20CSE008', 'C08', 'CSE-A · Sem 5', 3, 3, 5, 75, 71, '2026-02-17'),
    buildStudent(29, 'Elangovan Kumar',      '20CSE009', 'C09', 'CSE-A · Sem 5', 3, 3, 5, 75, 50, '2026-03-02'),
    buildStudent(30, 'Femi Rajan',           '20CSE010', 'C10', 'CSE-A · Sem 5', 3, 3, 5, 75, 75, null),

    // CSE-B Sem 5 (sectionId 4)
    buildStudent(31, 'Gokul Subramaniam',    '20CSE011', 'D01', 'CSE-B · Sem 5', 4, 3, 5, 75, 65, '2026-02-26'),
    buildStudent(32, 'Harshini Venkatesan',  '20CSE012', 'D02', 'CSE-B · Sem 5', 4, 3, 5, 75, 75, null),
    buildStudent(33, 'Iniyavan Palaniswami', '20CSE013', 'D03', 'CSE-B · Sem 5', 4, 3, 5, 75, 43, '2026-03-01'),
    buildStudent(34, 'Jeevitha Madhan',      '20CSE014', 'D04', 'CSE-B · Sem 5', 4, 3, 5, 75, 72, null),
    buildStudent(35, 'Kalaiarasi Rajendran', '20CSE015', 'D05', 'CSE-B · Sem 5', 4, 3, 5, 75, 58, '2026-02-24'),
    buildStudent(36, 'Lokesh Pandian',       '20CSE016', 'D06', 'CSE-B · Sem 5', 4, 3, 5, 75, 69, '2026-02-19'),
    buildStudent(37, 'Malathy Senthilkumar', '20CSE017', 'D07', 'CSE-B · Sem 5', 4, 3, 5, 75, 74, '2026-02-11'),
    buildStudent(38, 'Nandha Kumar R',       '20CSE018', 'D08', 'CSE-B · Sem 5', 4, 3, 5, 75, 36, '2026-03-02'),
    buildStudent(39, 'Oviya Sekar',          '20CSE019', 'D09', 'CSE-B · Sem 5', 4, 3, 5, 75, 73, null),
    buildStudent(40, 'Pavithra Sivasubramanian','20CSE020','D10','CSE-B · Sem 5', 4, 3, 5, 75, 60, '2026-02-25'),
];

// ─── Classes ──────────────────────────────────────────────────────────────────

export const MOCK_CLASSES = [
    {
        sectionId: 1,
        className: 'CSE-A',
        semester: 3,
        year: 2,
        totalStudents: 10,
        avgPercentage: 67,
        criticalCount: 3,
        warningCount: 3,
        goodCount: 4,
        totalClassesConducted: 80,
        subjectBreakdown: [
            { subjectId: 1, subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301', facultyName: 'Dr. Anitha Rajan',       totalClasses: 20, avgPercentage: 71 },
            { subjectId: 2, subjectName: 'Digital Electronics',          subjectCode: 'CS302', facultyName: 'Mr. Suresh Venkataraman', totalClasses: 18, avgPercentage: 69 },
            { subjectId: 3, subjectName: 'Discrete Mathematics',         subjectCode: 'MA301', facultyName: 'Dr. Meena Krishnaswamy',  totalClasses: 18, avgPercentage: 63 },
            { subjectId: 4, subjectName: 'English Communication',        subjectCode: 'HS301', facultyName: 'Dr. Lakshmi Selvaraj',   totalClasses: 12, avgPercentage: 72 },
            { subjectId: 5, subjectName: 'DSA Lab',                      subjectCode: 'CS301L',facultyName: 'Dr. Anitha Rajan',       totalClasses: 12, avgPercentage: 65 },
        ],
    },
    {
        sectionId: 2,
        className: 'CSE-B',
        semester: 3,
        year: 2,
        totalStudents: 10,
        avgPercentage: 66,
        criticalCount: 4,
        warningCount: 3,
        goodCount: 3,
        totalClassesConducted: 80,
        subjectBreakdown: [
            { subjectId: 1, subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301', facultyName: 'Dr. Anitha Rajan',       totalClasses: 20, avgPercentage: 68 },
            { subjectId: 2, subjectName: 'Digital Electronics',          subjectCode: 'CS302', facultyName: 'Mr. Suresh Venkataraman', totalClasses: 18, avgPercentage: 64 },
            { subjectId: 3, subjectName: 'Discrete Mathematics',         subjectCode: 'MA301', facultyName: 'Dr. Meena Krishnaswamy',  totalClasses: 18, avgPercentage: 60 },
            { subjectId: 4, subjectName: 'English Communication',        subjectCode: 'HS301', facultyName: 'Dr. Lakshmi Selvaraj',   totalClasses: 12, avgPercentage: 73 },
            { subjectId: 5, subjectName: 'DSA Lab',                      subjectCode: 'CS301L',facultyName: 'Dr. Anitha Rajan',       totalClasses: 12, avgPercentage: 62 },
        ],
    },
    {
        sectionId: 3,
        className: 'CSE-A',
        semester: 5,
        year: 3,
        totalStudents: 10,
        avgPercentage: 64,
        criticalCount: 4,
        warningCount: 2,
        goodCount: 4,
        totalClassesConducted: 75,
        subjectBreakdown: [
            { subjectId: 6, subjectName: 'Design & Analysis of Algorithms', subjectCode: 'CS501', facultyName: 'Dr. Anitha Rajan',       totalClasses: 20, avgPercentage: 67 },
            { subjectId: 7, subjectName: 'Computer Networks',              subjectCode: 'CS503', facultyName: 'Mr. Suresh Venkataraman', totalClasses: 18, avgPercentage: 60 },
            { subjectId: 8, subjectName: 'Theory of Computation',          subjectCode: 'CS502', facultyName: 'Dr. Meena Krishnaswamy',  totalClasses: 18, avgPercentage: 65 },
            { subjectId: 9, subjectName: 'Software Engineering',           subjectCode: 'CS504', facultyName: 'Dr. Lakshmi Selvaraj',   totalClasses: 12, avgPercentage: 68 },
            { subjectId: 10,subjectName: 'Networks Lab',                   subjectCode: 'CS503L',facultyName: 'Mr. Suresh Venkataraman', totalClasses: 7,  avgPercentage: 61 },
        ],
    },
    {
        sectionId: 4,
        className: 'CSE-B',
        semester: 5,
        year: 3,
        totalStudents: 10,
        avgPercentage: 63,
        criticalCount: 4,
        warningCount: 3,
        goodCount: 3,
        totalClassesConducted: 75,
        subjectBreakdown: [
            { subjectId: 6, subjectName: 'Design & Analysis of Algorithms', subjectCode: 'CS501', facultyName: 'Dr. Anitha Rajan',       totalClasses: 20, avgPercentage: 64 },
            { subjectId: 7, subjectName: 'Computer Networks',              subjectCode: 'CS503', facultyName: 'Mr. Suresh Venkataraman', totalClasses: 18, avgPercentage: 59 },
            { subjectId: 8, subjectName: 'Theory of Computation',          subjectCode: 'CS502', facultyName: 'Dr. Meena Krishnaswamy',  totalClasses: 18, avgPercentage: 62 },
            { subjectId: 9, subjectName: 'Software Engineering',           subjectCode: 'CS504', facultyName: 'Dr. Lakshmi Selvaraj',   totalClasses: 12, avgPercentage: 70 },
            { subjectId: 10,subjectName: 'Networks Lab',                   subjectCode: 'CS503L',facultyName: 'Mr. Suresh Venkataraman', totalClasses: 7,  avgPercentage: 58 },
        ],
    },
];

// ─── Departments ──────────────────────────────────────────────────────────────

export const MOCK_DEPARTMENTS = [
    {
        departmentId: 1,
        departmentName: 'Computer Science & Engineering',
        departmentCode: 'CSE',
        totalStudents: 40,
        avgPercentage: 65,
        criticalCount: 15,
        warningCount: 11,
        goodCount: 14,
        classBreakdown: MOCK_CLASSES,
    },
];

// ─── Summary Stats ────────────────────────────────────────────────────────────

const criticalTotal = MOCK_STUDENTS.filter((s) => s.riskLevel === 'CRITICAL').length;
const warningTotal  = MOCK_STUDENTS.filter((s) => s.riskLevel === 'WARNING').length;
const goodTotal     = MOCK_STUDENTS.filter((s) => s.riskLevel === 'GOOD').length;
const avgOverall    = Math.round(MOCK_STUDENTS.reduce((acc, s) => acc + s.percentage, 0) / MOCK_STUDENTS.length);

// ─── Main Report Data ─────────────────────────────────────────────────────────

export const MOCK_HOD_ATTENDANCE_REPORT_DATA: HODAttendanceReportData = {
    summaryStats: {
        totalStudents: 40,
        overallAvgPercentage: avgOverall,
        criticalCount: criticalTotal,
        warningCount: warningTotal,
        goodCount: goodTotal,
        totalClassesConducted: 310,
        departmentName: 'Computer Science & Engineering',
        semesterLabel: 'Semester III & V — July–Nov 2025',
        periodFilter: 'All Periods · All Subjects',
    },
    students: MOCK_STUDENTS,
    classes: MOCK_CLASSES,
    departments: MOCK_DEPARTMENTS,
    availablePeriods: [
        { periodNumber: 1, startTime: '09:00', endTime: '09:50', label: 'Period 1 (09:00–09:50)' },
        { periodNumber: 2, startTime: '09:50', endTime: '10:40', label: 'Period 2 (09:50–10:40)' },
        { periodNumber: 3, startTime: '10:55', endTime: '11:45', label: 'Period 3 (10:55–11:45)' },
        { periodNumber: 4, startTime: '11:45', endTime: '12:35', label: 'Period 4 (11:45–12:35)' },
        { periodNumber: 5, startTime: '13:30', endTime: '14:20', label: 'Period 5 (13:30–14:20)' },
        { periodNumber: 6, startTime: '14:20', endTime: '15:10', label: 'Period 6 (14:20–15:10)' },
        { periodNumber: 7, startTime: '15:25', endTime: '16:15', label: 'Period 7 (15:25–16:15)' },
    ],
    availableSemesters: [
        { id: 1, label: 'Semester I' },
        { id: 2, label: 'Semester II' },
        { id: 3, label: 'Semester III' },
        { id: 4, label: 'Semester IV' },
        { id: 5, label: 'Semester V' },
        { id: 6, label: 'Semester VI' },
        { id: 7, label: 'Semester VII' },
        { id: 8, label: 'Semester VIII' },
    ],
    availableSubjects: [
        { id: 1,  name: 'Data Structures & Algorithms',  code: 'CS301'  },
        { id: 2,  name: 'Digital Electronics',           code: 'CS302'  },
        { id: 3,  name: 'Discrete Mathematics',          code: 'MA301'  },
        { id: 4,  name: 'English Communication',         code: 'HS301'  },
        { id: 5,  name: 'DSA Lab',                       code: 'CS301L' },
        { id: 6,  name: 'Design & Analysis of Algorithms',code: 'CS501' },
        { id: 7,  name: 'Computer Networks',             code: 'CS503'  },
        { id: 8,  name: 'Theory of Computation',         code: 'CS502'  },
        { id: 9,  name: 'Software Engineering',          code: 'CS504'  },
        { id: 10, name: 'Networks Lab',                  code: 'CS503L' },
    ],
};

// ─── Student Detail Mock (student id 3 — Chetan, critical) ───────────────────

export const MOCK_STUDENT_DETAIL: StudentAttendanceDetail = {
    studentId: 3,
    studentName: 'Chetan Pandurangan',
    registerNumber: '21CSE003',
    rollNumber: 'A03',
    className: 'CSE-A · Sem 3',
    semester: 3,
    year: 2,
    subjectSummaries: [
        { subjectId: 1, subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301',  facultyName: 'Dr. Anitha Rajan',       totalClasses: 20, attended: 10, absent: 10, late: 1, percentage: 50, riskLevel: 'CRITICAL' },
        { subjectId: 2, subjectName: 'Digital Electronics',          subjectCode: 'CS302',  facultyName: 'Mr. Suresh Venkataraman', totalClasses: 18, attended: 8,  absent: 10, late: 2, percentage: 44, riskLevel: 'CRITICAL' },
        { subjectId: 3, subjectName: 'Discrete Mathematics',         subjectCode: 'MA301',  facultyName: 'Dr. Meena Krishnaswamy',  totalClasses: 18, attended: 14, absent: 4,  late: 0, percentage: 78, riskLevel: 'GOOD'     },
        { subjectId: 4, subjectName: 'English Communication',        subjectCode: 'HS301',  facultyName: 'Dr. Lakshmi Selvaraj',   totalClasses: 12, attended: 9,  absent: 3,  late: 0, percentage: 75, riskLevel: 'GOOD'     },
        { subjectId: 5, subjectName: 'DSA Lab',                      subjectCode: 'CS301L', facultyName: 'Dr. Anitha Rajan',       totalClasses: 12, attended: 7,  absent: 5,  late: 1, percentage: 58, riskLevel: 'CRITICAL' },
    ],
    periodRecords: [
        { date: '2026-01-06', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301',  periodLabel: 'Period 1 (09:00–09:50)', status: 'PRESENT', markedBy: 'Dr. Anitha Rajan', isManuallyMarked: false },
        { date: '2026-01-06', subjectName: 'Digital Electronics',          subjectCode: 'CS302',  periodLabel: 'Period 2 (09:50–10:40)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
        { date: '2026-01-07', subjectName: 'Discrete Mathematics',         subjectCode: 'MA301',  periodLabel: 'Period 3 (10:55–11:45)', status: 'PRESENT', markedBy: 'Dr. Meena K.',      isManuallyMarked: false },
        { date: '2026-01-07', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301',  periodLabel: 'Period 4 (11:45–12:35)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
        { date: '2026-01-08', subjectName: 'English Communication',        subjectCode: 'HS301',  periodLabel: 'Period 5 (13:30–14:20)', status: 'LATE',    markedBy: 'Dr. Lakshmi S.',   isManuallyMarked: true  },
        { date: '2026-01-09', subjectName: 'DSA Lab',                      subjectCode: 'CS301L', periodLabel: 'Period 6 (14:20–15:10)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
        { date: '2026-01-13', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301',  periodLabel: 'Period 1 (09:00–09:50)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
        { date: '2026-01-14', subjectName: 'Digital Electronics',          subjectCode: 'CS302',  periodLabel: 'Period 2 (09:50–10:40)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
        { date: '2026-01-15', subjectName: 'Discrete Mathematics',         subjectCode: 'MA301',  periodLabel: 'Period 3 (10:55–11:45)', status: 'PRESENT', markedBy: 'Dr. Meena K.',      isManuallyMarked: false },
        { date: '2026-01-20', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301',  periodLabel: 'Period 1 (09:00–09:50)', status: 'PRESENT', markedBy: 'Dr. Anitha Rajan', isManuallyMarked: false },
        { date: '2026-02-03', subjectName: 'DSA Lab',                      subjectCode: 'CS301L', periodLabel: 'Period 6 (14:20–15:10)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
        { date: '2026-02-10', subjectName: 'Digital Electronics',          subjectCode: 'CS302',  periodLabel: 'Period 2 (09:50–10:40)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
        { date: '2026-02-17', subjectName: 'Data Structures & Algorithms', subjectCode: 'CS301',  periodLabel: 'Period 1 (09:00–09:50)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
        { date: '2026-03-01', subjectName: 'DSA Lab',                      subjectCode: 'CS301L', periodLabel: 'Period 6 (14:20–15:10)', status: 'ABSENT',  markedBy: 'System',            isManuallyMarked: false },
    ],
};

// ─── Class Detail Mock (sectionId 1 — CSE-A Sem 3) ───────────────────────────

export const MOCK_CLASS_DETAIL: ClassAttendanceDetail = {
    sectionId: 1,
    className: 'CSE-A',
    semester: 3,
    year: 2,
    students: MOCK_STUDENTS.filter((s) => s.sectionId === 1),
    subjectBreakdown: MOCK_CLASSES[0].subjectBreakdown,
};
