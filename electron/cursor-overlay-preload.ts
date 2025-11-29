import { contextBridge, ipcRenderer } from 'electron'

// Expose cursor overlay API
contextBridge.exposeInMainWorld('cursorOverlay', {
  onCursorUpdate: (callback: (pos: { x: number; y: number }) => void) => {
    ipcRenderer.on('cursor:update', (_event, pos) => callback(pos))
  },

  onHoverUpdate: (callback: (hoverData: {
    isHovering: boolean
    targetRect?: { x: number; y: number; width: number; height: number }
  }) => void) => {
    ipcRenderer.on('cursor:hover', (_event, hoverData) => callback(hoverData))
  },

  onColorUpdate: (callback: (colorData: { backgroundColor: string }) => void) => {
    ipcRenderer.on('cursor:color', (_event, colorData) => callback(colorData))
  }
})
