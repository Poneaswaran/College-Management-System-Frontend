import type { HODProfile } from '../types/hodProfile';

// ============================================
// Mock data for /hod/profile route
// Used as fallback when backend is unavailable
// ============================================

export const MOCK_HOD_PROFILE: HODProfile = {
    id: 1,
    firstName: 'Suresh',
    lastName: 'Venkatesh',
    fullName: 'Dr. Suresh Venkatesh',
    email: 'suresh.venkatesh@university.edu',
    phone: '+91 98451 23456',
    dateOfBirth: '1972-04-18',
    gender: 'MALE',
    address: '14, Professors Colony, University Campus, Chennai – 600025',
    profilePhoto: null,

    employeeId: 'CSE-HOD-001',
    designation: 'Professor & Head of Department',
    joiningDate: '2003-07-15',
    hodSince: '2019-06-01',
    academicStatus: 'ACTIVE',
    qualifications: 'Ph.D. (Computer Science) – IIT Madras, M.E. (CSE) – Anna University',
    specialization: 'Distributed Systems & Cloud Computing',
    experience: '22 Years',
    researchInterests: [
        'Distributed Systems',
        'Cloud & Edge Computing',
        'Machine Learning',
        'Cyber Security',
    ],

    department: {
        name: 'Computer Science & Engineering',
        code: 'CSE',
        vision:
            'To be a centre of excellence in Computer Science education, research, and innovation that produces ethical and globally competitive engineers.',
    },

    departmentStats: {
        totalFaculty: 18,
        totalStudents: 480,
        activeCourses: 42,
        researchProjects: 7,
    },

    publications: [
        {
            id: 1,
            title: 'Adaptive Resource Scheduling in Heterogeneous Cloud Environments',
            journal: 'IEEE Transactions on Cloud Computing',
            year: 2023,
            type: 'JOURNAL',
            doi: '10.1109/TCC.2023.1234567',
        },
        {
            id: 2,
            title: 'Federated Edge Intelligence for Real-Time IoT Analytics',
            journal: 'International Conference on Distributed Computing (ICDCS)',
            year: 2022,
            type: 'CONFERENCE',
        },
        {
            id: 3,
            title: 'Secure Multi-Party Computation: Practical Approaches',
            journal: 'Springer Lecture Notes in Computer Science',
            year: 2021,
            type: 'BOOK_CHAPTER',
        },
        {
            id: 4,
            title: 'Container Orchestration Strategies for Microservice Architectures',
            journal: 'Journal of Systems and Software',
            year: 2020,
            type: 'JOURNAL',
            doi: '10.1016/j.jss.2020.110789',
        },
        {
            id: 5,
            title: 'Deep Learning Based Intrusion Detection in SDN Networks',
            journal: 'IEEE INFOCOM Workshop on Network Intelligence',
            year: 2019,
            type: 'CONFERENCE',
        },
    ],
};
