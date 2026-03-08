const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Agenda Plus Preload Loaded');
});

contextBridge.exposeInMainWorld('electronAPI', {
    saveNote: (content) => ipcRenderer.send('save-note', content),
    minimize: () => ipcRenderer.send('window-minimize'),
    ping: () => ipcRenderer.invoke('ping'),
});