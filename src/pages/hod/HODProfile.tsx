import { useEffect, useState } from 'react';
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
    Users,
    FlaskConical,
    BookMarked,
    ExternalLink,
    Tag,
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { useHODProfile } from '../../features/faculty/hooks/hodProfile';
import type { ResearchPublication, UpdateHODProfileInput } from '../../features/faculty/types/hodProfile';
import { useToast } from '../../components/ui/Toast';
import { SkeletonProfile } from '../../components/ui/Skeleton';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function yearsFrom(dateStr: string): number {
    return Math.floor(
        (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
    );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-[var(--color-background-secondary)] transition-colors group">
            <div className="mt-0.5 text-[var(--color-foreground-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-foreground-muted)] mb-1">
                    {label}
                </p>
                <p className="text-sm font-semibold text-[var(--color-foreground)] break-words">
                    {value || 'N/A'}
                </p>
            </div>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
    icon,
    label,
    value,
    color,
    bg,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    bg: string;
}) {
    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl ${bg} ${color} flex-shrink-0`}>{icon}</div>
            <div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// ─── Publication Type Badge ───────────────────────────────────────────────────

const PUB_TYPE_CONFIG: Record<
    ResearchPublication['type'],
    { label: string; className: string }
> = {
    JOURNAL: {
        label: 'Journal',
        className:
            'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30',
    },
    CONFERENCE: {
        label: 'Conference',
        className:
            'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]/30',
    },
    BOOK_CHAPTER: {
        label: 'Book Chapter',
        className:
            'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)]/30',
    },
};

function PubTypeBadge({ type }: { type: ResearchPublication['type'] }) {
    const { label, className } = PUB_TYPE_CONFIG[type];
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
            {label}
        </span>
    );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

interface EditModalProps {
    initial: UpdateHODProfileInput & { researchInterests: string[] };
    updating: boolean;
    onSave: (input: UpdateHODProfileInput) => void;
    onClose: () => void;
}

function EditProfileModal({ initial, updating, onSave, onClose }: EditModalProps) {
    const [form, setForm] = useState(initial);
    const [interestInput, setInterestInput] = useState('');

    const handleField =
        (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const addInterest = () => {
        const trimmed = interestInput.trim();
        if (!trimmed || form.researchInterests?.includes(trimmed)) return;
        setForm((prev) => ({
            ...prev,
            researchInterests: [...(prev.researchInterests ?? []), trimmed],
        }));
        setInterestInput('');
    };

    const removeInterest = (item: string) =>
        setForm((prev) => ({
            ...prev,
            researchInterests: (prev.researchInterests ?? []).filter((i) => i !== item),
        }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-xl border border-[var(--color-border)] max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-[var(--color-foreground)]">Edit Profile</h2>
                    <button
                        onClick={() => !updating && onClose()}
                        className="p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Notice */}
                    <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl flex items-start gap-3">
                        <Shield size={18} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                        <p className="text-sm text-[var(--color-foreground-secondary)]">
                            Fields like Employee ID, Department, and Designation can only be changed
                            by the Admin Office.
                        </p>
                    </div>

                    <form id="hod-edit-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                    First Name
                                </label>
                                <input
                                    className="input w-full"
                                    value={form.firstName ?? ''}
                                    onChange={handleField('firstName')}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                    Last Name
                                </label>
                                <input
                                    className="input w-full"
                                    value={form.lastName ?? ''}
                                    onChange={handleField('lastName')}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                    Contact Phone
                                </label>
                                <input
                                    className="input w-full"
                                    type="tel"
                                    value={form.phone ?? ''}
                                    onChange={handleField('phone')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-[var(--color-border)] pt-5">
                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                Residential Address
                            </label>
                            <textarea
                                className="input w-full py-3 resize-none"
                                rows={3}
                                value={form.address ?? ''}
                                onChange={handleField('address')}
                            />
                        </div>

                        {/* Research Interests */}
                        <div className="space-y-3 border-t border-[var(--color-border)] pt-5">
                            <label className="text-xs font-bold uppercase tracking-wide text-[var(--color-foreground-secondary)]">
                                Research Interests
                            </label>
                            <div className="flex gap-2">
                                <input
                                    className="input flex-1"
                                    placeholder="Add interest and press Enter or +"
                                    value={interestInput}
                                    onChange={(e) => setInterestInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addInterest();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={addInterest}
                                    className="btn btn-outline btn-md px-4"
                                >
                                    +
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(form.researchInterests ?? []).map((item) => (
                                    <span
                                        key={item}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm border border-[var(--color-primary)]/20"
                                    >
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => removeInterest(item)}
                                            className="hover:text-[var(--color-error)] transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] shrink-0 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={updating}
                        className="btn btn-outline btn-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="hod-edit-form"
                        disabled={updating}
                        className="btn btn-primary btn-md min-w-[130px]"
                    >
                        {updating ? <Loader size={18} className="animate-spin" /> : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HODProfile() {
    const { profile, loading, updating, error, loadProfile, saveProfile } = useHODProfile();
    const { addToast } = useToast();
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const openEdit = () => setIsEditOpen(true);
    const closeEdit = () => setIsEditOpen(false);

    const handleSave = async (input: UpdateHODProfileInput) => {
        try {
            await saveProfile(input);
            addToast({ type: 'success', title: 'Profile Updated', message: 'Your changes have been saved.' });
            closeEdit();
        } catch {
            addToast({ type: 'error', title: 'Update Failed', message: 'Could not save changes. Please try again.' });
        }
    };

    return (
        <PageLayout>
            <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-in-left">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-foreground)] tracking-tight">
                            HOD Profile
                        </h1>
                        <p className="text-[var(--color-foreground-secondary)] mt-1">
                            Manage your professional identity and department information
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && <SkeletonProfile />}

                {/* Error */}
                {!loading && error && (
                    <div className="p-5 bg-[var(--color-error-light)] text-[var(--color-error)] rounded-xl border border-[var(--color-error)]/40">
                        <p className="font-semibold">Failed to load profile</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Data */}
                {!loading && profile && (
                    <>
                        {/* ── Profile Hero Card ─────────────────────────────── */}
                        <div className="bg-[var(--color-card)] rounded-2xl shadow-theme-md border border-[var(--color-border)] overflow-hidden animate-slide-up">
                            {/* Gradient Banner */}
                            <div className="h-32 md:h-40 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />

                            {/* Avatar + Identity */}
                            <div className="px-6 md:px-8 pb-8 relative">
                                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20 mb-6">
                                    {/* Avatar */}
                                    <div className="relative group shrink-0">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[var(--color-card)] bg-[var(--color-background-secondary)] flex items-center justify-center overflow-hidden shadow-theme-lg">
                                            {profile.profilePhoto ? (
                                                <img
                                                    src={profile.profilePhoto}
                                                    alt={profile.fullName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User size={64} className="text-[var(--color-foreground-muted)]" />
                                            )}
                                        </div>
                                        <button
                                            title="Upload new photo (Coming soon)"
                                            className="absolute bottom-2 right-2 w-10 h-10 bg-[var(--color-background)] hover:bg-[var(--color-background-secondary)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-full flex items-center justify-center shadow-theme-sm transition-colors"
                                        >
                                            <Camera size={18} />
                                        </button>
                                    </div>

                                    {/* Name + Badges */}
                                    <div className="flex-1 pb-2">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">
                                                    {profile.fullName}
                                                </h2>
                                                <p className="text-[var(--color-foreground-secondary)] font-mono text-sm mt-1">
                                                    {profile.employeeId} · {profile.designation}
                                                </p>
                                            </div>
                                            <button
                                                onClick={openEdit}
                                                className="btn btn-primary btn-md flex items-center justify-center gap-2 shrink-0 md:self-end"
                                            >
                                                <Edit size={16} />
                                                Edit Profile
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="badge badge-success">
                                                {profile.academicStatus}
                                            </span>
                                            <span className="badge badge-info">
                                                {profile.department.code} Department
                                            </span>
                                            <span className="badge badge-warning">
                                                HOD since {new Date(profile.hodSince).getFullYear()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Department Vision */}
                                <div className="mt-2 p-4 rounded-xl bg-[var(--color-background-secondary)] border border-[var(--color-border)]">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-foreground-muted)] mb-1">
                                        Department Vision
                                    </p>
                                    <p className="text-sm text-[var(--color-foreground-secondary)] italic leading-relaxed">
                                        "{profile.department.vision}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Department Stats ──────────────────────────────── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
                            <StatCard
                                icon={<Users size={22} />}
                                label="Total Faculty"
                                value={profile.departmentStats.totalFaculty}
                                color="text-[var(--color-primary)]"
                                bg="bg-[var(--color-primary)]/10"
                            />
                            <StatCard
                                icon={<GraduationCap size={22} />}
                                label="Total Students"
                                value={profile.departmentStats.totalStudents}
                                color="text-[var(--color-secondary)]"
                                bg="bg-[var(--color-secondary)]/10"
                            />
                            <StatCard
                                icon={<BookOpen size={22} />}
                                label="Active Courses"
                                value={profile.departmentStats.activeCourses}
                                color="text-[var(--color-success)]"
                                bg="bg-[var(--color-success-light)]"
                            />
                            <StatCard
                                icon={<FlaskConical size={22} />}
                                label="Research Projects"
                                value={profile.departmentStats.researchProjects}
                                color="text-[var(--color-warning)]"
                                bg="bg-[var(--color-warning-light)]"
                            />
                        </div>

                        {/* ── Info Grid ─────────────────────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Professional Details */}
                            <div className="bg-[var(--color-card)] rounded-xl shadow-theme-md border border-[var(--color-border)] p-6 md:p-8 animate-scale-in delay-100">
                                <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                                        <Building2 size={20} />
                                    </div>
                                    Professional Details
                                </h3>
                                <div className="space-y-1">
                                    <InfoRow icon={<Briefcase size={16} />} label="Designation" value={profile.designation} />
                                    <InfoRow
                                        icon={<BookOpen size={16} />}
                                        label="Department"
                                        value={`${profile.department.name} (${profile.department.code})`}
                                    />
                                    <InfoRow
                                        icon={<Calendar size={16} />}
                                        label="Date of Joining"
                                        value={`${formatDate(profile.joiningDate)} (${yearsFrom(profile.joiningDate)} yrs)`}
                                    />
                                    <InfoRow
                                        icon={<Award size={16} />}
                                        label="HOD Since"
                                        value={`${formatDate(profile.hodSince)} (${yearsFrom(profile.hodSince)} yrs as HOD)`}
                                    />
                                    <InfoRow icon={<GraduationCap size={16} />} label="Qualifications" value={profile.qualifications} />
                                    <InfoRow icon={<BookMarked size={16} />} label="Specialization" value={profile.specialization} />
                                    <InfoRow icon={<Calendar size={16} />} label="Total Experience" value={profile.experience} />
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
                                <div className="space-y-1">
                                    <InfoRow icon={<Calendar size={16} />} label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                                    <InfoRow icon={<User size={16} />} label="Gender" value={profile.gender} />
                                    <InfoRow icon={<Phone size={16} />} label="Phone" value={profile.phone} />
                                    <InfoRow icon={<Mail size={16} />} label="Email" value={profile.email} />
                                    <InfoRow icon={<MapPin size={16} />} label="Address" value={profile.address} />
                                </div>
                            </div>

                            {/* Account Identity */}
                            <div className="bg-[var(--color-card)] rounded-xl shadow-theme-md border border-[var(--color-border)] p-6 md:p-8 lg:col-span-2 animate-scale-in delay-300">
                                <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-[var(--color-warning)]/10 text-[var(--color-warning)] rounded-lg">
                                        <Shield size={20} />
                                    </div>
                                    Account Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                    <InfoRow icon={<User size={16} />} label="Employee ID" value={profile.employeeId} />
                                    <InfoRow icon={<Building2 size={16} />} label="Role" value="HEAD OF DEPARTMENT (HOD)" />
                                </div>
                            </div>
                        </div>

                        {/* ── Research Interests ────────────────────────────── */}
                        <div className="bg-[var(--color-card)] rounded-xl shadow-theme-md border border-[var(--color-border)] p-6 md:p-8 animate-scale-in delay-100">
                            <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-5 flex items-center gap-3">
                                <div className="p-2 bg-[var(--color-success-light)] text-[var(--color-success)] rounded-lg">
                                    <Tag size={20} />
                                </div>
                                Research Interests
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {profile.researchInterests.map((interest) => (
                                    <span
                                        key={interest}
                                        className="px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-sm font-medium"
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ── Publications ──────────────────────────────────── */}
                        <div className="bg-[var(--color-card)] rounded-xl shadow-theme-md border border-[var(--color-border)] p-6 md:p-8 animate-scale-in delay-200">
                            <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-5 flex items-center gap-3">
                                <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                                    <FlaskConical size={20} />
                                </div>
                                Research Publications
                                <span className="ml-auto text-sm font-normal text-[var(--color-foreground-muted)]">
                                    {profile.publications.length} total
                                </span>
                            </h3>
                            <div className="divide-y divide-[var(--color-border)]">
                                {profile.publications.map((pub) => (
                                    <div key={pub.id} className="py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <PubTypeBadge type={pub.type} />
                                                    <span className="text-xs text-[var(--color-foreground-muted)]">
                                                        {pub.year}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-[var(--color-foreground)] mb-0.5">
                                                    {pub.title}
                                                </p>
                                                <p className="text-xs text-[var(--color-foreground-secondary)]">
                                                    {pub.journal}
                                                </p>
                                            </div>
                                            {pub.doi && (
                                                <a
                                                    href={`https://doi.org/${pub.doi}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-shrink-0 text-[var(--color-primary)] hover:opacity-75 transition-opacity"
                                                    title="View DOI"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Edit Modal */}
            {isEditOpen && profile && (
                <EditProfileModal
                    initial={{
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        phone: profile.phone,
                        address: profile.address,
                        researchInterests: [...profile.researchInterests],
                    }}
                    updating={updating}
                    onSave={handleSave}
                    onClose={closeEdit}
                />
            )}
        </PageLayout>
    );
}
