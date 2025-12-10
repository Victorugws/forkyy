"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const eye_tracking_service_1 = require("./eye-tracking-service");
let mainWindow = null;
let cursorOverlay = null;
const ENABLE_CURSOR_OVERLAY = true;
function getWindowContentMetrics(window) {
    const windowBounds = window.getBounds();
    const contentBounds = window.getContentBounds();
    return {
        windowBounds,
        contentBounds,
        offsetX: contentBounds.x - windowBounds.x,
        offsetY: contentBounds.y - windowBounds.y
    };
}
const isDev = process.env.NODE_ENV === 'development';
async function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        titleBarStyle: 'hiddenInset', // macOS style
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: true,
            webviewTag: true // Enable webview tag for embedded browsing
        }
    });
    // Webview tags are now managed in React, no need for BrowserManager
    // Load your Next.js app
    if (isDev) {
        await mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        await mainWindow.loadFile((0, path_1.join)(__dirname, '../.next/server/app/index.html'));
    }
    // Create cursor overlay window (full-screen, bulletproof)
    if (ENABLE_CURSOR_OVERLAY) {
        createCursorOverlay();
        setupCursorIPC();
    }
    // Setup eye tracking IPC handlers
    setupEyeTrackingIPC();
}
function createCursorOverlay() {
    if (!ENABLE_CURSOR_OVERLAY || !mainWindow)
        return;
    // Get the main window's CONTENT bounds (excludes title bar and frame)
    const contentBounds = mainWindow.getContentBounds();
    // Add padding at the top to avoid covering window control buttons (traffic lights)
    // macOS traffic lights are about 22px tall and positioned at the top left
    const TOP_PADDING = 40; // Enough space for traffic lights
    cursorOverlay = new electron_1.BrowserWindow({
        width: contentBounds.width,
        height: contentBounds.height - TOP_PADDING,
        x: contentBounds.x,
        y: contentBounds.y + TOP_PADDING,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        fullscreen: false,
        resizable: false,
        hasShadow: false,
        focusable: false,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    // CRITICAL: Set ignore mouse events with forward BEFORE loading content
    cursorOverlay.setIgnoreMouseEvents(true, { forward: true });
    // Use 'floating' instead of 'screen-saver' to avoid covering system UI like dock
    cursorOverlay.setAlwaysOnTop(true, 'floating');
    // Don't make it visible on all workspaces to avoid interfering with system UI
    // cursorOverlay.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    // Load cursor overlay HTML - always from electron directory
    const overlayPath = isDev
        ? (0, path_1.join)(__dirname, '..', 'electron', 'cursorOverlay.html')
        : (0, path_1.join)(__dirname, 'cursorOverlay.html');
    cursorOverlay.loadFile(overlayPath);
    // Re-apply ignore mouse events after page loads (important!)
    cursorOverlay.webContents.on('did-finish-load', () => {
        cursorOverlay?.setIgnoreMouseEvents(true, { forward: true });
        console.log('[Main] Cursor overlay loaded and click-through enabled');
    });
    // Update overlay position/size to match main window's CONTENT area
    const updateOverlayBounds = () => {
        if (!cursorOverlay || cursorOverlay.isDestroyed() || !mainWindow || mainWindow.isDestroyed())
            return;
        const contentBounds = mainWindow.getContentBounds();
        const TOP_PADDING = 40; // Match the padding used during creation
        const newBounds = {
            x: contentBounds.x,
            y: contentBounds.y + TOP_PADDING,
            width: contentBounds.width,
            height: contentBounds.height - TOP_PADDING
        };
        console.log('[Main] Updating overlay bounds:', newBounds, 'isMaximized:', mainWindow.isMaximized());
        cursorOverlay.setBounds(newBounds);
        // Ensure overlay stays visible and on top
        if (!cursorOverlay.isVisible()) {
            cursorOverlay.showInactive();
        }
        cursorOverlay.setAlwaysOnTop(true, 'floating');
    };
    // Track main window movements and resizes
    mainWindow.on('move', updateOverlayBounds);
    mainWindow.on('resize', updateOverlayBounds);
    mainWindow.on('maximize', updateOverlayBounds);
    mainWindow.on('unmaximize', updateOverlayBounds);
    mainWindow.on('enter-full-screen', updateOverlayBounds);
    mainWindow.on('leave-full-screen', updateOverlayBounds);
    // Ensure overlay stays on top and click-through
    setInterval(() => {
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            if (!cursorOverlay.isAlwaysOnTop()) {
                cursorOverlay.setAlwaysOnTop(true, 'screen-saver');
            }
            if (!cursorOverlay.isVisible()) {
                cursorOverlay.showInactive();
            }
            // Re-enforce click-through every cycle
            cursorOverlay.setIgnoreMouseEvents(true, { forward: true });
        }
    }, 100);
}
// Handle getting webview preload path
electron_1.ipcMain.handle('get-webview-preload-path', () => {
    const { app } = require('electron');
    const path = require('path');
    const isDev = process.env.NODE_ENV === 'development';
    // Use the simple JS version (no TypeScript compilation needed)
    let filePath;
    if (isDev) {
        // In dev, use the source JS file directly
        filePath = path.resolve(__dirname, '..', 'electron', 'webview-preload-simple.js');
    }
    else {
        filePath = path.join(app.getAppPath(), 'electron', 'webview-preload-simple.js');
    }
    console.log('[Main] Webview preload absolute path:', filePath);
    // Convert to file:// URL format (required by webview preload attribute)
    // On Windows, we need to convert backslashes to forward slashes
    const normalizedPath = process.platform === 'win32'
        ? filePath.replace(/\\/g, '/')
        : filePath;
    const fileUrl = `file://${normalizedPath}`;
    console.log('[Main] Webview preload file URL:', fileUrl);
    return fileUrl;
});
function setupCursorIPC() {
    if (!ENABLE_CURSOR_OVERLAY)
        return;
    // Receive cursor positions from renderer (screen coordinates)
    electron_1.ipcMain.on('cursor-move', (_event, data) => {
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            cursorOverlay.webContents.send('cursor-update', data);
        }
    });
    // Receive hover target updates from renderer
    electron_1.ipcMain.on('hover-target', (_event, data) => {
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            cursorOverlay.webContents.send('hover-target-update', data);
        }
    });
    // Receive mouse events from renderer
    electron_1.ipcMain.on('cursor-mousedown', () => {
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            cursorOverlay.webContents.send('cursor-mousedown');
        }
    });
    electron_1.ipcMain.on('cursor-mouseup', () => {
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            cursorOverlay.webContents.send('cursor-mouseup');
        }
    });
    // Webview-specific events (from webview-preload-simple.js)
    electron_1.ipcMain.on('cursor-down', () => {
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            cursorOverlay.webContents.send('cursor-mousedown');
        }
    });
    electron_1.ipcMain.on('cursor-up', () => {
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            cursorOverlay.webContents.send('cursor-mouseup');
        }
    });
    // Handle window close
    mainWindow?.on('closed', () => {
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            cursorOverlay.close();
        }
    });
}
function setupEyeTrackingIPC() {
    const eyeTracking = (0, eye_tracking_service_1.getEyeTrackingService)();
    // Enable/disable eye tracking
    electron_1.ipcMain.handle('eye-tracking:set-enabled', async (_event, enabled) => {
        await eyeTracking.setEnabled(enabled);
        return eyeTracking.isEnabled();
    });
    // Get eye tracking status
    electron_1.ipcMain.handle('eye-tracking:is-enabled', () => {
        return eyeTracking.isEnabled();
    });
    // Update configuration
    electron_1.ipcMain.handle('eye-tracking:update-config', (_event, config) => {
        eyeTracking.updateConfig(config);
        return eyeTracking.getConfig();
    });
    // Get configuration
    electron_1.ipcMain.handle('eye-tracking:get-config', () => {
        return eyeTracking.getConfig();
    });
    // Move cursor from gaze data (normalized 0-1 coordinates)
    electron_1.ipcMain.on('eye-tracking:move-cursor', async (_event, { x, y }) => {
        await eyeTracking.moveCursorFromGaze(x, y);
        // Also update the cursor overlay if it exists
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            const display = electron_1.screen.getPrimaryDisplay();
            const { width, height } = display.workAreaSize;
            const { x: offsetX, y: offsetY } = display.workArea;
            const screenX = offsetX + x * width;
            const screenY = offsetY + y * height;
            cursorOverlay.webContents.send('cursor-update', { x: screenX, y: screenY });
        }
    });
    // Move cursor to absolute position
    electron_1.ipcMain.on('eye-tracking:move-cursor-to', async (_event, { x, y }) => {
        await eyeTracking.moveCursorTo(x, y);
        // Update cursor overlay
        if (cursorOverlay && !cursorOverlay.isDestroyed()) {
            cursorOverlay.webContents.send('cursor-update', { x, y });
        }
    });
    // Get current cursor position
    electron_1.ipcMain.handle('eye-tracking:get-cursor-position', async () => {
        return await eyeTracking.getCursorPosition();
    });
    // Perform click
    electron_1.ipcMain.on('eye-tracking:click', async () => {
        await eyeTracking.click();
    });
    // Perform double click
    electron_1.ipcMain.on('eye-tracking:double-click', async () => {
        await eyeTracking.doubleClick();
    });
    // Reset eye tracking
    electron_1.ipcMain.handle('eye-tracking:reset', () => {
        eyeTracking.reset();
    });
}
// Handle permission requests (microphone, camera, etc.)
electron_1.app.whenReady().then(() => {
    // Don't set up permission handlers for media - let macOS handle it natively
    // This will allow the system permission dialog to appear
    // Only handle non-media permissions if needed
    electron_1.session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        // Let media permissions be handled by the system (don't intercept)
        // "media" covers both microphone and camera
        if (permission === 'media') {
            // Return without calling callback - Electron will handle it natively
            // This triggers the macOS permission dialog
            return;
        }
        // Handle other permissions
        callback(false);
    });
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
