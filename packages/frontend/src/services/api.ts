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

// API wrapper que escolhe entre Electron IPC ou Axios
export const api = {
  async get<T>(endpoint: string): Promise<T> {
    if (isElectron()) {
      return window.electronAPI.apiRequest({
        method: 'GET',
        endpoint,
      });
    }
    const response = await axiosClient.get<T>(endpoint);
    return response.data;
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    if (isElectron()) {
      return window.electronAPI.apiRequest({
        method: 'POST',
        endpoint,
        data,
      });
    }
    const response = await axiosClient.post<T>(endpoint, data);
    return response.data;
  },

  async put<T>(endpoint: string, data?: any): Promise<T> {
    if (isElectron()) {
      return window.electronAPI.apiRequest({
        method: 'PUT',
        endpoint,
        data,
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
      });
    }
    const response = await axiosClient.delete<T>(endpoint);
    return response.data;
  },
};

export default api;