import { client } from '../../lib/graphql';
import api from '../../services/api';
import type { 
  Student, 
  StudentProfile, 
  UpdateStudentProfileInput,
  UpdateStudentProfileWithPhotoInput,
  UpdateStudentProfileMutationResponse,
  UpdateStudentProfileWithPhotoMutationResponse
} from './types';
import { 
  GET_STUDENT_PROFILE, 
  UPDATE_STUDENT_PROFILE,
  UPDATE_STUDENT_PROFILE_WITH_PHOTO
} from './graphql/profile';

export const getStudents = () => api.get<Student[]>('/students');
export const getStudent = (id: string) => api.get<Student>(`/students/${id}`);

interface StudentProfileResponse {
  studentProfile: StudentProfile;
}

export const getStudentProfile = async (registerNumber: string) => {
  const { data } = await client.query<StudentProfileResponse>({
    query: GET_STUDENT_PROFILE,
    variables: { registerNumber },
  });

  if (!data) {
    throw new Error('No data returned from student profile query');
  }

  return data.studentProfile;
};

/**
 * Update student profile without photo
 */
export const updateStudentProfile = async (
  registerNumber: string,
  profileData: UpdateStudentProfileInput
) => {
  const { data } = await client.mutate<UpdateStudentProfileMutationResponse>({
    mutation: UPDATE_STUDENT_PROFILE,
    variables: {
      registerNumber,
      data: profileData,
    },
  });

  if (!data) {
    throw new Error('No data returned from update profile mutation');
  }

  return data.updateStudentProfile;
};

/**
 * Convert file to base64 string
 */
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Update student profile with photo using base64 encoding
 * This approach is simpler than multipart/form-data and works with standard GraphQL
 */
export const updateStudentProfileWithPhoto = async (
  registerNumber: string,
  profileData: UpdateStudentProfileWithPhotoInput,
  photoFile?: File | null
) => {
  // Convert photo to base64 if provided
  let photoBase64: string | null = null;
  if (photoFile) {
    photoBase64 = await convertFileToBase64(photoFile);
  }

  const { data } = await client.mutate<UpdateStudentProfileWithPhotoMutationResponse>({
    mutation: UPDATE_STUDENT_PROFILE_WITH_PHOTO,
    variables: {
      registerNumber,
      data: profileData,
      profilePictureBase64: photoBase64,
    },
  });

  if (!data) {
    throw new Error('No data returned from update profile with photo mutation');
  }

  return data.updateStudentProfileWithPhoto;
};
