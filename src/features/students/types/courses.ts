export interface ClassSchedule {
  dayName: string;
  startTime: string;
  endTime: string;
}

export interface Course {
  id: string;
  subjectCode: string;
  subjectName: string;
  subjectType: string;
  credits: number;
  facultyName: string;
  facultyEmail: string;
  description: string;
  courseProgress: number;
  grade: string;
  attendancePercentage: number;
  completedAssignments: number;
  totalAssignments: number;
  classSchedule: ClassSchedule[];
}

export interface CourseOverview {
  totalCourses: number;
  totalCredits: number;
  avgProgress: number;
  avgAttendance: number;
}

export interface CoursesPageResponse {
  courseOverview: CourseOverview;
  myCourses: Course[];
}
