'use client'

import React from 'react'
import { ResultCard } from './TabbedResultsPanel'
import { ExternalLink, Clock, TrendingUp, Image as ImageIcon, Video, DollarSign } from 'lucide-react'

/**
 * GoogleStyleResults
 * Google-inspired results layout with AI commentary at top
 * and search results with integrated sidebar content from other tabs
 */

interface GoogleStyleResultsProps {
  searchQuery: string
  aiCommentary?: string
  results?: SearchResult[]
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
  className = ''
}: GoogleStyleResultsProps) {
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

  const displayResults = results.length > 0 ? results : defaultResults

  return (
    <div className={`space-y-12 ${className}`}>
      {/* AI Commentary Section - Google-style summary */}
      <div className="neu-raised rounded-3xl p-8 border-l-4 border-primary/30">
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

      {/* Main Content Grid: Search Results + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Search Results (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Search Results
          </h2>

          <div className="space-y-8">
            {displayResults.map((result, index) => (
              <ResultCard key={index}>
                <div className="space-y-4">
                  {/* Source and URL */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground font-medium">{result.source}</span>
                    {result.timestamp && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          {result.timestamp}
                        </span>
                      </>
                    )}
                    {result.trending && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="flex items-center gap-1.5 text-green-600">
                          <TrendingUp className="size-3.5" />
                          <span className="text-xs font-medium">Trending</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-primary hover:underline cursor-pointer leading-tight">
                    {result.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {result.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-2">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-2 font-medium"
                    >
                      Visit page
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              </ResultCard>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Integrated Content (1/3) */}
        <div className="lg:col-span-1 space-y-10">
          {/* Images Section */}
          <div className="neu-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Related Images</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="neu-inset rounded-xl aspect-square bg-background/50 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-xs text-muted-foreground">Image {i}</span>
                </div>
              ))}
            </div>
            <a href="#" className="text-sm text-primary hover:underline mt-4 inline-block font-medium">
              View all images →
            </a>
          </div>

          {/* Videos Section */}
          <div className="neu-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Video className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Related Videos</h3>
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="neu-inset rounded-xl aspect-video bg-background/50 flex items-center justify-center hover:scale-102 transition-transform cursor-pointer">
                    <span className="text-xs text-muted-foreground">Video {i}</span>
                  </div>
                  <p className="text-xs text-foreground font-medium line-clamp-2">
                    Video about {searchQuery}
                  </p>
                </div>
              ))}
            </div>
            <a href="#" className="text-sm text-primary hover:underline mt-4 inline-block font-medium">
              View all videos →
            </a>
          </div>

          {/* Financials Section */}
          <div className="neu-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="size-5 text-green-600" />
              <h3 className="text-base font-semibold text-foreground">Market Data</h3>
            </div>
            <div className="space-y-4">
              {[
                { symbol: 'AAPL', price: '$182.45', change: '+2.3%', up: true },
                { symbol: 'GOOGL', price: '$145.67', change: '-0.8%', up: false },
                { symbol: 'MSFT', price: '$389.21', change: '+1.5%', up: true }
              ].map((stock, i) => (
                <div key={i} className="flex items-center justify-between p-3 neu-inset rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground">{stock.price}</p>
                  </div>
                  <span className={`text-sm font-semibold ${stock.up ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change}
                  </span>
                </div>
              ))}
            </div>
            <a href="#" className="text-sm text-primary hover:underline mt-4 inline-block font-medium">
              View all data →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
