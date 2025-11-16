'use client'

import { useState } from 'react'
import { ExternalLink, Clock, Eye, FileText } from 'lucide-react'
import { BrowserModal } from '../shared/BrowserModal'

interface Article {
  id: string
  title: string
  summary: string
  image: string
  source: string
  url: string
  views?: string
  sources?: number
  publishedHours?: number
  publishedAt?: string
  category?: string
}

interface NewsCardProps {
  article: Article
  onClick?: () => void
  variant?: 'vertical' | 'horizontal'
}

export function NewsCard({ article, onClick, variant = 'horizontal' }: NewsCardProps) {
  const [imageError, setImageError] = useState(false)
  const [showBrowser, setShowBrowser] = useState(false)

  const handleClick = () => {
    setShowBrowser(true)
    onClick?.()
  }

  // Vertical card for horizontal scrolling
  if (variant === 'vertical') {
    return (
      <>
        <div
          onClick={handleClick}
          className="flex-shrink-0 w-[380px] group cursor-pointer"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all overflow-hidden h-full flex flex-col backdrop-blur-sm">
            {/* Image */}
            <div className="relative h-56 overflow-hidden bg-black/40">
              {!imageError && article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/40">
                  <FileText className="size-12 text-white/20" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Source badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md border border-white/10 text-white/90">
                  {article.source}
                </span>
              </div>

              {/* External link button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(article.url || `/search?q=${encodeURIComponent(article.title)}`, '_blank', 'noopener,noreferrer')
                }}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Open in new tab"
              >
                <ExternalLink className="size-4 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-base font-medium text-white group-hover:text-white/80 transition-colors line-clamp-2 mb-3 leading-snug">
                {article.title}
              </h3>

              <p className="text-sm text-white/60 line-clamp-3 mb-4 flex-1 leading-relaxed">
                {article.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-2 text-xs text-white/40 pt-4 border-t border-white/10">
                <Clock className="size-3.5" />
                <span>{article.publishedAt || `${article.publishedHours}h ago`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Modal */}
        {showBrowser && (
          <BrowserModal
            url={article.url || `/search?q=${encodeURIComponent(article.title)}`}
            title={article.title}
            onClose={() => setShowBrowser(false)}
          />
        )}
      </>
    )
  }

  // Original horizontal card
  return (
    <>
      <div
        onClick={handleClick}
        className="block group cursor-pointer"
      >
        <div className="flex gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all">
          {/* Article Image */}
          <div className="relative w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            {!imageError && article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <FileText className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
              {article.title}
            </h3>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {article.summary}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {article.views && (
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {article.views} views
                </span>
              )}
              {article.sources && (
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {article.sources} sources
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {article.source}
              </span>
              <span>
                {article.publishedHours}h ago
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(article.url, '_blank', 'noopener,noreferrer')
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ml-auto"
                aria-label="Open in new tab"
              >
                <ExternalLink className="size-3" />
                <span className="text-xs">Open</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Modal */}
      {showBrowser && (
        <BrowserModal
          url={article.url}
          title={article.title}
          onClose={() => setShowBrowser(false)}
        />
      )}
    </>
  )
}

