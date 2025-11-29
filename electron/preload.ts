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

// Expose cursor API for unified cursor system
contextBridge.exposeInMainWorld('electronAPI', {
  onCursorMove: (callback: (pos: { x: number; y: number }) => void) => {
    ipcRenderer.on('cursor:move', (_event, pos) => callback(pos))
  },

  syncCursorPosition: (pos: { x: number; y: number }) => {
    ipcRenderer.send('cursor:move', pos)
  },

  // Expose IPC send for webview cursor relay
  sendCursorMove: (data: { x: number; y: number }) => {
    ipcRenderer.send('cursor-move', data)
  },

  sendHoverTarget: (data: any) => {
    ipcRenderer.send('hover-target', data)
  },

  sendCursorMouseDown: () => {
    ipcRenderer.send('cursor-mousedown')
  },

  sendCursorMouseUp: () => {
    ipcRenderer.send('cursor-mouseup')
  }
})

// Track cursor movement and send to overlay
// System cursor remains visible
document.addEventListener('DOMContentLoaded', () => {

  // Configuration for hover detection
  const TARGET_SELECTOR = '.cursor-target'
  let activeTarget: Element | null = null
  let currentLeaveHandler: (() => void) | null = null

  // Track mouse movement and send screen coordinates to overlay
  window.addEventListener('mousemove', (e) => {
    ipcRenderer.send('cursor-move', { x: e.screenX, y: e.screenY })
  })

  // Track mouse down/up for click animations
  window.addEventListener('mousedown', () => {
    ipcRenderer.send('cursor-mousedown')
  })

  window.addEventListener('mouseup', () => {
    ipcRenderer.send('cursor-mouseup')
  })

  // Track hover targets and send their bounds to overlay
  const handleMouseOver = (e: Event) => {
    const directTarget = e.target as Element
    const allTargets: Element[] = []
    let current: Element | null = directTarget

    // Find all matching targets in the hierarchy
    while (current && current !== document.body) {
      if (current.matches(TARGET_SELECTOR)) {
        allTargets.push(current)
      }
      current = current.parentElement
    }

    const target = allTargets[0] || null
    if (!target || activeTarget === target) return

    // Clean up previous target
    if (activeTarget && currentLeaveHandler) {
      activeTarget.removeEventListener('mouseleave', currentLeaveHandler)
    }

    activeTarget = target
    const rect = target.getBoundingClientRect()

    // Send hover enter event with target bounds
    ipcRenderer.send('hover-target', {
      isHovering: true,
      targetBounds: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      }
    })

    // Set up leave handler
    const leaveHandler = () => {
      ipcRenderer.send('hover-target', {
        isHovering: false
      })
      activeTarget = null
      currentLeaveHandler = null
    }

    currentLeaveHandler = leaveHandler
    target.addEventListener('mouseleave', leaveHandler)
  }

  // Handle scroll to check if still over target
  const handleScroll = () => {
    if (!activeTarget) return

    const rect = activeTarget.getBoundingClientRect()
    const mouseX = (window as any).lastMouseX || 0
    const mouseY = (window as any).lastMouseY || 0

    const isStillOver = mouseX >= rect.left && mouseX <= rect.right &&
                        mouseY >= rect.top && mouseY <= rect.bottom

    if (!isStillOver && currentLeaveHandler) {
      currentLeaveHandler()
    }
  }

  // Store last mouse position for scroll check
  window.addEventListener('mousemove', (e) => {
    (window as any).lastMouseX = e.clientX;
    (window as any).lastMouseY = e.clientY
  })

  window.addEventListener('mouseover', handleMouseOver, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
})
