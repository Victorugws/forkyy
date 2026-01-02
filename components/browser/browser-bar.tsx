'use client'

import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, RotateCw, Home, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTypewriterSuggestions } from '@/hooks/useTypewriterSuggestions'

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
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const typewriterTextRef = useRef<HTMLSpanElement>(null)
  
  const searchSuggestions = [
    'Enter URL or search...',
    'Market analysis dashboard',
    'Financial performance metrics',
    'Business strategy insights',
    'Competitive landscape review',
    'Revenue growth trends',
    'Investment portfolio analysis',
    'Budget planning template'
  ]
  
  useTypewriterSuggestions({
    suggestions: searchSuggestions,
    textRef: typewriterTextRef,
    speed: 80,
    deleteSpeed: 40,
    pauseTime: 1500,
    isPaused: isFocused || urlInput.length > 0
  })

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
    <>
      <style jsx global>{`
        /* Browser URL Input Styles - Neumorphic darker white with shiny text */
        /* Override neu-input class background */
        input.browser-url-input.neu-input,
        .browser-url-input.neu-input,
        .browser-url-input {
          border: none !important;
          outline: none !important;
          border-radius: 15px !important;
          padding: 1em !important;
          background: #f5f5f5 !important;
          background-color: #f5f5f5 !important;
          box-shadow: inset 0.5px 1.25px 2.5px rgba(0,0,0,0.3) !important;
          transition: 300ms ease-in-out !important;
          color: #374151 !important;
          position: relative !important;
          font-weight: 500 !important;
          font-size: 0.875rem !important;
        }
        
        .browser-url-input::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #f5f5f5 !important;
          background-color: #f5f5f5 !important;
          border-radius: 15px;
          z-index: -1;
          box-shadow: inset 0.5px 1.25px 2.5px rgba(0,0,0,0.3) !important;
        }
        
        .browser-url-input:not(:hover):not(:focus) {
          background-image: linear-gradient(
            120deg,
            rgba(55, 65, 81, 0.8) 0%,
            rgba(55, 65, 81, 0.8) 40%,
            rgba(55, 65, 81, 1) 50%,
            rgba(55, 65, 81, 0.8) 60%,
            rgba(55, 65, 81, 0.8) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine-input 3s linear infinite;
        }
        
        .browser-url-input:not(:hover):not(:focus)::placeholder {
          color: rgba(55, 65, 81, 0.7) !important;
          -webkit-text-fill-color: rgba(55, 65, 81, 0.7) !important;
        }
        
        .browser-url-input:hover {
          background-color: #f5f5f5 !important;
          background-image: none !important;
          box-shadow: none !important;
          color: #111827 !important;
          border: 1px solid #111827 !important;
          -webkit-text-fill-color: #111827 !important;
          animation: none !important;
        }
        
        .browser-url-input:hover::before {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        
        .browser-url-input:hover::placeholder {
          color: rgba(17, 24, 39, 0.5) !important;
          -webkit-text-fill-color: rgba(17, 24, 39, 0.5) !important;
        }
        
        .browser-url-input:focus {
          background-color: #f5f5f5 !important;
          background-image: none !important;
          color: #111827 !important;
          box-shadow: none !important;
          transform: none !important;
          border: 1px solid #111827 !important;
          -webkit-text-fill-color: #111827 !important;
          animation: none !important;
        }
        
        .browser-url-input:focus::before {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        
        .browser-url-input:focus::placeholder {
          color: rgba(17, 24, 39, 0.5) !important;
          -webkit-text-fill-color: rgba(17, 24, 39, 0.5) !important;
        }
        
        @keyframes shine-input {
          0% {
            background-position: 100%;
          }
          100% {
            background-position: -100%;
          }
        }
        
        .typewriter-placeholder-url {
          color: rgba(55, 65, 81, 0.7);
          background-image: linear-gradient(
            120deg,
            rgba(55, 65, 81, 0.8) 0%,
            rgba(55, 65, 81, 0.8) 40%,
            rgba(55, 65, 81, 1) 50%,
            rgba(55, 65, 81, 0.8) 60%,
            rgba(55, 65, 81, 0.8) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine-input 3s linear infinite;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .typewriter-cursor-url {
          display: inline-block;
          margin-left: 2px;
          color: rgba(55, 65, 81, 0.7);
          -webkit-text-fill-color: rgba(55, 65, 81, 0.7);
          animation: blink-url 1s infinite;
        }
        
        @keyframes blink-url {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
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
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            className={cn(
              "browser-url-input w-full",
              isLoading && "opacity-70"
            )}
          />
          {/* Typewriter Placeholder Overlay */}
          <div 
            className={`absolute left-4 right-4 top-1/2 -translate-y-1/2 pointer-events-none ${!isFocused && urlInput.length === 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="typewriter-placeholder-url" ref={typewriterTextRef}></span>
            <span className="typewriter-cursor-url">|</span>
          </div>
        </div>

        {/* Page Title (optional display) */}
        {pageTitle && (
          <div className="hidden lg:block text-sm text-muted-foreground max-w-[200px] truncate">
            {pageTitle}
          </div>
        )}
      </div>
    </>
  )
}
