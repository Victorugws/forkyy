'use client'

export interface Shortcut {
  id: string
  title: string
  url: string
  favicon?: string
  category?: string
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export interface BrowserHomeSettings {
  theme: 'light' | 'dark' | 'auto'
  backgroundType: 'solid' | 'gradient' | 'image'
  backgroundValue: string
  showClock: boolean
  showWeather: boolean
  showTodo: boolean
  showSpeedDial: boolean
  weatherLocation: string
  clockFormat: '12' | '24'
}

export interface BrowserHomeData {
  shortcuts: Shortcut[]
  todos: TodoItem[]
  settings: BrowserHomeSettings
}

const STORAGE_KEY = 'forkyy-browser-home'

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: '1', title: 'Gmail', url: 'https://gmail.com', favicon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' },
  { id: '2', title: 'GitHub', url: 'https://github.com', favicon: 'https://github.githubassets.com/favicons/favicon.svg' },
  { id: '3', title: 'YouTube', url: 'https://youtube.com', favicon: 'https://www.youtube.com/s/desktop/d743f786/img/favicon_32x32.png' },
  { id: '4', title: 'Twitter', url: 'https://twitter.com', favicon: 'https://abs.twimg.com/favicons/twitter.3.ico' },
  { id: '5', title: 'LinkedIn', url: 'https://linkedin.com', favicon: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca' },
  { id: '6', title: 'Reddit', url: 'https://reddit.com', favicon: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png' },
]

const DEFAULT_SETTINGS: BrowserHomeSettings = {
  theme: 'auto',
  backgroundType: 'gradient',
  backgroundValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  showClock: true,
  showWeather: true,
  showTodo: true,
  showSpeedDial: true,
  weatherLocation: 'New York',
  clockFormat: '12',
}

export function getBrowserHomeData(): BrowserHomeData {
  if (typeof window === 'undefined') {
    return {
      shortcuts: DEFAULT_SHORTCUTS,
      todos: [],
      settings: DEFAULT_SETTINGS,
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored) as BrowserHomeData
      return {
        shortcuts: data.shortcuts || DEFAULT_SHORTCUTS,
        todos: data.todos || [],
        settings: { ...DEFAULT_SETTINGS, ...data.settings },
      }
    }
  } catch (error) {
    console.error('Error loading browser home data:', error)
  }

  return {
    shortcuts: DEFAULT_SHORTCUTS,
    todos: [],
    settings: DEFAULT_SETTINGS,
  }
}

export function saveBrowserHomeData(data: Partial<BrowserHomeData>) {
  if (typeof window === 'undefined') return

  try {
    const current = getBrowserHomeData()
    const updated = {
      shortcuts: data.shortcuts ?? current.shortcuts,
      todos: data.todos ?? current.todos,
      settings: data.settings ?? current.settings,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving browser home data:', error)
  }
}

export function addShortcut(shortcut: Omit<Shortcut, 'id'>): Shortcut {
  const data = getBrowserHomeData()
  const newShortcut: Shortcut = {
    ...shortcut,
    id: Date.now().toString(),
  }
  data.shortcuts.push(newShortcut)
  saveBrowserHomeData(data)
  return newShortcut
}

export function updateShortcut(id: string, updates: Partial<Shortcut>) {
  const data = getBrowserHomeData()
  data.shortcuts = data.shortcuts.map(s =>
    s.id === id ? { ...s, ...updates } : s
  )
  saveBrowserHomeData(data)
}

export function deleteShortcut(id: string) {
  const data = getBrowserHomeData()
  data.shortcuts = data.shortcuts.filter(s => s.id !== id)
  saveBrowserHomeData(data)
}

export function addTodo(text: string): TodoItem {
  const data = getBrowserHomeData()
  const newTodo: TodoItem = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now(),
  }
  data.todos.push(newTodo)
  saveBrowserHomeData(data)
  return newTodo
}

export function updateTodo(id: string, updates: Partial<TodoItem>) {
  const data = getBrowserHomeData()
  data.todos = data.todos.map(t =>
    t.id === id ? { ...t, ...updates } : t
  )
  saveBrowserHomeData(data)
}

export function deleteTodo(id: string) {
  const data = getBrowserHomeData()
  data.todos = data.todos.filter(t => t.id !== id)
  saveBrowserHomeData(data)
}

export function updateSettings(settings: Partial<BrowserHomeSettings>) {
  const data = getBrowserHomeData()
  data.settings = { ...data.settings, ...settings }
  saveBrowserHomeData(data)
}
