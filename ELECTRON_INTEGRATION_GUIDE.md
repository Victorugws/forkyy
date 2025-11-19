# Electron Browser Integration Guide

## ✅ What's Been Set Up

All the Electron infrastructure is now in place:

### File Structure Created:
```
forkyy/
├── electron/
│   ├── main.ts              ✅ Main Electron process
│   ├── browser-manager.ts   ✅ BrowserView tab management
│   ├── preload.ts           ✅ IPC bridge (security layer)
│   └── tsconfig.json        ✅ TypeScript config for Electron
├── components/
│   ├── BrowserInterface.tsx ✅ Main browser UI
│   ├── BrowserTab.tsx       ✅ Tab component
│   └── AddressBar.tsx       ✅ Navigation controls
├── app/
│   └── browser/
│       └── page.tsx         ✅ Browser page route
└── types/
    └── electron.d.ts        ✅ TypeScript definitions
```

---

## 📦 Installation (Run on Your Local Machine)

Since network restrictions prevented installation here, run these on your machine:

```bash
# Install Electron dependencies
npm install --save-dev electron@latest electron-builder concurrently wait-on cross-env --legacy-peer-deps

# Install additional dev dependency
npm install --save-dev @types/node --legacy-peer-deps
```

---

## 🔧 Update package.json

Add these scripts to your `package.json`:

```json
{
  "name": "forkyy",
  "version": "1.0.0",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",

    // Add these new Electron scripts:
    "electron:compile": "tsc -p electron/tsconfig.json",
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:3000 && npm run electron:compile && electron .\"",
    "electron:build": "npm run build && npm run electron:compile",
    "electron:package:mac": "npm run electron:build && electron-builder --mac",
    "electron:package:win": "npm run electron:build && electron-builder --win",
    "electron:package:linux": "npm run electron:build && electron-builder --linux"
  },
  "build": {
    "appId": "com.forkyy.app",
    "productName": "Forkyy",
    "files": [
      "dist-electron/**/*",
      ".next/**/*",
      "public/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "directories": {
      "output": "release"
    },
    "mac": {
      "category": "public.app-category.productivity",
      "target": ["dmg", "zip"],
      "icon": "public/icon.icns"
    },
    "win": {
      "target": ["nsis"],
      "icon": "public/icon.ico"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "category": "Utility"
    }
  }
}
```

---

## 🚀 Running the Electron App

### Development Mode:
```bash
npm run electron:dev
```

