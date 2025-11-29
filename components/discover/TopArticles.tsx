'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Eye } from 'lucide-react'

interface Article {
  id: string
  title: string
  source: string
  views: string
  timeAgo: string
  category: string
  url?: string
}

export function TopArticles() {
  const [topArticles, setTopArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopArticles()
    // Refresh every 5 minutes
    const interval = setInterval(fetchTopArticles, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchTopArticles = async () => {
    try {
      const response = await fetch('/api/news?type=top-articles')
      const data = await response.json()

      if (data.success && data.data) {
        setTopArticles(data.data)
      }
    } catch (error) {
      console.error('Error fetching top articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleArticleClick = (article: Article) => {
    // Navigate to morphic search/prompt page with the article title
    const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search/${newChatId}?q=${encodeURIComponent(article.title)}` }
    }))
  }

  if (loading && topArticles.length === 0) {
    return (
      <div className="neu-card p-5 rounded-xl mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Top 5 Most Read</h3>
          <TrendingUp className="size-4 text-primary" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/30 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="neu-card p-5 rounded-xl mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Top 5 Most Read</h3>
        <TrendingUp className="size-4 text-primary" />
      </div>

      <div className="space-y-3">
        {topArticles.map((article, index) => (
          <div
            key={article.id}
            onClick={() => handleArticleClick(article)}
            className="flex gap-3 hover:bg-muted/30 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full neu-inset bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium line-clamp-2 mb-1">
                {article.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{article.source}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {article.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
