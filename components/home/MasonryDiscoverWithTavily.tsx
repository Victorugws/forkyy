'use client'

import { useState, useEffect } from 'react'
import Masonry from '@/components/reactbits/components/Masonry'

interface NewsItem {
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

export function MasonryDiscoverWithTavily() {
  const [newsItems, setNewsItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const topics = ['technology', 'science', 'business', 'health', 'sports']
        const promises = topics.map(topic =>
          fetch(`/api/news?type=topic&topic=${topic}`).then(res => res.json())
        )

        const results = await Promise.all(promises)
        const allNews = results.flatMap((r, index) =>
          (r.success ? r.data : []).map((item: any, i: number) => ({
            id: `${index}-${i}`,
            img: item.image || `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 100000000}?w=600&h=${300 + Math.random() * 400}&fit=crop`,
            url: item.url || 'https://example.com',
            height: 300 + Math.floor(Math.random() * 300),
            title: item.title || 'News Title',
            summary: item.summary || item.title || 'News summary',
            source: item.source || 'Source',
            publishedHours: item.publishedHours || Math.floor(Math.random() * 24),
          }))
        )

        // If no news was fetched, use fallback data
        if (allNews.length === 0) {
          throw new Error('No news data available')
        }

        setNewsItems(allNews.slice(0, 20))
      } catch (error) {
        console.error('Failed to fetch news:', error)
        // Fallback data - always shown if API fails
        setNewsItems(Array.from({ length: 15 }, (_, i) => ({
          id: `${i}`,
          img: `https://picsum.photos/id/${1000 + i}/600/${Math.floor(400 + Math.random() * 300)}`,
          url: 'https://example.com',
          height: 350 + Math.floor(Math.random() * 250),
          title: `Breaking News ${i + 1}`,
          summary: 'Latest updates and insights from around the world',
          source: 'News Source',
          publishedHours: Math.floor(Math.random() * 24),
        })))
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span className="text-sm font-medium uppercase tracking-wider">DISCOVER</span>
        </div>
      </div>
      <h2 className="text-5xl md:text-6xl font-bold text-center mb-4">
        Latest Insights
      </h2>
      <p className="text-center max-w-2xl mx-auto mb-16 text-lg text-muted-foreground">
        Explore the latest news and trends from around the world
      </p>

      {/* Masonry Grid with exact reactbits.dev component */}
      {newsItems.length > 0 ? (
        <Masonry
          items={newsItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={1.05}
          blurToFocus={true}
          colorShiftOnHover={true}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No items to display
        </div>
      )}
    </div>
  )
}
