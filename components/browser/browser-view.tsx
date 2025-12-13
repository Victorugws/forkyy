'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import { NeumorphicHomePage } from '@/components/neumorphic-pages/home-page'
import { NeumorphicAboutPage } from '@/components/neumorphic-pages/about-page'
import { NeumorphicServicesPage } from '@/components/neumorphic-pages/services-page'
import { NeumorphicDiscoverPage } from '@/components/neumorphic-pages/discover-page'
import { NeumorphicFinancePage } from '@/components/neumorphic-pages/finance-page'
import { NeumorphicImagesPage } from '@/components/neumorphic-pages/images-page'
import { NeumorphicVideosPage } from '@/components/neumorphic-pages/videos-page'
import { NeumorphicAcademicPage } from '@/components/neumorphic-pages/academic-page'
import { NeumorphicSpacesPage } from '@/components/neumorphic-pages/spaces-page'
import { NeumorphicWritingPage } from '@/components/neumorphic-pages/writing-page'

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electron?.isElectron

interface BrowserViewProps {
  url: string
  onNavigate: (url: string) => void
  onLoadingChange: (loading: boolean) => void
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onCanGoBackChange: (canGoBack: boolean) => void
  onCanGoForwardChange: (canGoForward: boolean) => void
  onFaviconChange?: (favicon: string) => void
}

// Define internal routes
const INTERNAL_ROUTES = [
  '/',
  '/about',
  '/services',
  '/discover',
  '/spaces',
  '/finance',
  '/images',
  '/videos',
  '/academic',
  '/writing',
  '/ide',
  '/builder'
]

// Check if URL is an internal route
function isInternalRoute(url: string): boolean {
  if (!url) return false

  try {
    // Check if it's just a path (no protocol)
    if (url.startsWith('/')) {
      return INTERNAL_ROUTES.includes(url.split('?')[0])
    }

    // Check if it's a full URL pointing to our domain
    const urlObj = new URL(url)
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : ''

    if (urlObj.hostname === currentDomain || urlObj.hostname === 'localhost') {
      return INTERNAL_ROUTES.includes(urlObj.pathname.split('?')[0])
    }
  } catch {
    // Invalid URL, treat as external
    return false
  }

  return false
}

// Get internal route path
function getInternalRoutePath(url: string): string {
  if (url.startsWith('/')) {
    return url.split('?')[0]
  }

  try {
    const urlObj = new URL(url)
    return urlObj.pathname.split('?')[0]
  } catch {
    return '/'
  }
}

