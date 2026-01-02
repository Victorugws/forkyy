"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserManager = void 0;
const electron_1 = require("electron");
const crypto_1 = require("crypto");
const path_1 = require("path");
class BrowserManager {
    constructor(window) {
        this.tabs = new Map();
        this.activeTabId = null;
        this.headerHeight = 120; // Default height of your UI header
        this.sidebarWidth = 0; // Width of right sidebar (AI Assistant, etc.)
        this.leftOffset = 0; // X offset for left panels (History, Downloads, etc.)
        this.window = window;
        // Handle window resize to update BrowserView bounds
        this.window.on('resize', () => {
            if (this.activeTabId) {
                this.updateBrowserViewBounds();
            }
        });
        // Clean up all tabs when window is closed
        this.window.on('closed', () => {
            this.tabs.forEach((tab) => {
                try {
                    if (!tab.view.webContents.isDestroyed()) {
                        tab.view.webContents.destroy();
                    }
                }
                catch (e) {
                    // Ignore errors during cleanup
                }
            });
            this.tabs.clear();
        });
    }
    async createTab(url = 'https://google.com') {
        const tabId = (0, crypto_1.randomUUID)();
        // Create BrowserView (embedded Chromium instance)
        const view = new electron_1.BrowserView({
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: true,
                webSecurity: true,
                preload: (0, path_1.join)(__dirname, 'browser-view-preload.js'),
                // Enable web features for modern sites (YouTube, etc.)
                plugins: true, // Enable plugins for media playback
                webgl: true,
                images: true,
                javascript: true,
                // Media support for YouTube and other video sites
                experimentalFeatures: true,
                // Allow autoplay for media
                autoplayPolicy: 'no-user-gesture-required'
            }
        });
        // Position the BrowserView below your UI header
        // Note: This sets initial bounds, will be updated when added to window
        this.updateBrowserViewBounds(view);
        // Disable auto-resize as we manage bounds manually to account for sidebars
        view.setAutoResize({
            width: false,
            height: false,
            horizontal: false,
            vertical: false
        });
        // Setup event listeners for this tab
        this.setupTabListeners(tabId, view);
        // Store tab
        const tab = {
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
        };
        this.tabs.set(tabId, tab);
        // Load URL - don't await as it may throw ERR_ABORTED during redirects
        view.webContents.loadURL(this.normalizeUrl(url)).catch((error) => {
            // Silently ignore ERR_ABORTED (-3) - this is normal during redirects
            if (error?.errno !== -3 && error?.code !== 'ERR_ABORTED') {
                console.warn('Failed to load initial URL:', error);
            }
        });
        // If this is the first tab, make it active
        if (this.tabs.size === 1) {
            await this.switchTab(tabId);
        }
        return tabId;
    }
    setupTabListeners(tabId, view) {
        const webContents = view.webContents;
        // Forward console messages from BrowserView
        webContents.on('console-message', (event, level, message, line, sourceId) => {
            const prefix = `[BrowserView ${tabId.slice(0, 8)}]`;
            console.log(`${prefix} ${message}`);
        });
        // Page title changed
        webContents.on('page-title-updated', (event, title) => {
            this.updateTabInfo(tabId, { title });
            this.notifyRenderer('tab-updated', tabId);
        });
        // URL changed (navigation)
        webContents.on('did-navigate', (event, url) => {
            this.updateTabInfo(tabId, {
                url,
                canGoBack: webContents.canGoBack(),
                canGoForward: webContents.canGoForward()
            });
            this.notifyRenderer('tab-updated', tabId);
        });
        // URL changed in frame (for single-page apps)
        webContents.on('did-navigate-in-page', (event, url) => {
            this.updateTabInfo(tabId, {
                url,
                canGoBack: webContents.canGoBack(),
                canGoForward: webContents.canGoForward()
            });
            this.notifyRenderer('tab-updated', tabId);
        });
        // Started loading
        webContents.on('did-start-loading', () => {
            this.updateTabInfo(tabId, { isLoading: true });
            this.notifyRenderer('tab-updated', tabId);
        });
        // Finished loading
        webContents.on('did-finish-load', () => {
            this.updateTabInfo(tabId, { isLoading: false });
            this.notifyRenderer('tab-updated', tabId);
            // Get favicon
            webContents.executeJavaScript(`
        const link = document.querySelector('link[rel*="icon"]')
        link ? link.href : null
      `).then((favicon) => {
                if (favicon) {
                    this.updateTabInfo(tabId, { favicon });
                    this.notifyRenderer('tab-updated', tabId);
                }
            }).catch(() => {
                // Ignore favicon errors
            });
        });
        // Failed to load
        webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
            // Ignore aborted loads (user navigated away)
            if (errorCode === -3)
                return;
            this.updateTabInfo(tabId, { isLoading: false });
            this.notifyRenderer('tab-load-failed', { tabId, errorCode, errorDescription, url: validatedURL });
        });
        // New window requested (handle popups)
        webContents.setWindowOpenHandler(({ url }) => {
            // Create new tab for popup
            this.createTab(url);
            return { action: 'deny' }; // Deny opening external window
        });
        // Download handling
        webContents.session.on('will-download', (event, item) => {
            // Notify renderer about download
            this.notifyRenderer('download-started', {
                filename: item.getFilename(),
                url: item.getURL(),
                totalBytes: item.getTotalBytes()
            });
            item.on('updated', (event, state) => {
                if (state === 'progressing' && !item.isPaused()) {
                    this.notifyRenderer('download-progress', {
                        filename: item.getFilename(),
                        percent: (item.getReceivedBytes() / item.getTotalBytes()) * 100
                    });
                }
            });
            item.on('done', (event, state) => {
                this.notifyRenderer('download-completed', {
                    filename: item.getFilename(),
                    state,
                    path: state === 'completed' ? item.getSavePath() : null
                });
            });
        });
    }
    async switchTab(tabId) {
        const tab = this.tabs.get(tabId);
        if (!tab)
            return;
        // Hide current tab
        if (this.activeTabId) {
            const currentTab = this.tabs.get(this.activeTabId);
            if (currentTab) {
                this.window.removeBrowserView(currentTab.view);
            }
        }
        // Update active tab ID first
        this.activeTabId = tabId;
        // Update bounds BEFORE adding to window to ensure correct initial size
        this.updateBrowserViewBounds(tab.view);
        // Show new tab
        this.window.addBrowserView(tab.view);
        // Update bounds again after adding to ensure it's applied
        this.updateBrowserViewBounds(tab.view);
        this.notifyRenderer('tab-switched', tabId);
    }
    async closeTab(tabId) {
        const tab = this.tabs.get(tabId);
        if (!tab)
            return;
        // Remove view from window if it's active
        if (this.activeTabId === tabId) {
            this.window.removeBrowserView(tab.view);
            // Switch to another tab if available
            const remainingTabs = Array.from(this.tabs.keys()).filter(id => id !== tabId);
            if (remainingTabs.length > 0) {
                await this.switchTab(remainingTabs[0]);
            }
            else {
                this.activeTabId = null;
            }
        }
        // Destroy the view
        ;
        tab.view.webContents.destroy();
        // Remove from map
        this.tabs.delete(tabId);
        this.notifyRenderer('tab-closed', tabId);
    }
    async navigate(tabId, url) {
        const tab = this.tabs.get(tabId);
        if (!tab)
            return;
        // Validate and normalize URL
        const normalizedUrl = this.normalizeUrl(url);
        // Start loading URL - don't await as it may throw ERR_ABORTED during redirects
        // The did-fail-load event handler will catch real errors
        tab.view.webContents.loadURL(normalizedUrl).catch((error) => {
            // Silently ignore ERR_ABORTED (-3) - this is normal during redirects
            if (error?.errno !== -3 && error?.code !== 'ERR_ABORTED') {
                console.error('Failed to load URL:', error);
            }
        });
    }
    async goBack(tabId) {
        const tab = this.tabs.get(tabId);
        if (tab && tab.view.webContents.canGoBack()) {
            tab.view.webContents.goBack();
        }
    }
    async goForward(tabId) {
        const tab = this.tabs.get(tabId);
        if (tab && tab.view.webContents.canGoForward()) {
            tab.view.webContents.goForward();
        }
    }
    async reload(tabId) {
        const tab = this.tabs.get(tabId);
        if (tab) {
            tab.view.webContents.reload();
        }
    }
    async stop(tabId) {
        const tab = this.tabs.get(tabId);
        if (tab) {
            tab.view.webContents.stop();
        }
    }
    getTabInfo(tabId) {
        const tab = this.tabs.get(tabId);
        return tab ? { ...tab.info } : null;
    }
    getAllTabs() {
        return Array.from(this.tabs.values()).map(tab => ({ ...tab.info }));
    }
    updateHeaderHeight(height) {
        this.headerHeight = height;
        if (this.activeTabId) {
            this.updateBrowserViewBounds();
        }
    }
    updateSidebarWidth(width) {
        console.log('[BrowserManager] Updating sidebar width:', width);
        this.sidebarWidth = width;
        if (this.activeTabId) {
            this.updateBrowserViewBounds();
            const tab = this.tabs.get(this.activeTabId);
            if (tab) {
                console.log('[BrowserManager] BrowserView bounds after sidebar update:', tab.view.getBounds());
            }
        }
    }
    updateLeftOffset(offset) {
        console.log('[BrowserManager] Updating left offset:', offset);
        this.leftOffset = offset;
        if (this.activeTabId) {
            this.updateBrowserViewBounds();
            const tab = this.tabs.get(this.activeTabId);
            if (tab) {
                console.log('[BrowserManager] BrowserView bounds after left offset update:', tab.view.getBounds());
            }
        }
    }
    updateBrowserViewBounds(view) {
        const bounds = this.window.getBounds();
        const targetView = view || (this.activeTabId ? this.tabs.get(this.activeTabId)?.view : null);
        if (targetView) {
            const newBounds = {
                x: this.leftOffset,
                y: this.headerHeight,
                width: Math.max(0, bounds.width - this.sidebarWidth - this.leftOffset),
                height: Math.max(0, bounds.height - this.headerHeight)
            };
            console.log('[BrowserManager] Setting BrowserView bounds:', {
                windowBounds: bounds,
                headerHeight: this.headerHeight,
                sidebarWidth: this.sidebarWidth,
                leftOffset: this.leftOffset,
                calculatedBounds: newBounds
            });
            targetView.setBounds(newBounds);
        }
    }
    updateTabInfo(tabId, updates) {
        const tab = this.tabs.get(tabId);
        if (tab) {
            tab.info = { ...tab.info, ...updates };
        }
    }
    notifyRenderer(channel, data) {
        // Check if window is still valid before sending
        if (!this.window.isDestroyed()) {
            this.window.webContents.send('browser-event', { channel, data });
        }
    }
    normalizeUrl(input) {
        // Add https:// if no protocol
        if (!/^https?:\/\//i.test(input)) {
            // Check if it looks like a domain
            if (/^[\w-]+(\.[\w-]+)+/.test(input)) {
                return `https://${input}`;
            }
            // Otherwise navigate to morphic chat page
            const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
            return `http://localhost:3000/search/${newChatId}?q=${encodeURIComponent(input)}`;
        }
        return input;
    }
}
exports.BrowserManager = BrowserManager;
