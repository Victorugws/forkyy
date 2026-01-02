'use client'

import { useEffect, useRef, useState } from 'react'
import path from 'path'

interface Tab {
  id: string
  url: string
  title: string
  favicon: string | null
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
}

export function WebViewBrowser() {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const webviewRefs = useRef<Map<string, Electron.WebviewTag>>(new Map())
  const [preloadPath, setPreloadPath] = useState<string>('')

  // Get path to webview preload script from Electron
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).electron?.isElectron) {
      (window as any).electron?.getWebviewPreloadPath?.().then((path: string) => {
        setPreloadPath(path)
      }).catch((err: any) => {
        console.error('Failed to get webview preload path:', err)
      })
    }
  }, [])

  // Create a new tab
  const createTab = (url: string = 'https://google.com') => {
    const newTab: Tab = {
      id: `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url,
      title: 'New Tab',
      favicon: null,
      isLoading: true,
      canGoBack: false,
      canGoForward: false
    }

    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
    return newTab.id
  }

  // Close a tab
  const closeTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== tabId)

      // If closing active tab, switch to another tab
      if (tabId === activeTabId && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id)
      } else if (newTabs.length === 0) {
        setActiveTabId(null)
      }

      return newTabs
    })

    // Remove webview ref
    webviewRefs.current.delete(tabId)
  }

  // Navigate to URL
  const navigate = (tabId: string, url: string) => {
    const webview = webviewRefs.current.get(tabId)
    if (webview) {
      const normalizedUrl = normalizeUrl(url)
      webview.src = normalizedUrl
    }
  }

  // Normalize URL
  const normalizeUrl = (input: string): string => {
    if (!/^https?:\/\//i.test(input)) {
      if (/^[\w-]+(\.[\w-]+)+/.test(input)) {
        return `https://${input}`
      }
      // Navigate to morphic search
      const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      return `http://localhost:3000/search/${newChatId}?q=${encodeURIComponent(input)}`
    }
    return input
  }

  // Setup webview event listeners
  const setupWebviewListeners = (webview: Electron.WebviewTag, tabId: string) => {
    // Page title updated
    webview.addEventListener('page-title-updated', (e: any) => {
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, title: e.title } : tab
      ))
    })

    // Started loading
    webview.addEventListener('did-start-loading', () => {
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, isLoading: true } : tab
      ))
    })

    // Finished loading
    webview.addEventListener('did-finish-load', () => {
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? {
          ...tab,
          isLoading: false,
          url: webview.getURL(),
          canGoBack: webview.canGoBack(),
          canGoForward: webview.canGoForward()
        } : tab
      ))
    })

    // Failed to load
    webview.addEventListener('did-fail-load', (e: any) => {
      if (e.errorCode === -3) return // Ignore aborted loads

      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, isLoading: false } : tab
      ))

      console.error('Failed to load:', e.errorDescription)
    })

    // Handle navigation
    webview.addEventListener('did-navigate', () => {
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? {
          ...tab,
          url: webview.getURL(),
          canGoBack: webview.canGoBack(),
          canGoForward: webview.canGoForward()
        } : tab
      ))
    })

    webview.addEventListener('did-navigate-in-page', () => {
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? {
          ...tab,
          url: webview.getURL(),
          canGoBack: webview.canGoBack(),
          canGoForward: webview.canGoForward()
        } : tab
      ))
    })

    // Handle new windows
    webview.addEventListener('new-window', (e: any) => {
      createTab(e.url)
    })

    // Forward cursor events from webview to parent for target cursor tracking
    webview.addEventListener('ipc-message', (e: any) => {
      if (e.channel === 'cursor:move' && typeof window !== 'undefined') {
        const { x, y, clickable, image } = e.args[0] || {};
        if (typeof x === 'number' && typeof y === 'number') {
          // Get webview position to convert coordinates
          // e.clientX/e.clientY from webview are relative to webview's viewport
          const rect = webview.getBoundingClientRect();
          
          // Try to get webview zoom level if available
          let zoomLevel = 1.0;
          try {
            // @ts-ignore - Electron webview API
            const zoom = webview.getZoomFactor?.();
            if (typeof zoom === 'number') {
              zoomLevel = zoom;
            }
          } catch (e) {
            // Zoom not available, use 1.0
          }
          
          // Convert webview-relative coordinates to window coordinates
          const windowX = rect.left + (x * zoomLevel);
          const windowY = rect.top + (y * zoomLevel);
          
          // Convert clickable element rect if present
          let clickableRect = null;
          if (clickable && typeof clickable === 'object') {
            clickableRect = {
              left: rect.left + (clickable.x * zoomLevel),
              top: rect.top + (clickable.y * zoomLevel),
              right: rect.left + (clickable.right * zoomLevel),
              bottom: rect.top + (clickable.bottom * zoomLevel),
              width: clickable.width * zoomLevel,
              height: clickable.height * zoomLevel
            };
          }
          
          // Dispatch custom event that TargetCursor can listen to
          const event = new CustomEvent('cursor:move', {
            detail: { 
              x: windowX, 
              y: windowY,
              clickable: clickableRect,
              image: image // Pass image info from webview
            }
          });
          window.dispatchEvent(event);
        }
      }
    })
  }

  // Create initial tab
  useEffect(() => {
    if (tabs.length === 0) {
      createTab('https://google.com')
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      {tabs.map(tab => (
        <webview
          key={tab.id}
          ref={(el) => {
            if (el) {
              webviewRefs.current.set(tab.id, el as any)
              setupWebviewListeners(el as any, tab.id)
            }
          }}
          src={tab.url}
          preload={preloadPath}
          className={`absolute inset-0 w-full h-full ${
            tab.id === activeTabId ? 'block' : 'hidden'
          }`}
          style={{
            width: '100%',
            height: '100%'
          }}
          partition="persist:main"
          allowpopups="true"
          webpreferences="contextIsolation=yes, nodeIntegration=no, sandbox=yes"
        />
      ))}

      {tabs.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No tabs open</p>
        </div>
      )}
    </div>
  )
}
