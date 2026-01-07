import axios from 'axios';

const isElectron = () => {
  return window && window.electronAPI;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Cliente Axios para uso web
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Interceptor de resposta para tratamento de erros
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('Sem refresh token');
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
          }

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar o refresh, desloga o usuário
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Função auxiliar para pegar o token
const getToken = () => localStorage.getItem('token');

// API wrapper que escolhe entre Electron IPC ou Axios
export const api = {
  async get<T>(endpoint: string): Promise<T> {
    if (isElectron()) {
      return window.electronAPI.apiRequest({
        method: 'GET',
        endpoint,
        token: getToken() || undefined,
      });
    }
    const response = await axiosClient.get<T>(endpoint);
    return response.data;
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    if (isElectron()) {
      return window.electronAPI.apiRequest({
        method: 'POST',
        endpoint,
        data,
        token: getToken() || undefined,
      });
    }
    const response = await axiosClient.post<T>(endpoint, data);
    return response.data;
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    if (isElectron()) {
      return window.electronAPI.apiRequest({
        method: 'PUT',
        endpoint,
        data,
        token: getToken() || undefined,
      });
    }
    const response = await axiosClient.put<T>(endpoint, data);
    return response.data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    if (isElectron()) {
      return window.electronAPI.apiRequest({
        method: 'DELETE',
        endpoint,
        token: getToken() || undefined,
      });
    }
    const response = await axiosClient.delete<T>(endpoint);
    return response.data;
  },
};

export default api;