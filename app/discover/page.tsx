'use client'

import {
  Newspaper,
  Star,
  Cloud,
  TrendingUp,
  Eye,
  FileText,
  Sparkles,
  Globe,
  Image as ImageIcon,
  Video
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { InfiniteNewsFeed } from '@/components/discover/InfiniteNewsFeed'

type ContentTab = 'all' | 'images' | 'videos' | 'news'

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
  const [activeTab, setActiveTab] = useState<ContentTab>('all')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [featuredArticle, setFeaturedArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imageResults, setImageResults] = useState<any[]>([])
  const [videoResults, setVideoResults] = useState<any[]>([])

  useEffect(() => {
    // Load saved interests from localStorage
    const saved = localStorage.getItem('userInterests')
    if (saved) {
      setSelectedInterests(JSON.parse(saved))
    }
  }, [])

  // Fetch news data (latest news, not topic-based)
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const featuredRes = await fetch('/api/news?type=featured')
        const featuredData = await featuredRes.json()

        if (featuredData.success || featuredData.fallback) {
          setFeaturedArticle(featuredData.data)
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

  // Fetch images when Images tab is active
  useEffect(() => {
    if (activeTab === 'images') {
      const fetchImages = async () => {
        try {
          const res = await fetch('/api/images?query=latest+news')
          const data = await res.json()
          if (data.success || data.fallback) {
            setImageResults(data.data || [])
          }
        } catch (error) {
          console.error('Error fetching images:', error)
        }
      }
      fetchImages()
    }
  }, [activeTab])

  // Fetch videos when Videos tab is active
  useEffect(() => {
    if (activeTab === 'videos') {
      const fetchVideos = async () => {
        try {
          const res = await fetch('/api/videos?query=latest+news&category=News')
          const data = await res.json()
          if (data.success || data.fallback) {
            setVideoResults(data.data || [])
          }
        } catch (error) {
          console.error('Error fetching videos:', error)
        }
      }
      fetchVideos()
    }
  }, [activeTab])

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
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'all'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="size-4 inline mr-2" />
              All
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'images'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ImageIcon className="size-4 inline mr-2" />
              Images
              {activeTab === 'images' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'videos'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Video className="size-4 inline mr-2" />
              Videos
              {activeTab === 'videos' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'news'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Newspaper className="size-4 inline mr-2" />
              News
              {activeTab === 'news' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* All Tab & News Tab - Show Featured Article + Infinite News Feed */}
        {(activeTab === 'all' || activeTab === 'news') && (
          <>
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
          </>
        )}

        {/* Images Tab - Show Image Grid */}
        {activeTab === 'images' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Latest Images</h2>
            {imageResults.length === 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {imageResults.map((image, index) => (
                  <a
                    key={index}
                    href={image.url || image.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all">
                      <div className="aspect-square bg-muted">
                        <img
                          src={image.thumbnail || image.url}
                          alt={image.title || 'Image'}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      {image.title && (
                        <div className="p-3">
                          <p className="text-sm text-muted-foreground line-clamp-1">{image.title}</p>
                          {image.source && (
                            <p className="text-xs text-muted-foreground/70 mt-1">{image.source}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videos Tab - Show Video Grid */}
        {activeTab === 'videos' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Latest Videos</h2>
            {videoResults.length === 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-video bg-muted rounded-xl animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {videoResults.map((video, index) => (
                  <a
                    key={index}
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all">
                      <div className="relative aspect-video bg-muted">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{video.channel}</span>
                          {video.views && (
                            <>
                              <span>•</span>
                              <span>{video.views} views</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
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
