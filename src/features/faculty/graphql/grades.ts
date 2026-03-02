import { gql } from '@apollo/client';

// ============================================
// Faculty Grade Submission — GraphQL Queries & Mutations
// ============================================

/**
 * Fetches all course sections assigned to the logged-in faculty member
 * along with their grade submission summary for the current semester.
 */
export const GET_FACULTY_GRADES = gql`
    query GetFacultyGrades($semesterId: Int) {
        facultyGrades(semesterId: $semesterId) {
            summary {
                totalCourses
                totalSubmitted
                totalDraft
                totalPendingApproval
                totalApproved
                totalRejected
                currentSemesterLabel
            }
            courseSections {
                id
                subjectCode
                subjectName
                sectionName
                semester
                semesterLabel
                department
                examType
                examDate
                internalMaxMark
                externalMaxMark
                totalMaxMark
                passMark
                studentCount
                submittedCount
                status
                lastModifiedAt
                submittedAt
            }
        }
    }
`;

/**
 * Fetches the full grade detail for a specific course section —
 * includes per-student marks, derived grades, and aggregate stats.
 */
export const GET_FACULTY_GRADE_DETAIL = gql`
    query GetFacultyGradeDetail($courseSectionId: Int!) {
        facultyGradeDetail(courseSectionId: $courseSectionId) {
            courseSection {
                id
                subjectCode
                subjectName
                sectionName
                semester
                semesterLabel
                department
                examType
                examDate
                internalMaxMark
                externalMaxMark
                totalMaxMark
                passMark
                studentCount
                submittedCount
                status
                lastModifiedAt
                submittedAt
            }
            stats {
                totalStudents
                passCount
                failCount
                absentCount
                passPercentage
                avgMark
                highestMark
                lowestMark
                gradeDistribution {
                    grade
                    count
                    percentage
                }
            }
            students {
                studentId
                registerNumber
                rollNumber
                studentName
                profilePhoto
                internalMark
                externalMark
                totalMark
                percentage
                letterGrade
                gradePoint
                isPass
                isAbsent
            }
        }
    }
`;

/**
 * Saves grade entries as a draft (non-destructive, can be called multiple times).
 */
export const SAVE_GRADES_DRAFT = gql`
    mutation SaveGradesDraft($input: SaveGradesDraftInput!) {
        saveGradesDraft(input: $input) {
            success
            message
            updatedAt
        }
    }
`;

/**
 * Submits grades for HOD/admin approval. After this call the status
 * moves to SUBMITTED and the faculty can no longer edit without rejection.
 */
export const SUBMIT_GRADES = gql`
    mutation SubmitGrades($input: SubmitGradesInput!) {
        submitGrades(input: $input) {
            success
            message
            submittedAt
            status
        }
    }
`;
