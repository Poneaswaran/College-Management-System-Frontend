import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Building2, MapPin, Users, Hash, Trash2, Edit, Search, Calendar, Clock, RotateCcw, ChevronDown } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import axios from 'axios';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';

interface Venue {
    id: number;
    name: string;
    venue_type: string;
    capacity: number;
    floor: number;
    building: string;
}

interface AvailableVenue {
    id: number;
    name: string;
    capacity: number;
    resource_id: number;
}

interface VenueFormData {
    building_name: string;
    building_code: string;
    floor_number: number;
    venue_name: string;
    venue_type: string;
    capacity: number;
}

const VENUE_TYPES = [
    { label: 'Classroom', value: 'CLASSROOM' },
    { label: 'Laboratory', value: 'LAB' },
    { label: 'Seminar Hall', value: 'SEMINAR_HALL' },
    { label: 'Auditorium', value: 'AUDITORIUM' },
    { label: 'Office', value: 'OFFICE' },
];

interface BuildingFilter {
    building_name: string;
    building_code: string;
    floors?: (number | string)[];
    total_floors?: number;
    total_venues?: number;
    total_capacity?: number;
}

export default function VenueManagement() {
    const { addToast } = useToast();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isAvailabilityMode, setIsAvailabilityMode] = useState(false);
    const [formData, setFormData] = useState<VenueFormData>({
        building_name: '',
        building_code: '',
        floor_number: 1,
        venue_name: '',
        venue_type: 'CLASSROOM',
        capacity: 60,
    });
    const [buildingSuggestions, setBuildingSuggestions] = useState<BuildingFilter[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showFloorSuggestions, setShowFloorSuggestions] = useState(false);

    const fetchVenues = useCallback(async () => {
        try {
            setLoading(true);
            setIsAvailabilityMode(false);
            const response = await api.get<{ venues: Venue[] }>('/api/campus-management/venues/');
            setVenues(response.data.venues);
        } catch (error) {
            console.error('Error fetching venues:', error);
            addToast({ type: 'error', title: 'Failed to fetch venues' });
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const checkAvailability = async () => {
        if (!startTime || !endTime) {
            addToast({ type: 'error', title: 'Please select both start and end times' });
            return;
        }

        try {
            setLoading(true);
            setIsAvailabilityMode(true);
            const isoStart = startTime.includes(':') && startTime.split(':').length === 2 ? `${startTime}:00` : startTime;
            const isoEnd = endTime.includes(':') && endTime.split(':').length === 2 ? `${endTime}:00` : endTime;
            
            const response = await api.get<{ available_venues: AvailableVenue[] }>(
                `/api/campus-management/venues/available/?start=${isoStart}&end=${isoEnd}`
            );
            
            // Map available venues to the Venue structure for the DataTable
            const mappedVenues: Venue[] = response.data.available_venues.map(v => ({
                id: v.id,
                name: v.name,
                venue_type: 'AVAILABLE',
                capacity: v.capacity,
                floor: 0,
                building: 'N/A',
            }));
            
            setVenues(mappedVenues);
            addToast({ type: 'success', title: `Found ${mappedVenues.length} available venues` });
        } catch (error) {
            console.error('Error checking availability:', error);
            addToast({ type: 'error', title: 'Failed to check availability' });
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setStartTime('');
        setEndTime('');
        fetchVenues();
    };

    useEffect(() => {
        fetchVenues();
    }, [fetchVenues]);

    const fetchBuildingFilters = useCallback(async () => {
        try {
            const response = await api.get<{ filters: BuildingFilter[] }>('/api/core/filters/?type=room');
            setBuildingSuggestions(response.data.filters);
        } catch (error) {
            console.error('Error fetching building filters:', error);
        }
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            fetchBuildingFilters();
        } else {
            setBuildingSuggestions([]);
            setShowSuggestions(false);
        }
    }, [isModalOpen, fetchBuildingFilters]);

    // Handle building search (filter locally if suggestions are already fetched)
    useEffect(() => {
        if (!isModalOpen) return;
        
        const timer = setTimeout(async () => {
            if (formData.building_name && formData.building_name.length >= 2 && showSuggestions) {
                // If we already have suggestions, we can filter them or re-fetch for more specific results
                // Re-fetching as per user request to call api
                try {
                    const response = await api.get<{ filters: BuildingFilter[] }>(
                        `/api/core/filters/?type=room&building_name=${formData.building_name}`
                    );
                    setBuildingSuggestions(response.data.filters);
                } catch (error) {
                    console.error('Error fetching building filters:', error);
                }
            } else if (!formData.building_name) {
                // Fetch default list when empty
                fetchBuildingFilters();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [formData.building_name, showSuggestions, isModalOpen, fetchBuildingFilters]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'floor_number' || name === 'capacity' ? Number(value) : value,
        }));
        if (name === 'building_name') {
            setShowSuggestions(true);
        }
    };

    const handleBuildingSelect = (buildingName: string | number) => {
        const building = buildingSuggestions.find(b => b.building_name === buildingName);
        if (building) {
            setFormData(prev => ({
                ...prev,
                building_name: building.building_name,
                building_code: building.building_code,
                floor_number: building.floors?.[0] ? Number(building.floors[0]) : 1
            }));
        }
    };

    const handleTypeChange = (value: string | number) => {
        setFormData(prev => ({ ...prev, venue_type: String(value) }));
    };

    const toPascalCase = (str: string) => {
        return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            // Transform keys and values to PascalCase for backend as requested
            const pascalCasePayload = {
                BuildingName: formData.building_name,
                BuildingCode: formData.building_code,
                FloorNumber: formData.floor_number,
                VenueName: formData.venue_name,
                VenueType: toPascalCase(formData.venue_type),
                Capacity: formData.capacity
            };

            await api.post('/api/campus-management/admin/rooms/create/', pascalCasePayload);
            addToast({ type: 'success', title: 'Venue created successfully' });
            setIsModalOpen(false);
            setFormData({
                building_name: '',
                building_code: '',
                floor_number: 1,
                venue_name: '',
                venue_type: 'CLASSROOM',
                capacity: 60,
            });
            fetchVenues();
        } catch (error) {
            console.error('Error creating venue:', error);
            let message = 'Failed to create venue';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            addToast({ type: 'error', title: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Venue>[] = [
        {
            key: 'name',
            header: 'Venue Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <MapPin size={16} />
                    </div>
                    <span className="font-medium">{row.name}</span>
                </div>
            ),
        },
        {
            key: 'building',
            header: 'Building',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-[var(--color-foreground-muted)]" />
                    <span>{row.building}</span>
                </div>
            ),
        },
        {
            key: 'floor',
            header: 'Floor',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Hash size={14} className="text-[var(--color-foreground-muted)]" />
                    <span>Floor {row.floor}</span>
                </div>
            ),
        },
        {
            key: 'venue_type',
            header: 'Type',
            render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    row.venue_type === 'CLASSROOM' 
                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                    : row.venue_type === 'LAB'
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : row.venue_type === 'AVAILABLE'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                    {row.venue_type}
                </span>
            ),
        },
        {
            key: 'capacity',
            header: 'Capacity',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-[var(--color-foreground-muted)]" />
                    <span>{row.capacity} Seats</span>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: () => (
                <div className="flex items-center gap-2">
                    <button className="p-2 text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 rounded-lg transition-colors">
                        <Edit size={16} />
                    </button>
                    <button className="p-2 text-[var(--color-foreground-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/5 rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <PageLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Venue Management</h1>
                        <p className="text-[var(--color-text-secondary)] mt-2">
                            Manage college venues, buildings, and rooms
                        </p>
                    </div>
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Create Venue
                    </Button>
                </div>

                {/* Availability Filter Bar */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 shadow-sm">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[200px] space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
                                <Calendar size={16} /> Start Time
                            </label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full h-11 px-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm transition-shadow focus:shadow-md"
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
                                <Clock size={16} /> End Time
                            </label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full h-11 px-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm transition-shadow focus:shadow-md"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline"
                                onClick={checkAvailability}
                                disabled={loading}
                                className="h-11 px-6 shadow-sm"
                            >
                                <Search size={18} className="mr-2" />
                                Check Availability
                            </Button>
                            {isAvailabilityMode && (
                                <button 
                                    onClick={resetFilters}
                                    className="p-3 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-hover)] rounded-lg transition-all border border-transparent hover:border-[var(--color-border)] shadow-sm"
                                    title="Reset filters"
                                >
                                    <RotateCcw size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-sm">
                    <DataTable 
                        columns={columns} 
                        data={venues} 
                        loading={loading}
                        emptyMessage={isAvailabilityMode ? "No rooms available for the selected time range." : "No venues found. Create one to get started."}
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Venue"
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Dropdown
                            label="Building Name"
                            options={buildingSuggestions.map(b => ({ label: b.building_name, value: b.building_name }))}
                            value={formData.building_name}
                            onChange={handleBuildingSelect}
                            placeholder="Select Building"
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-primary)]">Building Code</label>
                            <input
                                readOnly
                                value={formData.building_code}
                                placeholder="Auto-filled"
                                className="w-full h-12 px-4 bg-[var(--color-background-hover)]/30 border border-[var(--color-border)] rounded-lg outline-none text-[var(--color-text-secondary)] font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 relative">
                            <label className="text-sm font-semibold text-[var(--color-text-primary)]">Floor Number</label>
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    name="floor_number"
                                    value={formData.floor_number}
                                    onChange={handleInputChange}
                                    onFocus={() => setShowFloorSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowFloorSuggestions(false), 200)}
                                    placeholder="e.g. 3"
                                    className="w-full h-12 pl-4 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                />
                                <div 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] cursor-pointer"
                                    onClick={() => setShowFloorSuggestions(!showFloorSuggestions)}
                                >
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                            {showFloorSuggestions && (buildingSuggestions.find(b => b.building_name === formData.building_name)?.floors || [1, 2, 3, 4, 5]).length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                                    {(buildingSuggestions.find(b => b.building_name === formData.building_name)?.floors || [1, 2, 3, 4, 5]).map((f) => (
                                        <button
                                            key={f}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, floor_number: Number(f) }));
                                                setShowFloorSuggestions(false);
                                            }}
                                            className="w-full px-4 py-3 text-left hover:bg-[var(--color-background-hover)] transition-colors border-b last:border-0 border-[var(--color-border)] text-sm font-medium"
                                        >
                                            Floor {f}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-widest text-[10px] opacity-70">Venue Name</label>
                            <input
                                required
                                name="venue_name"
                                value={formData.venue_name}
                                onChange={handleInputChange}
                                placeholder="e.g. MB-301"
                                className="w-full h-12 px-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Dropdown
                            label="Venue Type"
                            options={VENUE_TYPES}
                            value={formData.venue_type}
                            onChange={handleTypeChange}
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--color-text-primary)]">Capacity</label>
                            <input
                                required
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                placeholder="e.g. 60"
                                className="w-full h-12 px-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--color-border)]">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-8"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Venue'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageLayout>
    );
}

