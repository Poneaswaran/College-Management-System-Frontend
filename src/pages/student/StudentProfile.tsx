import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client/react';
import { useState } from 'react';
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
    Loader,
    X
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import { selectCurrentUser } from '../../store/auth.store';
import { GET_STUDENT_PROFILE } from '../../features/students/graphql/profile';
import { getMediaUrl } from '../../lib/constants';
import { useUpdateProfileWithPhoto } from '../../features/students/hooks';
import ImageCropper from '../../components/ui/ImageCropper';
import type { StudentProfile as StudentProfileType, UpdateStudentProfileWithPhotoInput } from '../../features/students/types';

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

    const { updateProfile, loading: updating, error: updateError } = useUpdateProfileWithPhoto();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<UpdateStudentProfileWithPhotoInput>({});
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempPhotoFile, setTempPhotoFile] = useState<File | null>(null);

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

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const handleEditClick = () => {
        if (profile) {
            setFormData({
                firstName: profile.fullName,
                lastName: profile.lastName,
                phone: profile.phone,
                dateOfBirth: formatDateForInput(profile.dateOfBirth),
                gender: profile.gender as 'MALE' | 'FEMALE' | 'OTHER',
                address: profile.address,
                guardianName: profile.guardianName,
                guardianRelationship: profile.guardianRelationship,
                guardianPhone: profile.guardianPhone,
                guardianEmail: profile.guardianEmail,
            });
        }
        setIsEditModalOpen(true);
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            setTempPhotoFile(file);
            setIsCropperOpen(true);
        }
        // Reset input value so same file can be selected again
        e.target.value = '';
    };

    const handleCropComplete = (croppedFile: File) => {
        setSelectedPhoto(croppedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(croppedFile);
        setIsCropperOpen(false);
        setTempPhotoFile(null);
    };

    const handleCropCancel = () => {
        setIsCropperOpen(false);
        setTempPhotoFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const result = await updateProfile(registerNumber, formData, selectedPhoto);
        
        if (result) {
            setIsEditModalOpen(false);
            setSelectedPhoto(null);
            setPhotoPreview(null);
            await refetch();
        }
    };

    const handlePhotoButtonClick = () => {
        document.getElementById('profile-photo-input')?.click();
    };

    const handleDirectPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            setTempPhotoFile(file);
            setIsCropperOpen(true);
        }
        // Reset input value
        e.target.value = '';
    };

    const handleDirectCropComplete = async (croppedFile: File) => {
        setIsCropperOpen(false);
        setTempPhotoFile(null);
        
        if (profile) {
            const result = await updateProfile(registerNumber, {}, croppedFile);
            if (result) {
                await refetch();
            }
        }
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
                                    <button 
                                        onClick={handlePhotoButtonClick}
                                        disabled={updating}
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Change profile photo"
                                    >
                                        {updating ? <Loader size={20} className="animate-spin" /> : <Camera size={20} />}
                                    </button>
                                    <input
                                        id="profile-photo-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleDirectPhotoUpload}
                                        className="hidden"
                                    />
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
                                        <button 
                                            onClick={handleEditClick}
                                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                                        >
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

                {/* Edit Profile Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[var(--color-card)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)]">Edit Profile</h2>
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors"
                                >
                                    <X size={24} className="text-[var(--color-foreground-secondary)]" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Error Display */}
                                {updateError && (
                                    <div className="p-4 bg-[var(--color-error-light)] border border-[var(--color-error)] rounded-lg">
                                        <p className="text-[var(--color-error-dark)]">{updateError}</p>
                                    </div>
                                )}

                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                        Profile Photo
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center overflow-hidden">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : profilePhotoUrl ? (
                                                <img src={profilePhotoUrl} alt="Current" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={32} className="text-[var(--color-foreground-muted)]" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoSelect}
                                            className="block w-full text-sm text-[var(--color-foreground-secondary)]
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-[var(--color-primary)] file:text-white
                                                hover:file:bg-[var(--color-primary-hover)]
                                                file:cursor-pointer cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.firstName || ''}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lastName || ''}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dateOfBirth || ''}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                            Gender
                                        </label>
                                        <select
                                            value={formData.gender || ''}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER' })}
                                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            value={formData.address || ''}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Guardian Information */}
                                <div className="border-t border-[var(--color-border)] pt-6">
                                    <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">Guardian Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                                Guardian Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.guardianName || ''}
                                                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                                Relationship
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.guardianRelationship || ''}
                                                onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                                Guardian Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.guardianPhone || ''}
                                                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                                                Guardian Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.guardianEmail || ''}
                                                onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-4 justify-end border-t border-[var(--color-border)] pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        disabled={updating}
                                        className="px-6 py-2 border border-[var(--color-border)] text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updating ? (
                                            <>
                                                <Loader className="animate-spin" size={18} />
                                                Updating...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Image Cropper Modal */}
                {isCropperOpen && tempPhotoFile && (
                    <ImageCropper
                        imageFile={tempPhotoFile}
                        onCropComplete={isEditModalOpen ? handleCropComplete : handleDirectCropComplete}
                        onCancel={handleCropCancel}
                    />
                )}
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
