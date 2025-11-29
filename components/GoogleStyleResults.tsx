'use client'

import React, { useState } from 'react'
import { ResultCard } from './TabbedResultsPanel'
import { ExternalLink, Clock, TrendingUp, Image as ImageIcon, Video, DollarSign, ChevronDown, ChevronUp, Play, Search, Settings, MessageSquare, Globe, Newspaper, ShoppingCart, Map, TrendingUpIcon } from 'lucide-react'

/**
 * GoogleStyleResults
 * Google-inspired results layout with AI commentary at top
 * and search results with integrated sidebar content from other tabs
 */

interface GoogleStyleResultsProps {
  searchQuery: string
  aiCommentary?: string
  results?: SearchResult[]
  images?: any[]
  videos?: any[]
  className?: string
}

interface SearchResult {
  title: string
  url: string
  description: string
  source: string
  timestamp?: string
  trending?: boolean
}

export function GoogleStyleResults({
  searchQuery,
  aiCommentary,
  results = [],
  images = [],
  videos = [],
  className = ''
}: GoogleStyleResultsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [searchInput, setSearchInput] = useState(searchQuery)

  const handleSearch = (query: string) => {
    if (!query.trim()) return

    // Generate a new chat ID and navigate to morphic chat page
    const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search/${newChatId}?q=${encodeURIComponent(query)}` }
    }))
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchInput)
  }

  const defaultCommentary = `Based on current information about "${searchQuery}", here's what you need to know:`

  const defaultResults: SearchResult[] = [
    {
      title: `Understanding ${searchQuery}`,
      url: 'https://example.com',
      description: `A comprehensive overview of ${searchQuery.toLowerCase()}, covering the latest developments, key insights, and practical applications in the field.`,
      source: 'Example Source',
      timestamp: '2 hours ago',
      trending: true
    },
    {
      title: `Latest Research on ${searchQuery}`,
      url: 'https://example.com',
      description: `Recent academic findings and breakthroughs related to ${searchQuery.toLowerCase()}, compiled from leading institutions and research journals.`,
      source: 'Research Portal',
      timestamp: '5 hours ago'
    },
    {
      title: `Practical Guide: ${searchQuery}`,
      url: 'https://example.com',
      description: `Step-by-step instructions and best practices for working with ${searchQuery.toLowerCase()}, including common pitfalls and optimization techniques.`,
      source: 'Tech Guide',
      timestamp: '1 day ago'
    }
  ]

  const peopleAlsoAsk = [
    {
      question: `What is ${searchQuery}?`,
      answer: `${searchQuery} refers to a specific topic or concept. It encompasses various aspects and has gained attention for its relevance in the current context.`
    },
    {
      question: `How does ${searchQuery} work?`,
      answer: `The underlying mechanisms involve several key components that work together to achieve the desired outcome. Understanding these principles is essential for practical application.`
    },
    {
      question: `What are the benefits of ${searchQuery}?`,
      answer: `There are numerous advantages including improved efficiency, better outcomes, and enhanced user experience. Many experts recommend considering these benefits when evaluating options.`
    },
    {
      question: `Where can I learn more about ${searchQuery}?`,
      answer: `Resources include academic publications, online courses, professional communities, and specialized websites dedicated to this subject matter.`
    }
  ]

  const relatedSearches = [
    `${searchQuery} tutorial`,
    `${searchQuery} examples`,
    `best ${searchQuery}`,
    `${searchQuery} vs alternatives`,
    `${searchQuery} guide`,
    `how to use ${searchQuery}`,
  ]

  const displayResults = results.length > 0 ? results : defaultResults
  const [activeTab, setActiveTab] = useState('All')

  const tabs = [
    { name: 'Chat', icon: MessageSquare },
    { name: 'All', icon: Globe },
    { name: 'Images', icon: ImageIcon },
    { name: 'Videos', icon: Video },
    { name: 'News', icon: Newspaper },
    { name: 'Templates', icon: TrendingUpIcon },
  ]

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)

    // Navigate to specific pages or trigger chat sessions based on tab
    switch (tab) {
      case 'Chat':
        // Start a new chat session with the current search query
        handleSearch(searchQuery)
        break
      case 'Images':
        window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/images' } }))
        break
      case 'Videos':
        window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/videos' } }))
        break
      case 'News':
        // Trigger chat session with news query
        handleSearch(`${searchQuery} news`)
        break
      case 'Templates':
        // Navigate to templates or trigger search
        handleSearch(`${searchQuery} templates`)
        break
      default:
        // 'All' tab just stays on current page
        break
    }
  }

  return (
    <div className={`${className}`}>
      {/* Search Bar at Top */}
      <div className="px-4 lg:px-8 py-4 border-b border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-3xl">
              <div className="neu-input rounded-full px-6 py-3 flex items-center gap-3">
                <Search className="size-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSearchSubmit(e as any)
                    }
                  }}
                  className="flex-1 bg-transparent outline-none text-foreground text-base"
                  placeholder="Search..."
                />
                <Settings className="size-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 lg:px-8 border-b border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.name
                      ? 'neu-raised text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            About {displayResults.length * 1000} results (0.42 seconds)
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* AI Commentary Section - Google-style summary */}
          <div className="neu-raised rounded-3xl p-6 lg:p-8 border-l-4 border-primary/30">
            <div className="flex items-start gap-6">
              <div className="neu-inset rounded-full p-4 shrink-0">
                <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-3">
                  <span>AI Overview</span>
                  <span className="neu-inset px-3 py-1 rounded-lg text-xs text-muted-foreground font-normal">
                    Experimental
                  </span>
                </h3>
                <p className="text-base text-foreground/90 leading-relaxed">
                  {aiCommentary || defaultCommentary}
                </p>
              </div>
            </div>
          </div>

          {/* Short Videos Carousel */}
          {videos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Short videos</h3>
              <div className="relative -mx-4 lg:-mx-0">
                <div className="flex gap-3 overflow-x-auto px-4 lg:px-0 pb-4 scrollbar-hide snap-x snap-mandatory">
                  {videos.slice(0, 6).map((video, i) => (
                    <a
                      key={i}
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-card rounded-2xl overflow-hidden flex-shrink-0 w-56 snap-start group"
                    >
                      <div className="relative aspect-video bg-background/50">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="neu-raised rounded-full p-3">
                            <Play className="size-5 text-primary fill-primary" />
                          </div>
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-foreground font-medium line-clamp-2 mb-1">
                          {video.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{video.channel}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid: Search Results + Right Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Search Results (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-5">
                {displayResults.map((result, index) => (
                  <ResultCard key={index}>
                    <div className="space-y-3">
                      {/* Source and URL */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground font-medium">{result.source}</span>
                        {result.timestamp && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3" />
                              {result.timestamp}
                            </span>
                          </>
                        )}
                        {result.trending && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="size-3" />
                              <span className="text-xs font-medium">Trending</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="text-xl font-semibold text-primary hover:underline cursor-pointer leading-snug">
                          {result.title}
                        </h3>
                      </a>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.description}
                      </p>
                    </div>
                  </ResultCard>
                ))}
              </div>

              {/* People Also Ask Section */}
              <div className="neu-card rounded-2xl p-5 space-y-2">
                <h3 className="text-base font-semibold text-foreground mb-2">People also ask</h3>
                <div className="space-y-0">
                  {peopleAlsoAsk.map((item, index) => (
                    <div key={index} className="border-b border-border/30 last:border-0">
                      <button
                        onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                        className="w-full flex items-center justify-between py-3 text-left group"
                      >
                        <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors pr-4">
                          {item.question}
                        </span>
                        {expandedQuestion === index ? (
                          <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {expandedQuestion === index && (
                        <div className="pb-3 pl-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar: Integrated Content (1/3) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Images Section */}
              <div className="neu-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Related Images</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {images.length > 0 ? (
                    images.slice(0, 4).map((image, i) => (
                      <a
                        key={i}
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neu-inset rounded-lg aspect-square bg-background/50 overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
                      >
                        <img
                          src={image.thumbnail || image.url}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </a>
                    ))
                  ) : (
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="neu-inset rounded-lg aspect-square bg-background/50 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Image {i}</span>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/images' } }))}
                  className="text-xs text-primary hover:underline mt-3 inline-block font-medium"
                >
                  View all images →
                </button>
              </div>

              {/* Videos Section */}
              <div className="neu-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Related Videos</h3>
                </div>
                <div className="space-y-3">
                  {videos.length > 0 ? (
                    videos.slice(0, 2).map((video, i) => (
                      <a
                        key={i}
                        href={video.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block space-y-2 group"
                      >
                        <div className="neu-inset rounded-lg aspect-video bg-background/50 overflow-hidden hover:scale-102 transition-transform cursor-pointer relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                              {video.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground font-medium line-clamp-2">
                          {video.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {video.channel}
                        </p>
                      </a>
                    ))
                  ) : (
                    [1, 2].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="neu-inset rounded-lg aspect-video bg-background/50 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Video {i}</span>
                        </div>
                        <p className="text-xs text-foreground font-medium line-clamp-2">
                          Video about {searchQuery}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/videos' } }))}
                  className="text-xs text-primary hover:underline mt-3 inline-block font-medium"
                >
                  View all videos →
                </button>
              </div>

              {/* Financials Section */}
              <div className="neu-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="size-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-foreground">Market Data</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { symbol: 'AAPL', price: '$182.45', change: '+2.3%', up: true },
                    { symbol: 'GOOGL', price: '$145.67', change: '-0.8%', up: false },
                    { symbol: 'MSFT', price: '$389.21', change: '+1.5%', up: true }
                  ].map((stock, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 neu-inset rounded-lg">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.price}</p>
                      </div>
                      <span className={`text-xs font-semibold ${stock.up ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/finance' } }))}
                  className="text-xs text-primary hover:underline mt-3 inline-block font-medium"
                >
                  View all data →
                </button>
              </div>
            </div>
          </div>

          {/* People Also Search For */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">People also search for</h3>
            <div className="flex flex-wrap gap-2">
              {relatedSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="neu-card px-4 py-2 rounded-full text-xs text-foreground font-medium hover:bg-primary/5 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button className="neu-card rounded-full w-9 h-9 flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-primary/5 transition-colors">
              ‹
            </button>
            <button className="neu-raised rounded-full w-9 h-9 flex items-center justify-center text-sm font-medium text-white bg-blue-600">
              1
            </button>
            <button className="neu-card rounded-full w-9 h-9 flex items-center justify-center text-sm font-medium text-foreground hover:bg-primary/5 transition-colors">
              2
            </button>
            <button className="neu-card rounded-full w-9 h-9 flex items-center justify-center text-sm font-medium text-foreground hover:bg-primary/5 transition-colors">
              3
            </button>
            <button className="neu-card rounded-full w-9 h-9 flex items-center justify-center text-sm font-medium text-foreground hover:bg-primary/5 transition-colors">
              4
            </button>
            <button className="neu-card rounded-full w-9 h-9 flex items-center justify-center text-sm font-medium text-foreground hover:bg-primary/5 transition-colors">
              5
            </button>
            <button className="neu-card rounded-full w-9 h-9 flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-primary/5 transition-colors">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
