export interface Semester {
  displayName: string;
  year: string;
  startDate?: string;
  endDate?: string;
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
}

export interface Grade {
  id: string;
  subject: Subject;
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  grade: string;
  gradePoints: number;
  semester: Semester;
  examDate: string;
  isPublished: boolean;
}

export interface SemesterGPA {
  id: string;
  semesterName: string;
  gpa: number;
  totalCredits: number;
  creditsEarned: number;
  semester: Semester;
}

export interface GradeOverview {
  cgpa: number;
  cgpaStatus: string;
  totalCredits: number;
  creditsEarned: number;
  performanceTrend: string;
  semesterGpas: SemesterGPA[];
}

export interface GradesPageResponse {
  gradeOverview: GradeOverview;
  myGrades: Grade[];
}

export interface ExportGradesResponse {
  exportGrades: {
    success: boolean;
    message: string;
    filename: string;
    fileBase64: string;
  };
}
