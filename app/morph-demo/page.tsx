'use client'

import { MorphingCanvas } from '@/components/MorphingCanvas'
import {
  TabbedResultsPanel,
  TabbedResultsPanelContent,
  ResultCard,
  type TabType
} from '@/components/TabbedResultsPanel'
import { useState } from 'react'
import { ExternalLink, Clock, TrendingUp } from 'lucide-react'

/**
 * Morph Demo Page
 * Demonstrates the complete morphing experience:
 * Eye → Search → Loading → Results with Tabs
 */

export default function MorphDemoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [showResults, setShowResults] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // MorphingCanvas will handle the morphing sequence
    // After morphing completes, show results
    setTimeout(() => {
      setShowResults(true)
    }, 4500) // After eye-to-content transition
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  return (
    <div className="w-full h-screen bg-background">
      {showResults ? (
        // Results View with Tabbed Panel
        <TabbedResultsPanel
          searchQuery={searchQuery}
          isLoading={false}
          initialTab={activeTab}
          onTabChange={handleTabChange}
        >
          <TabbedResultsPanelContent>
            {/* Sample Results */}
            <div className="grid gap-6">
              {/* Result 1 */}
              <ResultCard>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="neu-inset px-2 py-1 rounded-lg text-xs text-muted-foreground">
                        Article
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        2 hours ago
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Understanding {searchQuery}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      A comprehensive overview of {searchQuery.toLowerCase()}, covering
                      the latest developments, key insights, and practical
                      applications in the field.
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="#"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Read more
                        <ExternalLink className="size-3" />
                      </a>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="size-3" />
                        <span>Trending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ResultCard>

              {/* Result 2 */}
              <ResultCard>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="neu-inset px-2 py-1 rounded-lg text-xs text-muted-foreground">
                        Research
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        5 hours ago
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Latest Research on {searchQuery}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Recent academic findings and breakthroughs related to{' '}
                      {searchQuery.toLowerCase()}, compiled from leading
                      institutions and research journals.
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="#"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View paper
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </ResultCard>

              {/* Result 3 */}
              <ResultCard>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="neu-inset px-2 py-1 rounded-lg text-xs text-muted-foreground">
                        Guide
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        1 day ago
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Practical Guide: {searchQuery}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Step-by-step instructions and best practices for working
                      with {searchQuery.toLowerCase()}, including common
                      pitfalls and optimization techniques.
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="#"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Start learning
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </ResultCard>
            </div>
          </TabbedResultsPanelContent>
        </TabbedResultsPanel>
      ) : (
        // Morphing Canvas View (Eye → Search → Loading)
        <MorphingCanvas
          onSearchSubmit={handleSearch}
          autoProgress={true}
        />
      )}
    </div>
  )
}