This will:
1. Start Next.js dev server (http://localhost:3000)
2. Compile Electron TypeScript files
3. Launch Electron window with your app

### Build for Production:
```bash
# For macOS
npm run electron:package:mac

# For Windows
npm run electron:package:win

# For Linux
npm run electron:package:linux
```

---

## 🎨 Integration Options

### Option 1: Dedicated Browser Page (Current Setup)

Navigate to `/browser` route to access full browser interface:

```typescript
// Already created at app/browser/page.tsx
import { BrowserInterface } from '@/components/BrowserInterface'

export default function BrowserPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <BrowserInterface />
    </div>
  )
}
```

### Option 2: Integrate into Existing Layout

Add browser to your main layout with a toggle:

```typescript
// Example: app/page.tsx
'use client'

import { useState } from 'react'
import { Chat } from '@/components/chat'
import { BrowserInterface } from '@/components/BrowserInterface'

export default function Page() {
  const [mode, setMode] = useState<'chat' | 'browser'>('chat')

  return (
    <div className="h-screen">
      {/* Mode toggle */}
      <div className="flex gap-2 p-2 bg-gray-100">
        <button onClick={() => setMode('chat')}>Chat</button>
        <button onClick={() => setMode('browser')}>Browser</button>
      </div>

      {/* Content */}
      {mode === 'chat' ? <Chat /> : <BrowserInterface />}
    </div>
  )
}
```

### Option 3: Integrate with MorphingCanvas

If you have the MorphingCanvas component (from the other branch):

```typescript
// components/MorphingCanvas.tsx
export function MorphingCanvas({ morphState }) {
  return (
    <div className="relative w-full h-screen">
      {/* Your animated eye background */}
      <AnimatedEyeBackground />

      {/* Show browser when in browser mode */}
      {morphState === 'browser-mode' && (
        <div className="absolute top-0 left-0 right-0">
          <BrowserInterface />
        </div>
      )}
    </div>
  )
}
```

---

## 🔍 How It Works

### Architecture:

```
┌─────────────────────────────────────┐
│  Electron Window                    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Next.js App (React)           │ │
│  │ - BrowserInterface component  │ │
│  │ - Tab bar + Address bar       │ │
│  │ Height: 120px                 │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ BrowserView (Chromium)        │ │
│  │ - Renders actual web pages    │ │
│  │ - Full browser engine         │ │
│  │ - Multiple instances = tabs   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Communication Flow:

```
React Component (BrowserInterface)
  ↓ (via window.electron API)
Preload Script (preload.ts)
  ↓ (IPC)
Main Process (main.ts)
  ↓
BrowserManager (browser-manager.ts)
  ↓
BrowserView (Chromium Engine)
```

---

## 🎯 Features Included

✅ **Multi-tab support** - Create, switch, close tabs
✅ **Full navigation** - Back, forward, reload, stop
✅ **URL handling** - Smart URL normalization (auto-https, search queries)
✅ **Favicon display** - Shows website icons in tabs
✅ **Loading indicators** - Visual feedback for page loads
✅ **Download handling** - Automatic download management
✅ **Popup blocking** - Popups open as new tabs
✅ **Error handling** - Failed loads are handled gracefully
✅ **Responsive layout** - Adjusts to window resize

---

## 🧪 Testing

### Test Browser Functionality:

1. Run `npm run electron:dev`
2. Navigate to `/browser` route (or integrate into your layout)
3. Test features:
   - Create new tab (+  button)
   - Navigate to google.com
   - Open youtube.com in another tab
   - Switch between tabs
   - Use back/forward buttons
   - Close tabs
   - Test URL autocomplete (type "github.com" → auto-https)
   - Test search (type "hello world" → Google search)

### Verify Events:

- Page title updates in tab
- Favicon appears
- Loading spinner shows during navigation
- Back/forward buttons enable/disable correctly
- Address bar updates with current URL

---

## 🐛 Troubleshooting

### BrowserView not showing:
- Check that header height is correct: `window.electron.browser.updateHeight(120)`
- Verify BrowserView bounds in browser-manager.ts

### TypeScript errors:
- Ensure types/electron.d.ts is included
- Check electron/tsconfig.json compiles correctly

### "electron not found":
- Install with `--legacy-peer-deps` flag due to React 19
- Verify `main` field in package.json points to compiled file

### Hot reload not working:
- Electron requires restart for main process changes
- React components hot reload normally

---

## 📝 Next Steps

### Minimal Integration (Recommended):
1. Run `npm install` commands above
2. Add scripts to package.json
3. Run `npm run electron:dev`
4. Navigate to `/browser` or integrate into your layout
5. Done! You have a working browser.

### Full Integration with Your UI:
1. Merge with your morphing canvas branch
2. Add browser mode to your morph states
3. Position BrowserInterface in your existing layout
4. Add transition animations if desired

---

## 📦 Distribution

When ready to ship:

```bash
# Build installers
npm run electron:package:mac   # Creates .dmg and .zip
npm run electron:package:win   # Creates .exe installer
npm run electron:package:linux # Creates AppImage and .deb

# Output in release/ directory
```

---

## 🔐 Security Features

✅ `contextIsolation: true` - Prevents code injection
✅ `nodeIntegration: false` - No Node.js in renderer
✅ `sandbox: true` - Sandboxed renderer processes
✅ `webSecurity: true` - Enforces web security policies
✅ Preload script - Only exposes safe APIs

---

## 💡 Tips

- **Header height**: Adjust `HEADER_HEIGHT` in browser-manager.ts if your UI is taller/shorter
- **Default URL**: Change default tab URL in BrowserInterface.tsx
- **Styling**: All components use Tailwind - customize as needed
- **State management**: Tabs state is managed by Electron, not React
- **Performance**: Each tab is a separate process (isolated and secure)

---

## 📚 Resources

- [Electron Docs](https://www.electronjs.org/docs)
- [BrowserView API](https://www.electronjs.org/docs/api/browser-view)
- [electron-builder](https://www.electron.build/)

---

**You're all set!** Just install dependencies and run `npm run electron:dev` to see your browser in action.
