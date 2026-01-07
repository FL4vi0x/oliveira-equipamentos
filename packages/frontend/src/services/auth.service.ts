import api from './api';

export interface User {
    id: string;
    nome: string;
    email: string;
    perfil: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export const authService = {
    async login(login: string, senha: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', { login, senha });
        if (response.user) {
            this.setUser(response.user);
        }
        if (response.access_token) {
            this.setToken(response.access_token);
        }
        if (response.refresh_token) {
            this.setRefreshToken(response.refresh_token);
        }
        return response;
    },

    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    removeToken() {
        localStorage.removeItem('token');
    },

    setRefreshToken(token: string) {
        localStorage.setItem('refresh_token', token);
    },

    getRefreshToken() {
        return localStorage.getItem('refresh_token');
    },

    removeRefreshToken() {
        localStorage.removeItem('refresh_token');
    },

    setUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser(): User | null {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },

    removeUser() {
        localStorage.removeItem('user');
    },

    logout() {
        this.removeToken();
        this.removeRefreshToken();
        this.removeUser();
        window.location.href = '/login';
    }
};

export default authService;
