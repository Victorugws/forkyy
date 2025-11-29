'use client'

import { useState } from 'react'
import { ExternalLink, Clock, Eye, FileText } from 'lucide-react'
import { TiltedImage } from './TiltedImage'

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
  variant?: 'vertical' | 'horizontal' | 'featured' | 'compact' | 'large-horizontal' | 'vertical-compact' | 'small-horizontal'
}

export function NewsCard({ article, onClick, variant = 'horizontal' }: NewsCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    // Generate a new chat ID and navigate to chat page with prompt
    const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search/${newChatId}?q=${encodeURIComponent(article.title)}` }
    }))
    onClick?.()
  }

  // Large horizontal card (text left, large image right) - spans 2 columns
  if (variant === 'large-horizontal') {
    return (
      <div onClick={handleClick} className="group cursor-pointer h-full">
          <div className="neu-card rounded-xl overflow-hidden h-full flex flex-col md:flex-row gap-4 p-4">
            {/* Text content on left */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-tight">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                Published {article.publishedAt || `${article.publishedHours || 13}h ago`}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                {article.summary}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {article.sources || 50} sources
                </span>
              </div>
            </div>
            {/* Image on right */}
            <div className="relative w-full md:w-64 h-48 md:h-auto rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {!imageError && article.image ? (
                <TiltedImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="size-12 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
      </div>
    )
  }

  // Vertical compact card (image top, compact text)
  if (variant === 'vertical-compact') {
    return (
      <div onClick={handleClick} className="group cursor-pointer h-full">
          <div className="neu-card rounded-xl overflow-hidden h-full flex flex-col">
            <div className="relative h-36 overflow-hidden bg-muted">
              {!imageError && article.image ? (
                <TiltedImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="size-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-2 leading-snug">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {article.sources || 45} sources
                </span>
              </div>
            </div>
          </div>
      </div>
    )
  }

  // Small horizontal card (text left, small image right)
  if (variant === 'small-horizontal') {
    return (
      <div onClick={handleClick} className="group cursor-pointer h-full">
          <div className="neu-card rounded-xl overflow-hidden h-full flex gap-3 p-3">
            <div className="flex-1 flex flex-col min-w-0">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {article.sources || 40} sources
                </span>
              </div>
            </div>
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {!imageError && article.image ? (
                <TiltedImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="size-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
      </div>
    )
  }

  // Featured card (large, for first article)
  if (variant === 'featured') {
    return (
      <>
        <div
          onClick={handleClick}
          className="group cursor-pointer h-full"
        >
          <div className="neu-card rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Image */}
            <div className="relative h-72 overflow-hidden bg-muted">
              {!imageError && article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <FileText className="size-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-tight">
                {article.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-4 mb-4 flex-1 leading-relaxed">
                {article.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-4 border-t border-border">
                <span className="flex items-center gap-1">
                  <FileText className="size-3.5" />
                  {article.sources || 38} sources
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {article.publishedAt || `${article.publishedHours || 2}h ago`}
                </span>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }

  // Compact card for grid
  if (variant === 'compact') {
    return (
      <>
        <div
          onClick={handleClick}
          className="group cursor-pointer h-full"
        >
          <div className="neu-card rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-muted">
              {!imageError && article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <FileText className="size-10 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-2 leading-snug">
                {article.title}
              </h3>

              {/* Footer */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {article.sources || 24} sources
                </span>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }

  // Vertical card for horizontal scrolling
  if (variant === 'vertical') {
    return (
      <>
        <div
          onClick={handleClick}
          className="flex-shrink-0 w-[380px] group cursor-pointer"
        >
          <div className="neu-card rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Image */}
            <div className="relative h-56 overflow-hidden bg-muted">
              {!imageError && article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <FileText className="size-12 text-muted-foreground" />
                </div>
              )}

              {/* Source badge */}
              <div className="absolute top-4 left-4">
                <span className="neu-inset px-3 py-1.5 rounded-full text-xs font-medium text-foreground">
                  {article.source}
                </span>
              </div>

              {/* External link button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(article.url || `/search?q=${encodeURIComponent(article.title)}`, '_blank', 'noopener,noreferrer')
                }}
                className="absolute top-4 right-4 p-2.5 rounded-full neu-button opacity-0 group-hover:opacity-100"
                aria-label="Open in new tab"
              >
                <ExternalLink className="size-4 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-snug">
                {article.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1 leading-relaxed">
                {article.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
                <Clock className="size-3.5" />
                <span>{article.publishedAt || `${article.publishedHours}h ago`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Modal */}
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
        <div className="flex gap-4 neu-card rounded-2xl p-4">
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
    </>
  )
}

