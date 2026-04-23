import React, { useState, useEffect, useCallback } from 'react';
import { Plus, GraduationCap, Edit, Trash2, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';
import axios from 'axios';

interface Section {
    id: number;
    code: string;
    name: string;
    course_name: string;
    department_code: string;
}

interface Course {
    id: number;
    name: string;
}

interface SectionUpdatePayload {
    name: string;
    code: string;
}

interface SectionCreatePayload {
    name: string;
    code: string;
    course_id: number;
}

export default function SectionManagement() {
    const { addToast } = useToast();
    const [sections, setSections] = useState<Section[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [confirmText, setConfirmText] = useState('');
    const [formData, setFormData] = useState({ 
        name: '', 
        code: '', 
        course_id: '' 
    });

    const fetchSections = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<{ sections: Section[] }>('/core/sections/');
            setSections(response.data.sections);
        } catch (error) {
            console.error('Error fetching sections:', error);
            addToast({ type: 'error', title: 'Failed to fetch sections' });
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const fetchCourses = useCallback(async () => {
        try {
            const response = await api.get<{ courses: Course[] }>('/core/courses/');
            setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }, []);

    useEffect(() => {
        fetchSections();
        fetchCourses();
    }, [fetchSections, fetchCourses]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (section: Section) => {
        setSelectedSection(section);
        setFormData({ 
            name: section.name, 
            code: section.code, 
            course_id: '' 
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSection(null);
        setFormData({ name: '', code: '', course_id: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (selectedSection) {
                const patchData: SectionUpdatePayload = { name: formData.name, code: formData.code };
                await api.patch(`/core/admin/sections/${selectedSection.id}/`, patchData);
                addToast({ type: 'success', title: 'Section updated successfully' });
            } else {
                const postData: SectionCreatePayload = {
                    name: formData.name,
                    code: formData.code,
                    course_id: Number(formData.course_id)
                };
                await api.post('/core/admin/sections/create/', postData);
                addToast({ type: 'success', title: 'Section created successfully' });
            }
            handleCloseModal();
            fetchSections();
        } catch (error) {
            console.error('Error saving section:', error);
            let message = 'Failed to save section';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            addToast({ type: 'error', title: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedSection || confirmText !== 'CONFIRM') return;
        try {
            setIsSubmitting(true);
            await api.delete(`/core/admin/sections/${selectedSection.id}/`);
            addToast({ type: 'success', title: 'Section deleted successfully' });
            setIsDeleteModalOpen(false);
            fetchSections();
        } catch (error) {
            console.error('Error deleting section:', error);
            addToast({ type: 'error', title: 'Failed to delete section' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Section>[] = [
        {
            key: 'name',
            header: 'Functional Name',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[var(--color-text-primary)] text-base">{row.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-tighter bg-[var(--color-background-tertiary)] px-2 py-0.5 rounded-full text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                            {row.department_code}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium">{row.course_name}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'code',
            header: 'Section Code',
            render: (row) => (
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-black text-lg shadow-sm">
                    {row.code}
                </div>
            ),
            align: 'center'
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEditClick(row)} className="p-2 text-[var(--color-text-secondary)] hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => { setSelectedSection(row); setConfirmText(''); setIsDeleteModalOpen(true); }} className="p-2 text-[var(--color-text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
            align: 'right'
        }
    ];

    return (
        <PageLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--color-border)]">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-600">
                                <GraduationCap size={24} />
                            </div>
                            <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Academic Sections</h1>
                        </div>
                        <p className="text-[var(--color-text-secondary)] text-lg font-medium">
                            Manage grouping of students within academic programs
                        </p>
                    </div>
                    <Button 
                        onClick={() => { setSelectedSection(null); setFormData({ name: '', code: '', course_id: '' }); setIsModalOpen(true); }} 
                        className="flex items-center gap-2 h-12 shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700"
                        data-testid="add-section-btn"
                    >
                        <Plus size={20} />
                        Add Section
                    </Button>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl transition-all hover:shadow-indigo-600/5">
                    <DataTable 
                        columns={columns} 
                        data={sections} 
                        loading={loading}
                        emptyMessage="No academic sections mapped currently."
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedSection ? "Edit Section" : "Create New Section"}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">
                    {!selectedSection && (
                        <Dropdown 
                            label="Target Course"
                            options={courses.map(c => ({ label: c.name, value: c.id }))}
                            value={formData.course_id}
                            onChange={(val) => setFormData(prev => ({ ...prev, course_id: String(val) }))}
                            placeholder="Select Course"
                            dataTestId="section-course-dropdown"
                        />
                    )}
                    <div className="space-y-1">
                        <label className="text-sm font-bold uppercase tracking-wider">Functional Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            data-testid="section-name-input"
                            placeholder="e.g. BSC CS Section A"
                            className="w-full h-12 px-4 border-2 border-[var(--color-border)] rounded-xl outline-none focus:border-indigo-600 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold uppercase tracking-wider">Section Code</label>
                        <input
                            required
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            data-testid="section-code-input"
                            placeholder="e.g. A"
                            className="w-full h-12 px-4 border-2 border-[var(--color-border)] rounded-xl outline-none focus:border-indigo-600 text-center font-black text-lg"
                        />
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="ghost" className="flex-1" onClick={handleCloseModal} data-testid="cancel-section-btn">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700" data-testid="submit-section-btn">
                            {isSubmitting ? 'Processing...' : (selectedSection ? 'Update Section' : 'Create Section')}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
                maxWidth="max-w-md"
            >
                <div className="p-6 pt-0 space-y-6 text-center">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex flex-col items-center gap-3">
                        <AlertCircle size={40} className="shrink-0" />
                        <p className="font-black text-lg uppercase tracking-widest">Permanent Action</p>
                        <p className="text-sm">Deleting <b>{selectedSection?.name}</b> will remove all student mappings for this section.</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm">Type <span className="font-black text-red-600">CONFIRM</span> to proceed:</p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full h-12 border-2 border-red-200 rounded-xl text-center font-black outline-none focus:border-red-600"
                            placeholder="CONFIRM"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-200"
                            disabled={confirmText !== 'CONFIRM' || isSubmitting}
                            onClick={handleDeleteConfirm}
                        >
                            {isSubmitting ? 'Removing...' : 'Delete Section'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
}
