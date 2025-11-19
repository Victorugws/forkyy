# Electron + BrowserView Implementation Guide for Forkyy

## What You'd Build

A **desktop application** that wraps your Next.js UI and embeds a fully-functional Chromium browser with tab support.

```
┌─────────────────────────────────────────────────────────┐
│  Forkyy Desktop App (Electron)                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Your Next.js UI (React Components)                │  │
│  │ - Search interface                                │  │
│  │ - Tab bar component                               │  │
│  │ - Navigation controls                             │  │
│  │ - Settings panel                                  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ BrowserView (Embedded Chromium)                   │  │
│  │ - Renders actual web pages                        │  │
│  │ - Full browser engine (not iframe)                │  │
│  │ - Multiple instances = multiple tabs              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Setup Electron (2-3 days)

**1. Install Dependencies:**
```bash
npm install --save-dev electron electron-builder
npm install --save-dev concurrently wait-on cross-env
```

**2. Project Structure:**
```
forkyy/
├── app/                    # Your existing Next.js app
├── components/             # Your React components
├── electron/              # New: Electron main process
│   ├── main.ts            # Main process entry
│   ├── preload.ts         # Bridge between main & renderer
│   └── browser-manager.ts # BrowserView tab management
├── electron-builder.yml   # Build configuration
└── package.json           # Updated scripts
```

**3. Update package.json:**
```json
{
  "name": "forkyy",
  "version": "1.0.0",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "concurrently \"next dev\" \"wait-on http://localhost:3000 && electron .\"",
    "build": "next build && tsc -p electron/tsconfig.json",
    "build:electron": "electron-builder",
    "start": "electron ."
  },
  "build": {
    "appId": "com.forkyy.app",
    "files": [
      "dist-electron/**/*",
      ".next/**/*",
      "node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.productivity"
    },
    "win": {
      "target": "nsis"
    }
  }
}
```

---

### Phase 2: Main Process Setup (3-5 days)

**electron/main.ts** - Application entry point:

```typescript
import { app, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { BrowserManager } from './browser-manager'

let mainWindow: BrowserWindow | null = null
let browserManager: BrowserManager | null = null

const isDev = process.env.NODE_ENV === 'development'

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    titleBarStyle: 'hiddenInset', // macOS style
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,      // Security: no Node in renderer
      contextIsolation: true,       // Security: isolated contexts
      sandbox: true,                // Security: sandbox renderer
      webSecurity: true
    }
  })

  // Initialize browser tab manager
  browserManager = new BrowserManager(mainWindow)

  // Load your Next.js app
  if (isDev) {
    await mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    await mainWindow.loadFile(join(__dirname, '../.next/server/app/index.html'))
  }

  // Setup IPC handlers for browser control
  setupBrowserIPC()
}

function setupBrowserIPC() {
  // Create new tab
  ipcMain.handle('browser:create-tab', async (event, url?: string) => {
    const tabId = await browserManager!.createTab(url || 'https://google.com')
    return tabId
  })

  // Navigate tab to URL
  ipcMain.handle('browser:navigate', async (event, tabId: string, url: string) => {
    await browserManager!.navigate(tabId, url)
  })

  // Close tab
  ipcMain.handle('browser:close-tab', async (event, tabId: string) => {
    await browserManager!.closeTab(tabId)
  })

  // Switch active tab
  ipcMain.handle('browser:switch-tab', async (event, tabId: string) => {
    await browserManager!.switchTab(tabId)
  })

  // Go back
  ipcMain.handle('browser:go-back', async (event, tabId: string) => {
    await browserManager!.goBack(tabId)
  })

  // Go forward
  ipcMain.handle('browser:go-forward', async (event, tabId: string) => {
    await browserManager!.goForward(tabId)
  })

  // Reload
  ipcMain.handle('browser:reload', async (event, tabId: string) => {
    await browserManager!.reload(tabId)
  })

  // Stop loading
  ipcMain.handle('browser:stop', async (event, tabId: string) => {
    await browserManager!.stop(tabId)
  })

  // Get tab info
  ipcMain.handle('browser:get-tab-info', async (event, tabId: string) => {
    return browserManager!.getTabInfo(tabId)
  })
}

// App lifecycle
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

---

### Phase 3: BrowserView Manager (5-7 days)

**electron/browser-manager.ts** - Handles multiple browser tabs:

