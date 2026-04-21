import api from '../api/axios';

// --- Types ---
export interface HODClass {
  id: number;
  name: string;
  section: string;
  semester: number;
}

export interface Period {
  id: number;
  label: string;
  start_time: string;
  end_time: string;
  order: number;
  is_break: boolean;
}

export interface Slot {
  slot_id: number;
  day: string;
  period_id: number;
  subject_id: number | null;
  subject_name: string | null;
  faculty_id: number | null;
  faculty_name: string | null;
  faculty_profile_photo: string | null;
  is_assigned: boolean;
}

export interface SubjectItem {
  id: number;
  name: string;
}

export interface FacultyItem {
  id: number;
  name: string;
  profile_photo: string | null;
}

export interface InchargeAssignment {
  id: number;
  section: number;
  section_name: string;
  faculty: number;
  faculty_name: string;
  faculty_email: string;
  section_full_name?: string;
}

export interface TimetableResponse {
  days: string[];
  periods: Period[];
  slots: Slot[];
  incharge: {
    faculty_id: number | null;
    faculty_name: string | null;
  } | null;
  semester_id: number | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  current_semester_id?: number | null;
}

export type Proposal = {
  slot_id: number;
  day: string;
  period_label: string;
  subject_name: string;
  faculty_name: string;
  action: "assign" | "unassign" | "swap";
};

export type Finding = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  affected_slots: number[];
};

export type Alternative = {
  day: string;
  period_label: string;
  is_free: boolean;
  suggestion: string;
};

// --- Service Functions ---

export const HODTimeTableService = {
  /**
   * Fetch all classes for the HOD's department with optional search and pagination
   */
  async fetchClasses(search: string = '', url?: string): Promise<PaginatedResponse<HODClass>> {
    const finalUrl = url || `/hod/classes/?search=${search}`;
    const { data } = await api.get(finalUrl);
    return data;
  },

  /**
   * Fetch the timetable grid and in-charge info for a specific class
   */
  async fetchTimetable(classId: number): Promise<TimetableResponse> {
    const { data } = await api.get(`/hod/timetable/?class_id=${classId}`);
    return data;
  },

  /**
   * Fetch subjects taught in a specific section
   */
  async fetchSubjects(classId: number): Promise<SubjectItem[]> {
    const { data } = await api.get(`/hod/subjects/?class_id=${classId}`);
    return data;
  },

  /**
   * Fetch faculty eligible to teach a subject in a specific class
   */
  async fetchFaculty(subjectId: number, classId: number, search: string = '', url?: string): Promise<PaginatedResponse<FacultyItem>> {
    const finalUrl = url || `/hod/faculty/?subject_id=${subjectId}&class_id=${classId}&search=${search}`;
    const { data } = await api.get(finalUrl);
    return data;
  },

  /**
   * Fetch all department faculty for in-charge assignment
   */
  async fetchAllDeptFaculty(search: string = '', url?: string): Promise<PaginatedResponse<FacultyItem>> {
    const finalUrl = url || `/hod/department-faculty/?search=${search}`;
    const { data } = await api.get(finalUrl);
    return data;
  },

  /**
   * Fetch all active in-charge assignments in the department
   */
  async fetchAllIncharges(): Promise<InchargeAssignment[]> {
    const { data } = await api.get('/hod/section-incharge/');
    return data;
  },

  /**
   * Assign a faculty member to a timetable slot
   */
  async assignSlot(slotId: number, subjectId: number, facultyId: number): Promise<{ success: boolean; slot: Slot }> {
    const { data } = await api.post('/hod/assign-slot/', {
      slot_id: slotId,
      subject_id: subjectId,
      faculty_id: facultyId,
    });
    return data;
  },

  /**
   * Assign a faculty member as the In-Charge for a section
   */
  async assignIncharge(sectionId: number, facultyId: number): Promise<{ success: boolean }> {
    const { data } = await api.post('/hod/section-incharge/', {
      section_id: sectionId,
      faculty_id: facultyId,
    });
    return data;
  },

  // --- AI Copilot ---

  async sendCopilotMessage(message: string, semesterId: number | null, classId: number | null): Promise<{ reply: string; proposals: Proposal[] | null }> {
    const { data } = await api.post('/hod/ai/chat/', {
      message,
      semester_id: semesterId,
      class_id: classId,
    });
    return data;
  },

  async commitProposal(proposal: Proposal): Promise<{ success: boolean, detail: string }> {
    const { data } = await api.post('/hod/ai/commit-proposal/', {
      proposal,
    });
    return data;
  },

  // --- AI Audit ---

  async runAudit(semesterId: number | null): Promise<{ score: number, findings: Finding[] }> {
    const { data } = await api.post('/hod/ai/audit/', {
      semester_id: semesterId,
    });
    return data;
  },

  // --- AI Conflict Explainer ---

  async explainConflict(error: string, context: object): Promise<{ explanation: string, alternatives: Alternative[] }> {
    const { data } = await api.post('/hod/ai/explain-conflict/', {
      error,
      context,
    });
    return data;
  }
};
