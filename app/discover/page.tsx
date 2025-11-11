'use client'

import {
  Newspaper,
  Star,
  Cloud,
  TrendingUp,
  Eye,
  FileText,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { InfiniteNewsFeed } from '@/components/discover/InfiniteNewsFeed'


const interests = [
  'Tech & Science',
  'Finance',
  'Arts & Culture',
  'Sports',
  'Entertainment'
]

const marketData = {
  sp500: { value: '0.861', change: -0.85, label: 'Bitcoin' },
  nasdaq: { value: '26,744.75', change: -4.13, label: 'VIX' }
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'top' | 'topics'>('top')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [featuredArticle, setFeaturedArticle] = useState<any>(null)
  const [newsCards, setNewsCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load saved interests from localStorage
    const saved = localStorage.getItem('userInterests')
    if (saved) {
      setSelectedInterests(JSON.parse(saved))
    }
  }, [])

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const [featuredRes, topRes] = await Promise.all([
          fetch('/api/news?type=featured'),
          fetch('/api/news?type=top')
        ])

        const [featuredData, topData] = await Promise.all([
          featuredRes.json(),
          topRes.json()
        ])

        if (featuredData.success || featuredData.fallback) {
          setFeaturedArticle(featuredData.data)
        }
        if (topData.success || topData.fallback) {
          setNewsCards(topData.data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 300000)
    return () => clearInterval(interval)
  }, [])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      const newInterests = prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
      return newInterests
    })
  }

  const saveInterests = () => {
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests))
    alert(`Saved ${selectedInterests.length} interests successfully!`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">📰</div>
            <h1 className="text-4xl font-serif font-light italic text-foreground">
              Discover
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab('top')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'top'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star className="size-4 inline mr-2" />
              Top
              {activeTab === 'top' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'topics'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Newspaper className="size-4 inline mr-2" />
              Topics
              {activeTab === 'topics' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Featured Article */}
        {loading || !featuredArticle ? (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 h-64 animate-pulse">
            <div className="flex gap-6 h-full">
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
              <div className="w-80 h-48 bg-muted rounded-xl"></div>
            </div>
          </div>
        ) : (
          <a
            href={featuredArticle.url || `/search?q=${encodeURIComponent(featuredArticle.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block group mb-8"
          >
            <div className="flex gap-6 rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground text-base mb-4 leading-relaxed">
                  {featuredArticle.summary}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="size-4" />
                    {featuredArticle.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="size-4" />
                    {featuredArticle.sources} sources
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                    {featuredArticle.source}
                  </span>
                  <span>Published {featuredArticle.publishedHours} hours ago</span>
                </div>
              </div>
              <div className="w-80 h-48 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </div>
          </a>
        )}

        {/* Infinite News Feed */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Latest News</h2>
          <InfiniteNewsFeed interests={selectedInterests} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border p-6 space-y-6">
        {/* Make it yours */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-5">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="size-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Make it yours
              </h3>
              <p className="text-xs text-muted-foreground">
                Select topics and interests to customize your Discover feed
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedInterests.includes(interest)
                    ? 'bg-primary text-primary-foreground border border-primary'
                    : 'bg-accent border border-border hover:border-primary/50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <button
            onClick={saveInterests}
            disabled={selectedInterests.length === 0}
            className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Interests ({selectedInterests.length})
          </button>
        </div>

        {/* Weather Widget */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cloud className="size-5 text-primary" />
              <span className="font-semibold text-foreground">26°</span>
              <span className="text-xs text-muted-foreground">°C</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Partly cloudy
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Accra</div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Mon</div>
              <div className="text-foreground">28°</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Tue</div>
              <div className="text-foreground">27°</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Wed</div>
              <div className="text-foreground">30°</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground mb-1">Thu</div>
              <div className="text-foreground">29°</div>
            </div>
          </div>
        </div>

        {/* Market Outlook */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            Market Outlook
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">
                  S&P Futures
                </div>
                <div className="text-xs text-muted-foreground">
                  {marketData.sp500.label}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  {marketData.sp500.value}
                </div>
                <div className="text-xs text-destructive">
                  {marketData.sp500.change}%
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">
                  NASDAQ
                </div>
                <div className="text-xs text-muted-foreground">
                  {marketData.nasdaq.label}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  {marketData.nasdaq.value}
                </div>
                <div className="text-xs text-destructive">
                  {marketData.nasdaq.change}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
