# Forkyy Firefox WebExtension

Firefox WebExtension version of Forkyy, replacing Electron with Tor Browser-compatible extension.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture.

## Quick Start

### Build

```bash
# Build the extension
node webextension/scripts/build-extension.js
```

This will:
1. Build your Next.js app as static export
2. Copy files to `webextension/newtab/app/` and `webextension/sidebar/app/`
3. Prepare manifest and entry files

### Load in Firefox

#### Option 1: Temporary Load (Development)

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select `webextension/manifest.json`

#### Option 2: Web-Ext (Recommended for Development)

```bash
npm install -g web-ext

# Run extension in Firefox
web-ext run --source-dir webextension

# Or with auto-reload
web-ext run --source-dir webextension --reload
```

## Project Structure

```
webextension/
├── manifest.json              # Extension manifest
├── background/
│   └── background.js         # Background service worker
├── newtab/
│   ├── index.html            # New Tab page entry
│   └── app/                  # Built React app (from scripts/build-extension.js)
├── sidebar/
│   ├── index.html            # Sidebar entry
│   └── app/                  # Built React app (shared)
├── lib/
│   └── browser-api.ts        # Browser API wrapper
└── scripts/
    └── build-extension.js    # Build script
```

## Development Workflow

1. **Make changes** to your React/Next.js app
2. **Build extension**: `node webextension/scripts/build-extension.js`
3. **Reload extension** in Firefox (web-ext auto-reloads)
4. **Test** New Tab page and Sidebar

## Key Files

- `manifest.json` - Extension configuration
- `background/background.js` - Handles browser.tabs API
- `lib/browser-api.ts` - Wrapper for WebExtensions APIs (use in React)
- `newtab/index.html` - New Tab page entry point
- `sidebar/index.html` - Sidebar entry point

## API Usage in React

Replace Electron IPC calls with:

```typescript
import { tabs, storage } from '@/lib/browser-api'

// Create tab
const tab = await tabs.create({ url: 'https://example.com' })

// Get all tabs
const allTabs = await tabs.getAll()

// Storage
await storage.set({ key: 'value' })
const data = await storage.get('key')
```

## Constraints

✅ **Allowed:**
- Static React app
- WebExtensions APIs
- Browser storage (5MB limit)
- Messaging between UI and background

❌ **Not Allowed:**
- Node.js/Electron APIs
- Native modules
- Server-side code (Next.js API routes)
- File system access
- OS-level integrations
- Custom browser chrome/tabs

## Migration Guide

See [ELECTRON_TO_WEBEXTENSIONS.md](./ELECTRON_TO_WEBEXTENSIONS.md) for detailed Electron → WebExtensions mapping.

## Troubleshooting

### Extension doesn't load
- Check `manifest.json` syntax
- Ensure all referenced files exist
- Check Firefox console for errors

### React app doesn't load
- Check build output in `newtab/app/` or `sidebar/app/`
- Verify asset paths are correct
- Check browser console for 404s

### Tabs API not working
- Ensure `tabs` permission in manifest
- Check background script console
- Verify message format matches background handler

## License

Same as main project (Apache-2.0)

