import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from './slice';
import { login as loginApi } from './api';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/auth.store';

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const login = async (credentials: any) => {
        dispatch(loginStart());
        try {
            const response = await loginApi(credentials);
            dispatch(loginSuccess(response.data));
        } catch (error: any) {
            dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
        }
    };

    return { user, isAuthenticated, login };
};
