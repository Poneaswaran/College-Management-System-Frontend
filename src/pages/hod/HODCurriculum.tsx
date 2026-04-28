import React, { useState, useEffect } from 'react';
import { 
    Book, 
    Layers, 
    Award, 
    FileText, 
    Search, 
    Filter, 
    Download,
    ChevronRight,
    Layout,
    Sparkles,
    CheckCircle2,
    BookOpen
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { getHODCurriculum, type HODCurriculumData, type CurriculumSubject } from '../../services/curriculum.service';

const HODCurriculum: React.FC = () => {
    const [data, setData] = useState<HODCurriculumData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'subjects' | 'programs'>('subjects');
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getHODCurriculum();
            setData(result);
        } catch (error) {
            console.error('Error fetching curriculum:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubjects = () => {
        if (!data) return [];
        let all: CurriculumSubject[] = [];
        Object.values(data.subjectsBySemester).forEach(list => {
            all = [...all, ...list];
        });

        return all.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                s.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSemester = semesterFilter === 'all' || s.semester_number.toString() === semesterFilter;
            return matchesSearch && matchesSemester;
        });
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="space-y-6">
                {/* AI Insights */}
                {data?.aiCurriculumInsight && (
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-5 rounded-2xl border border-indigo-500/20 shadow-sm flex items-start gap-4">
                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                            <Sparkles size={22} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">AI Curriculum Insight</h3>
                            <p className="text-[var(--color-foreground)] mt-1.5 leading-relaxed">{data.aiCurriculumInsight}</p>
                        </div>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<Book className="text-blue-600" />} 
                        label="Total Subjects" 
                        value={data?.totalSubjects || 0} 
                        color="blue"
                    />
                    <StatCard 
                        icon={<Award className="text-emerald-600" />} 
                        label="Total Credits" 
                        value={data?.totalCredits || 0} 
                        color="emerald"
                    />
                    <StatCard 
                        icon={<Layers className="text-orange-600" />} 
                        label="Core Subjects" 
                        value={data?.coreSubjectsCount || 0} 
                        color="orange"
                    />
                    <StatCard 
                        icon={<BookOpen className="text-purple-600" />} 
                        label="Electives" 
                        value={data?.electiveSubjectsCount || 0} 
                        color="purple"
                    />
                </div>

                {/* Main Content Tabs */}
                <div className="bg-[var(--color-background-soft)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
                    <div className="flex border-b border-[var(--color-border)] px-6">
                        <button 
                            onClick={() => setActiveTab('subjects')}
                            className={`py-4 px-6 text-sm font-semibold transition-all relative ${activeTab === 'subjects' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Course Subjects
                            {activeTab === 'subjects' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                        </button>
                        <button 
                            onClick={() => setActiveTab('programs')}
                            className={`py-4 px-6 text-sm font-semibold transition-all relative ${activeTab === 'programs' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Degree Programs
                            {activeTab === 'programs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'subjects' ? (
                            <div className="space-y-6">
                                {/* Filters */}
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="Search by name or code..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                                            <Filter size={16} className="text-gray-400" />
                                            <select 
                                                value={semesterFilter}
                                                onChange={(e) => setSemesterFilter(e.target.value)}
                                                className="bg-transparent outline-none text-sm font-medium"
                                            >
                                                <option value="all">All Semesters</option>
                                                {[1,2,3,4,5,6,7,8].map(s => (
                                                    <option key={s} value={s.toString()}>Semester {s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                                            <Download size={18} />
                                            Export
                                        </button>
                                    </div>
                                </div>

                                {/* Subjects Table */}
                                <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Info</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Semester</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Credits</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-background-soft)]">
                                            {filteredSubjects().map(subject => (
                                                <tr key={subject.id} className="hover:bg-[var(--color-background)] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                                                <FileText size={18} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-[var(--color-foreground)]">{subject.name}</div>
                                                                <div className="text-xs font-mono text-gray-500 uppercase">{subject.code}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                            subject.type === 'THEORY' ? 'bg-blue-100 text-blue-700' :
                                                            subject.type === 'LAB' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {subject.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-semibold text-gray-600">
                                                        {subject.semester_number}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm">
                                                            {subject.credits}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-medium">
                                                            <CheckCircle2 size={16} />
                                                            <span>Active</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data?.courses.map(course => (
                                    <div key={course.id} className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-blue-600 text-white rounded-xl">
                                                <Layout size={24} />
                                            </div>
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                                {course.duration_years} Years
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1">{course.name}</h3>
                                        <p className="text-sm font-mono text-gray-500 mb-6 uppercase tracking-widest">{course.code}</p>
                                        
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Subjects</div>
                                                <div className="text-xl font-bold text-blue-600">{course.subjectsCount}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Total Credits</div>
                                                <div className="text-xl font-bold text-emerald-600">{course.totalCredits}</div>
                                            </div>
                                        </div>

                                        <button className="w-full mt-6 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
                                            View Full Curriculum
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: 'blue' | 'emerald' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500/10 border-blue-500/20',
        emerald: 'bg-emerald-500/10 border-emerald-500/20',
        orange: 'bg-orange-500/10 border-orange-500/20',
        purple: 'bg-purple-500/10 border-purple-500/20',
    };

    return (
        <div className={`p-5 rounded-2xl border ${colorClasses[color]} bg-[var(--color-background-soft)] shadow-sm flex items-center gap-4`}>
            <div className="p-3 bg-[var(--color-background)] rounded-xl shadow-inner">
                {icon}
            </div>
            <div>
                <div className="text-2xl font-black text-[var(--color-foreground)] leading-none mb-1">{value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</div>
            </div>
        </div>
    );
};

export default HODCurriculum;
