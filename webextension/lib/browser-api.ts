/**
 * Browser API Wrapper
 * Provides a clean interface for your React components to interact with Firefox
 * Replaces Electron IPC calls
 * 
 * Note: This file should be included in your React app build
 * Place it in your src/lib or equivalent directory
 */

// Use browser namespace (Firefox WebExtensions)
// @ts-ignore - browser is available globally in WebExtension context
declare const browser: any

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

export interface CreateTabOptions {
  url: string
  active?: boolean
}

export interface UpdateTabOptions {
  url?: string
  active?: boolean
  pinned?: boolean
}

// Message helper
async function sendMessage<T = any>(action: string, params: any = {}): Promise<T> {
  const response = await browser.runtime.sendMessage({ action, ...params })
  
  if (response.success) {
    return response.data
  } else {
    throw new Error(response.error || 'Unknown error')
  }
}

// Tab Management
export const tabs = {
  async create(options: CreateTabOptions): Promise<Tab> {
    return sendMessage<Tab>('createTab', options)
  },

  async close(tabId: number): Promise<void> {
    return sendMessage('closeTab', { tabId })
  },

  async update(tabId: number, options: UpdateTabOptions): Promise<Tab> {
    return sendMessage<Tab>('updateTab', { tabId, updateProperties: options })
  },

  async getAll(query: any = {}): Promise<Tab[]> {
    return sendMessage<Tab[]>('getTabs', { query })
  },

  async getActive(): Promise<Tab | null> {
    return sendMessage<Tab | null>('getActiveTab')
  },

  async switch(tabId: number): Promise<void> {
    return sendMessage('switchTab', { tabId })
  },

  async goBack(tabId: number): Promise<void> {
    return sendMessage('goBack', { tabId })
  },

  async goForward(tabId: number): Promise<void> {
    return sendMessage('goForward', { tabId })
  },

  async reload(tabId: number): Promise<void> {
    return sendMessage('reloadTab', { tabId })
  },

    // Event listeners (using browser.tabs API directly)
  // Note: These require browser.tabs permission
  get onCreated() { return browser.tabs.onCreated },
  get onUpdated() { return browser.tabs.onUpdated },
  get onRemoved() { return browser.tabs.onRemoved },
  get onActivated() { return browser.tabs.onActivated },
}

// Storage Management
export const storage = {
  async get<T = any>(keys?: string | string[]): Promise<T> {
    const data = await sendMessage('getStorage', { keys })
    return data as T
  },

  async set(data: Record<string, any>): Promise<void> {
    return sendMessage('setStorage', { data })
  },

  async remove(keys: string | string[]): Promise<void> {
    await browser.storage.local.remove(keys)
  },

  async clear(): Promise<void> {
    await browser.storage.local.clear()
  },

  // Event listener
  get onChanged() { return browser.storage.onChanged },
}

// Window Management
export const windows = {
  async getCurrent(): Promise<any> {
    return browser.windows.getCurrent()
  },

  async getAll(): Promise<any[]> {
    return browser.windows.getAll()
  },

  async create(options: any): Promise<any> {
    return browser.windows.create(options)
  },

  async update(windowId: number, updateInfo: any): Promise<void> {
    await browser.windows.update(windowId, updateInfo)
  },
}

// Runtime info
export const runtime = {
  getURL: browser.runtime.getURL,
  id: browser.runtime.id,
}