```typescript
import { BrowserView, BrowserWindow, ipcMain } from 'electron'
import { v4 as uuidv4 } from 'uuid'

interface TabInfo {
  id: string
  url: string
  title: string
  favicon: string | null
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
}

interface Tab {
  id: string
  view: BrowserView
  info: TabInfo
}

export class BrowserManager {
  private window: BrowserWindow
  private tabs: Map<string, Tab> = new Map()
  private activeTabId: string | null = null
  private readonly HEADER_HEIGHT = 120 // Height of your UI header

  constructor(window: BrowserWindow) {
    this.window = window
  }

  async createTab(url: string = 'https://google.com'): Promise<string> {
    const tabId = uuidv4()

    // Create BrowserView (this is the embedded Chromium instance)
    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        webSecurity: true,
        // Enable web features
        plugins: false, // Disable Flash
        webgl: true,
        images: true,
        javascript: true
      }
    })

    // Position the BrowserView below your UI header
    const bounds = this.window.getBounds()
    view.setBounds({
      x: 0,
      y: this.HEADER_HEIGHT,
      width: bounds.width,
      height: bounds.height - this.HEADER_HEIGHT
    })

    // Auto-resize with window
    view.setAutoResize({
      width: true,
      height: true,
      horizontal: false,
      vertical: false
    })

    // Setup event listeners for this tab
    this.setupTabListeners(tabId, view)

    // Store tab
    const tab: Tab = {
      id: tabId,
      view,
      info: {
        id: tabId,
        url,
        title: 'New Tab',
        favicon: null,
        isLoading: true,
        canGoBack: false,
        canGoForward: false
      }
    }
    this.tabs.set(tabId, tab)

    // Load URL
    await view.webContents.loadURL(url)

    // If this is the first tab, make it active
    if (this.tabs.size === 1) {
      await this.switchTab(tabId)
    }

    return tabId
  }

  private setupTabListeners(tabId: string, view: BrowserView) {
    const webContents = view.webContents

    // Page title changed
    webContents.on('page-title-updated', (event, title) => {
      this.updateTabInfo(tabId, { title })
      this.notifyRenderer('tab-updated', tabId)
    })

    // URL changed (navigation)
    webContents.on('did-navigate', (event, url) => {
      this.updateTabInfo(tabId, {
        url,
        canGoBack: webContents.canGoBack(),
        canGoForward: webContents.canGoForward()
      })
      this.notifyRenderer('tab-updated', tabId)
    })

    // Started loading
    webContents.on('did-start-loading', () => {
      this.updateTabInfo(tabId, { isLoading: true })
      this.notifyRenderer('tab-updated', tabId)
    })

    // Finished loading
    webContents.on('did-finish-load', () => {
      this.updateTabInfo(tabId, { isLoading: false })
      this.notifyRenderer('tab-updated', tabId)

      // Get favicon
      webContents.executeJavaScript(`
        const link = document.querySelector('link[rel*="icon"]')
        link ? link.href : null
      `).then((favicon) => {
        if (favicon) {
          this.updateTabInfo(tabId, { favicon })
          this.notifyRenderer('tab-updated', tabId)
        }
      })
    })

    // Failed to load
    webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      this.updateTabInfo(tabId, { isLoading: false })
      this.notifyRenderer('tab-load-failed', { tabId, errorCode, errorDescription })
    })

    // New window requested (handle popups)
    webContents.setWindowOpenHandler(({ url }) => {
      // Create new tab for popup
      this.createTab(url)
      return { action: 'deny' } // Deny opening external window
    })

    // Download handling
    webContents.session.on('will-download', (event, item, webContents) => {
      // Notify renderer about download
      this.notifyRenderer('download-started', {
        filename: item.getFilename(),
        url: item.getURL(),
        totalBytes: item.getTotalBytes()
      })

      item.on('updated', (event, state) => {
        if (state === 'progressing') {
          this.notifyRenderer('download-progress', {
            filename: item.getFilename(),
            percent: (item.getReceivedBytes() / item.getTotalBytes()) * 100
          })
        }
      })

      item.on('done', (event, state) => {
        this.notifyRenderer('download-completed', {
          filename: item.getFilename(),
          state
        })
      })
    })
  }

  async switchTab(tabId: string) {
    const tab = this.tabs.get(tabId)
    if (!tab) return

    // Hide current tab
    if (this.activeTabId) {
      const currentTab = this.tabs.get(this.activeTabId)
      if (currentTab) {
        this.window.removeBrowserView(currentTab.view)
      }
    }

    // Show new tab
    this.window.addBrowserView(tab.view)
    this.activeTabId = tabId

    // Update bounds in case window was resized
    const bounds = this.window.getBounds()
    tab.view.setBounds({
      x: 0,
      y: this.HEADER_HEIGHT,
      width: bounds.width,
      height: bounds.height - this.HEADER_HEIGHT
    })

    this.notifyRenderer('tab-switched', tabId)
  }

  async closeTab(tabId: string) {
    const tab = this.tabs.get(tabId)
    if (!tab) return

    // Remove view from window if it's active
    if (this.activeTabId === tabId) {
      this.window.removeBrowserView(tab.view)

      // Switch to another tab if available
      const remainingTabs = Array.from(this.tabs.keys()).filter(id => id !== tabId)
      if (remainingTabs.length > 0) {
        await this.switchTab(remainingTabs[0])
      } else {
        this.activeTabId = null
      }
    }

    // Destroy the view
    ;(tab.view.webContents as any).destroy()

    // Remove from map
    this.tabs.delete(tabId)

    this.notifyRenderer('tab-closed', tabId)
  }

  async navigate(tabId: string, url: string) {
    const tab = this.tabs.get(tabId)
    if (!tab) return

    // Validate and normalize URL
    const normalizedUrl = this.normalizeUrl(url)
    await tab.view.webContents.loadURL(normalizedUrl)
  }

  async goBack(tabId: string) {
    const tab = this.tabs.get(tabId)
    if (tab && tab.view.webContents.canGoBack()) {
      tab.view.webContents.goBack()
    }
  }

  async goForward(tabId: string) {
    const tab = this.tabs.get(tabId)
    if (tab && tab.view.webContents.canGoForward()) {
      tab.view.webContents.goForward()
    }
  }

  async reload(tabId: string) {
    const tab = this.tabs.get(tabId)
    if (tab) {
      tab.view.webContents.reload()
    }
  }

  async stop(tabId: string) {
    const tab = this.tabs.get(tabId)
    if (tab) {
      tab.view.webContents.stop()
    }
  }

  getTabInfo(tabId: string): TabInfo | null {
    const tab = this.tabs.get(tabId)
    return tab ? { ...tab.info } : null
  }

  getAllTabs(): TabInfo[] {
    return Array.from(this.tabs.values()).map(tab => ({ ...tab.info }))
  }

  private updateTabInfo(tabId: string, updates: Partial<TabInfo>) {
    const tab = this.tabs.get(tabId)
    if (tab) {
      tab.info = { ...tab.info, ...updates }
    }
  }

  private notifyRenderer(channel: string, data: any) {
    this.window.webContents.send('browser-event', { channel, data })
  }

  private normalizeUrl(input: string): string {
    // Add https:// if no protocol
    if (!/^https?:\/\//i.test(input)) {
      // Check if it looks like a domain
      if (/^[\w-]+(\.[\w-]+)+/.test(input)) {
        return `https://${input}`
      }
      // Otherwise treat as search query
      return `https://www.google.com/search?q=${encodeURIComponent(input)}`
    }
    return input
  }
}
```

---

### Phase 4: Preload Bridge (1 day)

**electron/preload.ts** - Secure bridge between main and renderer:

```typescript
import { contextBridge, ipcRenderer } from 'electron'

