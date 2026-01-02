// Simple webview preload - plain JS, no TypeScript
// This runs inside external pages loaded in <webview> tags

console.log('[Webview Preload Simple] ✅ Script executing for:', window.location.href);

// Track cursor position and send to parent window via IPC
// This allows the target cursor to track mouse position even inside webviews
try {
  // In Electron webview preload scripts, ipcRenderer is available via require
  const { ipcRenderer } = require('electron');
  
  if (ipcRenderer) {
    console.log('[Webview Preload] ✅ IPC Renderer available, setting up cursor tracking');
    let lastSentX = -1;
    let lastSentY = -1;
    const THRESHOLD = 2; // Only send if cursor moved more than 2px

    // Helper function to check if an element is clickable (same logic as TargetCursor)
    const isClickableElement = (element) => {
      if (!element) return false;
      
      // Check for interactive elements
      const tagName = element.tagName.toLowerCase();
      const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'label', 'summary', 'details'];
      if (interactiveTags.includes(tagName)) {
        if (tagName === 'input' || tagName === 'button') {
          if (element.hasAttribute('disabled') || element.hasAttribute('readonly')) {
            return false;
          }
        }
        if (tagName === 'a') {
          return element.href !== '' || element.hasAttribute('href');
        }
        return true;
      }
      
      // Check for cursor pointer style
      try {
        const style = window.getComputedStyle(element);
        if ((style.cursor === 'pointer' || style.cursor === 'grab' || style.cursor === 'grabbing') && 
            style.pointerEvents !== 'none') {
          return true;
        }
      } catch (e) {
        // getComputedStyle might fail
      }
      
      // Check for role attributes
      const role = element.getAttribute('role');
      if (role && ['button', 'link', 'menuitem', 'tab', 'option', 'checkbox', 'radio', 'switch'].includes(role)) {
        return true;
      }
      
      // Check for onclick handlers
      if (element.onclick !== null) {
        return true;
      }
      
      // Check for tabindex
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex !== null && tabIndex !== '-1') {
        return true;
      }
      
      return false;
    };

    // Find clickable element at cursor position
    const findClickableElement = (x, y) => {
      try {
        const element = document.elementFromPoint(x, y);
        if (!element) return null;
        
        // Walk up the DOM tree to find clickable element
        let current = element;
        while (current && current !== document.body) {
          if (isClickableElement(current)) {
            const rect = current.getBoundingClientRect();
            return {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
              right: rect.right,
              bottom: rect.bottom
            };
          }
          current = current.parentElement;
        }
      } catch (e) {
        // elementFromPoint might fail in some cases
      }
      return null;
    };

    // Find image element at cursor position
    const findImageElement = (x, y) => {
      try {
        const element = document.elementFromPoint(x, y);
        if (!element) return null;
        
        // Walk up the DOM tree to find image element
        let current = element;
        while (current && current !== document.body) {
          if (current.tagName && current.tagName.toLowerCase() === 'img' && 
              current.src && !current.src.startsWith('data:')) {
            return {
              src: current.src,
              width: current.width || current.naturalWidth,
              height: current.height || current.naturalHeight,
              naturalWidth: current.naturalWidth,
              naturalHeight: current.naturalHeight,
              complete: current.complete
            };
          }
          current = current.parentElement;
        }
      } catch (e) {
        // elementFromPoint might fail in some cases
      }
      return null;
    };

    let lastImageSrc = null;
    
    const sendCursorPosition = (x, y) => {
      // Only send if position changed significantly to reduce IPC overhead
      const positionChanged = Math.abs(x - lastSentX) > THRESHOLD || Math.abs(y - lastSentY) > THRESHOLD;
      
      if (positionChanged) {
        // Find clickable element at cursor position
        const clickableRect = findClickableElement(x, y);
        
        // Find image element at cursor position
        const imageInfo = findImageElement(x, y);
        const imageChanged = imageInfo ? (imageInfo.src !== lastImageSrc) : (lastImageSrc !== null);
        
        // Send webview-relative coordinates, clickable element info, and image info to renderer
        ipcRenderer.sendToHost('cursor:move', { 
          x, 
          y,
          clickable: clickableRect,
          image: imageInfo
        });
        
        lastSentX = x;
        lastSentY = y;
        lastImageSrc = imageInfo ? imageInfo.src : null;
      }
    };

    // Track mouse movement - send webview-relative coordinates
    window.addEventListener('mousemove', (e) => {
      sendCursorPosition(e.clientX, e.clientY);
    });

    // Also track pointer events for better compatibility
    window.addEventListener('pointermove', (e) => {
      sendCursorPosition(e.clientX, e.clientY);
    });
    
    console.log('[Webview Preload] ✅ Cursor tracking listeners attached');
  } else {
    console.warn('[Webview Preload] ⚠️ IPC Renderer not available');
  }
} catch (error) {
  // IPC not available (e.g., in regular browser iframe)
  console.log('[Webview Preload] ❌ IPC not available, cursor tracking disabled:', error);
}
