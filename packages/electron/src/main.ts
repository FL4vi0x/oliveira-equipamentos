import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    autoHideMenuBar: !isDev,
    title: 'Oliveira Equipamentos - ERP + PDV',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('ping', async () => {
  return 'pong';
});

ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

ipcMain.handle('api-request', async (_event, { method, endpoint, data, token }) => {
  const baseURL = process.env.VITE_API_URL || 'http://127.0.0.1:3001/api';

  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Para PDFs e outros binários, retornamos como ArrayBuffer que o Electron converte para Buffer no IPC
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (error: any) {
    const isHttpError = error.message?.includes('HTTP error!');
    const isUnauthorized = error.message?.includes('status: 401');
    const isNotFound = error.message?.includes('status: 404');
    
    // Evita poluir o log do terminal com erros comuns que o frontend já sabe tratar (como 401 para refresh token)
    if (!isUnauthorized && !isNotFound) {
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        cause: error.cause,
        url: `${baseURL}${endpoint}`,
        method
      };
      console.error(' [ELECTRON API ERROR] ', JSON.stringify(errorDetails, null, 2));
    }
    
    throw error;
  }
});