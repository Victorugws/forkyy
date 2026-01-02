'use client'

import { useEffect, useState } from 'react'
import { Timeline } from '@/components/ui/timeline'

interface MarketSummaryProps {
  topic: string // "US Markets", "Crypto", etc.
}

interface TimelineEvent {
  date: string
  title: string
  description: string
  type?: 'blue' | 'green'
  imageUrl?: string
  images?: string[]
}

function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function MarketSummary({ topic }: MarketSummaryProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true)
      try {
        // Map topics to search queries
        const queryMap: Record<string, string> = {
          'US Markets': 'US stock market latest news',
          'Crypto': 'cryptocurrency bitcoin ethereum news',
          'Earnings': 'earnings reports stock market',
          'Screener': 'stock market trends analysis',
          'Politicians': 'congressional stock trading news'
        }

        const query = queryMap[topic] || 'financial markets news'

        let res: Response
        let data: any

        try {
          // Create abort controller for timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
          
          res = await fetch(`/api/news/infinite?page=1&interests=${encodeURIComponent(query)}`, {
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          
          if (!res.ok) {
            throw new Error(`API returned ${res.status}`)
          }
          
          const contentType = res.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON')
          }
          
          data = await res.json()
        } catch (fetchError: any) {
          // Handle abort (timeout) or network errors gracefully
          if (fetchError.name === 'AbortError') {
            console.warn('News API request timed out, using fallback')
          } else {
            console.warn('Failed to fetch news from API, using fallback:', fetchError.message || fetchError)
          }
          // Use fallback immediately if fetch fails
          setTimelineEvents(getFallbackTimeline(topic))
          setLastUpdate(new Date())
          setLoading(false)
          return
        }

        if (data.success && data.articles && data.articles.length > 0) {
          // Dummy images for casino-style spread effect
          const dummyImageSets = [
            [
              'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=600&fit=crop&q=80',
              'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=600&fit=crop&q=80',
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop&q=80',
            ],
            [
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop&q=80',
              'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=600&fit=crop&q=80',
              'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop&q=80',
            ],
          ]
          
          // Convert articles to timeline events - create more timeline items
          const events: TimelineEvent[] = data.articles.slice(0, 6).map((article: any, index: number) => {
            const date = new Date()
            date.setDate(date.getDate() - index)
            
            // All items can have images
            const images = dummyImageSets[index % dummyImageSets.length] || dummyImageSets[0]
            
            return {
              date: formatDate(date),
            title: article.title,
              description: article.summary || article.description || 'No summary available.',
              type: index % 2 === 0 ? 'blue' : 'green',
              images: images // All items have images
            }
          })
          setTimelineEvents(events)
        } else {
          // API returned no articles or error, use fallback
          setTimelineEvents(getFallbackTimeline(topic))
        }

        setLastUpdate(new Date())
      } catch (error) {
        console.error('Error fetching market summary:', error)
        // Fallback to static content
        setTimelineEvents(getFallbackTimeline(topic))
        setLastUpdate(new Date())
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()

    // Refresh every 5 minutes
    const interval = setInterval(fetchSummary, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [topic])

  const getTimeAgo = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Market Summary</h2>
          <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-6 animate-pulse">
              <div className="min-w-[80px]">
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="w-4 h-4 bg-muted rounded-full"></div>
              </div>
              <div className="flex-1 bg-muted rounded-lg p-4 h-24"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Convert timeline events to Timeline component format
  const timelineData = timelineEvents.map((event) => ({
    title: event.date,
    images: event.images,
    content: (
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-3">
          {event.title}
        </h4>
        <p className="text-sm font-normal text-muted-foreground leading-relaxed">
          {event.description}
        </p>
      </div>
    ),
  }))

  return (
    <div className="mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Market Summary</h2>
        <span className="text-sm text-muted-foreground">Updated {getTimeAgo()}</span>
      </div>
      
      <div className="rounded-xl p-6 relative overflow-visible">
        <Timeline data={timelineData} />
      </div>
    </div>
  )
}

function getFallbackTimeline(topic: string): TimelineEvent[] {
  const now = new Date()
  const dummyImageSets = [
    [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop',
    ],
  ]
  
  const fallbacks: Record<string, TimelineEvent[]> = {
    'US Markets': [
      {
        date: formatDate(new Date(now.getTime() - 0 * 24 * 60 * 60 * 1000)),
        title: 'Financial Markets | Latest News & Updates',
        description: 'Follow the latest developments in global financial markets with updates from AP News. Get today\'s market performance including stock indexes and closing prices.',
        type: 'blue',
        images: dummyImageSets[0]
      },
      {
        date: formatDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)),
        title: 'Finance and Markets - WSJ.com',
        description: 'The latest finance and stock market news covering the Dow, S&P 500, banking, investing and regulation.',
        type: 'green',
        images: dummyImageSets[1]
      },
      {
        date: formatDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
        title: 'Technology Sector Leads Market Gains',
        description: 'Major technology companies reported strong quarterly earnings, driving the NASDAQ to new highs. Investors remain optimistic about AI and cloud computing growth.',
        type: 'blue',
        images: dummyImageSets[0]
      },
      {
        date: formatDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
        title: 'Energy Sector Faces Headwinds',
        description: 'Oil prices declined as concerns about global demand growth persist. Energy stocks underperformed the broader market despite strong fundamentals.',
        type: 'green',
        images: dummyImageSets[1]
      },
      {
        date: formatDate(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)),
        title: 'Healthcare Stocks Rally on Drug Approvals',
        description: 'Pharmaceutical companies saw significant gains following FDA approvals of new treatments. Biotech sector outperformed broader market indices.',
        type: 'blue',
        images: dummyImageSets[0]
      },
      {
        date: formatDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
        title: 'Federal Reserve Signals Rate Stability',
        description: 'Central bank officials indicated that interest rates are likely to remain stable in the near term, providing clarity for investors and markets.',
        type: 'green',
        images: dummyImageSets[0] // All items have images
      }
    ],
    'Crypto': [
      {
        date: formatDate(new Date(now.getTime() - 0 * 24 * 60 * 60 * 1000)),
        title: 'Cryptocurrency Markets Remain Volatile',
        description: 'Major cryptocurrencies experienced volatility as regulatory developments and institutional adoption trends continue to influence market sentiment.',
        type: 'blue',
        images: dummyImageSets[0]
      },
      {
        date: formatDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)),
        title: 'Bitcoin Consolidates Above Key Levels',
        description: 'Bitcoin maintained positions above psychologically important price levels as traders assess market structure and potential breakout scenarios.',
        type: 'green',
        images: dummyImageSets[1]
      },
      {
        date: formatDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
        title: 'Ethereum Network Activity Increases',
        description: 'Ethereum transaction volume reached new highs as DeFi protocols see increased usage. Gas fees remained relatively stable despite higher activity.',
        type: 'blue',
        images: dummyImageSets[0]
      },
      {
        date: formatDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
        title: 'Institutional Adoption Continues',
        description: 'Major financial institutions announced new cryptocurrency products and services, signaling continued mainstream acceptance of digital assets.',
        type: 'green',
        images: dummyImageSets[1]
      },
      {
        date: formatDate(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)),
        title: 'DeFi Protocol Launches New Yield Products',
        description: 'Decentralized finance platforms introduced innovative yield farming opportunities, attracting significant capital inflows and increasing total value locked.',
        type: 'blue',
        images: dummyImageSets[0]
      },
      {
        date: formatDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
        title: 'Regulatory Clarity Improves Market Confidence',
        description: 'New regulatory frameworks provided clearer guidelines for cryptocurrency trading and custody, boosting institutional investor confidence.',
        type: 'green',
        images: dummyImageSets[1] // All items have images
      }
    ]
  }

  return fallbacks[topic] || fallbacks['US Markets']
}
