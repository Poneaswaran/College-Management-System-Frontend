import { TrendingUp, Award, BookOpen, Calendar, Download, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/layout/Sidebar';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Select } from '../../components/ui/Select';
import { client } from '../../lib/graphql';
import { getErrorMessage } from '../../lib/errorHandling';
import { GRADES_PAGE_QUERY, EXPORT_GRADES_QUERY } from '../../features/students/graphql/grades';
import type { GradesPageResponse, ExportGradesResponse, Grade } from '../../features/students/types/grades';
import type { RootState } from '../../store';

const getGradeColor = (grade: string) => {
    if (!grade) return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
    if (grade === 'A+' || grade === 'A') return 'text-green-600 bg-green-500/10 border-green-500/20';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
    if (grade === 'D') return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
    return 'text-red-600 bg-red-500/10 border-red-500/20';
};

const gradeColumns: Column<Grade>[] = [
    {
        key: 'subjectCode',
        header: 'Course Code',
        render: (row) => (
            <span className="font-medium text-[var(--color-foreground)]">{row.subject.code}</span>
        ),
    },
    {
        key: 'subjectName',
        header: 'Course Name',
        render: (row) => (
            <span className="text-[var(--color-foreground)]">{row.subject.name}</span>
        ),
    },
    {
        key: 'credits',
        header: 'Credits',
        align: 'center',
        render: (row) => (
            <span className="text-[var(--color-foreground)] font-medium">{row.subject.credits}</span>
        ),
    },
    {
        key: 'marks',
        header: 'Marks',
        align: 'center',
        render: (row) => (
            <div>
                <div className="text-[var(--color-foreground)] font-medium">{row.totalMarks}/{row.totalMaxMarks}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">{row.percentage.toFixed(1)}%</div>
            </div>
        ),
    },
    {
        key: 'grade',
        header: 'Grade',
        align: 'center',
        render: (row) => (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(row.grade)}`}>
                {row.grade || 'N/A'}
            </span>
        ),
    },
    {
        key: 'gradePoints',
        header: 'Grade Points',
        align: 'center',
        render: (row) => (
            <span className="text-[var(--color-foreground)] font-semibold">
                {row.gradePoints != null ? row.gradePoints.toFixed(1) : 'N/A'}
            </span>
        ),
    },
    {
        key: 'semester',
        header: 'Semester',
        render: (row) => (
            <span className="text-[var(--color-foreground)]">
                {row.semester.displayName} {row.semester.year}
            </span>
        ),
    },
    {
        key: 'examDate',
        header: 'Exam Date',
        render: (row) => (
            <span className="text-[var(--color-muted-foreground)]">
                {row.examDate ? new Date(row.examDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) : 'N/A'}
            </span>
        ),
    },
];

export default function Grades() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [data, setData] = useState<GradesPageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string>('all');
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const fetchGrades = async () => {
            const registerNumber = user?.username || user?.registerNumber;

            if (!registerNumber) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const result = await client.query<GradesPageResponse>({
                    query: GRADES_PAGE_QUERY,
                    variables: {
                        registerNumber,
                        semesterId: selectedSemester === 'all' ? null : parseInt(selectedSemester)
                    },
                    fetchPolicy: 'network-only',
                });
                if (result.data) {
                    setData(result.data);
                }
            } catch (err) {
                console.error('Grades fetch error:', err);
                const errorMessage = getErrorMessage(err);
                setError(new Error(errorMessage));
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, [user?.username, user?.registerNumber, selectedSemester]);

    const handleExportGrades = async () => {
        const registerNumber = user?.username || user?.registerNumber;

        if (!registerNumber) {
            alert('Register number not found');
            return;
        }

        try {
            setIsExporting(true);
            const response = await client.query<ExportGradesResponse>({
                query: EXPORT_GRADES_QUERY,
                variables: {
                    registerNumber,
                    semesterId: selectedSemester === 'all' ? null : parseInt(selectedSemester)
                },
                fetchPolicy: 'network-only',
            });

            if (response.data?.exportGrades.success) {
                const { filename, fileBase64 } = response.data.exportGrades;

                // Convert base64 to blob and download
                const byteCharacters = atob(fileBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error('Export error:', err);
            alert('Failed to export grades: ' + getErrorMessage(err));
        } finally {
            setIsExporting(false);
        }
    };

    // Get unique semesters from data
    const semesters = data?.gradeOverview?.semesterGpas?.map(
        sg => ({ id: sg.id, label: `${sg.semester.displayName} ${sg.semester.year}` })
    ) || [];

    // Calculate semester GPA for filtered grades
    const calculateSemesterGPA = () => {
        if (!data || selectedSemester === 'all') return null;
        const semGPA = data.gradeOverview?.semesterGpas?.find(
            sg => sg.id === selectedSemester
        );
        return semGPA ? semGPA.gpa.toFixed(2) : '0.00';
    };



    const cgpa = data?.gradeOverview?.cgpa || 0;
    const cgpaStatus = data?.gradeOverview?.cgpaStatus || 'Not Available';
    const performanceTrend = data?.gradeOverview?.performanceTrend || 'stable';

    return (
        <div className="flex min-h-screen bg-[var(--color-background)]">
            <Sidebar />
            <div className="flex-1 ml-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
                            Academic Grades
                        </h1>
                        <p className="text-[var(--color-muted-foreground)]">
                            View your academic performance and grades across all semesters
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-8">
                            <p className="font-medium">Error loading grades</p>
                            <p className="text-sm mt-1">{error.message}</p>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && !error && data && (<>

                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* CGPA Card */}
                            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-[var(--color-foreground)]">Overall CGPA</h3>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-4xl font-bold text-[var(--color-foreground)] mb-1">
                                            {cgpa.toFixed(2)}
                                        </div>
                                        <div className="text-sm font-medium text-green-600">
                                            {cgpaStatus}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-[var(--color-muted-foreground)]">Out of</div>
                                        <div className="text-2xl font-bold text-[var(--color-foreground)]">10.0</div>
                                    </div>
                                </div>
                            </div>

                            {/* Total Credits Card */}
                            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                            <BookOpen className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-[var(--color-foreground)]">Total Credits</h3>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-4xl font-bold text-[var(--color-foreground)] mb-1">
                                            {data.gradeOverview?.creditsEarned || 0}
                                        </div>
                                        <div className="text-sm text-[var(--color-muted-foreground)]">
                                            Out of {data.gradeOverview?.totalCredits || 0} credits
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Trend Card */}
                            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-[var(--color-foreground)]">Performance</h3>
                                    </div>
                                </div>
                                <div>
                                    <div className={`text-4xl font-bold mb-1 ${performanceTrend === 'improving' ? 'text-green-600' :
                                        performanceTrend === 'declining' ? 'text-red-600' :
                                            'text-blue-600'
                                        }`}>
                                        {performanceTrend === 'improving' ? '↑' :
                                            performanceTrend === 'declining' ? '↓' : '→'}
                                    </div>
                                    <div className="text-sm text-[var(--color-muted-foreground)]">
                                        {performanceTrend === 'improving' ? 'Improving trend' :
                                            performanceTrend === 'declining' ? 'Declining trend' :
                                                'Consistent performance'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Semester GPAs */}
                        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6 mb-8 shadow-sm">
                            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
                                Semester-wise GPA
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {data.gradeOverview?.semesterGpas?.map((semGPA) => (
                                    <div
                                        key={semGPA.id}
                                        className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-4"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                                            <div className="text-sm font-medium text-[var(--color-foreground)]">
                                                {semGPA.semester.displayName} {semGPA.semester.year}
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-[var(--color-foreground)] mb-1">
                                            {semGPA.gpa.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-[var(--color-muted-foreground)]">
                                            {semGPA.creditsEarned}/{semGPA.totalCredits} credits
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filters and Actions */}
                        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6 mb-6 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                                        <span className="text-sm font-medium text-[var(--color-foreground)]">
                                            Filter by Semester:
                                        </span>
                                    </div>
                                    <Select
                                        value={selectedSemester}
                                        onChange={setSelectedSemester}
                                        options={[
                                            { value: 'all', label: 'All Semesters' },
                                            ...semesters.map((semester) => ({
                                                value: semester.id,
                                                label: semester.label,
                                            })),
                                        ]}
                                    />
                                </div>

                                <button
                                    onClick={handleExportGrades}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>{isExporting ? 'Exporting...' : 'Download Grade Report'}</span>
                                </button>
                            </div>

                            {selectedSemester !== 'all' && calculateSemesterGPA() && (
                                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--color-muted-foreground)]">
                                            Semester GPA:
                                        </span>
                                        <span className="text-xl font-bold text-[var(--color-foreground)]">
                                            {calculateSemesterGPA()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Grades Table — Using the shared DataTable component */}
                        <DataTable<Grade>
                            columns={gradeColumns}
                            data={data.myGrades}
                            pageSize={10}
                            emptyMessage="No grades found for the selected semester"
                            emptyIcon={<Award className="w-12 h-12 text-[var(--color-muted-foreground)]" />}
                        />

                        {/* Grade Legend */}
                        <div className="mt-8 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
                                Grading Scale
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { grade: 'A+', points: '10.0', range: '90-100%' },
                                    { grade: 'A', points: '9.0', range: '80-89%' },
                                    { grade: 'B+', points: '8.0', range: '70-79%' },
                                    { grade: 'B', points: '7.0', range: '60-69%' },
                                    { grade: 'C', points: '6.0', range: '50-59%' }
                                ].map((item) => (
                                    <div
                                        key={item.grade}
                                        className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-3"
                                    >
                                        <div className={`text-xl font-bold mb-1 ${getGradeColor(item.grade).split(' ')[0]}`}>
                                            {item.grade}
                                        </div>
                                        <div className="text-sm font-medium text-[var(--color-foreground)]">
                                            {item.points} Points
                                        </div>
                                        <div className="text-xs text-[var(--color-muted-foreground)] mt-1">
                                            {item.range}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
}
