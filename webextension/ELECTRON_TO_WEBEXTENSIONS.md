# Electron → WebExtensions API Mapping

## Core Concepts

### Electron IPC → WebExtensions Messaging

**Electron:**
```typescript
// Main process
ipcMain.handle('browser:create-tab', async (event, url) => {
  // Create tab
})

// Renderer
const tabId = await ipcRenderer.invoke('browser:create-tab', url)
```

**WebExtensions:**
```typescript
// Background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createTab') {
    browser.tabs.create({ url: message.url })
      .then(tab => sendResponse({ success: true, data: tab }))
  }
})

// UI (React)
import { tabs } from '@/lib/browser-api'
const tab = await tabs.create({ url })
```

---

## Feature Mapping

### 1. Tab Management

| Electron | WebExtensions | Notes |
|----------|---------------|-------|
| `webview` tag | `browser.tabs` API | No embedded webview - use native Firefox tabs |
| `createTab(url)` | `browser.tabs.create({ url })` | Creates native Firefox tab |
| `closeTab(tabId)` | `browser.tabs.remove(tabId)` | Closes native Firefox tab |
| `navigate(tabId, url)` | `browser.tabs.update(tabId, { url })` | Updates existing tab |
| `webview.src = url` | `browser.tabs.update(tabId, { url })` | Navigate tab |
| Custom tab UI | Not possible | Firefox manages tab strip |
| Tab events | `browser.tabs.onCreated`<br>`browser.tabs.onUpdated`<br>`browser.tabs.onRemoved` | Listen to tab changes |

**Example Migration:**

```typescript
// BEFORE (Electron)
const createTab = (url: string) => {
  const newTab: Tab = {
    id: `tab-${Date.now()}`,
    url,
    // ...
  }
  setTabs(prev => [...prev, newTab])
  return newTab.id
}

// AFTER (WebExtensions)
import { tabs } from '@/lib/browser-api'

const createTab = async (url: string) => {
  const tab = await tabs.create({ url, active: true })
  // Firefox manages the tab - we just track it
  return tab.id
}
```

---

### 2. Navigation

| Electron | WebExtensions | Notes |
|----------|---------------|-------|
| `webview.canGoBack()` | Not directly available | Use history API via content script |
| `webview.canGoForward()` | Not directly available | Use history API via content script |
| `webview.goBack()` | `browser.tabs.executeScript` + `history.back()` | Limited control |
| `webview.goForward()` | `browser.tabs.executeScript` + `history.forward()` | Limited control |
| `webview.reload()` | `browser.tabs.reload(tabId)` | ✅ Direct equivalent |

**Example:**

```typescript
// BEFORE (Electron)
webview.goBack()
const canGoBack = webview.canGoBack()

// AFTER (WebExtensions)
import { tabs } from '@/lib/browser-api'
await tabs.goBack(tabId)
// Can't easily check canGoBack - would need content script
```

---

### 3. Window Management

| Electron | WebExtensions | Notes |
|----------|---------------|-------|
| `BrowserWindow` | `browser.windows` API | Less control, browser manages windows |
| `mainWindow.loadURL()` | Not applicable | UI is extension page |
| `mainWindow.webContents` | Not applicable | No main window |

**Example:**

```typescript
// BEFORE (Electron)
mainWindow = new BrowserWindow({ width: 1400, height: 900 })
await mainWindow.loadURL('http://localhost:3000')

// AFTER (WebExtensions)
// No main window - UI is New Tab page or Sidebar
// Managed by Firefox via manifest.json
```

---

### 4. Storage

| Electron | WebExtensions | Notes |
|----------|---------------|-------|
| `localStorage` | `browser.storage.local` | Async API, cross-page |
| `sessionStorage` | `browser.storage.session` | Firefox-specific, session-scoped |
| File system | ❌ Not available | Use `browser.storage.local` (5MB limit) |

**Example:**

```typescript
// BEFORE (Electron)
localStorage.setItem('tabs', JSON.stringify(tabs))
const tabs = JSON.parse(localStorage.getItem('tabs') || '[]')

// AFTER (WebExtensions)
import { storage } from '@/lib/browser-api'
await storage.set({ tabs })
const { tabs } = await storage.get('tabs')
```

---

### 5. Events & IPC

| Electron | WebExtensions | Notes |
|----------|---------------|-------|
| `ipcMain.on()` | `browser.runtime.onMessage` | Background script |
| `ipcRenderer.invoke()` | `browser.runtime.sendMessage` | Async messaging |
| `ipcRenderer.on()` | `browser.runtime.onMessage` | Or `window.addEventListener('message')` |
| `contextBridge.exposeInMainWorld` | Not needed | Direct access to `browser` API |

**Example:**

```typescript
// BEFORE (Electron - preload.ts)
contextBridge.exposeInMainWorld('electron', {
  browser: {
    createTab: () => ipcRenderer.invoke('browser:create-tab')
  }
})

// AFTER (WebExtensions)
import { tabs } from '@/lib/browser-api'
// Direct use - no bridge needed
await tabs.create({ url })
```

