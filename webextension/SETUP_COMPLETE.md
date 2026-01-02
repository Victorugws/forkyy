# Setup Complete! ✅

Initial setup for Firefox WebExtension migration is complete.

## What Was Done

1. ✅ **Added build script** to `package.json`: `extension:build`
2. ✅ **Installed TypeScript types**: `@types/firefox-webext-browser`
3. ✅ **Created browser API wrapper**: `lib/browser-api.ts`
4. ✅ **Created React hooks**:
   - `hooks/useBrowserTabs.ts` - Tab management hook
   - `hooks/useBrowserStorage.ts` - Storage management hook
5. ✅ **Created extension config**: `next.config.extension.mjs`
6. ✅ **Updated build script** to use extension config

## Files Created

### In Your App (`lib/` and `hooks/`)
- `lib/browser-api.ts` - Browser API wrapper (replaces Electron IPC)
- `hooks/useBrowserTabs.ts` - React hook for tabs
- `hooks/useBrowserStorage.ts` - React hook for storage

### In Extension Directory (`webextension/`)
- All extension files from previous setup
- Build script updated

## Next Steps

### 1. Test the Build (5 minutes)

```bash
npm run extension:build
```

This should:
- Build your Next.js app as static export
- Copy files to `webextension/newtab/app/` and `webextension/sidebar/app/`

### 2. Load Extension in Firefox (2 minutes)

1. Open Firefox
2. Go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select `webextension/manifest.json`

### 3. Start Migrating Components (1-2 weeks)

See `webextension/MIGRATION_CHECKLIST.md` for step-by-step migration.

Key files to update:
- `components/browser/WebViewBrowser.tsx` - Replace webview with tab list
- `components/browser/browser-client-enhanced.tsx` - Update to use hooks
- Any component using `(window as any).electron`

### 4. Example Migration

**Before (Electron):**
```tsx
if (typeof window !== 'undefined' && (window as any).electron) {
  await (window as any).electron.browser.createTab(url)
}
```

**After (WebExtension):**
```tsx
import { tabs } from '@/lib/browser-api'
await tabs.create({ url, active: true })
```

Or use the hook:
```tsx
import { useBrowserTabs } from '@/hooks/useBrowserTabs'

const { createTab } = useBrowserTabs()
await createTab(url)
```

## Important Notes

### ✅ Works
- Static React app
- Tab management via browser.tabs API
- Storage via browser.storage.local
- New Tab page
- Sidebar

### ❌ Doesn't Work
- `<webview>` components (use native Firefox tabs)
- Electron IPC (use browser.runtime.sendMessage)
- Native modules
- Next.js API routes (must be static)
- Eye tracking
- OS-level integrations

## Documentation

- `webextension/QUICK_START.md` - Quick reference
- `webextension/ARCHITECTURE.md` - Detailed architecture
- `webextension/ELECTRON_TO_WEBEXTENSIONS.md` - API mapping
- `webextension/MIGRATION_CHECKLIST.md` - Step-by-step checklist

## Troubleshooting

### Build fails
- Check that Next.js config allows static export
- Verify `next.config.extension.mjs` exists
- Check console for specific errors

### Extension doesn't load
- Check Firefox console (`about:debugging` → Inspect)
- Verify `manifest.json` syntax
- Ensure all files exist

### TypeScript errors
- Types are installed: `@types/firefox-webext-browser`
- Make sure to import from `@/lib/browser-api`

## Ready to Build!

Run `npm run extension:build` to test the setup.

