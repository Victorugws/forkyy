/**
 * Browser API Wrapper
 * Provides a clean interface for your React components to interact with Firefox
 * Replaces Electron IPC calls
 * 
 * Note: This works in both Electron and Firefox WebExtension contexts
 * In Electron, it falls back gracefully (for development)
 */

// Browser namespace is available globally in Firefox WebExtensions
// Types are provided by @types/firefox-webext-browser
// @ts-ignore - browser is available globally in WebExtension context
declare const browser: any

// Check if we're in a browser extension context
const isBrowserExtension = typeof browser !== 'undefined' && browser.runtime?.id

// Types (matches browser.tabs.Tab)
export interface Tab {
  id: number
  url?: string
  title?: string
  favIconUrl?: string
  active: boolean
  pinned: boolean
  windowId: number
  index: number
  status?: 'loading' | 'complete'
  discarded?: boolean
  highlighted?: boolean
  incognito?: boolean
  selected?: boolean
}

// Message helper
async function sendMessage<T = any>(action: string, params: any = {}): Promise<T> {
  if (!isBrowserExtension) {
    throw new Error('Browser extension API not available. This code only works in Firefox WebExtension context.')
  }

  const response = await browser.runtime.sendMessage({ action, ...params })
  
  if (response?.success) {
    return response.data
  } else {
    throw new Error(response?.error || 'Unknown error')
  }
}

// Tab Management
export const tabs = {
  async create(options: { url: string; active?: boolean }): Promise<Tab> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage<Tab>('createTab', options)
  },

  async close(tabId: number): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage('closeTab', { tabId })
  },

  async update(tabId: number, options: {
    url?: string
    active?: boolean
    pinned?: boolean
  }): Promise<Tab> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage<Tab>('updateTab', { tabId, updateProperties: options })
  },

  async getAll(query: any = {}): Promise<Tab[]> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage<Tab[]>('getTabs', { query })
  },

  async getActive(): Promise<Tab | null> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage<Tab | null>('getActiveTab')
  },

  async switch(tabId: number): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage('switchTab', { tabId })
  },

  async goBack(tabId: number): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage('goBack', { tabId })
  },

  async goForward(tabId: number): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage('goForward', { tabId })
  },

  async reload(tabId: number): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage('reloadTab', { tabId })
  },

  // Event listeners (using browser.tabs API directly)
  get onCreated() {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.tabs.onCreated
  },
  
  get onUpdated() {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.tabs.onUpdated
  },
  
  get onRemoved() {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.tabs.onRemoved
  },
  
  get onActivated() {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.tabs.onActivated
  },
}

// Storage Management
export const storage = {
  async get<T = any>(keys?: string | string[]): Promise<T> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    const data = await sendMessage('getStorage', { keys })
    return data as T
  },

  async set(data: Record<string, any>): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return sendMessage('setStorage', { data })
  },

  async remove(keys: string | string[]): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    await browser.storage.local.remove(keys)
  },

  async clear(): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    await browser.storage.local.clear()
  },

  // Event listener
  get onChanged() {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.storage.onChanged
  },
}

// Window Management
export const windows = {
  async getCurrent(): Promise<any> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.windows.getCurrent()
  },

  async getAll(): Promise<any[]> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.windows.getAll()
  },

  async create(options: any): Promise<any> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.windows.create(options)
  },

  async update(windowId: number, updateInfo: any): Promise<void> {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    await browser.windows.update(windowId, updateInfo)
  },
}

// Runtime info
export const runtime = {
  getURL: (path: string) => {
    if (!isBrowserExtension) {
      throw new Error('Browser extension API not available')
    }
    return browser.runtime.getURL(path)
  },
  get id() {
    if (!isBrowserExtension) {
      return undefined
    }
    return browser.runtime.id
  },
}

// Helper to check if we're in extension context
export const isExtensionContext = () => isBrowserExtension

