import { BrowserView, BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'

export interface TabInfo {
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
  private headerHeight: number = 120 // Default height of your UI header

  constructor(window: BrowserWindow) {
    this.window = window

    // Handle window resize to update BrowserView bounds
    this.window.on('resize', () => {
      if (this.activeTabId) {
        this.updateBrowserViewBounds()
      }
    })
  }

  async createTab(url: string = 'https://google.com'): Promise<string> {
    const tabId = randomUUID()

    // Create BrowserView (embedded Chromium instance)
    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        webSecurity: true,
        // Enable web features
        plugins: false,
        webgl: true,
        images: true,
        javascript: true
      }
    })

    // Position the BrowserView below your UI header
    this.updateBrowserViewBounds(view)

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
    await view.webContents.loadURL(this.normalizeUrl(url))

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

    // URL changed in frame (for single-page apps)
    webContents.on('did-navigate-in-page', (event, url) => {
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
      }).catch(() => {
        // Ignore favicon errors
      })
    })

    // Failed to load
    webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      // Ignore aborted loads (user navigated away)
      if (errorCode === -3) return

      this.updateTabInfo(tabId, { isLoading: false })
      this.notifyRenderer('tab-load-failed', { tabId, errorCode, errorDescription, url: validatedURL })
    })

    // New window requested (handle popups)
    webContents.setWindowOpenHandler(({ url }) => {
      // Create new tab for popup
      this.createTab(url)
      return { action: 'deny' } // Deny opening external window
    })

    // Download handling
    webContents.session.on('will-download', (event, item) => {
      // Notify renderer about download
      this.notifyRenderer('download-started', {
        filename: item.getFilename(),
        url: item.getURL(),
        totalBytes: item.getTotalBytes()
      })

      item.on('updated', (event, state) => {
        if (state === 'progressing' && !item.isPaused()) {
          this.notifyRenderer('download-progress', {
            filename: item.getFilename(),
            percent: (item.getReceivedBytes() / item.getTotalBytes()) * 100
          })
        }
      })

      item.on('done', (event, state) => {
        this.notifyRenderer('download-completed', {
          filename: item.getFilename(),
          state,
          path: state === 'completed' ? item.getSavePath() : null
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
    this.updateBrowserViewBounds(tab.view)

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

  updateHeaderHeight(height: number) {
    this.headerHeight = height
    if (this.activeTabId) {
      this.updateBrowserViewBounds()
    }
  }

  private updateBrowserViewBounds(view?: BrowserView) {
    const bounds = this.window.getBounds()
    const targetView = view || (this.activeTabId ? this.tabs.get(this.activeTabId)?.view : null)

    if (targetView) {
      targetView.setBounds({
        x: 0,
        y: this.headerHeight,
        width: bounds.width,
        height: bounds.height - this.headerHeight
      })
    }
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
