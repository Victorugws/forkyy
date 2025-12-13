'use client'

import { useState, FormEvent, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, RotateCw, Home, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrowserBarProps {
  currentUrl: string
  onUrlChange: (url: string) => void
  canGoBack: boolean
  canGoForward: boolean
  isLoading: boolean
  pageTitle: string
}

export function BrowserBar({
  currentUrl,
  onUrlChange,
  canGoBack,
  canGoForward,
  isLoading,
  pageTitle
}: BrowserBarProps) {
  const [urlInput, setUrlInput] = useState(currentUrl)

  const handleNavigate = () => {
    let url = urlInput.trim()

    // Allow /search/ routes but block other internal routes from address bar
    if (url.startsWith('/') && !url.startsWith('/search/')) {
      // Don't navigate to non-search internal routes via address bar
      // Reset to current URL
      setUrlInput(currentUrl)
      return
    }

    // Add https:// if no protocol specified
    if (url && !url.match(/^[a-z]+:\/\//i)) {
      // Check if it looks like a domain
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url
      } else {
        // Navigate to morphic chat page instead of Google search
        const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
        url = `/search/${newChatId}?q=${encodeURIComponent(url)}`
      }
    }

    if (url) {
      onUrlChange(url)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNavigate()
    }
  }

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('browser:back'))
  }

  const handleForward = () => {
    window.dispatchEvent(new CustomEvent('browser:forward'))
  }

  const handleRefresh = () => {
    window.dispatchEvent(new CustomEvent('browser:refresh'))
  }

  const handleHome = () => {
    // Home button navigates to internal homepage using browser event
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: '/' }
    }))
  }

  // Update input when URL changes externally
  if (currentUrl !== urlInput && document.activeElement?.tagName !== 'INPUT') {
    setUrlInput(currentUrl)
  }

  return (
    <div className="flex items-center gap-2 p-3 border-b bg-background">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          disabled={!canGoBack}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleForward}
          disabled={!canGoForward}
          className="h-9 w-9"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading}
          className="h-9 w-9"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCw className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleHome}
          className="h-9 w-9"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>

      {/* URL Input */}
      <div className="flex-1">
        <Input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter URL or search..."
          className={cn(
            "w-full border-[2.5px] border-gray-900",
            isLoading && "opacity-70"
          )}
        />
      </div>

      {/* Page Title (optional display) */}
      {pageTitle && (
        <div className="hidden lg:block text-sm text-muted-foreground max-w-[200px] truncate">
          {pageTitle}
        </div>
      )}
    </div>
  )
}
