"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose cursor overlay API
electron_1.contextBridge.exposeInMainWorld('cursorOverlay', {
    onCursorUpdate: (callback) => {
        electron_1.ipcRenderer.on('cursor:update', (_event, pos) => callback(pos));
    },
    onHoverUpdate: (callback) => {
        electron_1.ipcRenderer.on('cursor:hover', (_event, hoverData) => callback(hoverData));
    },
    onColorUpdate: (callback) => {
        electron_1.ipcRenderer.on('cursor:color', (_event, colorData) => callback(colorData));
    }
});
