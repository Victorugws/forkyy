'use client'

import { useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface BrowserModalProps {
  url: string
  title?: string
  onClose: () => void
}

export function BrowserModal({ url, title, onClose }: BrowserModalProps) {
  // Handle Esc key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-background w-full h-full max-w-7xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Browser Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/50 backdrop-blur">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close browser"
          >
            <X className="size-5" />
          </button>

          {/* URL Bar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border">
            <div className="size-4 text-muted-foreground">🔒</div>
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 bg-transparent text-sm text-muted-foreground outline-none select-all"
              title={url}
            />
          </div>

          {/* Open in New Tab Button */}
          <button
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <ExternalLink className="size-4" />
            Open in Browser
          </button>
        </div>

        {/* Title Bar (if provided) */}
        {title && (
          <div className="px-4 py-2 border-b border-border bg-muted/30">
            <h3 className="text-sm font-medium text-foreground truncate">{title}</h3>
          </div>
        )}

        {/* IFrame Content */}
        <div className="flex-1 relative bg-white">
          <iframe
            src={url}
            className="absolute inset-0 w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title={title || 'Browser view'}
            loading="lazy"
          />
        </div>

        {/* Loading Indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden">
          <div className="h-full bg-primary animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  )
}
