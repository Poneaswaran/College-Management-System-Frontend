import { useState, useEffect } from 'react';
import api from '../services/api';

interface TenantBranding {
    name: string;
    short_name: string;
    logo_url: string | null;
    schema_name: string;
    email: string;
    phone: string;
    address: string;
    established_year: number | null;
}

// In-memory cache to avoid refetching on every component mount
let cachedBranding: TenantBranding | null = null;
let fetchPromise: Promise<TenantBranding> | null = null;

/**
 * Hook to fetch and cache the current tenant's branding information.
 * Uses in-memory caching (not localStorage) for iframe compatibility.
 * 
 * Usage:
 *   const { branding, loading } = useTenantBranding();
 *   // branding.name => "VELS Institute of Science..."
 *   // branding.short_name => "VISTAS"
 */
export function useTenantBranding() {
    const [branding, setBranding] = useState<TenantBranding | null>(cachedBranding);
    const [loading, setLoading] = useState(!cachedBranding);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If already cached, use it immediately
        if (cachedBranding) {
            setBranding(cachedBranding);
            setLoading(false);
            return;
        }

        // If a fetch is already in flight, wait for it
        if (fetchPromise) {
            fetchPromise
                .then((data) => {
                    setBranding(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message || 'Failed to load branding');
                    setLoading(false);
                });
            return;
        }

        // Start a new fetch
        fetchPromise = api
            .get<TenantBranding>('/api/tenant/branding/')
            .then((res) => {
                const data = res.data;
                cachedBranding = data;
                fetchPromise = null;
                return data;
            });

        fetchPromise
            .then((data) => {
                setBranding(data);
                setLoading(false);
            })
            .catch((err) => {
                fetchPromise = null;
                setError(err.message || 'Failed to load branding');
                setLoading(false);
            });
    }, []);

    return { branding, loading, error };
}
