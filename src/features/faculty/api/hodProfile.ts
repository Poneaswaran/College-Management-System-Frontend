import { client } from '../../../lib/graphql';
import { GET_HOD_PROFILE, UPDATE_HOD_PROFILE } from '../graphql/hodProfile';
import { MOCK_HOD_PROFILE } from '../mockData/hodProfile';
import type {
    HODProfile,
    HODProfileResponse,
    UpdateHODProfileInput,
} from '../types/hodProfile';

export const fetchHODProfile = async (): Promise<HODProfile> => {
    try {
        const { data } = await client.query<HODProfileResponse>({
            query: GET_HOD_PROFILE,
            fetchPolicy: 'network-only',
        });

        if (!data) throw new Error('No data returned');
        return data.hodProfile;
    } catch {
        // Return mock data as fallback while backend endpoint is not yet ready
        return MOCK_HOD_PROFILE;
    }
};

interface UpdateHODProfileResponse {
    updateHODProfile: Partial<HODProfile>;
}

export const updateHODProfile = async (
    input: UpdateHODProfileInput,
): Promise<Partial<HODProfile>> => {
    try {
        const { data } = await client.mutate<UpdateHODProfileResponse>({
            mutation: UPDATE_HOD_PROFILE,
            variables: input,
        });

        if (!data) throw new Error('No data returned');
        return data.updateHODProfile;
    } catch {
        // Mock optimistic response for development
        return { ...input };
    }
};
