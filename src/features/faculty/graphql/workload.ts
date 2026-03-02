import { gql } from '@apollo/client';

export const GET_FACULTY_WORKLOAD = gql`
    query GetFacultyWorkload($semesterId: Int) {
        facultyWorkload(semesterId: $semesterId) {
            departmentName
            semesterLabel
            summaryStats {
                totalFaculty
                overloadedCount
                optimalCount
                underloadedCount
                avgHoursPerWeek
                totalCourseSections
            }
            facultyWorkloads {
                id
                facultyName
                employeeId
                designation
                department
                profilePhoto
                totalHoursPerWeek
                maxHoursPerWeek
                status
                attendanceAvg
                pendingGradingCount
                courseAssignments {
                    id
                    subjectName
                    subjectCode
                    sectionName
                    semester
                    hoursPerWeek
                    studentCount
                    department
                }
            }
        }
    }
`;
