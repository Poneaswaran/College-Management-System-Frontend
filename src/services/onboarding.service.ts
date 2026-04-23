import api from './api';

export interface OnboardingApproval {
  id: number;
  student_id?: number;
  faculty_id?: number;
  registration_number?: string;
  employee_id?: string;
  student_name?: string;
  faculty_name?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  rejected_at?: string;
}

class OnboardingService {
  // Student Onboarding
  async getPendingStudents(): Promise<OnboardingApproval[]> {
    const response = await api.get('/onboarding/admin/students/pending-approvals/');
    return response.data;
  }

  async approveStudent(studentId: number, remarks: string = '') {
    const response = await api.post(`/onboarding/admin/students/${studentId}/approve/`, { remarks });
    return response.data;
  }

  async rejectStudent(studentId: number, remarks: string = '') {
    const response = await api.post(`/onboarding/admin/students/${studentId}/reject/`, { remarks });
    return response.data;
  }

  async bulkApproveStudents(ids: number[], remarks: string = '') {
    const response = await api.post('/onboarding/admin/students/bulk-approve/', { ids, remarks });
    return response.data;
  }

  async bulkRejectStudents(ids: number[], remarks: string = '') {
    const response = await api.post('/onboarding/admin/students/bulk-reject/', { ids, remarks });
    return response.data;
  }

  // Faculty Onboarding
  async getPendingFaculty(): Promise<OnboardingApproval[]> {
    const response = await api.get('/onboarding/admin/faculty/pending-approvals/');
    return response.data;
  }

  async approveFaculty(facultyId: number, remarks: string = '') {
    const response = await api.post(`/onboarding/admin/faculty/${facultyId}/approve/`, { remarks });
    return response.data;
  }

  async rejectFaculty(facultyId: number, remarks: string = '') {
    const response = await api.post(`/onboarding/admin/faculty/${facultyId}/reject/`, { remarks });
    return response.data;
  }

  async bulkApproveFaculty(ids: number[], remarks: string = '') {
    const response = await api.post('/onboarding/admin/faculty/bulk-approve/', { ids, remarks });
    return response.data;
  }

  async bulkRejectFaculty(ids: number[], remarks: string = '') {
    const response = await api.post('/onboarding/admin/faculty/bulk-reject/', { ids, remarks });
    return response.data;
  }
}

export default new OnboardingService();
