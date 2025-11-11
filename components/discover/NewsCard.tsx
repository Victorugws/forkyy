'use client'

import { Eye, FileText } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ImageWithFallback } from '../shared/ImageWithFallback'

interface Article {
  id: string
  title: string
  summary: string
  image: string
  source: string
  url: string
  views: string
  sources: number
  publishedHours: number
}

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
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
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {article.views} views
            </span>
            <span className="flex items-center gap-1">
              <FileText className="size-3" />
              {article.sources} sources
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {article.source}
            </span>
            <span>
              {article.publishedHours}h ago
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
