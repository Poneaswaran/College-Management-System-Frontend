import { gql } from '@apollo/client';

export const GET_STUDENT_PROFILE = gql`
  query StudentProfile($registerNumber: String!) {
    studentProfile(registerNumber: $registerNumber) {
      id
      registerNumber
      rollNumber
      fullName
      lastName
      dateOfBirth
      gender
      phone
      address
      aadharNumber
      idProofType
      idProofNumber
      guardianName
      guardianRelationship
      guardianPhone
      guardianEmail
      admissionDate
      academicStatus
      year
      semester
      profilePhotoUrl
      profileCompleted
      course {
        code
        name
        durationYears
        department {
          code
          name
        }
      }
      section {
        name
        year
      }
      user {
        email
        registerNumber
      }
    }
  }
`;
