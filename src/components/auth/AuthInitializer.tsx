import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { client } from '../../lib/graphql';
import { ME_QUERY } from '../../features/auth/graphql/queries';
import { loginSuccess, logout } from '../../features/auth/slice';
import type { MeResponse } from '../../features/auth/types';

export function AuthInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('No token found, skipping auth initialization');
            return;
        }

        const initAuth = async () => {
            try {
                console.log('Fetching current user with token');
                const result = await client.query<MeResponse>({
                    query: ME_QUERY,
                    fetchPolicy: 'network-only',
                });

                if (result.data?.me) {
                    const user = {
                        ...result.data.me,
                        username: result.data.me.registerNumber,
                    };
                    
                    console.log('User authenticated:', user);
                    dispatch(loginSuccess({ user, token }));
                }
            } catch (error) {
                console.error('Failed to fetch current user:', error);
                // Token is invalid, clear auth state
                dispatch(logout());
            }
        };

        initAuth();
    }, [dispatch]);

    return null;
}
