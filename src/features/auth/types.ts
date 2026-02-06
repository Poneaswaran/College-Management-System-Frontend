export interface User {
    id: string;
    email: string;
    registerNumber: string;
    role: {
        code: string;
    };
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
