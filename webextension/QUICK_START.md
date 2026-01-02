# Quick Start Guide

## What Was Created

Complete Firefox WebExtension skeleton for porting your Electron app:

1. **manifest.json** - Extension configuration (Tor-compatible)
2. **background/background.js** - Service worker handling browser APIs
3. **newtab/index.html** - New Tab page entry point
4. **sidebar/index.html** - Sidebar entry point
5. **lib/browser-api.ts** - Browser API wrapper (replaces Electron IPC)
6. **lib/useBrowserTabs.ts** - React hook for tab management
7. **lib/useBrowserStorage.ts** - React hook for storage
8. **scripts/build-extension.js** - Build script
9. **next.config.extension.js** - Next.js config for static export

## Step 1: Add Build Script to package.json

Add this to your `package.json`:

```json
{
  "scripts": {
    "build:extension": "node webextension/scripts/build-extension.js"
  }
}
```

## Step 2: Copy Browser API Files to Your App

Copy these files to your React app so they're included in the build:

```bash
# Copy browser API wrapper
cp webextension/lib/browser-api.ts lib/browser-api.ts

# Copy React hooks
cp webextension/lib/useBrowserTabs.ts hooks/useBrowserTabs.ts
cp webextension/lib/useBrowserStorage.ts hooks/useBrowserStorage.ts
```

**Note:** These need to be part of your Next.js build, not separate extension files.

## Step 3: Update Your Components

### Replace Electron IPC Calls

**Before:**
```typescript
// Electron
if (typeof window !== 'undefined' && (window as any).electron) {
  await (window as any).electron.browser.createTab(url)
}
```

**After:**
```typescript
// WebExtensions
import { tabs } from '@/lib/browser-api'

const handleCreateTab = async (url: string) => {
  await tabs.create({ url, active: true })
}
```

### Use React Hooks

**For tab management:**
```typescript
import { useBrowserTabs } from '@/hooks/useBrowserTabs'

function MyComponent() {
  const { tabs, activeTab, createTab, closeTab } = useBrowserTabs()
  
  return (
    <div>
      {tabs.map(tab => (
        <div key={tab.id} onClick={() => closeTab(tab.id)}>
          {tab.title}
        </div>
      ))}
    </div>
  )
}
```

**For storage:**
```typescript
import { useBrowserStorage } from '@/hooks/useBrowserStorage'

function MyComponent() {
  const [value, setValue] = useBrowserStorage('myKey', 'default')
  
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
```

## Step 4: Build the Extension

```bash
npm run build:extension
```

This will:
1. Build your Next.js app as static export
2. Copy files to `webextension/newtab/app/` and `webextension/sidebar/app/`

## Step 5: Load in Firefox

### Development (Temporary)

1. Open Firefox
2. Go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select `webextension/manifest.json`

### With web-ext (Recommended)

```bash
npm install -g web-ext
cd webextension
web-ext run --reload
```

## Step 6: Test

1. Open a new tab - your React app should load
2. Open sidebar - same React app should load
3. Test tab creation/navigation
4. Test storage (should persist across sessions)

## Key Changes Needed

### 1. Remove Electron Dependencies

- Remove `<webview>` components
- Remove Electron IPC calls
- Remove native module dependencies

### 2. Update Tab Management

- Use `browser.tabs` API instead of custom webviews
- Firefox manages tab rendering
- Your UI shows tab list/metadata only

### 3. Static Export Only

- No Next.js API routes
- No server-side rendering
- Everything must be client-side

### 4. Update Asset Paths

Your React app will be loaded from `moz-extension://` URLs. Make sure:
- All assets use relative paths
- No absolute URLs to localhost
- Images/CSS load correctly

## Troubleshooting

### Extension doesn't load
- Check browser console: `about:debugging` → "Inspect" your extension
- Verify `manifest.json` syntax
- Ensure all files exist

### React app doesn't render
- Check console for 404s
- Verify build output exists in `newtab/app/`
- Check asset paths are correct

### Tabs API not working
- Check background script console
- Verify `tabs` permission in manifest
- Ensure messages match background handler format

### TypeScript errors
- Install `@types/firefox-webext-browser`:
  ```bash
  npm install --save-dev @types/firefox-webext-browser
  ```

## Next Steps

1. Migrate your components one by one
2. Test each feature as you port it
3. See [ELECTRON_TO_WEBEXTENSIONS.md](./ELECTRON_TO_WEBEXTENSIONS.md) for API mapping
4. Refer to [ARCHITECTURE.md](./ARCHITECTURE.md) for structure

