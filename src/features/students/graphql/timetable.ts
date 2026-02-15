import { gql } from 'graphql-tag';

export const TIMETABLE_PAGE_QUERY = gql`
  query TimetablePage($registerNumber: String!) {
    currentSemester {
      id
      number
      displayName
      year
      startDate
      endDate
    }
    
    myTimetable(registerNumber: $registerNumber) {
      id
      subject {
        code
        name
        subjectType
      }
      faculty {
        email
        registerNumber
      }
      room {
        roomNumber
        building
      }
      periodDefinition {
        dayOfWeek
        dayName
        startTime
        endTime
        periodNumber
      }
    }
    
    timetableStatistics(registerNumber: $registerNumber) {
      totalClasses
      theoryClasses
      labSessions
      tutorialClasses
    }
  }
`;

export const MY_TIMETABLE_QUERY = gql`
  query MyTimetable($registerNumber: String!) {
    myTimetable(registerNumber: $registerNumber) {
      id
      subject {
        code
        name
        subjectType
      }
      faculty {
        email
        registerNumber
      }
      room {
        roomNumber
        building
      }
      periodDefinition {
        dayOfWeek
        dayName
        startTime
        endTime
        periodNumber
      }
      notes
    }
  }
`;

export const TIMETABLE_STATISTICS_QUERY = gql`
  query TimetableStatistics($registerNumber: String!) {
    timetableStatistics(registerNumber: $registerNumber) {
      totalClasses
      theoryClasses
      labSessions
      tutorialClasses
    }
  }
`;

export const CURRENT_SEMESTER_QUERY = gql`
  query CurrentSemester {
    currentSemester {
      id
      number
      displayName
      year
      startDate
      endDate
      isCurrent
    }
  }
`;
