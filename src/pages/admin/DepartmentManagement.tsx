import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Trash2, Edit, AlertTriangle } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import axios from 'axios';

interface Department {
    id: number;
    name: string;
    code: string;
}

export default function DepartmentManagement() {
    const { addToast } = useToast();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [confirmText, setConfirmText] = useState('');
    const [formData, setFormData] = useState({ name: '', code: '' });

    const fetchDepartments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<{ departments: Department[] }>('/api/core/departments/');
            setDepartments(response.data.departments);
        } catch (error) {
            console.error('Error fetching departments:', error);
            addToast({ type: 'error', title: 'Failed to fetch departments' });
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (department: Department) => {
        setSelectedDepartment(department);
        setFormData({ name: department.name, code: department.code });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (department: Department) => {
        setSelectedDepartment(department);
        setConfirmText('');
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDepartment(null);
        setFormData({ name: '', code: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (selectedDepartment) {
                await api.patch(`/api/core/admin/departments/${selectedDepartment.id}/`, formData);
                addToast({ type: 'success', title: 'Department updated successfully' });
            } else {
                await api.post('/api/core/admin/departments/create/', formData);
                addToast({ type: 'success', title: 'Department created successfully' });
            }
            handleCloseModal();
            fetchDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
            let message = 'Failed to save department';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            addToast({ type: 'error', title: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedDepartment || confirmText !== 'CONFIRM') return;
        try {
            setIsSubmitting(true);
            await api.delete(`/api/core/admin/departments/${selectedDepartment.id}/`);
            addToast({ type: 'success', title: 'Department deleted successfully' });
            setIsDeleteModalOpen(false);
            setSelectedDepartment(null);
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
            addToast({ type: 'error', title: 'Failed to delete department' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Department>[] = [
        {
            key: 'code',
            header: 'Code',
            render: (row) => (
                <div className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-lg font-mono font-bold text-sm w-fit">
                    {row.code}
                </div>
            ),
        },
        {
            key: 'name',
            header: 'Department Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-background-secondary)] flex items-center justify-center border border-[var(--color-border)]">
                        <Building2 size={20} className="text-[var(--color-text-secondary)]" />
                    </div>
                    <span className="font-bold text-[var(--color-text-primary)] text-base">{row.name}</span>
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
                    <button onClick={() => handleDeleteClick(row)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors">
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
                <Header
                    title="Departments"
                    className="mb-4"
                    titleIcon={
                        <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                            <Building2 size={20} className="text-[var(--color-primary)]" />
                        </span>
                    }
                />

                <div className="px-4 md:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--color-border)]">
                    <div>
                        <p className="text-[var(--color-text-secondary)] text-lg font-medium">
                            Manage institutional academic departments and structures
                        </p>
                    </div>
                    <Button 
                        onClick={() => { setSelectedDepartment(null); setFormData({ name: '', code: '' }); setIsModalOpen(true); }}
                        className="flex items-center gap-2 h-12 shadow-lg shadow-[var(--color-primary)]/20"
                        data-testid="add-department-btn"
                    >
                        <Plus size={20} />
                        Add Department
                    </Button>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl transition-all hover:shadow-primary/5">
                    <DataTable 
                        columns={columns} 
                        data={departments} 
                        loading={loading}
                        emptyMessage="No departments found. Create one to begin."
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedDepartment ? "Edit Department" : "Add Department"}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Department Name</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                data-testid="department-name-input"
                                placeholder="e.g. Physics"
                                className="w-full h-12 px-4 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Short Code</label>
                            <input
                                required
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                data-testid="department-code-input"
                                placeholder="e.g. PHY"
                                className="w-full h-12 px-4 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-xl focus:border-[var(--color-primary)] font-mono transition-all outline-none uppercase"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                        <Button type="button" variant="ghost" onClick={handleCloseModal} data-testid="cancel-department-btn">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} data-testid="submit-department-btn">
                            {isSubmitting ? 'Saving...' : (selectedDepartment ? 'Update Department' : 'Create Department')}
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
                        <AlertTriangle className="shrink-0" />
                        <div>
                            <p className="font-bold">Heads Up</p>
                            <p className="text-sm">Deleting this department may affect associated courses and faculty.</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm">Type <span className="font-bold text-red-600">CONFIRM</span> to delete <span className="font-bold">{selectedDepartment?.name}</span>:</p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full h-12 px-4 border-2 border-[var(--color-border)] rounded-xl outline-none focus:border-red-500 text-center font-bold"
                            placeholder="CONFIRM"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-200"
                            disabled={confirmText !== 'CONFIRM' || isSubmitting}
                            onClick={handleDeleteConfirm}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
}
