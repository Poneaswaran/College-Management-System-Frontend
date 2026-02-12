import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from './slice';
import { login as loginApi } from './api';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/auth.store';
import type { User } from './types';

interface LoginCredentials {
    username: string;
    password: string;
}

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const login = async (credentials: LoginCredentials): Promise<User> => {
        dispatch(loginStart());
        try {
            const response = await loginApi(credentials);
            dispatch(loginSuccess(response.data));
            return response.data.user; // Return user object
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error 
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
                : 'Login failed';
            dispatch(loginFailure(errorMessage));
            throw error; // Re-throw so the component can handle it
        }
    };

    return { user, isAuthenticated, login };
};
