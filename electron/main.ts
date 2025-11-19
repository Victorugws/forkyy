import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { BrowserManager } from './browser-manager'

let mainWindow: BrowserWindow | null = null
let browserManager: BrowserManager | null = null

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
      webSecurity: true
    }
  })

  // Initialize browser tab manager
  browserManager = new BrowserManager(mainWindow)

  // Load your Next.js app
  if (isDev) {
    await mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    await mainWindow.loadFile(join(__dirname, '../.next/server/app/index.html'))
  }

  // Setup IPC handlers for browser control
  setupBrowserIPC()
}

function setupBrowserIPC() {
  // Create new tab
  ipcMain.handle('browser:create-tab', async (event, url?: string) => {
    const tabId = await browserManager!.createTab(url || 'https://google.com')
    return tabId
  })

  // Navigate tab to URL
  ipcMain.handle('browser:navigate', async (event, tabId: string, url: string) => {
    await browserManager!.navigate(tabId, url)
  })

  // Close tab
  ipcMain.handle('browser:close-tab', async (event, tabId: string) => {
    await browserManager!.closeTab(tabId)
  })

  // Switch active tab
  ipcMain.handle('browser:switch-tab', async (event, tabId: string) => {
    await browserManager!.switchTab(tabId)
  })

  // Go back
  ipcMain.handle('browser:go-back', async (event, tabId: string) => {
    await browserManager!.goBack(tabId)
  })

  // Go forward
  ipcMain.handle('browser:go-forward', async (event, tabId: string) => {
    await browserManager!.goForward(tabId)
  })

  // Reload
  ipcMain.handle('browser:reload', async (event, tabId: string) => {
    await browserManager!.reload(tabId)
  })

  // Stop loading
  ipcMain.handle('browser:stop', async (event, tabId: string) => {
    await browserManager!.stop(tabId)
  })

  // Get tab info
  ipcMain.handle('browser:get-tab-info', async (event, tabId: string) => {
    return browserManager!.getTabInfo(tabId)
  })

  // Get all tabs
  ipcMain.handle('browser:get-all-tabs', async () => {
    return browserManager!.getAllTabs()
  })

  // Update BrowserView height when UI changes
  ipcMain.handle('browser:update-height', async (event, headerHeight: number) => {
    browserManager!.updateHeaderHeight(headerHeight)
  })
}

// App lifecycle
app.whenReady().then(createWindow)

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
