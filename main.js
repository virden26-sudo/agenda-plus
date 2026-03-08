const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(os.homedir(), 'Downloads', 'Gemini_Generated_Image_brgc32brgc32brgc.png'),
    backgroundColor: '#3E9389',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const url = dev
    ? 'http://localhost:9003'
    : `file://${path.join(__dirname, 'out', 'index.html')}`;

  mainWindow.loadURL(url);

  // Set the default menu for Electron
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'Refresh', role: 'reload' },
        { label: 'Toggle DevTools', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Exit', role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  if (dev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Update IPC to match the 'saveNote' frontend call
ipcMain.on('save-note', (event, content) => {
    const filePath = path.join(app.getPath('desktop'), 'MTH12B_Notes.txt');
    fs.appendFile(filePath, `\n[${new Date().toLocaleString()}] ${content}`, (err) => {
        if (err) console.error('Failed to save note:', err);
    });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});