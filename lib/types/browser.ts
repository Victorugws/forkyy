export interface BrowserTab {
  id: string
  url: string
  title: string
  favicon?: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  history: string[]
  historyIndex: number
  pageContent: string
  zoomLevel: number
  isPinned: boolean
  isMuted: boolean
}

export interface Bookmark {
  id: string
  url: string
  title: string
  favicon?: string
  folder?: string
  createdAt: number
  tags?: string[]
}

export interface BrowserHistory {
  id: string
  url: string
  title: string
  visitedAt: number
  favicon?: string
}

export interface Download {
  id: string
  url: string
  filename: string
  size: number
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'cancelled'
  startedAt: number
  completedAt?: number
}

export interface SearchEngine {
  name: string
  url: string
  icon?: string
}

export const defaultSearchEngines: SearchEngine[] = [
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { name: 'Brave', url: 'https://search.brave.com/search?q=' },
]
