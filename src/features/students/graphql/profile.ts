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

export const UPDATE_STUDENT_PROFILE = gql`
  mutation UpdateStudentProfile($registerNumber: String!, $data: UpdateStudentProfileInput!) {
    updateStudentProfile(registerNumber: $registerNumber, data: $data) {
      profile {
        id
        registerNumber
        fullName
        lastName
        phone
        dateOfBirth
        gender
        address
        guardianName
        guardianRelationship
        guardianPhone
        guardianEmail
        profilePhotoUrl
        profileCompleted
      }
      message
    }
  }
`;

export const UPDATE_STUDENT_PROFILE_WITH_PHOTO = gql`
  mutation UpdateStudentProfileWithPhoto(
    $registerNumber: String!
    $data: UpdateStudentProfileWithPhotoInput!
    $profilePictureBase64: String
  ) {
    updateStudentProfileWithPhoto(
      registerNumber: $registerNumber
      data: $data
      profilePictureBase64: $profilePictureBase64
    ) {
      profile {
        id
        registerNumber
        fullName
        lastName
        phone
        dateOfBirth
        gender
        address
        guardianName
        guardianRelationship
        guardianPhone
        guardianEmail
        profilePhotoUrl
        profileCompleted
        user {
          email
          registerNumber
        }
        course {
          code
          name
        }
        section {
          name
          year
        }
      }
      message
    }
  }
`;
