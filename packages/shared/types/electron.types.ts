export interface ElectronAPI {
    ping: () => Promise<string>;
    getAppVersion: () => Promise<string>;
    apiRequest: (params: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        endpoint: string;
        data?: any;
        token?: string;
    }) => Promise<any>;
}
