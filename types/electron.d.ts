export interface TabInfo {
  id: string
  url: string
  title: string
  favicon: string | null
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
}

export interface DownloadInfo {
  filename: string
  url: string
  totalBytes: number
}

export interface DownloadProgress {
  filename: string
  percent: number
}

export interface DownloadCompleted {
  filename: string
  state: string
  path: string | null
}

export interface LoadFailedInfo {
  tabId: string
  errorCode: number
  errorDescription: string
  url: string
}

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
    getAllTabs: () => Promise<TabInfo[]>
    updateHeight: (headerHeight: number) => Promise<void>
    onTabUpdated: (callback: (tabId: string) => void) => () => void
    onTabSwitched: (callback: (tabId: string) => void) => () => void
    onTabClosed: (callback: (tabId: string) => void) => () => void
    onDownloadStarted: (callback: (info: DownloadInfo) => void) => () => void
    onDownloadProgress: (callback: (info: DownloadProgress) => void) => () => void
    onDownloadCompleted: (callback: (info: DownloadCompleted) => void) => () => void
    onLoadFailed: (callback: (info: LoadFailedInfo) => void) => () => void
  }
  platform: NodeJS.Platform
  isElectron: boolean
}

declare global {
  interface Window {
    electron?: ElectronAPI
  }
}

export {}
