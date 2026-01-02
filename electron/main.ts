import { app, BrowserWindow, ipcMain, screen, session } from 'electron'
import { join } from 'path'
import { getEyeTrackingService } from './eye-tracking-service'

let mainWindow: BrowserWindow | null = null

function getWindowContentMetrics(window: BrowserWindow) {
  const windowBounds = window.getBounds()
  const contentBounds = window.getContentBounds()

  return {
    windowBounds,
    contentBounds,
    offsetX: contentBounds.x - windowBounds.x,
    offsetY: contentBounds.y - windowBounds.y
  }
}

const isDev = process.env.NODE_ENV === 'development'

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    titleBarStyle: 'hiddenInset', // macOS style
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      webviewTag: true // Enable webview tag for embedded browsing
    }
  })

  // Webview tags are now managed in React, no need for BrowserManager

  // Load your Next.js app
  if (isDev) {
    await mainWindow.loadURL('http://localhost:3000')
    
    // Suppress CSP warning in development (expected due to Next.js hot reloading)
    // Inject script to filter console warnings after page loads
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow?.webContents.executeJavaScript(`
        (function() {
          const originalWarn = console.warn;
          console.warn = function(...args) {
            const message = args.join(' ');
            if (message.includes('Electron Security Warning') && message.includes('Content-Security-Policy')) {
              // Suppress this specific warning in development
              return;
            }
            originalWarn.apply(console, args);
          };
        })();
      `).catch(() => {
        // Ignore errors if script injection fails
      })
    })
    
    mainWindow.webContents.openDevTools()
  } else {
    await mainWindow.loadFile(join(__dirname, '../.next/server/app/index.html'))
  }

  // Setup cursor position tracking for target cursor
  setupCursorTrackingIPC()
}

// Handle getting webview preload path
ipcMain.handle('get-webview-preload-path', () => {
  const { app } = require('electron')
  const path = require('path')
  const isDev = process.env.NODE_ENV === 'development'

  // Use the simple JS version (no TypeScript compilation needed)
  let filePath: string
  if (isDev) {
    // In dev, use the source JS file directly
    filePath = path.resolve(__dirname, '..', 'electron', 'webview-preload-simple.js')
  } else {
    filePath = path.join(app.getAppPath(), 'electron', 'webview-preload-simple.js')
  }

  console.log('[Main] Webview preload absolute path:', filePath)

  // Convert to file:// URL format (required by webview preload attribute)
  // On Windows, we need to convert backslashes to forward slashes
  const normalizedPath = process.platform === 'win32'
    ? filePath.replace(/\\/g, '/')
    : filePath

  const fileUrl = `file://${normalizedPath}`
  console.log('[Main] Webview preload file URL:', fileUrl)

  return fileUrl
})

// Setup cursor position tracking for target cursor
function setupCursorTrackingIPC() {
  // Listen for cursor position requests from webviews
  // This allows webviews to get the actual cursor position without coordinate conversion issues
  ipcMain.on('webview-cursor-position', (event) => {
    if (!mainWindow) return
    const point = screen.getCursorScreenPoint()
    const contentBounds = mainWindow.getContentBounds()
    
    // Convert screen coordinates to window content coordinates
    const windowX = point.x - contentBounds.x
    const windowY = point.y - contentBounds.y
    
    // Send back to the webview that requested it
    event.reply('cursor-position-reply', { x: windowX, y: windowY })
  })
}

function setupEyeTrackingIPC() {
  const eyeTracking = getEyeTrackingService()

  // Enable/disable eye tracking
  ipcMain.handle('eye-tracking:set-enabled', async (_event, enabled: boolean) => {
    await eyeTracking.setEnabled(enabled)
    return eyeTracking.isEnabled()
  })

  // Get eye tracking status
  ipcMain.handle('eye-tracking:is-enabled', () => {
    return eyeTracking.isEnabled()
  })

  // Update configuration
  ipcMain.handle('eye-tracking:update-config', (_event, config: any) => {
    eyeTracking.updateConfig(config)
    return eyeTracking.getConfig()
  })

  // Get configuration
  ipcMain.handle('eye-tracking:get-config', () => {
    return eyeTracking.getConfig()
  })

  // Move cursor from gaze data (normalized 0-1 coordinates)
  ipcMain.on('eye-tracking:move-cursor', async (_event, { x, y }: { x: number; y: number }) => {
    await eyeTracking.moveCursorFromGaze(x, y)
  })

  // Move cursor to absolute position
  ipcMain.on('eye-tracking:move-cursor-to', async (_event, { x, y }: { x: number; y: number }) => {
    await eyeTracking.moveCursorTo(x, y)
  })

  // Get current cursor position
  ipcMain.handle('eye-tracking:get-cursor-position', async () => {
    return await eyeTracking.getCursorPosition()
  })

  // Perform click
  ipcMain.on('eye-tracking:click', async () => {
    await eyeTracking.click()
  })

  // Perform double click
  ipcMain.on('eye-tracking:double-click', async () => {
    await eyeTracking.doubleClick()
  })

  // Reset eye tracking
  ipcMain.handle('eye-tracking:reset', () => {
    eyeTracking.reset()
  })
}

// Set up Content Security Policy before app is ready
// This must be done before creating windows
app.whenReady().then(() => {
  // Set up eye tracking IPC handlers first, before creating window
  // This ensures handlers are registered before any components try to use them
  setupEyeTrackingIPC()
  // Set Content Security Policy to fix security warnings
  // Note: 'unsafe-eval' is required in development for Next.js hot reloading
  // This warning will not appear in production builds
  const defaultSession = session.defaultSession
  
  defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Only set CSP for main document requests (not subresources)
    if (details.resourceType === 'mainFrame' || details.resourceType === 'subFrame') {
      const csp = isDev
        ? // Development: Allow unsafe-eval for Next.js hot reloading
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http://localhost:* https:; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https:; " +
          "style-src 'self' 'unsafe-inline' http://localhost:* https:; " +
          "img-src 'self' data: blob: http://localhost:* https:; " +
          "font-src 'self' data: http://localhost:* https:; " +
          "connect-src 'self' http://localhost:* https: ws: wss:; " +
          "frame-src 'self' http://localhost:* https:; " +
          "media-src 'self' blob: http://localhost:* https:;"
        : // Production: Stricter CSP without unsafe-eval
          "default-src 'self' 'unsafe-inline' data: blob: https:; " +
          "script-src 'self' 'unsafe-inline' https:; " +
          "style-src 'self' 'unsafe-inline' https:; " +
          "img-src 'self' data: blob: https:; " +
          "font-src 'self' data: https:; " +
          "connect-src 'self' https: wss:; " +
          "frame-src 'self' https:; " +
          "media-src 'self' blob: https:;"

      const responseHeaders = {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp]
      }
      
      callback({ responseHeaders })
    } else {
      callback({})
    }
  })

  // Don't set up permission handlers for media - let macOS handle it natively
  // This will allow the system permission dialog to appear
  // Only handle non-media permissions if needed
  defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      // Let media permissions be handled by the system (don't intercept)
      // "media" covers both microphone and camera
      if (permission === 'media') {
        // Return without calling callback - Electron will handle it natively
        // This triggers the macOS permission dialog
        return
      }
      // Handle other permissions
      callback(false)
    }
  )

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
