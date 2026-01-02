# Firefox WebExtension Architecture

## Directory Structure

```
webextension/
├── manifest.json                 # Extension manifest
├── background/
│   └── background.js            # Background script (service worker)
├── newtab/
│   ├── index.html               # New Tab page entry
│   └── app/                     # Your React app (built static files)
│       ├── _next/               # Next.js static assets
│       ├── index.html
│       └── ...
├── sidebar/
│   ├── index.html               # Sidebar entry
│   └── app/                     # Same React app (can share)
│       └── ...
├── content/
│   └── content.js               # Optional: content script for web pages
├── public/                      # Static assets
│   └── icons/
└── scripts/
    └── build-extension.js       # Build script
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Firefox Browser                       │
│                                                          │
│  ┌──────────────────┐        ┌──────────────────┐     │
│  │   New Tab Page   │        │     Sidebar      │     │
│  │  (moz-extension) │        │  (moz-extension) │     │
│  │                  │        │                  │     │
│  │  Your React App  │◄───────┤  Your React App  │     │
│  │  (Static HTML)   │  Shared│  (Static HTML)   │     │
│  └────────┬─────────┘  State └────────┬─────────┘     │
│           │                            │               │
│           │  browser.runtime.sendMessage               │
│           │  browser.storage.local                     │
│           │                            │               │
│           └────────────┬───────────────┘               │
│                        │                               │
│  ┌─────────────────────▼─────────────────────────┐   │
│  │         Background Script (Service Worker)    │   │
│  │                                                │   │
│  │  - Handles browser.tabs API                   │   │
│  │  - Manages extension state                    │   │
│  │  - Coordinates UI ↔ Browser                   │   │
│  └────────────────────────────────────────────────┘   │
│                        │                               │
│           browser.tabs API                            │
│                        │                               │
│  ┌─────────────────────▼─────────────────────────┐   │
│  │            Firefox Tabs (Browser UI)          │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Communication Flow

### UI → Background
```javascript
// From your React app (New Tab or Sidebar)
browser.runtime.sendMessage({
  action: 'createTab',
  url: 'https://example.com'
})
```

### Background → UI
```javascript
// From background script
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Notify all UI pages
  browser.runtime.sendMessage({
    action: 'tabUpdated',
    tabId,
    changeInfo,
    tab
  }).catch(() => {
    // UI page not open - ignore
  })
})
```

### State Persistence
```javascript
// Save state
browser.storage.local.set({ tabs: [...] })

// Load state
const { tabs } = await browser.storage.local.get('tabs')
```

## How React App is Loaded

### New Tab Page
1. User opens new tab
2. Firefox loads `chrome_url_overrides.newtab` → `newtab/index.html`
3. `index.html` loads your React app from `moz-extension://<extension-id>/newtab/app/index.html`
4. React app runs, communicates with background via `browser.runtime`

### Sidebar
1. User opens sidebar (via extension button or API)
2. Firefox loads `sidebar/index.html`
3. Same React app loads (can be shared code)
4. Communicates with background same way

## Key Constraints

✅ **Allowed:**
- Static React app (no SSR, no API routes)
- WebExtension APIs (`browser.*`)
- `moz-extension://` URLs
- Browser storage APIs
- Messaging between UI and background

❌ **Not Allowed:**
- Node.js/Electron APIs
- Native modules
- Server-side code (Next.js API routes won't work)
- Direct file system access
- OS-level integrations

