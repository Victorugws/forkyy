'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { DottedBorderCard } from '@/components/ui/dotted-border-card'

interface Source {
  id: string
  title: string
  url?: string
  snippet?: string
}

interface SourcesPanelProps {
  sources?: Source[]
  className?: string
}

export function SourcesPanel({ sources = [], className }: SourcesPanelProps) {
  return (
    <div
      className={cn(
        'fixed right-6 top-24 bottom-40 w-80',
        'overflow-y-auto z-10',
        className
      )}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
      }}
    >
      <DottedBorderCard
        borderRadius="1rem"
        padding="p-4"
        className="w-full"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          Sources...
        </h3>
        
        <div className="space-y-3">
          {sources.length === 0 ? (
            // Empty source placeholders
            Array.from({ length: 5 }).map((_, index) => (
              <DottedBorderCard
                key={index}
                borderRadius="0.5rem"
                padding="p-3"
                background="bg-gray-50/50"
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </DottedBorderCard>
            ))
          ) : (
            sources.map((source, index) => (
              <DottedBorderCard
                key={source.id || index}
                borderRadius="0.5rem"
                padding="p-3"
                background="bg-white/50 hover:bg-white/80 transition-colors"
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs text-gray-600 font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2 mb-1"
                    >
                      {source.title}
                    </a>
                  ) : (
                    <div className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                      {source.title}
                    </div>
                  )}
                  {source.snippet && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {source.snippet}
                    </p>
                  )}
                </div>
              </DottedBorderCard>
            ))
          )}
        </div>
      </DottedBorderCard>
    </div>
  )
}

