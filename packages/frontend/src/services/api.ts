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
  async electronRequest<T>(method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE', endpoint: string, data?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    try {
      const queryParams = params ? new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ).toString() : '';
      
      return await window.electronAPI.apiRequest({
        method,
        endpoint: queryParams ? `${endpoint}?${queryParams}` : endpoint,
        data,
        token: getToken() || undefined,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('status: 401')) {
        return axiosClient.request<T>({ 
          method, 
          url: endpoint, 
          data, 
          params 
        }).then(res => res.data);
      }
      throw error;
    }
  },

  async get<T>(endpoint: string, config?: { params?: Record<string, string | number | boolean | undefined> }): Promise<T> {
    if (isElectron()) return this.electronRequest<T>('GET', endpoint, undefined, config?.params);
    const response = await axiosClient.get<T>(endpoint, config);
    return response.data;
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    if (isElectron()) return this.electronRequest<T>('POST', endpoint, data);
    const response = await axiosClient.post<T>(endpoint, data);
    return response.data;
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    if (isElectron()) return this.electronRequest<T>('PUT', endpoint, data);
    const response = await axiosClient.put<T>(endpoint, data);
    return response.data;
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    if (isElectron()) return this.electronRequest<T>('PATCH', endpoint, data);
    const response = await axiosClient.patch<T>(endpoint, data);
    return response.data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    if (isElectron()) return this.electronRequest<T>('DELETE', endpoint);
    const response = await axiosClient.delete<T>(endpoint);
    return response.data;
  },
};

export default api;