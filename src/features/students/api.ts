import { client } from '../../lib/graphql';
import api from '../../services/api';
import type { Student, StudentProfile } from './types';
import { GET_STUDENT_PROFILE } from './graphql/profile';

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
