'use client'

import { useState, useEffect } from 'react'
import { Hash, Flame } from 'lucide-react'

interface Topic {
  id: string
  name: string
  count: string
  trend: 'hot' | 'rising' | 'stable'
  category: string
  url?: string
}

export function TrendingTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingTopics()
    // Refresh every 5 minutes
    const interval = setInterval(fetchTrendingTopics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchTrendingTopics = async () => {
    try {
      const response = await fetch('/api/news?type=trending')
      const data = await response.json()

      if (data.success && data.data) {
        setTopics(data.data)
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'hot') {
      return <Flame className="size-3 text-orange-500" />
    }
    return null
  }

  const handleTopicClick = (topic: Topic) => {
    // Navigate to morphic search/prompt page with the topic
    const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search/${newChatId}?q=${encodeURIComponent(topic.name)}` }
    }))
  }

  if (loading && topics.length === 0) {
    return (
      <div className="neu-card p-5 rounded-xl mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Top 10 Trending Now</h3>
          <Hash className="size-4 text-primary" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/30 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="neu-card p-5 rounded-xl mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Top 10 Trending Now</h3>
        <Hash className="size-4 text-primary" />
      </div>

      <div className="space-y-2">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            onClick={() => handleTopicClick(topic)}
            className="flex items-center gap-3 hover:bg-muted/30 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0 w-5 text-center">
              <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium truncate">{topic.name}</p>
                {getTrendIcon(topic.trend)}
              </div>
              <p className="text-xs text-muted-foreground">{topic.category}</p>
            </div>

            <div className="flex-shrink-0">
              <span className="text-xs text-muted-foreground">{topic.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
