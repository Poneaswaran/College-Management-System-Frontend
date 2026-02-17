import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { Search, Filter, MoreHorizontal, Download } from 'lucide-react';

interface Student {
    id: string;
    registerNumber: string;
    name: string;
    department: string;
    semester: number;
    section: string;
    gpa: number;
    attendancePercentage: number;
    email: string;
    status: 'ACTIVE' | 'INACTIVE' | 'ALUMNI';
}

const MOCK_STUDENTS: Student[] = [
    {
        id: '1',
        registerNumber: 'REG2023001',
        name: 'John Doe',
        department: 'Computer Science',
        semester: 4,
        section: 'A',
        gpa: 3.8,
        attendancePercentage: 95.5,
        email: 'john.doe@college.edu',
        status: 'ACTIVE',
    },
    {
        id: '2',
        registerNumber: 'REG2023002',
        name: 'Jane Smith',
        department: 'Computer Science',
        semester: 4,
        section: 'A',
        gpa: 3.9,
        attendancePercentage: 98.2,
        email: 'jane.smith@college.edu',
        status: 'ACTIVE',
    },
    {
        id: '3',
        registerNumber: 'REG2023003',
        name: 'Alice Johnson',
        department: 'Electrical Engineering',
        semester: 2,
        section: 'B',
        gpa: 3.5,
        attendancePercentage: 88.0,
        email: 'alice.j@college.edu',
        status: 'ACTIVE',
    },
    {
        id: '4',
        registerNumber: 'REG2023004',
        name: 'Bob Brown',
        department: 'Mechanical Engineering',
        semester: 6,
        section: 'C',
        gpa: 3.2,
        attendancePercentage: 75.4,
        email: 'bob.brown@college.edu',
        status: 'INACTIVE',
    },
    {
        id: '5',
        registerNumber: 'REG2023005',
        name: 'Charlie Davis',
        department: 'Civil Engineering',
        semester: 8,
        section: 'A',
        gpa: 3.7,
        attendancePercentage: 92.1,
        email: 'charlie.d@college.edu',
        status: 'ACTIVE',
    },
    {
        id: '6',
        registerNumber: 'REG2023006',
        name: 'Diana Evans',
        department: 'Computer Science',
        semester: 4,
        section: 'B',
        gpa: 3.6,
        attendancePercentage: 85.5,
        email: 'diana.e@college.edu',
        status: 'ACTIVE',
    },
    {
        id: '7',
        registerNumber: 'REG2023007',
        name: 'Ethan Foster',
        department: 'Information Technology',
        semester: 2,
        section: 'A',
        gpa: 3.4,
        attendancePercentage: 90.0,
        email: 'ethan.f@college.edu',
        status: 'ACTIVE',
    }
];

export const StudentList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('ALL');

    const filteredStudents = MOCK_STUDENTS.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment = filterDepartment === 'ALL' || student.department === filterDepartment;

        return matchesSearch && matchesDepartment;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'INACTIVE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'ALUMNI': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getAttendanceColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 dark:text-green-400';
        if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Student List</h1>
                            <p className="text-[var(--color-muted-foreground)] mt-1">
                                Manage and view all enrolled students
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] transition-colors">
                                <Download size={16} />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                                Add Student
                            </button>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-4 mb-6 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name, register number..."
                                    className="w-full pl-10 pr-4 py-2 outline-none border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg">
                                    <Filter size={16} className="text-[var(--color-muted-foreground)]" />
                                    <select
                                        className="bg-transparent border-none outline-none text-sm text-[var(--color-foreground)]"
                                        value={filterDepartment}
                                        onChange={(e) => setFilterDepartment(e.target.value)}
                                    >
                                        <option value="ALL">All Departments</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Electrical Engineering">Electrical Engineering</option>
                                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                                        <option value="Civil Engineering">Civil Engineering</option>
                                        <option value="Information Technology">Information Technology</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[var(--color-muted-foreground)] bg-[var(--color-background-secondary)] border-b border-[var(--color-border)]">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Student Info</th>
                                        <th className="px-6 py-4 font-medium">Register Number</th>
                                        <th className="px-6 py-4 font-medium">Department</th>
                                        <th className="px-6 py-4 font-medium">Semester/Section</th>
                                        <th className="px-6 py-4 font-medium">Attendance</th>
                                        <th className="px-6 py-4 font-medium">GPA</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border)]">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-[var(--color-background-secondary)]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-[var(--color-foreground)]">{student.name}</span>
                                                        <span className="text-xs text-[var(--color-muted-foreground)]">{student.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-[var(--color-foreground)]">
                                                    {student.registerNumber}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--color-foreground)]">
                                                    {student.department}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--color-foreground)]">
                                                    Sem {student.semester} - {student.section}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${student.attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                                                                style={{ width: `${student.attendancePercentage}%` }}
                                                            />
                                                        </div>
                                                        <span className={`font-medium ${getAttendanceColor(student.attendancePercentage)}`}>
                                                            {student.attendancePercentage}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-[var(--color-foreground)]">
                                                    {student.gpa}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-[var(--color-muted-foreground)]">
                                                No students found matching your criteria
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Mock */}
                        <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
                            <span className="text-sm text-[var(--color-muted-foreground)]">
                                Showing {filteredStudents.length} of {MOCK_STUDENTS.length} students
                            </span>
                            <div className="flex items-center gap-2">
                                <button disabled className="px-3 py-1 text-sm border border-[var(--color-border)] rounded-md opacity-50 cursor-not-allowed">Previous</button>
                                <button className="px-3 py-1 text-sm border border-[var(--color-border)] rounded-md hover:bg-[var(--color-background-secondary)]">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
