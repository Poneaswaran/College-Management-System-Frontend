export interface Assignment {
  id: string;
  title: string;
  subjectName: string;
  subjectCode: string;
  dueDate: string;
  maxMarks: number;
  isSubmitted: boolean;
  submissionDate?: string;
}

export interface RecentActivity {
  id: string;
  activityType: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface CourseProgress {
  subjectCode: string;
  subjectName: string;
  totalAssignments: number;
  completedAssignments: number;
  percentage: number;
}

export interface ClassSchedule {
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  roomNumber: string;
  startTime: string;
  endTime: string;
  dayName?: string;
}

export interface StudentDashboardData {
  studentName: string;
  registerNumber: string;
  profilePhotoUrl?: string;
  assignmentsDueThisWeek: Assignment[];
  totalPendingAssignments: number;
  totalOverdueAssignments: number;
  recentActivities: RecentActivity[];
  courseProgress: CourseProgress[];
  overallProgressPercentage: number;
  currentGpa: number;
  nextClass?: ClassSchedule;
  todayClasses: ClassSchedule[];
}

export interface StudentDashboardResponse {
  studentDashboard: StudentDashboardData;
}
