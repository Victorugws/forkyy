// BrowserView preload script for cursor tracking
// This runs inside pages loaded in BrowserView instances
const { ipcRenderer } = require('electron')

console.log('[BrowserView Preload Cursor] ✅ Script executing for:', window.location.href)

// Interactive element selector
const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'textarea',
  'select',
  'label',
  'img',
  'video',
  'audio',
  '[onclick]',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[tabindex]:not([tabindex="-1"])',
  '[data-clickable]',
  '[draggable="true"]',
  'summary',
  '.cursor-target'
].join(', ')

// Helper to check if element has pointer cursor
const hasPointerCursor = (element) => {
  const style = window.getComputedStyle(element)
  return style.cursor === 'pointer'
}

// Helper to check if element is truly interactive
const isInteractive = (element) => {
  try {
    if (element.matches(INTERACTIVE_SELECTOR)) return true
    if (hasPointerCursor(element)) return true
    const onclick = element.getAttribute('onclick')
    if (onclick) return true
    return false
  } catch (e) {
    return false
  }
}

// Hover detection state
let activeTarget = null
let currentLeaveHandler = null

// Track mouse movement and send to main process
// BrowserView coordinates are relative to the BrowserView itself
// The main process will convert to screen coordinates using BrowserView bounds
let lastSendTime = 0
window.addEventListener('mousemove', (e) => {
  const data = {
    x: e.clientX,  // BrowserView-local coordinates
    y: e.clientY, // BrowserView-local coordinates
    clientX: e.clientX,
    clientY: e.clientY
  }

  // Send to main process via IPC (not sendToHost, since this is BrowserView, not webview tag)
  ipcRenderer.send('browserview-cursor-move', data)

  // Debug log (throttled)
  const now = Date.now()
  if (now - lastSendTime > 1000) {
    console.log('[BrowserView Preload Cursor] Sending cursor-move:', data)
    lastSendTime = now
  }
}, { passive: true })

// Track hover targets and send their bounds to main process
const handleMouseOver = (e) => {
  const directTarget = e.target
  const target = directTarget
  if (!target || activeTarget === target) return
  
  // Skip HTML, BODY, and other top-level elements
  const tagName = target.tagName?.toUpperCase()
  if (tagName === 'HTML' || tagName === 'BODY' || tagName === 'HEAD') {
    return
  }

  // Clean up previous target
  if (activeTarget && currentLeaveHandler) {
    activeTarget.removeEventListener('mouseleave', currentLeaveHandler)
  }

  activeTarget = target
  const rect = target.getBoundingClientRect()
  
  // Validate bounds
  if (rect.width <= 0 || rect.height <= 0) {
    console.log('[BrowserView Preload Cursor] Skipping invalid bounds:', target.tagName, rect)
    return
  }

  const targetBounds = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height
  }
  
  // Double-check bounds are valid
  if (targetBounds.width <= 0 || targetBounds.height <= 0 || targetBounds.bottom <= targetBounds.top) {
    console.log('[BrowserView Preload Cursor] Skipping invalid bounds (validation failed):', target.tagName, targetBounds)
    return
  }

  const hoverData = {
    isHovering: true,
    targetBounds: targetBounds
  }

  // Send hover enter event with target bounds (BrowserView-local coordinates)
  console.log('[BrowserView Preload Cursor] Sending hover-target IPC:', hoverData)
  ipcRenderer.send('browserview-hover-target', hoverData)

  console.log('[BrowserView Preload Cursor] Hover target:', target.tagName, rect)

  // Set up leave handler
  const leaveHandler = () => {
    ipcRenderer.send('browserview-hover-target', {
      isHovering: false
    })
    activeTarget = null
    currentLeaveHandler = null
  }

  currentLeaveHandler = leaveHandler
  target.addEventListener('mouseleave', leaveHandler)
}

// Add mouseover listener
window.addEventListener('mouseover', (e) => {
  console.log('[BrowserView Preload Cursor] Mouseover event:', e.target.tagName)
  handleMouseOver(e)
}, { passive: true })

// Track mousedown/mouseup
window.addEventListener('mousedown', () => {
  ipcRenderer.send('browserview-cursor-down', {})
}, { passive: true })

window.addEventListener('mouseup', () => {
  ipcRenderer.send('browserview-cursor-up', {})
}, { passive: true })

console.log('[BrowserView Preload Cursor] ✅ Event listeners attached!')

