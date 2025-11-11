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
import { useState } from 'react'

const featuredArticle = {
  title: 'Trump says US close to trade deal with India',
  summary:
    'The president says tariff will lower the current 50% tariff rate, citing India\'s reduced Russian oil purchases after imposing tariffs earlier this year.',
  image:
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=500&fit=crop',
  source: 'reuters',
  views: '1M',
  sources: 92,
  publishedHours: 7
}

const newsCards = [
  {
    title: 'Private credit market tops $3T as regulators warn of risks',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    source: 'reuters',
    views: '75K',
    sources: 45,
    publishedHours: 12
  },
  {
    title: 'Ukraine raids Zelensky ally in $300M energy kickback scheme',
    image:
      'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&h=300&fit=crop',
    source: 'ap',
    views: '58K',
    sources: 34,
    publishedHours: 8
  },
  {
    title: 'China curbs fentanyl chemical exports after Trump deal',
    image:
      'https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=400&h=300&fit=crop',
    source: 'wsj',
    views: '94K',
    sources: 68,
    publishedHours: 5
  }
]

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
        <Link
          href={`/search?q=${encodeURIComponent(featuredArticle.title)}`}
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
        </Link>

        {/* News Grid */}
        <div className="grid grid-cols-3 gap-4">
          {newsCards.map((card, index) => (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(card.title)}`}
              className="group"
            >
              <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all">
                <div className="relative h-40">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" />
                      {card.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" />
                      {card.sources}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent border border-border hover:border-primary/50 transition-colors"
              >
                {interest}
              </button>
            ))}
          </div>
          <button className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            Save Interests
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
