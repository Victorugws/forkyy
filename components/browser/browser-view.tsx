'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import { NeumorphicHomePage } from '@/components/neumorphic-pages/home-page'
import { NeumorphicAboutPage } from '@/components/neumorphic-pages/about-page'
import { NeumorphicServicesPage } from '@/components/neumorphic-pages/services-page'

interface BrowserViewProps {
  url: string
  onNavigate: (url: string) => void
  onLoadingChange: (loading: boolean) => void
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onCanGoBackChange: (canGoBack: boolean) => void
  onCanGoForwardChange: (canGoForward: boolean) => void
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
  '/writing'
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
  onCanGoForwardChange
}: BrowserViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [history, setHistory] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const [iframeUrl, setIframeUrl] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [internalPath, setInternalPath] = useState('/')

  // Handle URL changes
  useEffect(() => {
    if (url && url !== iframeUrl) {
      const internal = isInternalRoute(url)
      setIsInternal(internal)

      if (internal) {
        const path = getInternalRoutePath(url)
        setInternalPath(path)
        setIframeUrl(url)

        // Set page title based on route
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
        onTitleChange(titles[path] || 'ORB AI')
        onLoadingChange(false)
      } else {
        setIframeUrl(url)
        setError(null)
        onLoadingChange(true)
      }

      // Add to history
      const newHistory = history.slice(0, currentIndex + 1)
      newHistory.push(url)
      setHistory(newHistory)
      setCurrentIndex(newHistory.length - 1)

      // Update navigation state
      onCanGoBackChange(newHistory.length > 1)
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

    window.addEventListener('browser:back', handleBack)
    window.addEventListener('browser:forward', handleForward)
    window.addEventListener('browser:refresh', handleRefresh)

    return () => {
      window.removeEventListener('browser:back', handleBack)
      window.removeEventListener('browser:forward', handleForward)
      window.removeEventListener('browser:refresh', handleRefresh)
    }
  }, [currentIndex, history, iframeUrl])

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

          // Extract text content for AI
          const bodyText = iframeDoc.body?.innerText || ''
          onContentChange(bodyText.slice(0, 10000)) // Limit content size

          // Update URL if iframe navigated
          const iframeLocation = iframeRef.current.contentWindow?.location.href
          if (iframeLocation && iframeLocation !== 'about:blank' && iframeLocation !== iframeUrl) {
            onNavigate(iframeLocation)
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

  const handleError = () => {
    onLoadingChange(false)
    setError('Failed to load page. The site may not allow embedding.')
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
        if (data.title) onTitleChange(data.title)
        if (data.content) onContentChange(data.content)
      }
    } catch (e) {
      console.error('Failed to fetch page content:', e)
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
    <div className="relative w-full h-full bg-background">
      {error && !isInternal && (
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

      {!iframeUrl && (
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
      {iframeUrl && isInternal && (
        <div className="w-full h-full overflow-auto">
          {renderInternalPage()}
        </div>
      )}

      {/* Render external pages in iframe */}
      {iframeUrl && !isInternal && (
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
    </div>
  )
}
