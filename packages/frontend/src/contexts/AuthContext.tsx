import React, { createContext, useState, useEffect, useContext } from 'react';
import authService, { type User } from '../services/auth.service';

// UI Preview Mode - permite bypass de autenticação para desenvolvimento visual
const UI_PREVIEW_MODE = import.meta.env.VITE_UI_PREVIEW_MODE === 'true';

// Usuário mock para Preview Mode
const PREVIEW_USER: User = {
    id: 'preview-user',
    nome: 'Administrador Oliveira',
    email: 'admin@oliveira.com',
    role: 'admin',
};

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (login: string, senha: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(UI_PREVIEW_MODE ? PREVIEW_USER : null);
    const [loading, setLoading] = useState(!UI_PREVIEW_MODE);

    useEffect(() => {
        // Em Preview Mode, já iniciamos autenticado
        if (UI_PREVIEW_MODE) {
            return;
        }

        const loadUser = () => {
            const storedUser = authService.getUser();
            const token = authService.getToken();

            if (storedUser && token) {
                setUser(storedUser);
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (login: string, senha: string) => {
        try {
            const response = await authService.login(login, senha);
            authService.setToken(response.access_token);
            authService.setUser(response.user);
            setUser(response.user);
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
