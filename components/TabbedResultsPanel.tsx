'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { BinaryLoadingPlaceholder } from './BinaryLoadingPlaceholder'

/**
 * TabbedResultsPanel
 * Holistic panel with All/Images/Videos/Financials tabs
 * Feels like one canvas changing shape, not different pages
 * Only appears in chat/search context
 */

export type TabType = 'all' | 'images' | 'videos' | 'financials'

interface TabbedResultsPanelProps {
  initialTab?: TabType
  searchQuery?: string
  isLoading?: boolean
  className?: string
  onTabChange?: (tab: TabType) => void
  children?: React.ReactNode
}

interface TabConfig {
  id: TabType
  label: string
  icon: React.ElementType
  description: string
}

const tabs: TabConfig[] = [
  {
    id: 'all',
    label: 'All',
    icon: Sparkles,
    description: 'Comprehensive results across all sources'
  },
  {
    id: 'images',
    label: 'Images',
    icon: ImageIcon,
    description: 'Visual content and imagery'
  },
  {
    id: 'videos',
    label: 'Videos',
    icon: Video,
    description: 'Video content and media'
  },
  {
    id: 'financials',
    label: 'Financials',
    icon: TrendingUp,
    description: 'Market data and financial insights'
  }
]

export function TabbedResultsPanel({
  initialTab = 'all',
  searchQuery,
  isLoading = false,
  className = '',
  onTabChange,
  children
}: TabbedResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      {/* Tab Navigation */}
      <div className="sticky top-[72px] z-40 glass border-b border-border/40 px-6 py-4">
        <div className="max-w-[1400px] mx-auto">
          {/* Search Query Display */}
          {searchQuery && (
            <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                {searchQuery}
              </h1>
              <p className="text-sm text-muted-foreground">
                Searching across all sources...
              </p>
            </div>
          )}

          {/* Tab Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300',
                    'hover:scale-105 active:scale-95 shrink-0',
                    isActive
                      ? 'neu-raised text-foreground font-medium shadow-neu'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                  )}
                  title={tab.description}
                >
                  <Icon
                    className={cn(
                      'size-4 transition-colors duration-300',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span className="text-sm">{tab.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"
                      style={{
                        animation: 'scale-in 0.3s ease-out'
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Area with Morphing */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {isLoading ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Loading State with Binary Placeholders */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 neu-raised px-6 py-4 rounded-2xl">
                  <Loader2 className="size-5 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Processing your query...
                  </span>
                </div>
              </div>

              <BinaryLoadingPlaceholder lines={8} />

              {/* Pulsing Status */}
              <div className="flex justify-center">
                <div className="neu-inset px-8 py-4 rounded-xl">
                  <p className="text-sm text-muted-foreground text-center">
                    Analyzing sources across {activeTab === 'all' ? 'all categories' : tabs.find(t => t.id === activeTab)?.label.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'animate-in fade-in slide-in-from-bottom-4 duration-700',
                'transition-all duration-500'
              )}
              key={activeTab} // Re-mount on tab change for animation
            >
              {children || (
                <EmptyState
                  tab={activeTab}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: translateX(-50%) scaleX(0);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) scaleX(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * EmptyState
 * Shown when no results are available for a tab
 */
function EmptyState({
  tab,
  searchQuery
}: {
  tab: TabType
  searchQuery?: string
}) {
  const tabConfig = tabs.find(t => t.id === tab)
  const Icon = tabConfig?.icon || Sparkles

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="neu-raised rounded-3xl p-8 max-w-md">
        <div className="neu-inset rounded-2xl p-6 mb-6 inline-flex">
          <Icon className="size-12 text-muted-foreground/50" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-3">
          {searchQuery ? 'No results found' : 'Start your search'}
        </h3>

        <p className="text-sm text-muted-foreground mb-6">
          {searchQuery
            ? `We couldn't find any ${tabConfig?.label.toLowerCase()} results for "${searchQuery}"`
            : `Enter a query to see ${tabConfig?.label.toLowerCase()} results here`}
        </p>

        {searchQuery && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Try:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Refining your search', 'Different keywords', 'Another category'].map((suggestion, i) => (
                <span
                  key={i}
                  className="neu-inset px-3 py-1.5 rounded-lg text-xs text-foreground/80"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * TabbedResultsPanelContent
 * Wrapper for tab-specific content with consistent styling
 */
export function TabbedResultsPanelContent({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  )
}

/**
 * ResultCard
 * Neumorphic card for individual results
 */
export function ResultCard({
  children,
  className = '',
  onClick
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'neu-card rounded-2xl p-6 transition-all duration-300',
        'hover:shadow-neu-lg hover:scale-[1.02]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
