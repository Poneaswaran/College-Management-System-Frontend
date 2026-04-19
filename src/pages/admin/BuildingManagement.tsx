import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Building2, Hash, Trash2, Edit } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import axios from 'axios';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';

interface Building {
    id: number;
    name: string;
    code: string;
    total_floors: number;
    total_rooms: number;
}

interface BuildingFormData {
    name: string;
    code: string;
}

export default function BuildingManagement() {
    const { addToast } = useToast();
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<BuildingFormData>({
        name: '',
        code: '',
    });
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const fetchBuildings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<{ buildings: Building[] }>('/api/campus-management/admin/buildings/');
            setBuildings(response.data.buildings);
        } catch (error) {
            console.error('Error fetching buildings:', error);
            addToast({ type: 'error', title: 'Failed to fetch buildings' });
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchBuildings();
    }, [fetchBuildings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditClick = (building: Building) => {
        setSelectedBuilding(building);
        setFormData({
            name: building.name,
            code: building.code,
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (building: Building) => {
        setSelectedBuilding(building);
        setConfirmText('');
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBuilding(null);
        setFormData({ name: '', code: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (selectedBuilding) {
                await api.patch(`/api/campus-management/admin/buildings/${selectedBuilding.id}/`, formData);
                addToast({ type: 'success', title: 'Building updated successfully' });
            } else {
                await api.post('/api/campus-management/admin/buildings/create/', formData);
                addToast({ type: 'success', title: 'Building created successfully' });
            }
            handleCloseModal();
            fetchBuildings();
        } catch (error) {
            console.error('Error saving building:', error);
            let message = 'Failed to save building';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            addToast({ type: 'error', title: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedBuilding || confirmText !== 'CONFIRM') return;

        try {
            setIsSubmitting(true);
            await api.delete(`/api/campus-management/admin/buildings/${selectedBuilding.id}/`);
            addToast({ type: 'success', title: 'Building and associated resources deleted successfully' });
            setIsDeleteModalOpen(false);
            setSelectedBuilding(null);
            fetchBuildings();
        } catch (error) {
            console.error('Error deleting building:', error);
            addToast({ type: 'error', title: 'Failed to delete building' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Building>[] = [
        {
            key: 'name',
            header: 'Building Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-sm transition-transform hover:scale-105">
                        <Building2 size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-[var(--color-text-primary)]">{row.name}</span>
                        <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">{row.code}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'total_floors',
            header: 'Floors',
            render: (row) => (
                <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-background-secondary)] rounded-lg border border-[var(--color-border)] w-fit">
                    <Hash size={14} className="text-[var(--color-primary)] opacity-70" />
                    <span className="font-semibold text-sm">{row.total_floors} Floors</span>
                </div>
            ),
        },
        {
            key: 'total_rooms',
            header: 'Rooms',
            render: (row) => (
                <div className="px-3 py-1 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 rounded-lg w-fit">
                    <span className="font-medium text-sm text-[var(--color-primary)]">{row.total_rooms} Rooms</span>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => handleEditClick(row)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-hover)] rounded-lg transition-all border border-transparent hover:border-[var(--color-border)]" 
                        title="Edit Building"
                    >
                        <Edit size={18} />
                    </button>
                    <button 
                        onClick={() => handleDeleteClick(row)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/5 rounded-lg transition-all border border-transparent hover:border-red-100" 
                        title="Delete Building"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <PageLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--color-border)]">
                    <div>
                        <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Building Management</h1>
                        <p className="text-[var(--color-text-secondary)] mt-2 text-lg font-medium">
                            Manage main university structures and infrastructure
                        </p>
                    </div>
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 h-14 px-8 shadow-xl shadow-[var(--color-primary)]/20 hover:shadow-none transition-all"
                    >
                        <Plus size={24} />
                        Add Building
                    </Button>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl transition-all hover:shadow-primary/5 group">
                    <DataTable 
                        columns={columns} 
                        data={buildings} 
                        loading={loading}
                        emptyMessage="No buildings registered yet. Add one to start organizing your campus."
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedBuilding ? "Edit Building" : "Register New Building"}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-widest flex items-center gap-2">
                                <Building2 size={16} className="text-[var(--color-primary)]" />
                                Building Full Name
                            </label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Science & Technology Block"
                                className="w-full h-14 px-5 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-medium text-lg placeholder:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-widest flex items-center gap-2">
                                <Hash size={16} className="text-[var(--color-primary)]" />
                                Building Short Code
                            </label>
                            <input
                                required
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                placeholder="e.g. STB"
                                className="w-full h-14 px-5 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all font-mono font-bold text-lg uppercase tracking-widest placeholder:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-8 border-t border-[var(--color-border)]">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                            className="h-12 px-6 font-bold uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="h-12 px-10 font-bold uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20"
                        >
                            {isSubmitting ? 'Saving...' : (selectedBuilding ? 'Update Building' : 'Register Building')}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
                maxWidth="max-w-md"
            >
                <div className="p-6 pt-0 space-y-6">
                    <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl text-red-700 space-y-2">
                        <p className="font-bold flex items-center gap-2">
                            <Trash2 size={18} />
                            Critical Warning
                        </p>
                        <p className="text-sm">
                            Deleting <span className="font-black underline">{selectedBuilding?.name}</span> will permanently remove all associated:
                        </p>
                        <ul className="text-xs list-disc list-inside opacity-80">
                            <li>Floors and levels</li>
                            <li>Rooms and Venues</li>
                            <li>Schedules associated with these venues</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                            Please type <span className="font-mono font-bold text-red-600 bg-red-50 px-1 rounded">CONFIRM</span> to proceed:
                        </p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type CONFIRM here"
                            className="w-full h-14 px-5 bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-bold tracking-widest text-center"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                        <Button 
                            variant="ghost" 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 h-12 font-bold uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={handleDeleteConfirm}
                            disabled={confirmText !== 'CONFIRM' || isSubmitting}
                            className={`flex-1 h-12 font-bold uppercase tracking-widest border-2 transition-all ${
                                confirmText === 'CONFIRM' 
                                ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20 hover:bg-red-700' 
                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
}
