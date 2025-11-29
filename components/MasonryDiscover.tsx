'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface NewsItem {
  title: string
  summary: string
  image: string
  source: string
  url: string
  views: string
  sources: number
  publishedHours: number
}

interface MasonryDiscoverProps {
  className?: string
}

export function MasonryDiscover({ className = '' }: MasonryDiscoverProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const columnRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news?type=top')
        const data = await response.json()

        if (data.success && data.data) {
          // Fetch multiple batches for more content
          const topics = ['technology', 'science', 'business']
          const promises = topics.map(topic =>
            fetch(`/api/news?type=topic&topic=${topic}`).then(res => res.json())
          )

          const results = await Promise.all(promises)
          const allNews = [
            ...data.data,
            ...results.flatMap(r => r.success ? r.data : [])
          ]

          setNewsItems(allNews.slice(0, 15))
        } else if (data.fallback) {
          setNewsItems(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Distribute items across three columns
  const columns = [
    newsItems.filter((_, i) => i % 3 === 0),
    newsItems.filter((_, i) => i % 3 === 1),
    newsItems.filter((_, i) => i % 3 === 2),
  ]

  if (loading) {
    return (
      <div className={`py-24 px-6 max-w-7xl mx-auto ${className}`}>
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
    <div className={`py-24 px-6 max-w-7xl mx-auto ${className}`}>
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

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 masonry-container">
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            ref={columnRefs[colIndex]}
            className="masonry-column space-y-6"
            style={{
              animation: `slideColumn${colIndex % 2 === 0 ? 'Down' : 'Up'} 20s linear infinite`,
              animationPlayState: 'paused'
            }}
          >
            {column.map((item, itemIndex) => (
              <MasonryCard
                key={`${colIndex}-${itemIndex}`}
                item={item}
                columnIndex={colIndex}
              />
            ))}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideColumnDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }

        @keyframes slideColumnUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }

        .masonry-container:hover .masonry-column {
          animation-play-state: running !important;
        }
      `}</style>
    </div>
  )
}

interface MasonryCardProps {
  item: NewsItem
  columnIndex: number
}

function MasonryCard({ item, columnIndex }: MasonryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={cardRef}
        className="neu-card rounded-3xl overflow-hidden bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-500"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
        }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className={`object-cover transition-all duration-700 ${
              isHovered ? 'scale-110 filter-none' : 'scale-100 grayscale'
            }`}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Source Badge */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
              <span className="text-xs font-medium">{item.source}</span>
            </div>
          </div>

          {/* Time Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-xs font-medium">{item.publishedHours}h ago</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {item.summary}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{item.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>{item.sources} sources</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}
