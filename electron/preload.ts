import { contextBridge, ipcRenderer } from 'electron'
import type { TabInfo } from './browser-manager'

// Expose safe API to renderer process (React app)
contextBridge.exposeInMainWorld('electron', {
  // Get webview preload path (via IPC from main process)
  getWebviewPreloadPath: (): Promise<string> =>
    ipcRenderer.invoke('get-webview-preload-path'),
  
  // Browser control methods
  browser: {
    createTab: (url?: string): Promise<string> =>
      ipcRenderer.invoke('browser:create-tab', url),

    navigate: (tabId: string, url: string): Promise<void> =>
      ipcRenderer.invoke('browser:navigate', tabId, url),

    closeTab: (tabId: string): Promise<void> =>
      ipcRenderer.invoke('browser:close-tab', tabId),

    switchTab: (tabId: string): Promise<void> =>
      ipcRenderer.invoke('browser:switch-tab', tabId),

    goBack: (tabId: string): Promise<void> =>
      ipcRenderer.invoke('browser:go-back', tabId),

    goForward: (tabId: string): Promise<void> =>
      ipcRenderer.invoke('browser:go-forward', tabId),

    reload: (tabId: string): Promise<void> =>
      ipcRenderer.invoke('browser:reload', tabId),

    stop: (tabId: string): Promise<void> =>
      ipcRenderer.invoke('browser:stop', tabId),

    getTabInfo: (tabId: string): Promise<TabInfo | null> =>
      ipcRenderer.invoke('browser:get-tab-info', tabId),

    getAllTabs: (): Promise<TabInfo[]> =>
      ipcRenderer.invoke('browser:get-all-tabs'),

    updateHeight: (headerHeight: number): Promise<void> =>
      ipcRenderer.invoke('browser:update-height', headerHeight),

    updateSidebarWidth: (sidebarWidth: number): Promise<void> =>
      ipcRenderer.invoke('browser:update-sidebar-width', sidebarWidth),

    updateLeftOffset: (leftOffset: number): Promise<void> =>
      ipcRenderer.invoke('browser:update-left-offset', leftOffset),

    // Event listeners
    onTabUpdated: (callback: (tabId: string) => void) => {
      const handler = (_event: any, { channel, data }: { channel: string; data: any }) => {
        if (channel === 'tab-updated') callback(data)
      }
      ipcRenderer.on('browser-event', handler)
      return () => ipcRenderer.removeListener('browser-event', handler)
    },

    onTabSwitched: (callback: (tabId: string) => void) => {
      const handler = (_event: any, { channel, data }: { channel: string; data: any }) => {
        if (channel === 'tab-switched') callback(data)
      }
      ipcRenderer.on('browser-event', handler)
      return () => ipcRenderer.removeListener('browser-event', handler)
    },

    onTabClosed: (callback: (tabId: string) => void) => {
      const handler = (_event: any, { channel, data }: { channel: string; data: any }) => {
        if (channel === 'tab-closed') callback(data)
      }
      ipcRenderer.on('browser-event', handler)
      return () => ipcRenderer.removeListener('browser-event', handler)
    },

    onDownloadStarted: (callback: (info: { filename: string; url: string; totalBytes: number }) => void) => {
      const handler = (_event: any, { channel, data }: { channel: string; data: any }) => {
        if (channel === 'download-started') callback(data)
      }
      ipcRenderer.on('browser-event', handler)
      return () => ipcRenderer.removeListener('browser-event', handler)
    },

    onDownloadProgress: (callback: (info: { filename: string; percent: number }) => void) => {
      const handler = (_event: any, { channel, data }: { channel: string; data: any }) => {
        if (channel === 'download-progress') callback(data)
      }
      ipcRenderer.on('browser-event', handler)
      return () => ipcRenderer.removeListener('browser-event', handler)
    },

    onDownloadCompleted: (callback: (info: { filename: string; state: string; path: string | null }) => void) => {
      const handler = (_event: any, { channel, data }: { channel: string; data: any }) => {
        if (channel === 'download-completed') callback(data)
      }
      ipcRenderer.on('browser-event', handler)
      return () => ipcRenderer.removeListener('browser-event', handler)
    },

    onLoadFailed: (callback: (info: { tabId: string; errorCode: number; errorDescription: string; url: string }) => void) => {
      const handler = (_event: any, { channel, data }: { channel: string; data: any }) => {
        if (channel === 'tab-load-failed') callback(data)
      }
      ipcRenderer.on('browser-event', handler)
      return () => ipcRenderer.removeListener('browser-event', handler)
    }
  },

  // Generic event handlers for non-browser events (like mouse-position)
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args))
  },

  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback)
  },

  // Platform detection
  platform: process.platform,
  isElectron: true
})

// Expose eye tracking API
contextBridge.exposeInMainWorld('eyeTracking', {
  setEnabled: (enabled: boolean): Promise<boolean> =>
    ipcRenderer.invoke('eye-tracking:set-enabled', enabled),

  isEnabled: (): Promise<boolean> =>
    ipcRenderer.invoke('eye-tracking:is-enabled'),

  updateConfig: (config: { smoothing?: number; sensitivity?: number }): Promise<any> =>
    ipcRenderer.invoke('eye-tracking:update-config', config),

  getConfig: (): Promise<any> =>
    ipcRenderer.invoke('eye-tracking:get-config'),

  moveCursor: (x: number, y: number) => {
    ipcRenderer.send('eye-tracking:move-cursor', { x, y })
  },

  moveCursorTo: (x: number, y: number) => {
    ipcRenderer.send('eye-tracking:move-cursor-to', { x, y })
  },

  getCursorPosition: (): Promise<{ x: number; y: number }> =>
    ipcRenderer.invoke('eye-tracking:get-cursor-position'),

  click: () => {
    ipcRenderer.send('eye-tracking:click')
  },

  doubleClick: () => {
    ipcRenderer.send('eye-tracking:double-click')
  },

  reset: (): Promise<void> =>
    ipcRenderer.invoke('eye-tracking:reset')
})
