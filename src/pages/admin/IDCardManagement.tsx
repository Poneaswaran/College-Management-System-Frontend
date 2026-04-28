import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Printer, Grid, List as ListIcon, CheckCircle2, Edit3, Save, Filter, Search, Palette, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileService, { type StudentProfile, type FacultyProfile } from '../../services/profile.service';
import { schoolService, type School } from '../../services/school.service';
import { departmentService, type Department } from '../../services/department.service';
import IDCard, { type IDCardColors } from '../../components/admin/IDCard';
import { useToast } from '../../components/ui/Toast';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { useTenantBranding } from '../../hooks/useTenantBranding';
import api from '../../lib/axios';

export default function IDCardManagement() {
    const { branding } = useTenantBranding();
    const { type = 'students' } = useParams<{ type: string }>();
    const isStudent = type === 'students';
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    // Pagination states
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    
    // Filter states
    const [schools, setSchools] = useState<School[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
    const [selectedDeptId, setSelectedDeptId] = useState<string>('');
    
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
    const [showCustomizer, setShowCustomizer] = useState(false);
    
    // Template colors state
    interface IDCardTemplate {
        student_primary_color: string;
        student_header_text_color: string;
        student_background_color: string;
        student_text_color: string;
        student_label_color: string;
        faculty_primary_color: string;
        faculty_header_text_color: string;
        faculty_background_color: string;
        faculty_text_color: string;
        faculty_label_color: string;
    }
    const [template, setTemplate] = useState<IDCardTemplate>({
        student_primary_color: '#2563eb',
        student_header_text_color: '#ffffff',
        student_background_color: '#f8fafc',
        student_text_color: '#111827',
        student_label_color: '#6b7280',
        faculty_primary_color: '#059669',
        faculty_header_text_color: '#ffffff',
        faculty_background_color: '#f8fafc',
        faculty_text_color: '#111827',
        faculty_label_color: '#6b7280',
    });
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const { addToast } = useToast();

    // Load template colors from backend
    useEffect(() => {
        api.get('/profile/id-card-template/').then(res => {
            setTemplate(res.data);
        }).catch(() => {/* use defaults */});
    }, []);

    const saveTemplate = useCallback(async (updated: IDCardTemplate) => {
        setIsSavingTemplate(true);
        try {
            const res = await api.patch('/profile/id-card-template/', updated);
            setTemplate(res.data);
            addToast({ type: 'success', title: 'Template Saved', message: 'ID card colors have been updated.' });
        } catch {
            addToast({ type: 'error', title: 'Save Failed', message: 'Could not save template colors.' });
        } finally {
            setIsSavingTemplate(false);
        }
    }, [addToast]);

    const resetTemplate = async () => {
        setIsSavingTemplate(true);
        try {
            const res = await api.post('/profile/id-card-template/reset/');
            setTemplate(res.data);
            addToast({ type: 'success', title: 'Reset', message: 'Colors reset to factory defaults.' });
        } catch {
            addToast({ type: 'error', title: 'Reset Failed', message: 'Could not reset template.' });
        } finally {
            setIsSavingTemplate(false);
        }
    };

    const handleColorChange = (field: keyof IDCardTemplate, value: string) => {
        setTemplate(prev => ({ ...prev, [field]: value }));
    };

    // Derived live colors passed to IDCard preview
    const activeColors: IDCardColors = isStudent
        ? {
              primary:    template.student_primary_color,
              headerText: template.student_header_text_color,
              background: template.student_background_color,
              text:       template.student_text_color,
              label:      template.student_label_color,
          }
        : {
              primary:    template.faculty_primary_color,
              headerText: template.faculty_header_text_color,
              background: template.faculty_background_color,
              text:       template.faculty_text_color,
              label:      template.faculty_label_color,
          };

    // Fetch schools once
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await schoolService.getSchools();
                setSchools(res.schools);
            } catch (error) {
                console.error("Failed to fetch schools", error);
            }
        };
        fetchSchools();
    }, []);

    // Fetch departments when school changes
    useEffect(() => {
        const fetchDepts = async () => {
            if (selectedSchoolId) {
                try {
                    const res = await departmentService.getDepartments(Number(selectedSchoolId));
                    setDepartments(res.departments);
                } catch (error) {
                    console.error("Failed to fetch departments", error);
                }
            } else {
                setDepartments([]);
            }
            setSelectedDeptId('');
        };
        fetchDepts();
    }, [selectedSchoolId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = { 
                search: searchTerm,
                school_id: selectedSchoolId || undefined,
                department_id: selectedDeptId || undefined,
                page,
                page_size: pageSize
            };
            
            if (isStudent) {
                const response = await ProfileService.getStudents(params);
                setData(response.results);
                setTotalCount(response.count);
            } else {
                const response = await ProfileService.getFaculties(params);
                setData(response.results);
                setTotalCount(response.count);
            }
        } catch (error) {
            addToast({ 
                type: 'error', 
                title: 'Fetch Error', 
                message: `Failed to fetch ${type} data for ID cards.` 
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setSelectedIds([]);
    }, [type, searchTerm, selectedSchoolId, selectedDeptId, page, pageSize]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [type, searchTerm, selectedSchoolId, selectedDeptId]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map(item => item.id));
        }
    };

    const handlePrint = async () => {
        if (selectedIds.length === 0) {
            addToast({ type: 'warning', title: 'Selection Required', message: 'Please select at least one ID card to print.' });
            return;
        }
        
        setIsLoading(true);
        try {
            await ProfileService.bulkGenerateIDCards(type as 'students' | 'faculty', selectedIds, orientation);
            addToast({ type: 'success', title: 'Download Started', message: `Your bulk ID cards PDF is being downloaded.` });
        } catch (error) {
            addToast({ type: 'error', title: 'Download Failed', message: 'Failed to generate bulk ID cards PDF.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSingleDownload = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const profile = data.find(d => d.id === id);
            const identifier = isStudent ? profile.register_number : profile.id;
            await ProfileService.downloadIDCard(type as 'students' | 'faculty', identifier, orientation);
            addToast({ type: 'success', title: 'Success', message: 'ID card downloaded successfully.' });
        } catch (error) {
            addToast({ type: 'error', title: 'Error', message: 'Failed to download ID card.' });
        }
    };

    const handleEditClick = (profile: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingProfile({ ...profile });
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async () => {
        if (!editingProfile) return;
        setIsSaving(true);
        try {
            if (isStudent) {
                await ProfileService.updateStudent(editingProfile.register_number, editingProfile);
            } else {
                await ProfileService.updateFaculty(editingProfile.user_id || editingProfile.id, editingProfile);
            }
            addToast({ type: 'success', title: 'Success', message: 'Profile updated successfully.' });
            setIsEditModalOpen(false);
            fetchData();
        } catch (error: any) {
            addToast({ 
                type: 'error', 
                title: 'Update Failed', 
                message: error.response?.data?.detail || 'Failed to update profile.' 
            });
        } finally {
            setIsSaving(false);
        }
    };

    const schoolOptions = schools.map(s => ({ value: s.id.toString(), label: s.name }));
    const deptOptions = departments.map(d => ({ value: d.id.toString(), label: d.name }));
    const orientationOptions = [
        { value: 'landscape', label: 'Landscape (Horizontal)' },
        { value: 'portrait', label: 'Portrait (Vertical)' }
    ];

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {isStudent ? 'Student ID Cards' : 'Faculty ID Cards'}
                        </h1>
                        <p className="mt-2 text-lg text-gray-500">
                            Generate and print premium identity cards for {isStudent ? 'students' : 'faculty members'}.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Select 
                            value={orientation}
                            onChange={(val) => setOrientation(val as 'landscape' | 'portrait')}
                            options={orientationOptions}
                            placeholder="Orientation"
                            size="sm"
                            wrapperClassName="w-[180px]"
                            icon={<Grid size={14} />}
                        />

                        <Select 
                            value={selectedSchoolId}
                            onChange={setSelectedSchoolId}
                            options={schoolOptions}
                            placeholder="All Schools"
                            size="sm"
                            wrapperClassName="w-[180px]"
                            icon={<Filter size={14} />}
                        />

                        {selectedSchoolId && (
                            <Select 
                                value={selectedDeptId}
                                onChange={setSelectedDeptId}
                                options={deptOptions}
                                placeholder="All Departments"
                                size="sm"
                                wrapperClassName="w-[180px] animate-in fade-in slide-in-from-left-2"
                                icon={<Filter size={14} />}
                            />
                        )}

                        <SearchInput 
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder={`Search ${type}...`}
                            wrapperClassName="w-64"
                        />

                        <button 
                            onClick={selectAll}
                            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                selectedIds.length === data.length && data.length > 0
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <CheckCircle2 size={18} />
                            {selectedIds.length === data.length && data.length > 0 ? 'Deselect All' : 'Select All'}
                        </button>

                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                            disabled={selectedIds.length === 0}
                        >
                            <Printer size={18} />
                            Print ({selectedIds.length})
                        </button>

                        <button
                            onClick={() => setShowCustomizer(v => !v)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium border transition-all ${showCustomizer ? 'bg-violet-600 text-white border-violet-600 shadow-lg' : 'bg-white text-violet-700 border-violet-200 hover:bg-violet-50'}`}
                        >
                            <Palette size={16} />
                            Customize Colors
                        </button>
                    </div>
                </div>

                {/* Color Customizer Panel */}
                {showCustomizer && (
                    <div className="mb-6 p-6 bg-white border border-violet-100 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Palette size={20} className="text-violet-600" />
                                ID Card Color Theme
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={resetTemplate}
                                    disabled={isSavingTemplate}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    <RotateCcw size={13} />
                                    Reset Defaults
                                </button>
                                <button
                                    onClick={() => saveTemplate(template)}
                                    disabled={isSavingTemplate}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium disabled:opacity-50"
                                >
                                    <Save size={13} />
                                    {isSavingTemplate ? 'Saving…' : 'Save Colors'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Student Card Colors */}
                            <div>
                                <h4 className="text-sm font-semibold text-blue-700 mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: template.student_primary_color }} />
                                    Student Card Colors
                                </h4>
                                <div className="space-y-3">
                                    {([
                                        ['student_primary_color', 'Primary / Header Color'],
                                        ['student_header_text_color', 'Header Text Color'],
                                        ['student_background_color', 'Card Background'],
                                        ['student_text_color', 'Body Text Color'],
                                        ['student_label_color', 'Label / Caption Color'],
                                    ] as const).map(([field, label]) => (
                                        <div key={field} className="flex items-center justify-between gap-4">
                                            <label className="text-sm text-gray-600 flex-1">{label}</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-gray-400 w-16 text-right">{template[field]}</span>
                                                <div className="relative">
                                                    <input
                                                        type="color"
                                                        value={template[field]}
                                                        onChange={e => handleColorChange(field, e.target.value)}
                                                        className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-transparent"
                                                        title={label}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Faculty Card Colors */}
                            <div>
                                <h4 className="text-sm font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: template.faculty_primary_color }} />
                                    Faculty Card Colors
                                </h4>
                                <div className="space-y-3">
                                    {([
                                        ['faculty_primary_color', 'Primary / Header Color'],
                                        ['faculty_header_text_color', 'Header Text Color'],
                                        ['faculty_background_color', 'Card Background'],
                                        ['faculty_text_color', 'Body Text Color'],
                                        ['faculty_label_color', 'Label / Caption Color'],
                                    ] as const).map(([field, label]) => (
                                        <div key={field} className="flex items-center justify-between gap-4">
                                            <label className="text-sm text-gray-600 flex-1">{label}</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-gray-400 w-16 text-right">{template[field]}</span>
                                                <div className="relative">
                                                    <input
                                                        type="color"
                                                        value={template[field]}
                                                        onChange={e => handleColorChange(field, e.target.value)}
                                                        className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-transparent"
                                                        title={label}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-gray-400">
                            Color changes are saved to the server and applied to all future PDF exports for this institution.
                        </p>
                    </div>
                )}

                {/* Filters & Controls */}
                <div className="mb-6 flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-bold text-gray-900">{totalCount}</span> {isStudent ? 'Students' : 'Faculty'} Found
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Fetching profiles...</p>
                    </div>
                ) : data.length > 0 ? (
                    <div className={`
                        ${viewMode === 'grid' 
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                            : 'flex flex-col gap-4'}
                        print:grid print:grid-cols-2 print:gap-4
                    `}>
                        {data.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => toggleSelect(item.id)}
                                className={`relative cursor-pointer transition-all duration-300 group ${
                                    selectedIds.includes(item.id) 
                                    ? 'ring-4 ring-blue-500/20 ring-offset-4 rounded-2xl scale-[1.02]' 
                                    : 'hover:scale-[1.01]'
                                } ${viewMode === 'list' ? 'flex items-center' : ''} print:scale-100 print:ring-0`}
                            >
                                <IDCard 
                                    type={isStudent ? 'student' : 'faculty'} 
                                    data={item} 
                                    institutionName={branding?.name}
                                    colors={activeColors}
                                />

                                
                                {/* Hover Actions */}
                                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 no-print">
                                    <button 
                                        onClick={(e) => handleEditClick(item, e)}
                                        className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg shadow-xl hover:bg-white transition-all hover:scale-110"
                                        title="Edit Profile"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button 
                                        onClick={(e) => handleSingleDownload(item.id, e)}
                                        className="p-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg shadow-xl hover:bg-white transition-all hover:scale-110"
                                        title="Download PDF"
                                    >
                                        <Printer size={16} />
                                    </button>
                                </div>

                                {selectedIds.includes(item.id) && (
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white p-1 rounded-full shadow-lg z-20 print:hidden">
                                        <CheckCircle2 size={16} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="p-4 bg-white rounded-full shadow-md mb-4">
                            <Search size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No {type} found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {!isLoading && totalCount > pageSize && (
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-bold text-gray-900">{(page - 1) * pageSize + 1}</span> to{' '}
                            <span className="font-bold text-gray-900">{Math.min(page * pageSize, totalCount)}</span> of{' '}
                            <span className="font-bold text-gray-900">{totalCount}</span> results
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, i) => {
                                const p = i + 1;
                                // Only show current page, first, last, and pages near current
                                if (
                                    p === 1 || 
                                    p === Math.ceil(totalCount / pageSize) || 
                                    (p >= page - 1 && p <= page + 1)
                                ) {
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                                page === p 
                                                ? 'bg-blue-600 text-white shadow-lg' 
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                } else if (p === page - 2 || p === page + 2) {
                                    return <span key={p} className="text-gray-400">...</span>;
                                }
                                return null;
                            })}

                            <button
                                onClick={() => setPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                                disabled={page === Math.ceil(totalCount / pageSize)}
                                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={`Edit ${isStudent ? 'Student' : 'Faculty'} Profile`}
            >
                {editingProfile && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput 
                                label="First Name"
                                value={editingProfile.first_name || editingProfile.full_name?.split(' ')[0] || ''}
                                onChange={(e) => setEditingProfile({ ...editingProfile, first_name: e.target.value })}
                            />
                            <FormInput 
                                label="Last Name"
                                value={editingProfile.last_name || editingProfile.full_name?.split(' ').slice(1).join(' ') || ''}
                                onChange={(e) => setEditingProfile({ ...editingProfile, last_name: e.target.value })}
                            />
                        </div>
                        
                        {isStudent ? (
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput 
                                    label="Roll Number"
                                    value={editingProfile.roll_number || ''}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, roll_number: e.target.value })}
                                />
                                <FormInput 
                                    label="Register Number"
                                    value={editingProfile.register_number || ''}
                                    readOnly
                                    className="bg-gray-50"
                                />
                                <FormInput 
                                    label="Year"
                                    type="number"
                                    value={editingProfile.year || ''}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, year: parseInt(e.target.value) })}
                                />
                                <FormInput 
                                    label="Semester"
                                    type="number"
                                    value={editingProfile.semester || ''}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, semester: parseInt(e.target.value) })}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput 
                                    label="Designation"
                                    value={editingProfile.designation || ''}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, designation: e.target.value })}
                                />
                                <FormInput 
                                    label="Specialization"
                                    value={editingProfile.specialization || ''}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, specialization: e.target.value })}
                                />
                                <FormInput 
                                    label="Office Hours"
                                    value={editingProfile.office_hours || ''}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, office_hours: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button 
                                variant="primary" 
                                onClick={handleSaveProfile}
                                loading={isSaving}
                                icon={<Save size={18} />}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    aside, nav, header, button, .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .id-card-container {
                        box-shadow: none !important;
                        border: 1px solid #eee !important;
                        break-inside: avoid;
                        margin: 10px auto;
                    }
                }
            `}} />
        </PageLayout>
    );
}