// Expose safe API to renderer process
contextBridge.exposeInMainWorld('electron', {
  // Browser control
  browser: {
    createTab: (url?: string) => ipcRenderer.invoke('browser:create-tab', url),
    navigate: (tabId: string, url: string) => ipcRenderer.invoke('browser:navigate', tabId, url),
    closeTab: (tabId: string) => ipcRenderer.invoke('browser:close-tab', tabId),
    switchTab: (tabId: string) => ipcRenderer.invoke('browser:switch-tab', tabId),
    goBack: (tabId: string) => ipcRenderer.invoke('browser:go-back', tabId),
    goForward: (tabId: string) => ipcRenderer.invoke('browser:go-forward', tabId),
    reload: (tabId: string) => ipcRenderer.invoke('browser:reload', tabId),
    stop: (tabId: string) => ipcRenderer.invoke('browser:stop', tabId),
    getTabInfo: (tabId: string) => ipcRenderer.invoke('browser:get-tab-info', tabId),

    // Event listeners
    onTabUpdated: (callback: (tabId: string) => void) => {
      ipcRenderer.on('browser-event', (event, { channel, data }) => {
        if (channel === 'tab-updated') callback(data)
      })
    },
    onTabSwitched: (callback: (tabId: string) => void) => {
      ipcRenderer.on('browser-event', (event, { channel, data }) => {
        if (channel === 'tab-switched') callback(data)
      })
    },
    onTabClosed: (callback: (tabId: string) => void) => {
      ipcRenderer.on('browser-event', (event, { channel, data }) => {
        if (channel === 'tab-closed') callback(data)
      })
    },
    onDownloadStarted: (callback: (info: any) => void) => {
      ipcRenderer.on('browser-event', (event, { channel, data }) => {
        if (channel === 'download-started') callback(data)
      })
    }
  }
})
```

---

### Phase 5: React UI Components (5-7 days)

**components/BrowserInterface.tsx** - Main browser UI:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { BrowserTab } from './BrowserTab'
import { AddressBar } from './AddressBar'

interface TabInfo {
  id: string
  url: string
  title: string
  favicon: string | null
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
}

export function BrowserInterface() {
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== 'undefined' && window.electron) {
      // Create initial tab
      window.electron.browser.createTab('https://google.com').then((tabId: string) => {
        loadTabInfo(tabId)
        setActiveTabId(tabId)
      })

      // Listen for tab updates
      window.electron.browser.onTabUpdated((tabId: string) => {
        loadTabInfo(tabId)
      })

      window.electron.browser.onTabSwitched((tabId: string) => {
        setActiveTabId(tabId)
        loadTabInfo(tabId)
      })

      window.electron.browser.onTabClosed((tabId: string) => {
        setTabs(prev => prev.filter(tab => tab.id !== tabId))
      })
    }
  }, [])

  const loadTabInfo = async (tabId: string) => {
    if (window.electron) {
      const info = await window.electron.browser.getTabInfo(tabId)
      if (info) {
        setTabs(prev => {
          const existing = prev.find(t => t.id === tabId)
          if (existing) {
            return prev.map(t => t.id === tabId ? info : t)
          }
          return [...prev, info]
        })

        if (tabId === activeTabId) {
          setCurrentUrl(info.url)
        }
      }
    }
  }

  const handleNewTab = async () => {
    if (window.electron) {
      const tabId = await window.electron.browser.createTab()
      loadTabInfo(tabId)
    }
  }

  const handleCloseTab = async (tabId: string) => {
    if (window.electron) {
      await window.electron.browser.closeTab(tabId)
    }
  }

  const handleSwitchTab = async (tabId: string) => {
    if (window.electron) {
      await window.electron.browser.switchTab(tabId)
    }
  }

  const handleNavigate = async (url: string) => {
    if (window.electron && activeTabId) {
      await window.electron.browser.navigate(activeTabId, url)
    }
  }

  const handleGoBack = async () => {
    if (window.electron && activeTabId) {
      await window.electron.browser.goBack(activeTabId)
    }
  }

  const handleGoForward = async () => {
    if (window.electron && activeTabId) {
      await window.electron.browser.goForward(activeTabId)
    }
  }

  const handleReload = async () => {
    if (window.electron && activeTabId) {
      await window.electron.browser.reload(activeTabId)
    }
  }

  const activeTab = tabs.find(t => t.id === activeTabId)

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-2 pt-2 bg-gray-100 border-b">
        {tabs.map(tab => (
          <BrowserTab
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSwitch={() => handleSwitchTab(tab.id)}
            onClose={() => handleCloseTab(tab.id)}
          />
        ))}
        <button
          onClick={handleNewTab}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded"
        >
          + New Tab
        </button>
      </div>

      {/* Navigation Bar */}
      <AddressBar
        url={currentUrl}
        isLoading={activeTab?.isLoading || false}
        canGoBack={activeTab?.canGoBack || false}
        canGoForward={activeTab?.canGoForward || false}
        onNavigate={handleNavigate}
        onBack={handleGoBack}
        onForward={handleGoForward}
        onReload={handleReload}
      />

      {/* BrowserView renders here (managed by Electron) */}
      <div className="flex-1" />
    </div>
  )
}
```

