const { contextBridge, ipcRenderer } = require('electron')

// Note: With contextIsolation: true, preload scripts run in an isolated context
// and cannot directly access the page DOM. The cursor injection is handled via
// webContents.executeJavaScript in browser-manager.ts on the 'dom-ready' event.
// This preload file is kept for potential future IPC communication needs.

console.log('[BrowserView Preload] Preload script loaded')
