import { BrowserView, BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'
import { join } from 'path'

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
  private sidebarWidth: number = 0 // Width of right sidebar (AI Assistant, etc.)
  private leftOffset: number = 0 // X offset for left panels (History, Downloads, etc.)

  constructor(window: BrowserWindow) {
    this.window = window

    // Handle window resize to update BrowserView bounds
    this.window.on('resize', () => {
      if (this.activeTabId) {
        this.updateBrowserViewBounds()
      }
    })

    // Clean up all tabs when window is closed
    this.window.on('closed', () => {
      this.tabs.forEach((tab) => {
        try {
          if (!tab.view.webContents.isDestroyed()) {
            (tab.view.webContents as any).destroy()
          }
        } catch (e) {
          // Ignore errors during cleanup
        }
      })
      this.tabs.clear()
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
        preload: join(__dirname, 'browser-view-preload.js'),
        // Enable web features for modern sites (YouTube, etc.)
        plugins: true, // Enable plugins for media playback
        webgl: true,
        images: true,
        javascript: true,
        // Media support for YouTube and other video sites
        experimentalFeatures: true,
        // Allow autoplay for media
        autoplayPolicy: 'no-user-gesture-required' as any
      }
    })

    // Position the BrowserView below your UI header
    // Note: This sets initial bounds, will be updated when added to window
    this.updateBrowserViewBounds(view)

    // Disable auto-resize as we manage bounds manually to account for sidebars
    view.setAutoResize({
      width: false,
      height: false,
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

    // Load URL - don't await as it may throw ERR_ABORTED during redirects
    view.webContents.loadURL(this.normalizeUrl(url)).catch((error) => {
      // Silently ignore ERR_ABORTED (-3) - this is normal during redirects
      if (error?.errno !== -3 && error?.code !== 'ERR_ABORTED') {
        console.warn('Failed to load initial URL:', error)
      }
    })

    // If this is the first tab, make it active
    if (this.tabs.size === 1) {
      await this.switchTab(tabId)
    }

    return tabId
  }

  private setupTabListeners(tabId: string, view: BrowserView) {
    const webContents = view.webContents

    // Forward console messages from BrowserView
    webContents.on('console-message', (event, level, message, line, sourceId) => {
      const prefix = `[BrowserView ${tabId.slice(0, 8)}]`
      console.log(`${prefix} ${message}`)
    })

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

    // Cursor is now handled by the overlay window, no need to inject
    // Keeping this commented out for reference
    /*
    webContents.on('dom-ready', () => {
      // Inject cursor script immediately when DOM is ready
      webContents.executeJavaScript(`
        (function() {
          'use strict';

          // Check if cursor already exists to prevent duplication
          if (window.__customCursorInjected) {
            console.log('[SimpleCursor] Already injected, skipping');
            return;
          }
          window.__customCursorInjected = true;

          let cursorElement = null;
          let position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
          let isClicking = false;
          let eventListenersAttached = false;
          let currentCursorColor = '#00ff88';

          // Function to get contrasting color
          function getContrastColor(bgColor) {
            // Convert rgb to values
            const match = bgColor.match(/^rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
            if (!match) return '#000000';

            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);

            // Calculate relative luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            // Calculate contrast ratio between black and background
            const blackContrast = (luminance + 0.05) / 0.05;

            // Only change from black if contrast is too low (< 3:1 for minimum visibility)
            if (blackContrast < 3) {
              // Background is too dark for black cursor, use white
              return '#FFFFFF';
            }

            // Use black for everything else
            return '#000000';
          }

          // Sample background color at cursor position
          function updateCursorColor() {
            if (!cursorElement) return;

            const element = document.elementFromPoint(position.x, position.y);
            if (!element) return;

            // Get computed background color
            let bgColor = null;
            let currentEl = element;
            let depth = 0;

            // Traverse up the DOM tree to find a visible background color
            while (currentEl && depth < 20) {
              const style = window.getComputedStyle(currentEl);
              const bg = style.backgroundColor;

              // Check if background is not transparent
              if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                bgColor = bg;
                break;
              }

              currentEl = currentEl.parentElement;
              depth++;
            }

            if (bgColor) {
              const contrastColor = getContrastColor(bgColor);
              currentCursorColor = contrastColor;

              // Update cursor element colors
              const outerCircle = cursorElement.querySelector('div > div:nth-child(1)');
              const centerDot = cursorElement.querySelector('div > div:nth-child(2)');
              const horizontalCross = cursorElement.querySelector('div > div:nth-child(3)');
              const verticalCross = cursorElement.querySelector('div > div:nth-child(4)');

              if (outerCircle) outerCircle.style.borderColor = contrastColor;
              if (centerDot) centerDot.style.background = contrastColor;
              if (horizontalCross) horizontalCross.style.background = contrastColor;
              if (verticalCross) verticalCross.style.background = contrastColor;
            }
          }

          // Create cursor element
          function createCursor() {
            // Remove existing cursor if any
            const existing = document.getElementById('custom-target-cursor');
            if (existing) {
              existing.remove();
            }

            const container = document.createElement('div');
            container.id = 'custom-target-cursor';
            container.style.cssText = \`
              position: fixed;
              pointer-events: none;
              z-index: 99999;
              transition: transform 0.1s ease-out;
              left: 0;
              top: 0;
            \`;

            container.innerHTML = \`
              <div style="position: relative; width: 32px; height: 32px; filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 1px rgba(255, 255, 255, 0.8));">
                <!-- Outer circle -->
                <div style="
                  position: absolute;
                  width: 32px;
                  height: 32px;
                  border: 2px solid #000000;
                  border-radius: 50%;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  box-shadow:
                    0 0 0 1px rgba(255, 255, 255, 0.5) inset,
                    0 0 0 1px rgba(255, 255, 255, 0.5);
                "></div>

                <!-- Center dot -->
                <div style="
                  position: absolute;
                  width: 6px;
                  height: 6px;
                  background: #000000;
                  border: 2px solid #ffffff;
                  border-radius: 50%;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
                "></div>

                <!-- Horizontal crosshair -->
                <div style="
                  position: absolute;
                  width: 10px;
                  height: 2px;
                  background: #000000;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
                "></div>

                <!-- Vertical crosshair -->
                <div style="
                  position: absolute;
                  width: 2px;
                  height: 10px;
                  background: #000000;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
                "></div>
              </div>
            \`;

            document.body.appendChild(container);
            return container;
          }

          // Update cursor position
          function updateCursorPosition() {
            if (!cursorElement) return;

            const scale = isClicking ? 0.9 : 1;
            cursorElement.style.transform = \`translate(\${position.x - 16}px, \${position.y - 16}px) scale(\${scale})\`;
          }

          // Mouse move handler
          function handleMouseMove(e) {
            position.x = e.clientX;
            position.y = e.clientY;
            updateCursorPosition();
            updateCursorColor();
          }

          // Mouse down handler
          function handleMouseDown() {
            isClicking = true;
            updateCursorPosition();
          }

          // Mouse up handler
          function handleMouseUp() {
            isClicking = false;
            updateCursorPosition();
          }

          // Cleanup function
          function cleanup() {
            if (eventListenersAttached) {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mousedown', handleMouseDown);
              document.removeEventListener('mouseup', handleMouseUp);
              eventListenersAttached = false;
            }
            if (cursorElement) {
              cursorElement.remove();
              cursorElement = null;
            }
            window.__customCursorInjected = false;
          }

          // Wait for document to be ready
          function init() {
            try {
              // Wait for body to exist
              if (!document.body) {
                setTimeout(init, 50);
                return;
              }

              console.log('[SimpleCursor] Initializing...');

              // Remove existing cursor style if any
              const existingStyle = document.getElementById('custom-cursor-style');
              if (existingStyle) {
                existingStyle.remove();
              }

              // Hide default cursor
              const style = document.createElement('style');
              style.id = 'custom-cursor-style';
              style.textContent = \`
                * { cursor: none !important; }
              \`;
              if (document.head) {
                document.head.appendChild(style);
              } else {
                document.documentElement.appendChild(style);
              }

              // Create custom cursor
              cursorElement = createCursor();
              
              // Set initial position to center of screen
              if (cursorElement) {
                updateCursorPosition();
                console.log('[SimpleCursor] Cursor element created:', cursorElement);
              } else {
                console.error('[SimpleCursor] Failed to create cursor element');
              }

              // Set up event listeners only once
              if (!eventListenersAttached) {
                document.addEventListener('mousemove', handleMouseMove, { passive: true });
                document.addEventListener('mousedown', handleMouseDown);
                document.addEventListener('mouseup', handleMouseUp);
                eventListenersAttached = true;
                console.log('[SimpleCursor] Event listeners attached');
              }

              console.log('[SimpleCursor] Initialized successfully. Cursor at:', position);

              // Cleanup on page unload
              window.addEventListener('beforeunload', cleanup);
              
              // Also try to re-initialize if cursor disappears
              setTimeout(() => {
                if (!document.getElementById('custom-target-cursor')) {
                  console.warn('[SimpleCursor] Cursor element missing, re-initializing...');
                  cursorElement = null;
                  window.__customCursorInjected = false;
                  init();
                }
              }, 1000);
            } catch (error) {
              console.error('[SimpleCursor] Error:', error);
              console.error('[SimpleCursor] Stack:', error.stack);
            }
          }

          // Initialize immediately
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
          } else {
            // DOM already ready, try to init immediately
            setTimeout(init, 100);
          }
          
          // Also try on window load as fallback
          window.addEventListener('load', () => {
            if (!cursorElement || !document.getElementById('custom-target-cursor')) {
              console.log('[SimpleCursor] Window loaded, ensuring cursor exists...');
              setTimeout(init, 100);
            }
          });
        })();
      `).catch((error) => {
        console.warn('[BrowserManager] Failed to inject cursor script:', error)
      })
    })
    */

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

    // Update active tab ID first
    this.activeTabId = tabId

    // Update bounds BEFORE adding to window to ensure correct initial size
    this.updateBrowserViewBounds(tab.view)

    // Show new tab
    this.window.addBrowserView(tab.view)

    // Update bounds again after adding to ensure it's applied
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

    // Start loading URL - don't await as it may throw ERR_ABORTED during redirects
    // The did-fail-load event handler will catch real errors
    tab.view.webContents.loadURL(normalizedUrl).catch((error) => {
      // Silently ignore ERR_ABORTED (-3) - this is normal during redirects
      if (error?.errno !== -3 && error?.code !== 'ERR_ABORTED') {
        console.error('Failed to load URL:', error)
      }
    })
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

  updateSidebarWidth(width: number) {
    console.log('[BrowserManager] Updating sidebar width:', width)
    this.sidebarWidth = width
    if (this.activeTabId) {
      this.updateBrowserViewBounds()
      const tab = this.tabs.get(this.activeTabId)
      if (tab) {
        console.log('[BrowserManager] BrowserView bounds after sidebar update:', tab.view.getBounds())
      }
    }
  }

  updateLeftOffset(offset: number) {
    console.log('[BrowserManager] Updating left offset:', offset)
    this.leftOffset = offset
    if (this.activeTabId) {
      this.updateBrowserViewBounds()
      const tab = this.tabs.get(this.activeTabId)
      if (tab) {
        console.log('[BrowserManager] BrowserView bounds after left offset update:', tab.view.getBounds())
      }
    }
  }

  private updateBrowserViewBounds(view?: BrowserView) {
    const bounds = this.window.getBounds()
    const targetView = view || (this.activeTabId ? this.tabs.get(this.activeTabId)?.view : null)

    if (targetView) {
      const newBounds = {
        x: this.leftOffset,
        y: this.headerHeight,
        width: Math.max(0, bounds.width - this.sidebarWidth - this.leftOffset),
        height: Math.max(0, bounds.height - this.headerHeight)
      }

      console.log('[BrowserManager] Setting BrowserView bounds:', {
        windowBounds: bounds,
        headerHeight: this.headerHeight,
        sidebarWidth: this.sidebarWidth,
        leftOffset: this.leftOffset,
        calculatedBounds: newBounds
      })

      targetView.setBounds(newBounds)
    }
  }

  private updateTabInfo(tabId: string, updates: Partial<TabInfo>) {
    const tab = this.tabs.get(tabId)
    if (tab) {
      tab.info = { ...tab.info, ...updates }
    }
  }

  private notifyRenderer(channel: string, data: any) {
    // Check if window is still valid before sending
    if (!this.window.isDestroyed()) {
      this.window.webContents.send('browser-event', { channel, data })
    }
  }

  private normalizeUrl(input: string): string {
    // Add https:// if no protocol
    if (!/^https?:\/\//i.test(input)) {
      // Check if it looks like a domain
      if (/^[\w-]+(\.[\w-]+)+/.test(input)) {
        return `https://${input}`
      }
      // Otherwise navigate to morphic chat page
      const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      return `http://localhost:3000/search/${newChatId}?q=${encodeURIComponent(input)}`
    }
    return input
  }
}
