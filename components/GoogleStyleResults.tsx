'use client'

import React from 'react'
import { ResultCard } from './TabbedResultsPanel'
import { ExternalLink, Clock, TrendingUp } from 'lucide-react'

/**
 * GoogleStyleResults
 * Google-inspired results layout with AI commentary at top
 * and search results underneath
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
    <div className={`space-y-6 ${className}`}>
      {/* AI Commentary Section - Google-style summary */}
      <div className="neu-raised rounded-2xl p-6 border-l-4 border-primary/30">
        <div className="flex items-start gap-4">
          <div className="neu-inset rounded-full p-3 shrink-0">
            <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <span>AI Overview</span>
              <span className="neu-inset px-2 py-0.5 rounded-md text-xs text-muted-foreground font-normal">
                Experimental
              </span>
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {aiCommentary || defaultCommentary}
            </p>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground px-2">
          Search Results
        </h2>

        {displayResults.map((result, index) => (
          <ResultCard key={index}>
            <div className="space-y-2">
              {/* Source and URL */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{result.source}</span>
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
                      <span className="text-xs">Trending</span>
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                {result.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Visit page
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </ResultCard>
        ))}
      </div>
    </div>
  )
}
