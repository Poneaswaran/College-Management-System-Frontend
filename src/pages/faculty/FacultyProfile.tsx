import React, { useState, useEffect, useCallback } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Briefcase,
    Shield,
    Edit,
    Camera,
    Loader,
    X,
    Building2,
    GraduationCap,
    Award,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { Header } from '../../components/layout/Header';
import profileService, { type FacultyProfile as FacultyProfileType } from '../../services/profile.service';

export default function FacultyProfile() {
    const [profile, setProfile] = useState<FacultyProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        designation: '',
        qualifications: '',
        specialization: '',
        office_hours: '',
        experience: '',
    });

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const data = await profileService.getFacultyProfile();
            setProfile(data);
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                phone: data.phone || '',
                address: data.address || '',
                designation: data.designation || '',
                qualifications: data.qualifications || '',
                specialization: data.specialization || '',
                office_hours: data.office_hours || '',
                experience: data.experience || '',
            });
        } catch (err: any) {
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchProfile();
    }, [fetchProfile]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        
        setUpdating(true);
        setError(null);
        setSuccess(null);

        try {
            await profileService.updateFaculty(profile.user, formData);
            setSuccess('Profile updated successfully');
            await fetchProfile();
            setTimeout(() => setIsEditModalOpen(false), 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <PageLayout>
                <Header title="Faculty Profile" />
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader className="animate-spin text-[var(--color-primary)]" size={48} />
                    <p className="text-[var(--color-foreground-muted)] font-medium animate-pulse">Loading your profile...</p>
                </div>
            </PageLayout>
        );
    }

    if (!profile) {
        return (
            <PageLayout>
                <Header title="Faculty Profile" />
                <div className="p-8 text-center">
                    <div className="bg-[var(--color-error-light)] text-[var(--color-error)] p-6 rounded-2xl inline-block">
                        <AlertCircle size={40} className="mx-auto mb-2" />
                        <h3 className="font-bold">Error Loading Profile</h3>
                        <p className="text-sm">{error || 'Profile not found'}</p>
                        <button onClick={() => window.location.reload()} className="mt-4 btn btn-error btn-sm">Retry</button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Header 
                title="Faculty Profile" 
                titleIcon={<User size={28} className="text-[var(--color-primary)]" />}
            />
            <div className="p-6 md:p-8 space-y-6">

                {/* Profile Card */}
                <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-md border border-[var(--color-border)] overflow-hidden animate-slide-up">
                    <div className="h-32 md:h-40 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>

                    <div className="px-6 md:px-8 pb-8 relative">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 mb-6">
                            <div className="relative group shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[var(--color-card)] bg-[var(--color-background-secondary)] flex items-center justify-center overflow-hidden shadow-theme-lg">
                                    {profile.profile_photo ? (
                                        <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-[var(--color-foreground-muted)]" />
                                    )}
                                </div>
                                <button
                                    className="absolute bottom-2 right-2 w-10 h-10 bg-[var(--color-background)] hover:bg-[var(--color-background-secondary)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-full flex items-center justify-center shadow-theme-sm transition-colors"
                                    title="Upload new photo"
                                >
                                    <Camera size={18} />
                                </button>
                            </div>

                            <div className="flex-1 pb-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">{profile.full_name}</h2>
                                        <p className="text-[var(--color-foreground-secondary)] font-mono text-sm mt-1">
                                            {profile.designation} • {profile.department_name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="btn btn-primary btn-md flex items-center justify-center gap-2 shrink-0 md:self-end"
                                    >
                                        <Edit size={16} />
                                        <span>Edit Profile</span>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className={`badge ${profile.is_active ? 'badge-success' : 'badge-error'}`}>
                                        {profile.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                    <span className="badge badge-info">
                                        {profile.department_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Professional Information */}
                    <div className="bg-[var(--color-card)] rounded-xl shadow-theme-md border border-[var(--color-border)] p-6 md:p-8 animate-scale-in delay-100">
                        <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-3">
                            <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                                <Building2 size={20} />
                            </div>
                            Professional Details
                        </h3>
                        <div className="space-y-5">
                            <InfoRow icon={<Briefcase size={16} />} label="Designation" value={profile.designation} />
                            <InfoRow icon={<BookOpen size={16} />} label="Department" value={profile.department_name || 'N/A'} />
                            <InfoRow icon={<Calendar size={16} />} label="Date of Joining" value={formatDate(profile.joining_date)} />
                            <InfoRow icon={<GraduationCap size={16} />} label="Qualifications" value={profile.qualifications} />
                            <InfoRow icon={<Award size={16} />} label="Specialization" value={profile.specialization} />
                            <InfoRow icon={<Calendar size={16} />} label="Experience" value={profile.experience || 'N/A'} />
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-[var(--color-card)] rounded-xl shadow-theme-md border border-[var(--color-border)] p-6 md:p-8 animate-scale-in delay-200">
                        <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-3">
                            <div className="p-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-lg">
                                <User size={20} />
                            </div>
                            Personal Information
                        </h3>
                        <div className="space-y-5">
                            <InfoRow icon={<Calendar size={16} />} label="Date of Birth" value={formatDate(profile.date_of_birth)} />
                            <InfoRow icon={<User size={16} />} label="Gender" value={profile.gender || 'N/A'} />
                            <InfoRow icon={<Phone size={16} />} label="Phone" value={profile.phone || 'N/A'} />
                            <InfoRow icon={<Mail size={16} />} label="Email" value={profile.email || 'N/A'} />
                            <InfoRow icon={<MapPin size={16} />} label="Address" value={profile.address || 'N/A'} />
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-xl border border-[var(--color-border)] max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in overflow-hidden">
                            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                                <h2 className="text-xl font-bold text-[var(--color-foreground)]">Edit Profile</h2>
                                <button
                                    onClick={() => !updating && setIsEditModalOpen(false)}
                                    className="p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">First Name</label>
                                            <input
                                                type="text"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                className="input w-full"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">Last Name</label>
                                            <input
                                                type="text"
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                className="input w-full"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input w-full"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">Experience</label>
                                            <input
                                                type="text"
                                                value={formData.experience}
                                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                className="input w-full"
                                                placeholder="e.g., 10 Years"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">Specialization</label>
                                            <input
                                                type="text"
                                                value={formData.specialization}
                                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                className="input w-full"
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">Residential Address</label>
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                rows={3}
                                                className="input w-full py-3 resize-none"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl flex items-center gap-3">
                                            <AlertCircle size={18} />
                                            <p className="text-sm font-medium">{error}</p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="p-4 bg-[var(--color-success-light)] text-[var(--color-success)] rounded-xl flex items-center gap-3">
                                            <CheckCircle2 size={18} />
                                            <p className="text-sm font-medium">{success}</p>
                                        </div>
                                    )}
                                </form>
                            </div>

                            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] shrink-0 flex justify-end gap-3 rounded-b-2xl">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    disabled={updating}
                                    className="btn btn-outline btn-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="edit-profile-form"
                                    disabled={updating}
                                    className="btn btn-primary btn-md min-w-[120px]"
                                >
                                    {updating ? <Loader size={18} className="animate-spin" /> : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-[var(--color-background-secondary)] transition-colors group">
            <div className="mt-0.5 text-[var(--color-foreground-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-foreground-muted)] mb-1">{label}</p>
                <p className="text-sm font-semibold text-[var(--color-foreground)] break-words">{value || 'N/A'}</p>
            </div>
        </div>
    );
}
