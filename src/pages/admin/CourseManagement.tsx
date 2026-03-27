import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Calendar, Plus, Settings2, Clock, MapPin, Trash2, Edit, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';
import axios from 'axios';

interface Course {
    id: number;
    name: string;
    code: string;
    department_name: string;
    duration_years: number;
}

interface Department {
    id: number;
    name: string;
}

export default function CourseManagement() {
    const { addToast } = useToast();
    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [confirmText, setConfirmText] = useState('');
    const [formData, setFormData] = useState({ name: '', code: '', department_id: '', duration_years: '' });

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<{ courses: Course[] }>('/api/core/courses/');
            setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            addToast({ type: 'error', title: 'Failed to fetch courses' });
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await api.get<{ departments: Department[] }>('/api/core/departments/');
            setDepartments(response.data.departments);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
        fetchDepartments();
    }, [fetchCourses, fetchDepartments]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (course: Course) => {
        setSelectedCourse(course);
        setFormData({ 
            name: course.name, 
            code: course.code, 
            department_id: '', // Not provided in list API but we'll show it updateable
            duration_years: String(course.duration_years) 
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
        setFormData({ name: '', code: '', department_id: '', duration_years: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (selectedCourse) {
                const patchData: any = { name: formData.name, duration_years: Number(formData.duration_years) };
                await api.patch(`/api/core/admin/courses/${selectedCourse.id}/`, patchData);
                addToast({ type: 'success', title: 'Course updated successfully' });
            } else {
                await api.post('/api/core/admin/courses/create/', {
                    ...formData,
                    duration_years: Number(formData.duration_years),
                    department_id: Number(formData.department_id)
                });
                addToast({ type: 'success', title: 'Course created successfully' });
            }
            handleCloseModal();
            fetchCourses();
        } catch (error) {
            console.error('Error saving course:', error);
            let message = 'Failed to save course';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            addToast({ type: 'error', title: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCourse || confirmText !== 'CONFIRM') return;
        try {
            setIsSubmitting(true);
            await api.delete(`/api/core/admin/courses/${selectedCourse.id}/`);
            addToast({ type: 'success', title: 'Course deleted successfully' });
            setIsDeleteModalOpen(false);
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            addToast({ type: 'error', title: 'Failed to delete course' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Course>[] = [
        {
            key: 'name',
            header: 'Course Program',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[var(--color-text-primary)] text-base">{row.name}</span>
                    <span className="text-xs font-mono text-[var(--color-primary)] opacity-70 tracking-widest uppercase">{row.code}</span>
                </div>
            ),
        },
        {
            key: 'department_name',
            header: 'Sponsoring Department',
            render: (row) => (
                <div className="text-[var(--color-text-secondary)] font-medium">
                    {row.department_name}
                </div>
            ),
        },
        {
            key: 'duration_years',
            header: 'Program Duration',
            render: (row) => (
                <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-full w-fit">
                    <Clock size={14} className="text-[var(--color-primary)]" />
                    <span className="text-sm font-semibold">{row.duration_years} Years</span>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEditClick(row)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => { setSelectedCourse(row); setConfirmText(''); setIsDeleteModalOpen(true); }} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors">
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
                        <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Academic Courses</h1>
                        <p className="text-[var(--color-text-secondary)] mt-2 text-lg font-medium">
                            Manage bachelor and postgraduate academic programs
                        </p>
                    </div>
                    <Button 
                        onClick={() => { setSelectedCourse(null); setFormData({ name: '', code: '', department_id: '', duration_years: '' }); setIsModalOpen(true); }} 
                        className="flex items-center gap-2 h-12 shadow-lg shadow-[var(--color-primary)]/20"
                        data-testid="add-course-btn"
                    >
                        <Plus size={20} />
                        Add Course
                    </Button>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl transition-all hover:shadow-primary/5">
                    <DataTable 
                        columns={columns} 
                        data={courses} 
                        loading={loading}
                        emptyMessage="No academic programs registered."
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedCourse ? "Edit Course" : "Add Course"}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">
                    <div className="space-y-4">
                        {!selectedCourse && (
                            <Dropdown 
                                label="Sponsoring Department"
                                options={departments.map(d => ({ label: d.name, value: d.id }))}
                                value={formData.department_id}
                                onChange={(val) => setFormData(prev => ({ ...prev, department_id: String(val) }))}
                                placeholder="Select Department"
                                dataTestId="course-department-dropdown"
                            />
                        )}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Course Program Name</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                data-testid="course-name-input"
                                placeholder="e.g. B.Sc Psychology"
                                className="w-full h-12 px-4 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Program Code</label>
                                <input
                                    required
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    disabled={!!selectedCourse}
                                    data-testid="course-code-input"
                                    placeholder="e.g. BSC_PSY"
                                    className="w-full h-12 px-4 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] font-mono uppercase transition-all disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Duration (Years)</label>
                                <input
                                    required
                                    type="number"
                                    name="duration_years"
                                    value={formData.duration_years}
                                    onChange={handleInputChange}
                                    data-testid="course-duration-input"
                                    placeholder="e.g. 3"
                                    className="w-full h-12 px-4 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] transition-all"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                        <Button type="button" variant="ghost" onClick={handleCloseModal} data-testid="cancel-course-btn">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} data-testid="submit-course-btn">
                            {isSubmitting ? 'Saving...' : (selectedCourse ? 'Update Course' : 'Create Course')}
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
                <div className="p-6 pt-0 space-y-6">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex gap-3">
                        <AlertCircle className="shrink-0" />
                        <div>
                            <p className="font-bold">Important Notice</p>
                            <p className="text-sm">Deleting this course will permanently remove its associated sections and mapping.</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-center">Type <span className="font-black text-red-600">CONFIRM</span> to delete <br /> <b>{selectedCourse?.name}</b></p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full h-12 border-2 border-[var(--color-border)] rounded-xl text-center font-black outline-none focus:border-red-500"
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
                            {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
}