export function BrowserView({
  url,
  onNavigate,
  onLoadingChange,
  onTitleChange,
  onContentChange,
  onCanGoBackChange,
  onCanGoForwardChange,
  onFaviconChange
}: BrowserViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  // Initialize state - will be updated in useEffect
  const [iframeUrl, setIframeUrl] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [internalPath, setInternalPath] = useState('/')
  const [pageContent, setPageContent] = useState('')
  const [webviewPreloadPath, setWebviewPreloadPath] = useState<string>('')
  
  // Load webview preload path for Electron
  useEffect(() => {
    if (isElectron && typeof window !== 'undefined' && (window as any).electron?.getWebviewPreloadPath) {
      (window as any).electron.getWebviewPreloadPath().then((path: string) => {
        console.log('[BrowserView] ✅ Webview preload path loaded:', path)
        console.log('[BrowserView] Path starts with file://?', path.startsWith('file://'))

        // Ensure path has file:// protocol
        if (!path.startsWith('file://')) {
          console.error('[BrowserView] ❌ Path does not start with file://, fixing...')
          const fixedPath = path.startsWith('/') ? `file://${path}` : `file:///${path}`
          console.log('[BrowserView] Fixed path:', fixedPath)
          setWebviewPreloadPath(fixedPath)
        } else {
          setWebviewPreloadPath(path)
        }
      }).catch((err: any) => {
        console.error('[BrowserView] ❌ Failed to get webview preload path:', err)
      })
    } else {
      console.warn('[BrowserView] ⚠️ Electron API not available or not in Electron')
    }
  }, [])

  // Set up webview IPC message handlers to relay cursor events
  useEffect(() => {
    if (!isElectron || !iframeRef.current || isInternal) return

    const webview = iframeRef.current as any
    const electronAPI = (window as any).electronAPI

    console.log('[BrowserView] Setting up webview for:', iframeUrl, 'Element tag:', webview?.tagName)

    if (!electronAPI) {
      console.warn('[BrowserView] electronAPI not available for webview cursor relay')
      return
    }

    const handleIpcMessage = (event: any) => {
      const { channel, args } = event
      console.log('[BrowserView] IPC message received:', channel, args)

      // Relay cursor messages from webview to main process
      if (channel === 'cursor-move') {
        const [data] = args
        console.log('[BrowserView] Relaying cursor-move:', data)
        electronAPI.sendCursorMove?.(data)
      } else if (channel === 'hover-target') {
        const [data] = args
        electronAPI.sendHoverTarget?.(data)
      } else if (channel === 'cursor-mousedown' || channel === 'cursor-down') {
        console.log('[BrowserView] Relaying cursor-down')
        electronAPI.sendCursorMouseDown?.()
      } else if (channel === 'cursor-mouseup' || channel === 'cursor-up') {
        console.log('[BrowserView] Relaying cursor-up')
        electronAPI.sendCursorMouseUp?.()
      }
    }

    // Forward console messages from webview to main console for debugging
    const handleConsoleMessage = (event: any) => {
      console.log(`[Webview Console] ${event.message}`)
    }

    // Wait for webview to be ready before adding listener
    const setupListener = () => {
      console.log('[BrowserView] ✅ Webview ready! Setting up IPC listener for:', iframeUrl)
      webview.addEventListener('ipc-message', handleIpcMessage)
      webview.addEventListener('console-message', handleConsoleMessage)
    }

    // Always wait for dom-ready event to ensure webview is fully loaded
    webview.addEventListener('dom-ready', setupListener, { once: true })

    return () => {
      webview.removeEventListener?.('ipc-message', handleIpcMessage)
      webview.removeEventListener?.('console-message', handleConsoleMessage)
    }
  }, [isElectron, isInternal, iframeUrl])

  // Handle URL changes (including initial load)
  useEffect(() => {
    const targetUrl = url || '/'
    
    // Always process the URL to handle initial load
    const internal = isInternalRoute(targetUrl)
    setIsInternal(internal)

    if (internal) {
      const path = getInternalRoutePath(targetUrl)
      setInternalPath(path)
      setIframeUrl(targetUrl)

      // Set page title based on route
      // Don't update title for home page if it's "New Tab" - let it stay until user navigates
      const titles: Record<string, string> = {
        '/': 'ORB AI - AI Solutions',
        '/about': 'About Us - ORB AI',
        '/services': 'Services - ORB AI',
        '/discover': 'Discover - ORB AI',
        '/spaces': 'Spaces - ORB AI',
        '/finance': 'Finance - ORB AI',
        '/images': 'Images - ORB AI',
        '/videos': 'Videos - ORB AI',
        '/academic': 'Academic - ORB AI',
        '/writing': 'Writing - ORB AI'
      }
      // For home page, don't update title - let it stay as "New Tab" until user navigates
      // For other routes, update the title
      if (path !== '/') {
        onTitleChange(titles[path] || 'ORB AI')
      }
      onLoadingChange(false)
    } else {
      setIframeUrl(targetUrl)
      setError(null)
      onLoadingChange(true)
      
      // For external URLs, immediately fetch title and favicon via API
      // This ensures we get the correct title/favicon even before the iframe loads
      if (targetUrl && !targetUrl.startsWith('/')) {
        // Set a temporary title based on domain while we fetch the real title
        try {
          const urlObj = new URL(targetUrl)
          const domainTitle = urlObj.hostname.replace('www.', '').split('.')[0]
          const tempTitle = domainTitle.charAt(0).toUpperCase() + domainTitle.slice(1)
          onTitleChange(tempTitle)
        } catch {
          // Ignore URL parsing errors
        }
        // Fetch the actual title and favicon immediately
        fetchPageContent(targetUrl)
      }
    }

    // Add to history only if it's a new URL or initial load
    if (history.length === 0 || targetUrl !== history[currentIndex]) {
      const newHistory = history.length === 0 
        ? [targetUrl]
        : history.slice(0, currentIndex + 1).concat(targetUrl)
      setHistory(newHistory)
      const newIndex = newHistory.length - 1
      setCurrentIndex(newIndex)

      // Update navigation state
      onCanGoBackChange(newIndex > 0)
      onCanGoForwardChange(false)
    }
  }, [url])

  // Update navigation capabilities
  useEffect(() => {
    onCanGoBackChange(currentIndex > 0)
    onCanGoForwardChange(currentIndex < history.length - 1)
  }, [currentIndex, history.length])

  // Handle browser navigation events
  useEffect(() => {
    const handleBack = () => {
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1
        setCurrentIndex(newIndex)
        setIframeUrl(history[newIndex])
        onNavigate(history[newIndex])
      }
    }

    const handleForward = () => {
      if (currentIndex < history.length - 1) {
        const newIndex = currentIndex + 1
        setCurrentIndex(newIndex)
        setIframeUrl(history[newIndex])
        onNavigate(history[newIndex])
      }
    }

    const handleRefresh = () => {
      if (iframeRef.current) {
        setError(null)
        onLoadingChange(true)
        iframeRef.current.src = iframeUrl
      }
    }

    const handleNavigateEvent = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.url) {
        onNavigate(customEvent.detail.url)
      }
    }

    window.addEventListener('browser:back', handleBack)
    window.addEventListener('browser:forward', handleForward)
    window.addEventListener('browser:refresh', handleRefresh)
    window.addEventListener('browser:navigate', handleNavigateEvent)

    return () => {
      window.removeEventListener('browser:back', handleBack)
      window.removeEventListener('browser:forward', handleForward)
      window.removeEventListener('browser:refresh', handleRefresh)
      window.removeEventListener('browser:navigate', handleNavigateEvent)
    }
  }, [currentIndex, history, iframeUrl])

  // Extract favicon from URL or document
  const extractFavicon = (doc: Document | null, pageUrl: string): string | null => {
    if (!doc && !pageUrl) return null

    // Try to get favicon from document
    if (doc) {
      // Look for favicon link tags
      const faviconLink = doc.querySelector('link[rel*="icon"]') as HTMLLinkElement
      if (faviconLink?.href) {
        // Resolve relative URLs
        try {
          const url = new URL(faviconLink.href, pageUrl)
          return url.href
        } catch {
          return faviconLink.href
        }
      }
    }

    // Fallback: try /favicon.ico
    if (pageUrl) {
      try {
        const url = new URL(pageUrl)
        const faviconUrl = `${url.origin}/favicon.ico`
        return faviconUrl
      } catch {
        // If URL parsing fails, try simple concatenation
        if (pageUrl.startsWith('http')) {
          const baseUrl = pageUrl.split('/').slice(0, 3).join('/')
          return `${baseUrl}/favicon.ico`
        }
      }
    }

    return null
  }

  // Handle iframe load events
  const handleLoad = async () => {
    onLoadingChange(false)

    if (iframeRef.current) {
      try {
        // Try to access iframe content (will fail for cross-origin)
        const iframeDoc = iframeRef.current.contentDocument
        if (iframeDoc) {
          const title = iframeDoc.title || 'Untitled'
          onTitleChange(title)

          // Extract favicon
          const favicon = extractFavicon(iframeDoc, iframeUrl)
          if (favicon && onFaviconChange) {
            onFaviconChange(favicon)
          }

          // Extract text content for AI
          const bodyText = iframeDoc.body?.innerText || ''
          setPageContent(bodyText.slice(0, 10000))
          onContentChange(bodyText.slice(0, 10000)) // Limit content size

          // Update URL if iframe navigated
          const iframeLocation = iframeRef.current.contentWindow?.location.href
          if (iframeLocation && iframeLocation !== 'about:blank' && iframeLocation !== iframeUrl) {
            onNavigate(iframeLocation)
          }
        } else {
          // For cross-origin sites, use Google's favicon service
          if (iframeUrl && onFaviconChange) {
            const favicon = getFaviconFromService(iframeUrl)
            if (favicon) {
              onFaviconChange(favicon)
            } else {
              // Fallback to extracting from URL
              const extracted = extractFavicon(null, iframeUrl)
              if (extracted) {
                onFaviconChange(extracted)
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin restrictions - fetch content via API instead
        if (iframeUrl) {
          fetchPageContent(iframeUrl)
        }
      }
    }
  }

  // Use Google's favicon service as a reliable fallback for cross-origin sites
  const getFaviconFromService = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      // Use Google's favicon service for reliable favicon fetching
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    } catch {
      return null
    }
  }

  // Set up favicon for external URLs
  const lastFaviconUrlRef = useRef<string>('')
  const lastFaviconRef = useRef<string | null>(null)
  
  useEffect(() => {
    if (!iframeUrl || isInternal || !onFaviconChange) return

    // Prevent duplicate calls for the same URL
    if (lastFaviconUrlRef.current === iframeUrl) return
    lastFaviconUrlRef.current = iframeUrl

    // For external URLs, use Google's favicon service as primary method
    const favicon = getFaviconFromService(iframeUrl)
    if (favicon && favicon !== lastFaviconRef.current) {
      lastFaviconRef.current = favicon
      onFaviconChange(favicon)
    } else if (!favicon) {
      // Fallback to extracting from URL
      const extracted = extractFavicon(null, iframeUrl)
      if (extracted && extracted !== lastFaviconRef.current) {
        lastFaviconRef.current = extracted
        onFaviconChange(extracted)
      }
    }
    // Note: onFaviconChange is intentionally excluded from deps to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeUrl, isInternal])

  const handleError = () => {
    onLoadingChange(false)
    setError('Failed to load page. The site may not allow embedding.')
    
    // For cross-origin issues, try to fetch via API proxy
    if (iframeUrl && !iframeUrl.startsWith('/')) {
      fetchPageContent(iframeUrl)
    }
  }

  // Fetch page content via API for cross-origin pages
  const fetchPageContent = async (pageUrl: string) => {
    try {
      const response = await fetch('/api/browser/fetch-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pageUrl })
      })

      if (response.ok) {
        const data = await response.json()
        // Always update title if available - this should override any default
        if (data.title && data.title.trim()) {
          console.log('[BrowserView] Updating title to:', data.title.trim())
          onTitleChange(data.title.trim())
        } else {
          console.warn('[BrowserView] No title found in API response for:', pageUrl)
        }
        // Update favicon - prefer API result, fallback to Google service
        if (onFaviconChange) {
          if (data.favicon) {
            onFaviconChange(data.favicon)
          } else {
            // Fallback to Google's favicon service if API didn't return one
            const fallbackFavicon = getFaviconFromService(pageUrl)
            if (fallbackFavicon) {
              onFaviconChange(fallbackFavicon)
            }
          }
        }
        if (data.content) {
          setPageContent(data.content)
          onContentChange(data.content)
        }
      } else {
        // If API fails, still try to get favicon from service
        if (onFaviconChange) {
          const fallbackFavicon = getFaviconFromService(pageUrl)
          if (fallbackFavicon) {
            onFaviconChange(fallbackFavicon)
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch page content:', e)
      // Even if API fails, try to get favicon from service
      if (onFaviconChange) {
        const fallbackFavicon = getFaviconFromService(pageUrl)
        if (fallbackFavicon) {
          onFaviconChange(fallbackFavicon)
        }
      }
    }
  }

  // Render internal neumorphic page
  const renderInternalPage = () => {
    switch (internalPath) {
      case '/':
        return <NeumorphicHomePage />
      case '/about':
        return <NeumorphicAboutPage />
      case '/services':
        return <NeumorphicServicesPage />
      case '/discover':
        return <NeumorphicDiscoverPage />
      case '/finance':
        return <NeumorphicFinancePage />
      case '/images':
        return <NeumorphicImagesPage />
      case '/videos':
        return <NeumorphicVideosPage />
      case '/academic':
        return <NeumorphicAcademicPage />
      case '/spaces':
        return <NeumorphicSpacesPage />
      case '/writing':
        return <NeumorphicWritingPage />
      case '/ide':
        // Render IDE page directly using iframe to load the Next.js route
        return (
          <iframe
            src="/ide"
            className="w-full h-full border-0"
            title="IDE"
          />
        )
      case '/builder':
        // Render Builder page directly using iframe to load the Next.js route
        return (
          <iframe
            src="/builder"
            className="w-full h-full border-0"
            title="Website Builder"
          />
        )
      default:
        return (
          <div className="flex items-center justify-center h-full bg-background">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-2">{internalPath}</h2>
              <p className="text-muted-foreground">Page under construction</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-background">
      {error && !isInternal && !isElectron && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="text-center p-8 max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Page</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <p className="text-xs text-muted-foreground">
              Some websites prevent embedding. Try using the AI assistant to search or get information instead.
            </p>
          </div>
        </div>
      )}

      {!iframeUrl && !url && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-2">AI Browser</h2>
            <p className="text-muted-foreground mb-4">
              Enter a URL in the address bar to start browsing with AI assistance
            </p>
            <p className="text-sm text-muted-foreground">
              The AI assistant will help you understand, summarize, and interact with web content
            </p>
          </div>
        </div>
      )}

      {/* Render internal neumorphic pages */}
      {(iframeUrl || url) && isInternal && (
        <div className="w-full h-full overflow-auto">
          {renderInternalPage()}
        </div>
      )}

      {/* Render external pages in webview (Electron) or iframe (web) */}
      {iframeUrl && !isInternal && (
        <>
          {isElectron ? (
            webviewPreloadPath ? (
              <webview
                ref={(el) => {
                  (iframeRef as any).current = el
                  if (el && !isInternal) {
                    console.log('[BrowserView] Webview element created for:', iframeUrl)
                    const electronAPI = (window as any).electronAPI
                    if (!electronAPI) {
                      console.warn('[BrowserView] electronAPI not available')
                      return
                    }

                    // Set up IPC listeners immediately
                    const handleIpcMessage = (event: any) => {
                      const { channel, args } = event
                      console.log('[BrowserView] IPC from webview:', channel)
                      if (channel === 'cursor-move') {
                        electronAPI.sendCursorMove?.(args[0])
                      } else if (channel === 'cursor-down' || channel === 'cursor-mousedown') {
                        electronAPI.sendCursorMouseDown?.()
                      } else if (channel === 'cursor-up' || channel === 'cursor-mouseup') {
                        electronAPI.sendCursorMouseUp?.()
                      }
                    }

                    const handleConsoleMessage = (event: any) => {
                      console.log(`[Webview] ${event.message}`)
                    }

                    el.addEventListener('ipc-message', handleIpcMessage)
                    el.addEventListener('console-message', handleConsoleMessage)
                    el.addEventListener('dom-ready', () => {
                      console.log('[BrowserView] Webview dom-ready for:', iframeUrl)
                    })
                  }
                }}
                src={iframeUrl}
                className={cn(
                  "w-full h-full border-0",
                  error && "hidden"
                )}
                style={{ display: error ? 'none' : 'flex' }}
                // @ts-ignore - Electron webview attributes
                allowpopups="true"
                webpreferences="nodeIntegration=yes,contextIsolation=no"
                preload={webviewPreloadPath}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            )
          ) : (
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              className={cn(
                "w-full h-full border-0",
                error && "hidden"
              )}
              onLoad={handleLoad}
              onError={handleError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              title="Browser View"
            />
          )}
        </>
      )}
    </div>
  )
}
