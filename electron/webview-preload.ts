// Webview preload script for bulletproof cursor overlay
// This script runs inside <webview> tags (external pages)
// It hides the cursor and sends coordinates to the overlay window

import { ipcRenderer } from 'electron'

const TARGET_SELECTOR = '.cursor-target'

function init() {
  console.log('[WebView Preload] ✅ Script loaded! Initializing cursor tracking for:', window.location.href)
  console.log('[WebView Preload] ipcRenderer available:', typeof ipcRenderer !== 'undefined')

  // System cursor remains visible - we're just tracking its position
  let activeTarget: Element | null = null
  let currentLeaveHandler: (() => void) | null = null

  // Track mouse movement and send to host (main window)
  let lastLogTime = 0
  window.addEventListener('mousemove', (e) => {
    // Send screen coordinates to host window
    const data = { x: e.screenX, y: e.screenY }
    ipcRenderer.sendToHost('cursor-move', data)

    // Debug log (throttled to avoid spam)
    const now = Date.now()
    if (now - lastLogTime > 1000) {
      console.log('[WebView Preload] Sending cursor-move:', data)
      lastLogTime = now
    }
  }, { passive: true })

  // Track mouse down/up for click animations
  window.addEventListener('mousedown', () => {
    ipcRenderer.sendToHost('cursor-mousedown')
  }, { passive: true })

  window.addEventListener('mouseup', () => {
    ipcRenderer.sendToHost('cursor-mouseup')
  }, { passive: true })

  // Track hover targets and send their bounds to host
  const handleMouseOver = (e: Event) => {
    const directTarget = e.target as Element
    const allTargets: Element[] = []
    let current: Element | null = directTarget

    // Find all matching targets in the hierarchy
    while (current && current !== document.body) {
      if (current.matches(TARGET_SELECTOR)) {
        allTargets.push(current)
      }
      current = current.parentElement
    }

    const target = allTargets[0] || null
    if (!target || activeTarget === target) return

    // Clean up previous target
    if (activeTarget && currentLeaveHandler) {
      activeTarget.removeEventListener('mouseleave', currentLeaveHandler)
    }

    activeTarget = target
    const rect = target.getBoundingClientRect()

    // Send hover enter event with target bounds to host
    ipcRenderer.sendToHost('hover-target', {
      isHovering: true,
      targetBounds: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      }
    })

    // Set up leave handler
    const leaveHandler = () => {
      ipcRenderer.sendToHost('hover-target', {
        isHovering: false
      })
      activeTarget = null
      currentLeaveHandler = null
    }

    currentLeaveHandler = leaveHandler
    target.addEventListener('mouseleave', leaveHandler)
  }

  window.addEventListener('mouseover', handleMouseOver as EventListener, { passive: true })

  console.log('[WebView Preload] Bulletproof cursor initialized')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

