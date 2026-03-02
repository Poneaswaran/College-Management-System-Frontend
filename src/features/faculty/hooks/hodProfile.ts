import { useState, useCallback } from 'react';
import { fetchHODProfile, updateHODProfile } from '../api/hodProfile';
import type { HODProfile, UpdateHODProfileInput } from '../types/hodProfile';

interface UseHODProfileReturn {
    profile: HODProfile | null;
    loading: boolean;
    updating: boolean;
    error: string | null;
    updateError: string | null;
    loadProfile: () => Promise<void>;
    saveProfile: (input: UpdateHODProfileInput) => Promise<void>;
}

export const useHODProfile = (): UseHODProfileReturn => {
    const [profile, setProfile] = useState<HODProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchHODProfile();
            setProfile(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load profile';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveProfile = useCallback(
        async (input: UpdateHODProfileInput) => {
            setUpdating(true);
            setUpdateError(null);
            try {
                const updated = await updateHODProfile(input);
                // Merge returned fields back into local state
                setProfile((prev) => {
                    if (!prev) return prev;
                    const merged: HODProfile = {
                        ...prev,
                        ...updated,
                        fullName:
                            `${updated.firstName ?? prev.firstName} ${updated.lastName ?? prev.lastName}`.trim(),
                    };
                    return merged;
                });
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to update profile';
                setUpdateError(message);
                throw err;
            } finally {
                setUpdating(false);
            }
        },
        [],
    );

    return {
        profile,
        loading,
        updating,
        error,
        updateError,
        loadProfile,
        saveProfile,
    };
};
