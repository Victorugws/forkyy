"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose safe API to renderer process (React app)
electron_1.contextBridge.exposeInMainWorld('electron', {
    // Get webview preload path (via IPC from main process)
    getWebviewPreloadPath: () => electron_1.ipcRenderer.invoke('get-webview-preload-path'),
    // Browser control methods
    browser: {
        createTab: (url) => electron_1.ipcRenderer.invoke('browser:create-tab', url),
        navigate: (tabId, url) => electron_1.ipcRenderer.invoke('browser:navigate', tabId, url),
        closeTab: (tabId) => electron_1.ipcRenderer.invoke('browser:close-tab', tabId),
        switchTab: (tabId) => electron_1.ipcRenderer.invoke('browser:switch-tab', tabId),
        goBack: (tabId) => electron_1.ipcRenderer.invoke('browser:go-back', tabId),
        goForward: (tabId) => electron_1.ipcRenderer.invoke('browser:go-forward', tabId),
        reload: (tabId) => electron_1.ipcRenderer.invoke('browser:reload', tabId),
        stop: (tabId) => electron_1.ipcRenderer.invoke('browser:stop', tabId),
        getTabInfo: (tabId) => electron_1.ipcRenderer.invoke('browser:get-tab-info', tabId),
        getAllTabs: () => electron_1.ipcRenderer.invoke('browser:get-all-tabs'),
        updateHeight: (headerHeight) => electron_1.ipcRenderer.invoke('browser:update-height', headerHeight),
        updateSidebarWidth: (sidebarWidth) => electron_1.ipcRenderer.invoke('browser:update-sidebar-width', sidebarWidth),
        updateLeftOffset: (leftOffset) => electron_1.ipcRenderer.invoke('browser:update-left-offset', leftOffset),
        // Event listeners
        onTabUpdated: (callback) => {
            const handler = (_event, { channel, data }) => {
                if (channel === 'tab-updated')
                    callback(data);
            };
            electron_1.ipcRenderer.on('browser-event', handler);
            return () => electron_1.ipcRenderer.removeListener('browser-event', handler);
        },
        onTabSwitched: (callback) => {
            const handler = (_event, { channel, data }) => {
                if (channel === 'tab-switched')
                    callback(data);
            };
            electron_1.ipcRenderer.on('browser-event', handler);
            return () => electron_1.ipcRenderer.removeListener('browser-event', handler);
        },
        onTabClosed: (callback) => {
            const handler = (_event, { channel, data }) => {
                if (channel === 'tab-closed')
                    callback(data);
            };
            electron_1.ipcRenderer.on('browser-event', handler);
            return () => electron_1.ipcRenderer.removeListener('browser-event', handler);
        },
        onDownloadStarted: (callback) => {
            const handler = (_event, { channel, data }) => {
                if (channel === 'download-started')
                    callback(data);
            };
            electron_1.ipcRenderer.on('browser-event', handler);
            return () => electron_1.ipcRenderer.removeListener('browser-event', handler);
        },
        onDownloadProgress: (callback) => {
            const handler = (_event, { channel, data }) => {
                if (channel === 'download-progress')
                    callback(data);
            };
            electron_1.ipcRenderer.on('browser-event', handler);
            return () => electron_1.ipcRenderer.removeListener('browser-event', handler);
        },
        onDownloadCompleted: (callback) => {
            const handler = (_event, { channel, data }) => {
                if (channel === 'download-completed')
                    callback(data);
            };
            electron_1.ipcRenderer.on('browser-event', handler);
            return () => electron_1.ipcRenderer.removeListener('browser-event', handler);
        },
        onLoadFailed: (callback) => {
            const handler = (_event, { channel, data }) => {
                if (channel === 'tab-load-failed')
                    callback(data);
            };
            electron_1.ipcRenderer.on('browser-event', handler);
            return () => electron_1.ipcRenderer.removeListener('browser-event', handler);
        }
    },
    // Generic event handlers for non-browser events (like mouse-position)
    on: (channel, callback) => {
        electron_1.ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    },
    off: (channel, callback) => {
        electron_1.ipcRenderer.removeListener(channel, callback);
    },
    // Platform detection
    platform: process.platform,
    isElectron: true
});
// Expose eye tracking API
electron_1.contextBridge.exposeInMainWorld('eyeTracking', {
    setEnabled: (enabled) => electron_1.ipcRenderer.invoke('eye-tracking:set-enabled', enabled),
    isEnabled: () => electron_1.ipcRenderer.invoke('eye-tracking:is-enabled'),
    updateConfig: (config) => electron_1.ipcRenderer.invoke('eye-tracking:update-config', config),
    getConfig: () => electron_1.ipcRenderer.invoke('eye-tracking:get-config'),
    moveCursor: (x, y) => {
        electron_1.ipcRenderer.send('eye-tracking:move-cursor', { x, y });
    },
    moveCursorTo: (x, y) => {
        electron_1.ipcRenderer.send('eye-tracking:move-cursor-to', { x, y });
    },
    getCursorPosition: () => electron_1.ipcRenderer.invoke('eye-tracking:get-cursor-position'),
    click: () => {
        electron_1.ipcRenderer.send('eye-tracking:click');
    },
    doubleClick: () => {
        electron_1.ipcRenderer.send('eye-tracking:double-click');
    },
    reset: () => electron_1.ipcRenderer.invoke('eye-tracking:reset')
});
