import { useState } from 'react';
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
    Award
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';

// Dummy static data until GraphQL is integrated
const DUMMY_PROFILE = {
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john.doe@university.edu",
    phone: "+1 555-0198",
    dateOfBirth: "1985-06-15",
    gender: "MALE",
    address: "123 Faculty Quarters, University Campus, Knowledge City",
    employeeId: "FAC-2015-042",
    department: {
        name: "Computer Science and Engineering",
        code: "CSE"
    },
    designation: "Associate Professor",
    joiningDate: "2015-08-01",
    academicStatus: "ACTIVE",
    qualifications: "Ph.D. in Computer Science",
    specialization: "Artificial Intelligence and Machine Learning",
    experience: "10 Years"
};

export default function FacultyProfile() {
    const [profile] = useState(DUMMY_PROFILE);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Dummy state for edit form
    const [formData, setFormData] = useState({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleEditClick = () => {
        setFormData({
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            address: profile.address,
        });
        setIsEditModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setUpdating(false);
        setIsEditModalOpen(false);
        // In reality, we'd refetch or update state here
    };

    return (
        <PageLayout>
            <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-in-left">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-foreground)] tracking-tight">Faculty Profile</h1>
                        <p className="text-[var(--color-foreground-secondary)] mt-1">Manage your professional identity and personal information</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-md border border-[var(--color-border)] overflow-hidden animate-slide-up">
                    {/* Header with gradient */}
                    <div className="h-32 md:h-40 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>

                    {/* Profile Photo Section */}
                    <div className="px-6 md:px-8 pb-8 relative">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 mb-6">
                            <div className="relative group shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[var(--color-card)] bg-[var(--color-background-secondary)] flex items-center justify-center overflow-hidden shadow-theme-lg">
                                    <User size={64} className="text-[var(--color-foreground-muted)]" />
                                </div>
                                <button
                                    className="absolute bottom-2 right-2 w-10 h-10 bg-[var(--color-background)] hover:bg-[var(--color-background-secondary)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-full flex items-center justify-center shadow-theme-sm transition-colors"
                                    title="Upload new photo (Coming soon)"
                                >
                                    <Camera size={18} />
                                </button>
                            </div>

                            <div className="flex-1 pb-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">{profile.fullName}</h2>
                                        <p className="text-[var(--color-foreground-secondary)] font-mono text-sm mt-1">
                                            {profile.employeeId} • {profile.designation}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleEditClick}
                                        className="btn btn-primary btn-md flex items-center justify-center gap-2 shrink-0 md:self-end"
                                    >
                                        <Edit size={16} />
                                        <span>Edit Profile</span>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="badge badge-success">
                                        {profile.academicStatus}
                                    </span>
                                    <span className="badge badge-info">
                                        {profile.department.code} Department
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
                            <InfoRow icon={<BookOpen size={16} />} label="Department" value={`${profile.department.name} (${profile.department.code})`} />
                            <InfoRow icon={<Calendar size={16} />} label="Date of Joining" value={formatDate(profile.joiningDate)} />
                            <InfoRow icon={<GraduationCap size={16} />} label="Qualifications" value={profile.qualifications} />
                            <InfoRow icon={<Award size={16} />} label="Specialization" value={profile.specialization} />
                            <InfoRow icon={<Calendar size={16} />} label="Experience" value={profile.experience} />
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
                            <InfoRow icon={<Calendar size={16} />} label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                            <InfoRow icon={<User size={16} />} label="Gender" value={profile.gender} />
                            <InfoRow icon={<Phone size={16} />} label="Phone" value={profile.phone} />
                            <InfoRow icon={<Mail size={16} />} label="Email" value={profile.email} />
                            <InfoRow icon={<MapPin size={16} />} label="Address" value={profile.address} />
                        </div>
                    </div>

                    {/* Identity Information */}
                    <div className="bg-[var(--color-card)] rounded-xl shadow-theme-md border border-[var(--color-border)] p-6 md:p-8 lg:col-span-2 animate-scale-in delay-300">
                        <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-3">
                            <div className="p-2 bg-[var(--color-warning)]/10 text-[var(--color-warning)] rounded-lg">
                                <Shield size={20} />
                            </div>
                            Account Identity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InfoRow icon={<User size={16} />} label="Employee ID" value={profile.employeeId} />
                            <InfoRow icon={<Building2 size={16} />} label="Associated Role" value="FACULTY" />
                        </div>
                    </div>
                </div>

                {/* Dummy Edit Profile Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-xl border border-[var(--color-border)] max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in overflow-hidden">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                                <h2 className="text-xl font-bold text-[var(--color-foreground)]">Edit Profile</h2>
                                <button
                                    onClick={() => !updating && setIsEditModalOpen(false)}
                                    className="p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto">
                                <div className="p-4 mb-6 bg-[var(--color-info)]/10 border border-[var(--color-info)]/30 rounded-xl flex items-start gap-3">
                                    <Shield size={20} className="text-[var(--color-info)] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-[var(--color-info)] font-medium">Limited Editing Capabilities</p>
                                        <p className="text-sm text-[var(--color-foreground-secondary)] mt-1">Some fields like Employee ID and Department can only be modified by administrators. Contact the admin office for changes.</p>
                                    </div>
                                </div>

                                <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="input w-full"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="input w-full"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                                Contact Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 border-t border-[var(--color-border)] pt-6">
                                        <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                            Residential Address
                                        </label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="input w-full py-3 resize-none"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
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

// Helper component for displaying information rows
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
