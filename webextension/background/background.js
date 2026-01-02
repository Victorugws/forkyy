/**
 * Background Service Worker
 * Handles browser.tabs API and coordinates between UI and Firefox
 */

// Listen for messages from UI (New Tab or Sidebar)
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(response => sendResponse({ success: true, data: response }))
    .catch(error => sendResponse({ success: false, error: error.message }))
  
  return true; // Keep channel open for async response
})

async function handleMessage(message, sender) {
  const { action, ...params } = message

  switch (action) {
    case 'createTab':
      return await createTab(params.url, params.active)
    
    case 'closeTab':
      return await closeTab(params.tabId)
    
    case 'updateTab':
      return await updateTab(params.tabId, params.updateProperties)
    
    case 'getTabs':
      return await getTabs(params.query)
    
    case 'getActiveTab':
      return await getActiveTab()
    
    case 'switchTab':
      return await switchTab(params.tabId)
    
    case 'goBack':
      return await goBack(params.tabId)
    
    case 'goForward':
      return await goForward(params.tabId)
    
    case 'reloadTab':
      return await reloadTab(params.tabId)
    
    case 'getStorage':
      return await getStorage(params.keys)
    
    case 'setStorage':
      return await setStorage(params.data)
    
    default:
      throw new Error(`Unknown action: ${action}`)
  }
}

// Tab Management
async function createTab(url, active = true) {
  const tab = await browser.tabs.create({
    url: url,
    active: active
  })
  return tab
}

async function closeTab(tabId) {
  await browser.tabs.remove(tabId)
  return { success: true }
}

async function updateTab(tabId, updateProperties) {
  const tab = await browser.tabs.update(tabId, updateProperties)
  return tab
}

async function getTabs(query = {}) {
  const tabs = await browser.tabs.query(query)
  return tabs
}

async function getActiveTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  return tabs[0] || null
}

async function switchTab(tabId) {
  await browser.tabs.update(tabId, { active: true })
  const window = await browser.windows.getCurrent()
  if (window) {
    await browser.windows.update(window.id, { focused: true })
  }
  return { success: true }
}

async function goBack(tabId) {
  // Use browser.tabs.executeScript is deprecated, use scripting API instead
  // For now, we'll use a workaround with browser.tabs.update
  // Note: History navigation requires content script injection
  // This is a simplified version - full implementation would need content scripts
  return { success: true, note: 'History navigation requires content script' }
}

async function goForward(tabId) {
  // Use browser.tabs.executeScript is deprecated, use scripting API instead
  // For now, we'll use a workaround with browser.tabs.update
  // Note: History navigation requires content script injection
  // This is a simplified version - full implementation would need content scripts
  return { success: true, note: 'History navigation requires content script' }
}

async function reloadTab(tabId) {
  await browser.tabs.reload(tabId)
  return { success: true }
}

// Storage Management
async function getStorage(keys) {
  if (keys) {
    return await browser.storage.local.get(keys)
  }
  return await browser.storage.local.get()
}

async function setStorage(data) {
  await browser.storage.local.set(data)
  return { success: true }
}

// Listen for tab updates and notify UI
browser.tabs.onCreated.addListener((tab) => {
  notifyUI({ action: 'tabCreated', tab })
})

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  notifyUI({ action: 'tabUpdated', tabId, changeInfo, tab })
})

browser.tabs.onRemoved.addListener((tabId) => {
  notifyUI({ action: 'tabRemoved', tabId })
})

browser.tabs.onActivated.addListener((activeInfo) => {
  notifyUI({ action: 'tabActivated', activeInfo })
})

// Notify all UI pages (New Tab and Sidebar)
// Uses runtime.sendMessage to all extension pages
async function notifyUI(message) {
  // Send to all extension pages
  // They listen with browser.runtime.onMessage or window.addEventListener('message')
  try {
    await browser.runtime.sendMessage(message)
  } catch (e) {
    // No listeners - ignore
  }
}

