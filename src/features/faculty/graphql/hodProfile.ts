import { gql } from '@apollo/client';

export const GET_HOD_PROFILE = gql`
    query GetHODProfile {
        hodProfile {
            id
            firstName
            lastName
            fullName
            email
            phone
            dateOfBirth
            gender
            address
            profilePhoto
            employeeId
            designation
            joiningDate
            hodSince
            academicStatus
            qualifications
            specialization
            experience
            researchInterests
            department {
                name
                code
                vision
            }
            departmentStats {
                totalFaculty
                totalStudents
                activeCourses
                researchProjects
            }
            publications {
                id
                title
                journal
                year
                type
                doi
            }
        }
    }
`;

export const UPDATE_HOD_PROFILE = gql`
    mutation UpdateHODProfile(
        $firstName: String
        $lastName: String
        $phone: String
        $address: String
        $researchInterests: [String!]
    ) {
        updateHODProfile(
            data: {
                firstName: $firstName
                lastName: $lastName
                phone: $phone
                address: $address
                researchInterests: $researchInterests
            }
        ) {
            id
            firstName
            lastName
            fullName
            phone
            address
            researchInterests
        }
    }
`;
