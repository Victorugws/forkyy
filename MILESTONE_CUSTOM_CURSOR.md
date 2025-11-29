# Custom Cursor Implementation Milestone

## Overview
Successfully implemented a custom TargetCursor that follows the system cursor across both internal React pages and external webview content (e.g., YouTube).

## Current Implementation

### Architecture

The implementation uses a **transparent overlay window** approach with three main components:

1. **Cursor Overlay Window** (`electron/main.ts`)
   - A frameless, transparent, always-on-top Electron window
   - Covers the entire screen
   - Click-through enabled via `setIgnoreMouseEvents(true, { forward: true })`
   - Displays the custom cursor HTML/CSS
   - Level: `screen-saver` for highest priority

2. **React TargetCursor Component** (`components/TargetCursor/`)
   - Custom cursor visual (spinning corners effect)
   - Renders inside the overlay window
   - Positioned via CSS transforms based on mouse coordinates

3. **IPC Communication** (`electron/main.ts` + `electron/preload.ts`)
   - Bidirectional communication between main process and overlay
   - Sends cursor position updates to overlay window

### How It Works

#### On Internal Pages (React App)
1. Main window tracks mouse movement via React event listeners
2. Mouse coordinates sent to Electron main process via IPC (`cursor-move`)
3. Main process forwards coordinates to overlay window
4. Overlay positions the TargetCursor at the coordinates

#### On External Pages (Webview - e.g., YouTube)
1. Webview preload script (`electron/webview-preload-simple.js`) injects into external pages
2. Preload script tracks `mousemove` events inside the webview
3. Coordinates sent to host via `ipcRenderer.sendToHost('cursor-move')`
4. Host (React) forwards to main process
5. Main process updates overlay position

**Critical Configuration:**
- Webview must have `sandbox="false"` attribute
- Without this, preload scripts don't execute in Electron 28+

### File Structure

```
electron/
├── main.ts                        # Main Electron process, overlay creation
├── preload.ts                     # Main window preload
├── webview-preload-simple.js      # Webview preload (plain JS)
├── cursorOverlay.html             # Overlay window HTML
├── cursorOverlay.js               # Overlay window script
└── cursorOverlay.css              # Overlay window styles

components/
├── TargetCursor/                  # React cursor component
└── browser/
    └── browser-view.tsx           # Webview with sandbox="false"
```

### Key Implementation Details

#### 1. Overlay Window Configuration
```typescript
// electron/main.ts
const cursorOverlay = new BrowserWindow({
  transparent: true,
  frame: false,
  hasShadow: false,
  alwaysOnTop: true,
  skipTaskbar: true,
  resizable: false,
  focusable: false,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  }
})

// CRITICAL: Enable click-through
cursorOverlay.setIgnoreMouseEvents(true, { forward: true })
cursorOverlay.setAlwaysOnTop(true, 'screen-saver')
```

#### 2. Click-Through Enforcement
```typescript
// Re-apply after page loads
cursorOverlay.webContents.on('did-finish-load', () => {
  cursorOverlay?.setIgnoreMouseEvents(true, { forward: true })
})

// Re-enforce every 100ms (belt & suspenders)
setInterval(() => {
  if (cursorOverlay && !cursorOverlay.isDestroyed()) {
    cursorOverlay.setIgnoreMouseEvents(true, { forward: true })
  }
}, 100)
```

#### 3. Webview Configuration
```tsx
// components/browser/browser-view.tsx
<webview
  ref={browserRef}
  src={url}
  preload={webviewPreloadPath}
  allowpopups="true"
  disablewebsecurity="true"
  partition="persist:webview"
  sandbox="false"  // CRITICAL for preload execution
  webpreferences="contextIsolation=no, nodeIntegration=yes, sandbox=no"
/>
```

#### 4. Webview Preload Script
```javascript
// electron/webview-preload-simple.js
const { ipcRenderer } = require('electron'); // Direct require, NOT window.require

window.addEventListener('mousemove', (e) => {
  const data = {
    x: e.screenX,
    y: e.screenY,
    clientX: e.clientX,
    clientY: e.clientY
  };
  ipcRenderer.sendToHost('cursor-move', data);
}, { passive: true });
```

#### 5. IPC Communication Flow
```
Webview (YouTube)
  → ipcRenderer.sendToHost('cursor-move')
    → React (browser-view.tsx)
      → window.electron.sendCursorMove()
        → Electron Main Process
          → cursorOverlay.webContents.send('cursor-move')
            → Overlay Window
              → TargetCursor position update
```

### What Works ✅

1. **System Cursor Visible**: Native OS cursor remains visible at all times
2. **Custom Cursor Follows on Internal Pages**: TargetCursor tracks mouse on React pages (home, search, etc.)
3. **Custom Cursor Follows on External Pages**: TargetCursor tracks mouse on YouTube, Google, etc.
4. **Clicking Works Everywhere**: Overlay is fully click-through, no interaction blocking
5. **Overlay Always On Top**: Custom cursor always visible above all content

### Known Issues ⚠️

1. **Cursor Disappears When Maximized**
   - When the Electron window is maximized, the TargetCursor disappears
   - Likely cause: Overlay window bounds don't update with main window size
   - Solution: Need to add resize/maximize event handlers to update overlay bounds
   - **Status**: Not yet fixed (reverted previous attempt)

### Configuration Flags

```typescript
// electron/main.ts
const ENABLE_CURSOR_OVERLAY = true  // Toggle entire overlay system
```

### Performance Considerations

- Mouse events throttled to prevent excessive IPC calls
- Passive event listeners for better scroll performance
- Overlay re-enforcement runs every 100ms (minimal overhead)

### Debug Information

#### Logs to Check

**Main Window Console:**
```
[Browser] Cursor overlay path: /path/to/cursorOverlay.html
[Browser] Webview preload path: /path/to/webview-preload-simple.js
```

**Overlay Window Console:**
```
[Overlay] Cursor overlay initialized
[Overlay] Received cursor update: {x: 500, y: 300}
```

**Webview Console (YouTube):**
```
[Webview Preload Simple] ✅ Script executing for: https://www.youtube.com/
[Webview Preload Simple] ✅ ipcRenderer loaded!
[Webview Preload Simple] ✅ Event listeners attached!
[Webview Preload Simple] Sending cursor-move: {x: ..., y: ...}
```

**Main Process Console:**
```
[Main] Cursor overlay loaded and click-through enabled
```

### Testing Checklist

- [x] Custom cursor visible on home page
- [x] Custom cursor follows mouse on home page
- [x] Buttons clickable on home page
- [x] Custom cursor follows mouse on YouTube
- [x] Video thumbnails clickable on YouTube
- [x] Scrolling works on all pages
- [x] System cursor remains visible
- [ ] Custom cursor works after maximize
- [ ] Custom cursor works after unmaximize

### Next Steps

1. Fix maximize screen disappearance issue
2. Optimize overlay bounds updating
3. Consider adding cursor hide on window blur
4. Add more visual states (click, hover)

---

**Date**: 2025-11-28
**Electron Version**: 28+
**Status**: Milestone Achieved (with one known issue)
