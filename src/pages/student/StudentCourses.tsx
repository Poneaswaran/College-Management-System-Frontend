import { BookOpen, Clock, User, TrendingUp, FileText, Calendar } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

interface Course {
    id: string;
    code: string;
    name: string;
    instructor: string;
    credits: number;
    semester: string;
    progress: number;
    grade: string;
    attendance: number;
    assignments: {
        total: number;
        completed: number;
    };
    schedule: string[];
    description: string;
    type: 'Theory' | 'Lab' | 'Practical';
}

const mockCourses: Course[] = [
    {
        id: '1',
        code: 'CS301',
        name: 'Data Structures and Algorithms',
        instructor: 'Dr. Sarah Johnson',
        credits: 4,
        semester: 'Semester 5',
        progress: 75,
        grade: 'A',
        attendance: 92,
        assignments: { total: 8, completed: 6 },
        schedule: ['Monday 9:00 AM', 'Thursday 9:00 AM'],
        description: 'Advanced data structures including trees, graphs, and their applications in algorithm design.',
        type: 'Theory',
    },
    {
        id: '2',
        code: 'CS302',
        name: 'Database Management Systems',
        instructor: 'Prof. Michael Chen',
        credits: 4,
        semester: 'Semester 5',
        progress: 68,
        grade: 'A-',
        attendance: 88,
        assignments: { total: 6, completed: 4 },
        schedule: ['Monday 10:00 AM', 'Thursday 10:00 AM'],
        description: 'Relational database design, SQL, normalization, and database administration.',
        type: 'Theory',
    },
    {
        id: '3',
        code: 'CS303',
        name: 'Web Development',
        instructor: 'Dr. Emily Davis',
        credits: 3,
        semester: 'Semester 5',
        progress: 82,
        grade: 'A',
        attendance: 95,
        assignments: { total: 10, completed: 8 },
        schedule: ['Monday 11:30 AM', 'Friday 11:30 AM'],
        description: 'Modern web development with HTML5, CSS3, JavaScript, and popular frameworks.',
        type: 'Lab',
    },
    {
        id: '4',
        code: 'CS304',
        name: 'Operating Systems',
        instructor: 'Prof. Robert Wilson',
        credits: 4,
        semester: 'Semester 5',
        progress: 60,
        grade: 'B+',
        attendance: 85,
        assignments: { total: 7, completed: 4 },
        schedule: ['Monday 2:00 PM', 'Friday 10:00 AM'],
        description: 'Process management, memory management, file systems, and concurrent programming.',
        type: 'Theory',
    },
    {
        id: '5',
        code: 'CS305',
        name: 'Computer Networks',
        instructor: 'Dr. Lisa Anderson',
        credits: 3,
        semester: 'Semester 5',
        progress: 70,
        grade: 'B+',
        attendance: 90,
        assignments: { total: 5, completed: 3 },
        schedule: ['Tuesday 9:00 AM', 'Friday 9:00 AM'],
        description: 'Network protocols, TCP/IP, routing algorithms, and network security fundamentals.',
        type: 'Theory',
    },
    {
        id: '6',
        code: 'CS306',
        name: 'Software Engineering',
        instructor: 'Prof. David Martinez',
        credits: 3,
        semester: 'Semester 5',
        progress: 78,
        grade: 'A-',
        attendance: 93,
        assignments: { total: 6, completed: 5 },
        schedule: ['Tuesday 11:30 AM'],
        description: 'Software development lifecycle, design patterns, testing, and project management.',
        type: 'Theory',
    },
];

export default function StudentCourses() {
    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-500/10';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-500/10';
        if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-500/10';
        return 'text-red-600 bg-red-500/10';
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Theory':
                return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
            case 'Lab':
                return 'bg-green-500/10 text-green-600 border-green-500/30';
            case 'Practical':
                return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
        }
    };

    const totalCredits = mockCourses.reduce((sum, course) => sum + course.credits, 0);
    const averageProgress = Math.round(
        mockCourses.reduce((sum, course) => sum + course.progress, 0) / mockCourses.length
    );
    const averageAttendance = Math.round(
        mockCourses.reduce((sum, course) => sum + course.attendance, 0) / mockCourses.length
    );

    return (
        <div className="flex bg-[var(--color-background-secondary)] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
                        My Courses
                    </h1>
                    <p className="text-[var(--color-foreground-secondary)]">
                        Manage and track your enrolled courses for the current semester
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <BookOpen size={20} className="text-blue-600" />
                            </div>
                            <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                                Total Courses
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {mockCourses.length}
                        </p>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <TrendingUp size={20} className="text-green-600" />
                            </div>
                            <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                                Total Credits
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {totalCredits}
                        </p>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <FileText size={20} className="text-purple-600" />
                            </div>
                            <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                                Avg Progress
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {averageProgress}%
                        </p>
                    </div>

                    <div className="bg-[var(--color-card)] p-6 rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Calendar size={20} className="text-orange-600" />
                            </div>
                            <h3 className="text-sm font-medium text-[var(--color-foreground-secondary)]">
                                Avg Attendance
                            </h3>
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-foreground)]">
                            {averageAttendance}%
                        </p>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockCourses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:shadow-lg cursor-pointer"
                        >
                            {/* Course Header */}
                            <div className="p-6 border-b border-[var(--color-border)]">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-[var(--color-foreground)]">
                                                {course.name}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-[var(--color-foreground-secondary)] mb-1">
                                            {course.code} • {course.credits} Credits
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                                            course.type
                                        )}`}
                                    >
                                        {course.type}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-secondary)]">
                                    <User size={16} />
                                    <span>{course.instructor}</span>
                                </div>
                            </div>

                            {/* Course Body */}
                            <div className="p-6">
                                <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
                                    {course.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[var(--color-foreground-secondary)]">
                                            Course Progress
                                        </span>
                                        <span className="font-semibold text-[var(--color-foreground)]">
                                            {course.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-[var(--color-background-tertiary)] rounded-full h-2">
                                        <div
                                            className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                        <p className="text-xs text-[var(--color-foreground-muted)] mb-1">
                                            Grade
                                        </p>
                                        <p
                                            className={`text-lg font-bold px-2 py-1 rounded ${getGradeColor(
                                                course.grade
                                            )}`}
                                        >
                                            {course.grade}
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                        <p className="text-xs text-[var(--color-foreground-muted)] mb-1">
                                            Attendance
                                        </p>
                                        <p className="text-lg font-bold text-[var(--color-foreground)]">
                                            {course.attendance}%
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-[var(--color-background-secondary)] rounded-lg">
                                        <p className="text-xs text-[var(--color-foreground-muted)] mb-1">
                                            Assignments
                                        </p>
                                        <p className="text-lg font-bold text-[var(--color-foreground)]">
                                            {course.assignments.completed}/{course.assignments.total}
                                        </p>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className="pt-4 border-t border-[var(--color-border)]">
                                    <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-secondary)] mb-2">
                                        <Clock size={16} />
                                        <span className="font-medium">Class Schedule:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {course.schedule.map((slot, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-medium"
                                            >
                                                {slot}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
