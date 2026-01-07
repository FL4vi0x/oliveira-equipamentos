import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.tsx.css';

const Login: React.FC = () => {
    const [loginValue, setLoginValue] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(loginValue, senha);
            navigate('/erp/dashboard');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(
                error.response?.data?.message ||
                'Erro ao realizar login. Verifique suas credenciais.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-placeholder">O</div>
                    <h1>Oliveira Equipamentos</h1>
                    <p>Gerencie seus equipamentos de forma profissional</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="login">E-mail ou CPF</label>
                        <input
                            id="login"
                            type="text"
                            placeholder="Email ou CPF (apenas números)"
                            value={loginValue}
                            onChange={(e) => setLoginValue(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <input
                            id="senha"
                            type="password"
                            placeholder="••••••••"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Acessar Sistema'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>&copy; 2026 Oliveira Equipamentos. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
