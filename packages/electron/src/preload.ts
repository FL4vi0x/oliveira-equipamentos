import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI } from '../../shared/types/electron.types';

// Expor API tipada para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  apiRequest: (params: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    data?: any;
    token?: string;
  }) => ipcRenderer.invoke('api-request', params),
} as ElectronAPI);

// Type definitions para window global
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}