**components/BrowserTab.tsx:**

```typescript
interface BrowserTabProps {
  tab: TabInfo
  isActive: boolean
  onSwitch: () => void
  onClose: () => void
}

export function BrowserTab({ tab, isActive, onSwitch, onClose }: BrowserTabProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-t cursor-pointer max-w-[200px] ${
        isActive ? 'bg-white' : 'bg-gray-200 hover:bg-gray-300'
      }`}
      onClick={onSwitch}
    >
      {tab.favicon && (
        <img src={tab.favicon} alt="" className="w-4 h-4" />
      )}
      <span className="flex-1 text-sm truncate">
        {tab.isLoading ? 'Loading...' : tab.title}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  )
}
```

**components/AddressBar.tsx:**

```typescript
'use client'

import { useState } from 'react'

interface AddressBarProps {
  url: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  onNavigate: (url: string) => void
  onBack: () => void
  onForward: () => void
  onReload: () => void
}

export function AddressBar({
  url,
  isLoading,
  canGoBack,
  canGoForward,
  onNavigate,
  onBack,
  onForward,
  onReload
}: AddressBarProps) {
  const [inputValue, setInputValue] = useState(url)

  useEffect(() => {
    setInputValue(url)
  }, [url])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNavigate(inputValue)
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="p-2 disabled:opacity-30"
      >
        ←
      </button>
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className="p-2 disabled:opacity-30"
      >
        →
      </button>
      <button onClick={onReload} className="p-2">
        {isLoading ? '×' : '↻'}
      </button>

      <form onSubmit={handleSubmit} className="flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2"
          placeholder="Search or enter address"
        />
      </form>
    </div>
  )
}
```

---

### Phase 6: TypeScript Definitions (1 day)

**types/electron.d.ts:**

```typescript
export interface ElectronAPI {
  browser: {
    createTab: (url?: string) => Promise<string>
    navigate: (tabId: string, url: string) => Promise<void>
    closeTab: (tabId: string) => Promise<void>
    switchTab: (tabId: string) => Promise<void>
    goBack: (tabId: string) => Promise<void>
    goForward: (tabId: string) => Promise<void>
    reload: (tabId: string) => Promise<void>
    stop: (tabId: string) => Promise<void>
    getTabInfo: (tabId: string) => Promise<TabInfo | null>
    onTabUpdated: (callback: (tabId: string) => void) => void
    onTabSwitched: (callback: (tabId: string) => void) => void
    onTabClosed: (callback: (tabId: string) => void) => void
    onDownloadStarted: (callback: (info: any) => void) => void
  }
}

