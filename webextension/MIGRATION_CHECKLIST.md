# Migration Checklist

## Pre-Migration Analysis

- [ ] List all Electron dependencies in `package.json`
- [ ] Find all `electron` imports in codebase
- [ ] Find all `ipcRenderer`/`ipcMain` usage
- [ ] Find all `<webview>` components
- [ ] List all native module dependencies
- [ ] Identify Next.js API routes
- [ ] List all file system operations
- [ ] Identify OS-level integrations (eye tracking, etc.)

## File Preparation

- [ ] Copy `lib/browser-api.ts` to your app's `lib/` directory
- [ ] Copy `hooks/useBrowserTabs.ts` to your app's `hooks/` directory
- [ ] Copy `hooks/useBrowserStorage.ts` to your app's `hooks/` directory
- [ ] Add build script to `package.json`: `"build:extension": "node webextension/scripts/build-extension.js"`
- [ ] Install types: `npm install --save-dev @types/firefox-webext-browser`

## Code Migration

### Tab Management

- [ ] Replace `<webview>` components with tab list UI
- [ ] Update `WebViewBrowser.tsx` to use `useBrowserTabs` hook
- [ ] Replace `createTab()` to use `browser.tabs.create()`
- [ ] Replace `closeTab()` to use `browser.tabs.remove()`
- [ ] Replace `navigate()` to use `browser.tabs.update()`
- [ ] Update tab event listeners to use `browser.tabs.on*`

### IPC Communication

- [ ] Remove all `ipcRenderer.invoke()` calls
- [ ] Replace with `browser.runtime.sendMessage()` or direct API calls
- [ ] Remove all `ipcMain.handle()` from Electron code
- [ ] Update background script to handle messages

### Storage

- [ ] Replace `localStorage` with `browser.storage.local`
- [ ] Update all sync storage calls to async
- [ ] Update components to use `useBrowserStorage` hook
- [ ] Test storage persistence

### Window Management

- [ ] Remove `BrowserWindow` usage
- [ ] Remove window lifecycle code
- [ ] Remove custom window controls
- [ ] Accept Firefox's window management

### Components to Update

- [ ] `components/browser/WebViewBrowser.tsx`
- [ ] `components/browser/browser-client-enhanced.tsx`
- [ ] `components/browser/browser-view.tsx`
- [ ] Any component using `(window as any).electron`
- [ ] Any component using Electron IPC

### Features to Remove/Disable

- [ ] Eye tracking (cannot be ported)
- [ ] Cursor tracking (limited)
- [ ] Native module integrations
- [ ] File system access
- [ ] Next.js API routes
- [ ] Server-side rendering

## Build & Configuration

- [ ] Update `next.config.mjs` for static export
- [ ] Add `output: 'export'` to Next.js config
- [ ] Set `images.unoptimized: true`
- [ ] Remove server-side dependencies
- [ ] Test static export builds

## Testing

- [ ] Build extension successfully
- [ ] Load extension in Firefox
- [ ] Test New Tab page loads
- [ ] Test Sidebar loads
- [ ] Test tab creation
- [ ] Test tab closing
- [ ] Test tab navigation
- [ ] Test storage persistence
- [ ] Test tab event listeners
- [ ] Test on multiple pages
- [ ] Test extension reload

## Tor Browser Compatibility

- [ ] Test in Tor Browser
- [ ] Verify no external network requests
- [ ] Verify all APIs are Tor-safe
- [ ] Test .onion site compatibility (if applicable)

## Documentation

- [ ] Update README with extension instructions
- [ ] Document removed features
- [ ] Document API changes
- [ ] Add troubleshooting section

## Deployment

- [ ] Package extension for distribution
- [ ] Sign extension (if distributing)
- [ ] Test installation from package
- [ ] Create update mechanism (if needed)

