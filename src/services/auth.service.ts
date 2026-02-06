export const AuthService = {
    getToken(): string | null {
        return localStorage.getItem('token');
    },

    setToken(token: string): void {
        localStorage.setItem('token', token);
    },

    removeToken(): void {
        localStorage.removeItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    logout(): void {
        this.removeToken();
        window.location.href = '/auth/login';
    }
};
