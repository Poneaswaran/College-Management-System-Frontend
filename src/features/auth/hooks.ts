import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from './slice';
import { login as loginApi, logout as logoutApi } from './api';
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

    const logout = async () => {
        try {
            const token = localStorage.getItem('token') || '';
            
            if (token) {
                // Call logout mutation
                await logoutApi(token);
            }
        } catch (error: unknown) {
            console.error('Logout error:', error);
            // Continue with logout even if API call fails
        } finally {
            // Clear local state regardless of API call result
            dispatch(logoutAction());
        }
    };

    return { user, isAuthenticated, login, logout };
};
