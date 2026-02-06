export interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'admin' | 'header';
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
