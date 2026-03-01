import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import Sidebar from '../../components/layout/Sidebar';
import { MoreHorizontal, Download } from 'lucide-react';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { FilterBar } from '../../components/ui/FilterBar';
import { GET_FACULTY_STUDENTS } from '../../features/faculty/graphql/students';
import type { FacultyStudent, FacultyStudentsResponse } from '../../features/faculty/types/students';

// We map department names to IDs for the dropdown if needed, but since our
// backend expects $departmentId as Int, we should ideally have a list.
// For now, let's assume we map selected department name to an ID or leave it 
// as string if your backend was updated. Wait, the query says $departmentId: Int.
// If the UI only has 'Computer Science' etc., we need their IDs.
// Let's assume some IDs for the mock options, or we can fetch departments separately.
// The user's prompt says: `$departmentId: Int`.
const DEPARTMENT_OPTIONS = [
    { value: 'ALL', label: 'All Departments' },
    { value: '1', label: 'Computer Science' },
    { value: '2', label: 'Electrical Engineering' },
    { value: '3', label: 'Mechanical Engineering' },
    { value: '4', label: 'Civil Engineering' },
    { value: '5', label: 'Information Technology' },
];

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

const studentColumns: Column<FacultyStudent>[] = [
    {
        key: 'fullName',
        header: 'Student Info',
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-medium text-[var(--color-foreground)]">{row.fullName}</span>
                <span className="text-xs text-[var(--color-foreground-muted)]">{row.email}</span>
            </div>
        ),
    },
    {
        key: 'registerNumber',
        header: 'Register Number',
        render: (row) => (
            <span className="font-mono text-[var(--color-foreground)]">{row.registerNumber}</span>
        ),
    },
    {
        key: 'departmentName',
        header: 'Department',
        render: (row) => (
            <span className="text-[var(--color-foreground)]">{row.departmentName}</span>
        ),
    },
    {
        key: 'semesterSection',
        header: 'Semester / Section',
        render: (row) => (
            <span className="text-[var(--color-foreground)]">{row.semesterSection}</span>
        ),
    },
    {
        key: 'attendancePercentage',
        header: 'Attendance',
        render: (row) => (
            <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                        className={`h-full ${row.attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${row.attendancePercentage}%` }}
                    />
                </div>
                <span className={`font-medium ${getAttendanceColor(row.attendancePercentage)}`}>
                    {row.attendancePercentage}%
                </span>
            </div>
        ),
    },
    {
        key: 'gpa',
        header: 'GPA',
        render: (row) => (
            <span className="font-medium text-[var(--color-foreground)]">{row.gpa?.toFixed(2) || 'N/A'}</span>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (row) => (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                {row.status}
            </span>
        ),
    },
    {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: () => (
            <button className="p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors">
                <MoreHorizontal size={18} />
            </button>
        ),
    },
];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export const StudentList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [filterDepartment, setFilterDepartment] = useState('ALL');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Parse departmentId
    const departmentId = filterDepartment === 'ALL' ? undefined : parseInt(filterDepartment, 10);

    const { data, loading, error } = useQuery<FacultyStudentsResponse>(GET_FACULTY_STUDENTS, {
        variables: {
            search: debouncedSearchTerm || undefined,
            departmentId: departmentId,
            page: page,
            pageSize: pageSize,
        },
        fetchPolicy: 'cache-and-network',
    });

    const students = data?.facultyStudents?.students || [];
    const totalCount = data?.facultyStudents?.totalCount || 0;

    // Handlers to reset page when filters change
    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        setPage(1);
    };

    const handleDepartmentChange = (val: string) => {
        setFilterDepartment(val);
        setPage(1);
    };

    const handlePageSizeChange = (val: number) => {
        setPageSize(val);
        setPage(1);
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
                            <p className="text-[var(--color-foreground-muted)] mt-1">
                                Manage and view all enrolled students
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] transition-colors">
                                <Download size={16} />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                                Add Student
                            </button>
                        </div>
                    </div>

                    {/* Filters and Search — Using shared components */}
                    <FilterBar className="mb-6">
                        <SearchInput
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by name, register number or email..."
                            wrapperClassName="w-full md:w-96"
                        />
                        <FilterBar.Actions>
                            <Select
                                value={filterDepartment}
                                onChange={handleDepartmentChange}
                                options={DEPARTMENT_OPTIONS}
                            />
                        </FilterBar.Actions>
                    </FilterBar>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                            An error occurred while fetching students: {error.message}
                        </div>
                    )}

                    {/* Table — Using the shared DataTable component */}
                    <DataTable<FacultyStudent>
                        columns={studentColumns}
                        data={students}
                        pageSize={pageSize}
                        loading={loading}
                        totalCount={totalCount}
                        currentPage={page}
                        onPageChange={setPage}
                        onPageSizeChange={handlePageSizeChange}
                        emptyMessage="No students found matching your criteria"
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentList;
