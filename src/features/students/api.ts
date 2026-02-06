import api from '../../services/api';
import type { Student } from './types';

export const getStudents = () => api.get<Student[]>('/students');
export const getStudent = (id: string) => api.get<Student>(`/students/${id}`);
