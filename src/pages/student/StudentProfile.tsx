import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client/react';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    BookOpen, 
    GraduationCap,
    Users,
    FileText,
    Shield,
    Edit,
    Camera,
    Loader
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { selectCurrentUser } from '../../store/auth.store';
import { GET_STUDENT_PROFILE } from '../../features/students/graphql/profile';
import { getMediaUrl } from '../../lib/constants';
import type { StudentProfile as StudentProfileType } from '../../features/students/types';

interface StudentProfileResponse {
    studentProfile: StudentProfileType;
}

export default function StudentProfile() {
    const currentUser = useSelector(selectCurrentUser);
    const registerNumber = currentUser?.registerNumber || '';
    
    const { data, loading, error, refetch } = useQuery<StudentProfileResponse>(GET_STUDENT_PROFILE, {
        variables: { registerNumber },
        skip: !registerNumber,
    });

    const profile = data?.studentProfile;
    const profilePhotoUrl = getMediaUrl(profile?.profilePhotoUrl);
    
    // Debug logging
    console.log('Profile photo path from backend:', profile?.profilePhotoUrl);
    console.log('Generated profile photo URL:', profilePhotoUrl);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <Loader className="animate-spin h-12 w-12 mx-auto mb-4 text-[var(--color-primary)]" />
                        <p className="text-[var(--color-foreground-secondary)]">Loading profile...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <p className="text-[var(--color-error)] mb-4">Error loading profile: {error.message}</p>
                        <button 
                            onClick={() => refetch()} 
                            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)]"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (!profile) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-screen">
                    <p className="text-[var(--color-foreground-secondary)]">No profile data available</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">My Profile</h1>
                    <p className="text-[var(--color-foreground-secondary)]">View and manage your personal information</p>
                </div>

                {/* Profile Completion Status */}
                {!profile.profileCompleted && (
                    <div className="mb-6 p-4 bg-[var(--color-warning-light)] border border-[var(--color-warning)] rounded-lg">
                        <p className="text-[var(--color-warning-dark)] font-medium">
                            ⚠️ Your profile is incomplete. Please complete all required fields.
                        </p>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-[var(--color-card)] rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden mb-6">
                        {/* Header with gradient */}
                        <div className="h-32 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>
                        
                        {/* Profile Photo Section */}
                        <div className="px-8 pb-8">
                            <div className="flex items-start gap-6 -mt-16 mb-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white bg-[var(--color-background-secondary)] flex items-center justify-center overflow-hidden shadow-lg">
                                        {profilePhotoUrl ? (
                                            <img 
                                                src={profilePhotoUrl} 
                                                alt={profile.fullName} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error('Image failed to load:', profilePhotoUrl);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                                onLoad={() => console.log('Image loaded successfully:', profilePhotoUrl)}
                                            />
                                        ) : (
                                            <User size={48} className="text-[var(--color-foreground-muted)]" />
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors">
                                        <Camera size={20} />
                                    </button>
                                </div>
                                
                                <div className="flex-1 pt-16">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-[var(--color-foreground)]">{profile.fullName} {profile.lastName}</h2>
                                            <p className="text-[var(--color-foreground-secondary)] flex items-center gap-2 mt-1">
                                                <FileText size={16} />
                                                {profile.registerNumber} • {profile.rollNumber}
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
                                            <Edit size={18} />
                                            Edit Profile
                                        </button>
                                    </div>
                                    
                                    <div className="flex gap-4 mt-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            profile.academicStatus === 'ACTIVE' 
                                                ? 'bg-[var(--color-success-light)] text-[var(--color-success-dark)]'
                                                : 'bg-[var(--color-error-light)] text-[var(--color-error-dark)]'
                                        }`}>
                                            {profile.academicStatus}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-info-light)] text-[var(--color-info-dark)]">
                                            Year {profile.year} • Semester {profile.semester}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="bg-[var(--color-card)] rounded-xl shadow-md border border-[var(--color-border)] p-6">
                            <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                                <User size={22} className="text-[var(--color-primary)]" />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <InfoRow icon={<Calendar size={18} />} label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                                <InfoRow icon={<User size={18} />} label="Gender" value={profile.gender} />
                                <InfoRow icon={<Phone size={18} />} label="Phone" value={profile.phone} />
                                <InfoRow icon={<Mail size={18} />} label="Email" value={profile.user.email} />
                                <InfoRow icon={<MapPin size={18} />} label="Address" value={profile.address} />
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="bg-[var(--color-card)] rounded-xl shadow-md border border-[var(--color-border)] p-6">
                            <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                                <GraduationCap size={22} className="text-[var(--color-primary)]" />
                                Academic Information
                            </h3>
                            <div className="space-y-4">
                                <InfoRow icon={<BookOpen size={18} />} label="Course" value={`${profile.course.name} (${profile.course.code})`} />
                                <InfoRow icon={<BookOpen size={18} />} label="Department" value={`${profile.course.department.name} (${profile.course.department.code})`} />
                                <InfoRow icon={<Users size={18} />} label="Section" value={profile.section.name} />
                                <InfoRow icon={<Calendar size={18} />} label="Duration" value={`${profile.course.durationYears} years`} />
                                <InfoRow icon={<Calendar size={18} />} label="Admission Date" value={formatDate(profile.admissionDate)} />
                            </div>
                        </div>

                        {/* Guardian Information */}
                        <div className="bg-[var(--color-card)] rounded-xl shadow-md border border-[var(--color-border)] p-6">
                            <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                                <Users size={22} className="text-[var(--color-primary)]" />
                                Guardian Information
                            </h3>
                            <div className="space-y-4">
                                <InfoRow icon={<User size={18} />} label="Name" value={profile.guardianName} />
                                <InfoRow icon={<User size={18} />} label="Relationship" value={profile.guardianRelationship} />
                                <InfoRow icon={<Phone size={18} />} label="Phone" value={profile.guardianPhone} />
                                <InfoRow icon={<Mail size={18} />} label="Email" value={profile.guardianEmail} />
                            </div>
                        </div>

                    {/* Identity Information */}
                    <div className="bg-[var(--color-card)] rounded-xl shadow-md border border-[var(--color-border)] p-6">
                        <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                            <Shield size={22} className="text-[var(--color-primary)]" />
                            Identity Information
                        </h3>
                        <div className="space-y-4">
                            <InfoRow icon={<FileText size={18} />} label="Aadhar Number" value={profile.aadharNumber} />
                            <InfoRow icon={<FileText size={18} />} label="ID Proof Type" value={profile.idProofType} />
                            <InfoRow icon={<FileText size={18} />} label="ID Proof Number" value={profile.idProofNumber} />
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

// Helper component for displaying information rows
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[var(--color-primary)]">{icon}</div>
            <div className="flex-1">
                <p className="text-sm text-[var(--color-foreground-muted)]">{label}</p>
                <p className="text-[var(--color-foreground)] font-medium">{value || 'N/A'}</p>
            </div>
        </div>
    );
}
