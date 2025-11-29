// Simple webview preload - plain JS, no TypeScript
// This runs inside external pages loaded in <webview> tags

console.log('[Webview Preload Simple] ✅ Script executing for:', window.location.href);

// Preload scripts have direct access to require (not window.require)
try {
  const { ipcRenderer } = require('electron');
  console.log('[Webview Preload Simple] ✅ ipcRenderer loaded!');

  // Track mouse movement and send to host
  let lastSendTime = 0;
  window.addEventListener('mousemove', (e) => {
    const data = {
      x: e.screenX,
      y: e.screenY,
      clientX: e.clientX,
      clientY: e.clientY
    };

    ipcRenderer.sendToHost('cursor-move', data);

    // Debug log (throttled)
    const now = Date.now();
    if (now - lastSendTime > 1000) {
      console.log('[Webview Preload Simple] Sending cursor-move:', data);
      lastSendTime = now;
    }
  }, { passive: true });

  // Track mousedown/mouseup
  window.addEventListener('mousedown', () => {
    ipcRenderer.sendToHost('cursor-down', {});
  }, { passive: true });

  window.addEventListener('mouseup', () => {
    ipcRenderer.sendToHost('cursor-up', {});
  }, { passive: true });

  console.log('[Webview Preload Simple] ✅ Event listeners attached!');
} catch (err) {
  console.error('[Webview Preload Simple] ❌ Failed to setup:', err);
  console.error('[Webview Preload Simple] Error details:', err.message, err.stack);
}
