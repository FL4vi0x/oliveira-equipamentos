import { ElectronAPI } from '../../../shared/types/electron.types';

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
