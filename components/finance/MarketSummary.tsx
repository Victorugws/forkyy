'use client'

import { useEffect, useState } from 'react'

interface MarketSummaryProps {
  topic: string // "US Markets", "Crypto", etc.
}

interface SummaryArticle {
  title: string
  content: string
}

export function MarketSummary({ topic }: MarketSummaryProps) {
  const [articles, setArticles] = useState<SummaryArticle[]>([])
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

        const res = await fetch(`/api/news/infinite?page=1&interests=${encodeURIComponent(query)}`)
        const data = await res.json()

        if (data.articles && data.articles.length > 0) {
          // Take top 2 articles for summary
          setArticles(data.articles.slice(0, 2).map((article: any) => ({
            title: article.title,
            content: article.summary || 'No summary available.'
          })))
        }

        setLastUpdate(new Date())
      } catch (error) {
        console.error('Error fetching market summary:', error)
        // Fallback to static content
        setArticles(getFallbackSummary(topic))
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
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border bg-card animate-pulse">
              <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Market Summary</h2>
        <span className="text-sm text-muted-foreground">Updated {getTimeAgo()}</span>
      </div>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold text-foreground mb-3">{article.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{article.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function getFallbackSummary(topic: string): SummaryArticle[] {
  const fallbacks: Record<string, SummaryArticle[]> = {
    'US Markets': [
      {
        title: 'Markets Show Mixed Performance',
        content: 'US stocks showed mixed performance as investors weighed economic data and corporate earnings. Technology stocks led gains while energy sectors faced pressure.'
      },
      {
        title: 'Federal Reserve Policy in Focus',
        content: 'Market participants continue to monitor Federal Reserve commentary for signals on future interest rate policy amid evolving economic conditions.'
      }
    ],
    'Crypto': [
      {
        title: 'Cryptocurrency Markets Remain Volatile',
        content: 'Major cryptocurrencies experienced volatility as regulatory developments and institutional adoption trends continue to influence market sentiment.'
      },
      {
        title: 'Bitcoin Consolidates Above Key Levels',
        content: 'Bitcoin maintained positions above psychologically important price levels as traders assess market structure and potential breakout scenarios.'
      }
    ]
  }

  return fallbacks[topic] || fallbacks['US Markets']
}
