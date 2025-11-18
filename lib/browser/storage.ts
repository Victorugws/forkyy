import { BrowserTab, Bookmark, BrowserHistory } from '@/lib/types/browser'

const STORAGE_KEYS = {
  TABS: 'browser_tabs',
  BOOKMARKS: 'browser_bookmarks',
  HISTORY: 'browser_history',
  ACTIVE_TAB: 'browser_active_tab',
  SETTINGS: 'browser_settings',
}

export interface BrowserSettings {
  defaultSearchEngine: string
  showBookmarksBar: boolean
  privateMode: boolean
  blockPopups: boolean
  enableJavaScript: boolean
}

// Tabs
export function saveTabs(tabs: BrowserTab[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs))
  }
}

export function loadTabs(): BrowserTab[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.TABS)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function saveActiveTab(tabId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tabId)
  }
}

export function loadActiveTab(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB)
  }
  return null
}

// Bookmarks
export function saveBookmarks(bookmarks: Bookmark[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))
  }
}

export function loadBookmarks(): Bookmark[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS)
    return data ? JSON.parse(data) : []
  }
  return []
}

// History
export function saveHistory(history: BrowserHistory[]) {
  if (typeof window !== 'undefined') {
    // Keep only last 1000 items
    const limited = history.slice(-1000)
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limited))
  }
}

export function loadHistory(): BrowserHistory[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
    return data ? JSON.parse(data) : []
  }
  return []
}

export function addToHistory(entry: Omit<BrowserHistory, 'id'>) {
  const history = loadHistory()
  const newEntry: BrowserHistory = {
    ...entry,
    id: `${Date.now()}-${Math.random()}`,
  }
  history.push(newEntry)
  saveHistory(history)
}

export function clearHistory() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.HISTORY)
  }
}

// Settings
export function saveSettings(settings: BrowserSettings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  }
}

export function loadSettings(): BrowserSettings {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (data) return JSON.parse(data)
  }

  return {
    defaultSearchEngine: 'Google',
    showBookmarksBar: true,
    privateMode: false,
    blockPopups: true,
    enableJavaScript: true,
  }
}
