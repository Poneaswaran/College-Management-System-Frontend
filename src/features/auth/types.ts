export interface User {
    id: string;
    email: string;
    registerNumber: string;
    role: {
        id: string;
        name: string;
        code: string;
    };
    department?: {
        id: string;
        name: string;
        code: string;
    };
    username?: string;
}

export interface MeResponse {
    me: {
        id: string;
        email: string;
        registerNumber: string;
        role: {
            id: string;
            name: string;
            code: string;
        };
        department: {
            id: string;
            name: string;
            code: string;
        };
    };
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
