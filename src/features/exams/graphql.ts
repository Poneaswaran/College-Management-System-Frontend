import { gql } from '@apollo/client';

export const GET_EXAMS = gql`
    query GetExams($semesterId: ID, $examType: String, $status: String, $departmentId: ID) {
        exams(semesterId: $semesterId, examType: $examType, status: $status, departmentId: $departmentId) {
            id
            name
            description
            semesterId
            departmentId
            examType
            status
            maxMarks
            passMarks
            startDate
            endDate
        }
    }
`;

export const GET_EXAM = gql`
    query GetExam($id: ID!) {
        exam(id: $id) {
            id
            name
            description
            semesterId
            departmentId
            examType
            status
            maxMarks
            passMarks
            startDate
            endDate
        }
    }
`;

export const GET_UPCOMING_EXAMS = gql`
    query GetUpcomingExams {
        upcomingExams {
            id
            name
            examType
            status
            startDate
            endDate
        }
    }
`;

export const GET_EXAM_SCHEDULES = gql`
    query GetExamSchedules($examId: ID!, $sectionId: ID) {
        examSchedules(examId: $examId, sectionId: $sectionId) {
            id
            examId
            sectionId
            subjectId
            subjectName
            subjectCode
            date
            startTime
            endTime
            room
            invigilatorId
            invigilatorName
        }
    }
`;

export const GET_SEATING_ARRANGEMENT = gql`
    query GetSeatingArrangement($scheduleId: ID!) {
        seatingArrangement(scheduleId: $scheduleId) {
            id
            scheduleId
            studentId
            studentName
            registerNumber
            seatNumber
        }
    }
`;

export const GET_EXAM_RESULTS = gql`
    query GetExamResults($scheduleId: ID!, $status: String) {
        examResults(scheduleId: $scheduleId, status: $status) {
            id
            scheduleId
            studentId
            studentName
            registerNumber
            marksObtained
            isAbsent
            gradeLetter
            status
            remarks
        }
    }
`;

export const GET_HALL_TICKETS = gql`
    query GetHallTickets($examId: ID!, $sectionId: ID) {
        hallTickets(examId: $examId, sectionId: $sectionId) {
            id
            examId
            studentId
            issueDate
            status
        }
    }
`;

// Dashboard & Specific Queries
export const GET_MY_EXAM_SCHEDULE = gql`
    query MyExamSchedule($examId: ID!) {
        myExamSchedule(examId: $examId) {
            id
            examId
            subjectName
            date
            startTime
            endTime
            room
        }
    }
`;

export const GET_MY_SEAT = gql`
    query MySeat($scheduleId: ID!) {
        mySeat(scheduleId: $scheduleId) {
            seatNumber
            room
        }
    }
`;

export const GET_MY_RESULTS = gql`
    query MyResults($examId: ID, $semesterId: ID) {
        myResults(examId: $examId, semesterId: $semesterId) {
            id
            subjectName
            marksObtained
            gradeLetter
            status
        }
    }
`;

export const GET_MY_HALL_TICKET = gql`
    query MyHallTicket($examId: ID!) {
        myHallTicket(examId: $examId) {
            id
            issueDate
            status
        }
    }
`;

// Mutations
export const CREATE_EXAM = gql`
    mutation CreateExam($input: ExamInput!) {
        createExam(input: $input) {
            id
            name
            status
        }
    }
`;

export const UPDATE_EXAM = gql`
    mutation UpdateExam($id: ID!, $input: ExamInput!) {
        updateExam(id: $id, input: $input) {
            id
            name
            status
        }
    }
`;

export const UPDATE_EXAM_STATUS = gql`
    mutation UpdateExamStatus($id: ID!, $status: String!) {
        updateExamStatus(id: $id, status: $status) {
            id
            status
        }
    }
`;

export const DELETE_EXAM = gql`
    mutation DeleteExam($id: ID!) {
        deleteExam(id: $id)
    }
`;

export const CREATE_EXAM_SCHEDULE = gql`
    mutation CreateExamSchedule($input: ExamScheduleInput!) {
        createExamSchedule(input: $input) {
            id
            date
            startTime
        }
    }
`;

export const AUTO_ASSIGN_SEATING = gql`
    mutation AutoAssignSeating($scheduleId: ID!) {
        autoAssignSeating(scheduleId: $scheduleId) {
            success
            message
            assignedCount
        }
    }
`;

export const MARK_EXAM_ATTENDANCE = gql`
    mutation MarkExamAttendance($scheduleId: ID!, $studentId: ID!, $isAbsent: Boolean!) {
        markExamAttendance(scheduleId: $scheduleId, studentId: $studentId, isAbsent: $isAbsent) {
            id
            isAbsent
        }
    }
`;

export const BULK_ENTER_MARKS = gql`
    mutation BulkEnterMarks($scheduleId: ID!, $marks: [MarkInput!]!) {
        bulkEnterMarks(scheduleId: $scheduleId, marks: $marks) {
            success
            message
        }
    }
`;

export const VERIFY_RESULTS = gql`
    mutation VerifyResults($scheduleId: ID!) {
        verifyResults(scheduleId: $scheduleId) {
            success
            message
        }
    }
`;

export const PUBLISH_RESULTS = gql`
    mutation PublishResults($scheduleId: ID!) {
        publishResults(scheduleId: $scheduleId) {
            success
            message
        }
    }
`;

export const BULK_GENERATE_HALL_TICKETS = gql`
    mutation BulkGenerateHallTickets($examId: ID!, $sectionId: ID!) {
        bulkGenerateHallTickets(examId: $examId, sectionId: $sectionId) {
            success
            message
            generatedCount
        }
    }
`;
