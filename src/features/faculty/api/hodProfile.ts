import api from '../../../lib/axios';
import type { 
    HODProfile, 
    UpdateHODProfileInput,
} from '../types/hodProfile';

export const fetchHODProfile = async (): Promise<HODProfile> => {
    const { data } = await api.get<HODProfile>('/profile/hod/profile/');
    return data;
};

export const updateHODProfile = async (
    input: UpdateHODProfileInput,
): Promise<Partial<HODProfile>> => {
    const { data } = await api.patch<HODProfile>('/profile/hod/profile/', input);
    return data;
};