declare global {
  interface Window {
    electron?: ElectronAPI
  }
}
```

---

## Timeline & Effort Estimate

| Phase | Time | Complexity |
|-------|------|------------|
| 1. Electron Setup | 2-3 days | Easy |
| 2. Main Process | 3-5 days | Medium |
| 3. BrowserView Manager | 5-7 days | Hard |
| 4. Preload Bridge | 1 day | Easy |
| 5. React UI | 5-7 days | Medium |
| 6. TypeScript Setup | 1 day | Easy |
| **Testing & Polish** | 5-7 days | Medium |
| **TOTAL** | **3-5 weeks** | |

---

## What You Get

✅ **Full Chromium browser** - Not an iframe, actual browser engine
✅ **Multi-tab support** - Each tab is isolated BrowserView
✅ **Keep your React code** - 90%+ code reuse from Next.js app
✅ **Native performance** - Direct Chromium rendering
✅ **Desktop features** - System menus, shortcuts, notifications
✅ **Auto-updates** - Via electron-updater
✅ **Cross-platform** - Build for Mac, Windows, Linux

---

## Limitations vs CEF

❌ **Memory:** Slightly higher than CEF (but not much)
❌ **App size:** ~150-200MB vs CEF's ~100-150MB
❌ **Customization:** Can't modify Chromium internals (CEF can)

But you get:
✅ **90% faster development**
✅ **JavaScript instead of C++**
✅ **Reuse existing code**
✅ **Much easier debugging**

---

## Next Steps

1. **Try it out:** Start with Phase 1 setup
2. **Build basic tab manager:** Phase 2-4
3. **Add React UI:** Phase 5
4. **Polish:** Downloads, bookmarks, history

Want me to set this up for you?