---

### 6. Preload Scripts

| Electron | WebExtensions | Notes |
|----------|---------------|-------|
| `webview.preload` | Content scripts | Different purpose - inject into web pages |
| Context isolation | Content Security Policy | Different security model |

**Not applicable** - WebExtensions don't have preload scripts. Use content scripts if you need to interact with web page content.

---

## What Cannot Be Ported

### ❌ Removed Features

1. **Embedded Webviews**
   - ❌ `<webview>` tag doesn't exist
   - ✅ Use native Firefox tabs instead

2. **Custom Tab Strip**
   - ❌ Cannot replace Firefox tab strip
   - ✅ Work with existing tabs via API

3. **Window Control**
   - ❌ Cannot replace browser chrome
   - ❌ Limited window management
   - ✅ Work within Firefox UI

4. **Native Modules**
   - ❌ No Node.js native modules
   - ❌ No OS-level integrations
   - ✅ Use WebExtension APIs only

5. **Eye Tracking**
   - ❌ No native module access
   - ❌ No OS-level hooks
   - ❌ Cannot be ported

6. **Cursor Tracking**
   - ❌ Limited OS-level access
   - ❌ Cannot track cursor outside extension
   - ❌ Limited to extension UI

7. **Next.js API Routes**
   - ❌ No server-side code
   - ❌ Must use static export
   - ✅ Move API logic to background script or external service

8. **File System Access**
   - ❌ No direct file access
   - ✅ Use `browser.storage.local` (5MB limit)
   - ✅ Use downloads API for user files

9. **Custom Window Lifecycle**
   - ❌ Browser manages windows
   - ✅ Work with browser events

---

## Migration Strategy

### Step 1: Identify Electron Dependencies

1. Find all `electron` imports
2. Find all `ipcRenderer`/`ipcMain` usage
3. Find all `webview` usage
4. List native module dependencies

### Step 2: Map to WebExtensions APIs

1. Tab management → `browser.tabs`
2. IPC → `browser.runtime.sendMessage`
3. Storage → `browser.storage.local`
4. Window → `browser.windows` (if needed)

### Step 3: Remove Electron-Specific Code

1. Remove `<webview>` components
2. Replace IPC with messaging
3. Remove native module dependencies
4. Convert to static React app

### Step 4: Adapt UI

1. Remove custom tab strip (use Firefox tabs)
2. Remove window controls (use Firefox chrome)
3. Adapt navigation controls (limited by API)
4. Use extension pages (New Tab, Sidebar)

---

## Example: Migrating WebViewBrowser Component

**BEFORE (Electron):**
```tsx
export function WebViewBrowser() {
  const [tabs, setTabs] = useState<Tab[]>([])
  const webviewRefs = useRef<Map<string, Electron.WebviewTag>>(new Map())

  const createTab = (url: string) => {
    const newTab = { id: generateId(), url }
    setTabs(prev => [...prev, newTab])
    return newTab.id
  }

  return (
    <div>
      {tabs.map(tab => (
        <webview
          key={tab.id}
          src={tab.url}
          preload={preloadPath}
        />
      ))}
    </div>
  )
}
```

**AFTER (WebExtensions):**
```tsx
import { tabs as browserTabs } from '@/lib/browser-api'

export function WebViewBrowser() {
  const [firefoxTabs, setFirefoxTabs] = useState<browser.tabs.Tab[]>([])

  useEffect(() => {
    // Load existing tabs
    browserTabs.getAll().then(setFirefoxTabs)

    // Listen for tab changes
    const handleTabCreated = (tab: browser.tabs.Tab) => {
      setFirefoxTabs(prev => [...prev, tab])
    }
    
    browserTabs.onCreated.addListener(handleTabCreated)
    return () => browserTabs.onCreated.removeListener(handleTabCreated)
  }, [])

  const createTab = async (url: string) => {
    const tab = await browserTabs.create({ url, active: true })
    return tab.id
  }

  // No webview rendering - Firefox handles tabs
  return (
    <div>
      {/* Display tab list, but Firefox renders actual tabs */}
      {firefoxTabs.map(tab => (
        <div key={tab.id} onClick={() => browserTabs.switch(tab.id)}>
          {tab.title || tab.url}
        </div>
      ))}
    </div>
  )
}
```

---

## Key Differences Summary

| Aspect | Electron | WebExtensions |
|--------|----------|---------------|
| **Tab Rendering** | Custom `<webview>` | Native Firefox tabs |
| **UI Control** | Full control | Limited to extension pages |
| **IPC** | `ipcRenderer`/`ipcMain` | `browser.runtime.sendMessage` |
| **Storage** | `localStorage` (sync) | `browser.storage.local` (async) |
| **Native Code** | ✅ Supported | ❌ Not supported |
| **Window Management** | Full control | Limited API |
| **File System** | ✅ Full access | ❌ Not available |
| **Build** | Electron app | Static HTML + manifest |

