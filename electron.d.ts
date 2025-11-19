import type { TabInfo } from './electron/browser-manager'

declare global {
  interface Window {
    electron?: {
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
        getAllTabs: () => Promise<TabInfo[]>
        updateHeight: (headerHeight: number) => Promise<void>
        onTabUpdated: (callback: (tabId: string) => void) => () => void
        onTabSwitched: (callback: (tabId: string) => void) => () => void
        onTabClosed: (callback: (tabId: string) => void) => () => void
        onDownloadStarted: (callback: (info: { filename: string; url: string; totalBytes: number }) => void) => () => void
        onDownloadProgress: (callback: (info: { filename: string; percent: number }) => void) => () => void
        onDownloadCompleted: (callback: (info: { filename: string; state: string; path: string | null }) => void) => () => void
        onLoadFailed: (callback: (info: { tabId: string; errorCode: number; errorDescription: string; url: string }) => void) => () => void
      }
      platform: string
      isElectron: true
    }
  }
}

export {}
