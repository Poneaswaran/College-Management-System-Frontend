import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from './slice';
import { login as loginApi } from './api';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/auth.store';

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const login = async (credentials: any): Promise<boolean> => {
        dispatch(loginStart());
        try {
            const response = await loginApi(credentials);
            dispatch(loginSuccess(response.data));
            return true; // Success - API returned valid response
        } catch (error: any) {
            dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
            throw error; // Re-throw so the component can handle it
        }
    };

    return { user, isAuthenticated, login };
};
