import api from '../../services/api';
import type { User } from './types';

export const login = (credentials: any) => api.post<{ user: User, token: string }>('/auth/login', credentials);
export const register = (data: any) => api.post<{ user: User, token: string }>('/auth/register', data);
