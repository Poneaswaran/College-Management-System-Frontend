import { gql } from '@apollo/client';

// ─── Main Report Overview ─────────────────────────────────────────────────────

export const GET_HOD_ATTENDANCE_REPORT = gql`
    query GetHodAttendanceReport(
        $departmentId: Int
        $semesterId: Int
        $subjectId: Int
        $periodNumber: Int
        $dateFrom: String
        $dateTo: String
    ) {
        hodAttendanceReport(
            departmentId: $departmentId
            semesterId: $semesterId
            subjectId: $subjectId
            periodNumber: $periodNumber
            dateFrom: $dateFrom
            dateTo: $dateTo
        ) {
            summaryStats {
                totalStudents
                overallAvgPercentage
                criticalCount
                warningCount
                goodCount
                totalClassesConducted
                departmentName
                semesterLabel
                periodFilter
            }
            availablePeriods {
                periodNumber
                startTime
                endTime
                label
            }
            availableSemesters {
                id
                label
            }
            availableSubjects {
                id
                name
                code
            }
            students {
                studentId
                studentName
                registerNumber
                rollNumber
                className
                sectionId
                year
                semester
                totalClasses
                attended
                absent
                late
                percentage
                riskLevel
                lastAbsentDate
            }
            classes {
                sectionId
                className
                semester
                year
                totalStudents
                avgPercentage
                criticalCount
                warningCount
                goodCount
                totalClassesConducted
                subjectBreakdown {
                    subjectId
                    subjectName
                    subjectCode
                    facultyName
                    totalClasses
                    avgPercentage
                }
            }
            departments {
                departmentId
                departmentName
                departmentCode
                totalStudents
                avgPercentage
                criticalCount
                warningCount
                goodCount
                classBreakdown {
                    sectionId
                    className
                    semester
                    year
                    totalStudents
                    avgPercentage
                    criticalCount
                    warningCount
                    goodCount
                    totalClassesConducted
                }
            }
        }
    }
`;

// ─── Student Detail Drill-Down ────────────────────────────────────────────────

export const GET_HOD_STUDENT_ATTENDANCE_DETAIL = gql`
    query GetHodStudentAttendanceDetail(
        $studentId: Int!
        $semesterId: Int
        $dateFrom: String
        $dateTo: String
    ) {
        hodStudentAttendanceDetail(
            studentId: $studentId
            semesterId: $semesterId
            dateFrom: $dateFrom
            dateTo: $dateTo
        ) {
            studentId
            studentName
            registerNumber
            rollNumber
            className
            semester
            year
            subjectSummaries {
                subjectId
                subjectName
                subjectCode
                facultyName
                totalClasses
                attended
                absent
                late
                percentage
                riskLevel
            }
            periodRecords {
                date
                subjectName
                subjectCode
                periodLabel
                status
                markedBy
                isManuallyMarked
            }
        }
    }
`;

// ─── Class Detail Drill-Down ──────────────────────────────────────────────────

export const GET_HOD_CLASS_ATTENDANCE_DETAIL = gql`
    query GetHodClassAttendanceDetail(
        $sectionId: Int!
        $semesterId: Int
        $subjectId: Int
        $dateFrom: String
        $dateTo: String
    ) {
        hodClassAttendanceDetail(
            sectionId: $sectionId
            semesterId: $semesterId
            subjectId: $subjectId
            dateFrom: $dateFrom
            dateTo: $dateTo
        ) {
            sectionId
            className
            semester
            year
            students {
                studentId
                studentName
                registerNumber
                rollNumber
                className
                sectionId
                year
                semester
                totalClasses
                attended
                absent
                late
                percentage
                riskLevel
                lastAbsentDate
            }
            subjectBreakdown {
                subjectId
                subjectName
                subjectCode
                facultyName
                totalClasses
                avgPercentage
            }
        }
    }
`;
