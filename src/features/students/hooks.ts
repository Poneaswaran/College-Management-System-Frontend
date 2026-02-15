import { useEffect, useState } from 'react';
import { getStudents, updateStudentProfile, updateStudentProfileWithPhoto } from './api';
import type { 
  Student, 
  UpdateStudentProfileInput, 
  UpdateStudentProfileWithPhotoInput,
  UpdateProfileResponse
} from './types';

export const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudents()
            .then(res => setStudents(res.data))
            .finally(() => setLoading(false));
    }, []);

    return { students, loading };
};

/**
 * Hook for updating student profile without photo
 */
export const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProfile = async (
        registerNumber: string,
        profileData: UpdateStudentProfileInput
    ): Promise<UpdateProfileResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await updateStudentProfile(registerNumber, profileData);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Failed to update profile';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error };
};

/**
 * Hook for updating student profile with photo
 */
export const useUpdateProfileWithPhoto = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProfile = async (
        registerNumber: string,
        profileData: UpdateStudentProfileWithPhotoInput,
        photoFile?: File | null
    ): Promise<UpdateProfileResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await updateStudentProfileWithPhoto(
                registerNumber,
                profileData,
                photoFile
            );
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Failed to update profile with photo';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error };
};
