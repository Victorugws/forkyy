'use client'

import { useState } from 'react'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { TabbedResultsPanel, TabbedResultsPanelContent, ResultCard, type TabType } from '@/components/TabbedResultsPanel'
import { GoogleStyleResults } from '@/components/GoogleStyleResults'

/**
 * Main Chat Interface
 * Uses morphing experience:
 * Eye → Blank Canvas → Search Grows → Tabbed Results with Chat and All (Google-style) tabs
 */

export default function HomePage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // After morphing sequence completes, show results
    // Total: 4500ms (search fades to canvas) + 3000ms (content fades from canvas) = 7500ms
    setTimeout(() => {
      setHasSearched(true)
    }, 7500) // After full morphing sequence
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  if (hasSearched) {
    return (
      <div className="w-full min-h-screen bg-background">
        <TabbedResultsPanel
          searchQuery={searchQuery}
          isLoading={false}
          initialTab={activeTab}
          onTabChange={handleTabChange}
        >
          <TabbedResultsPanelContent>
            {/* Google-style results for "All" tab */}
            {activeTab === 'all' && (
              <GoogleStyleResults
                searchQuery={searchQuery}
                aiCommentary={`${searchQuery} encompasses several key aspects. Here's a comprehensive overview based on the latest information: The topic has evolved significantly, with recent developments showing promising directions for future applications and research.`}
              />
            )}

            {/* Chat tab content */}
            {activeTab === 'chat' && (
              <div className="space-y-6">
                <ResultCard>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      Chat Mode
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Conversational AI responses about &quot;{searchQuery}&quot; appear here. This mode provides interactive dialogue with follow-up questions.
                    </p>
                  </div>
                </ResultCard>
              </div>
            )}

            {/* Images tab content */}
            {activeTab === 'images' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="neu-card rounded-2xl p-2">
                    <div className="neu-inset rounded-xl aspect-square bg-background/50 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Image {i}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Videos tab content */}
            {activeTab === 'videos' && (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <ResultCard key={i}>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">Video Result {i}</h3>
                      <p className="text-sm text-muted-foreground">Video content about {searchQuery}</p>
                    </div>
                  </ResultCard>
                ))}
              </div>
            )}

            {/* Financials tab content */}
            {activeTab === 'financials' && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <ResultCard key={i}>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">Financial Data {i}</h3>
                      <p className="text-sm text-muted-foreground">Market insights related to {searchQuery}</p>
                    </div>
                  </ResultCard>
                ))}
              </div>
            )}
          </TabbedResultsPanelContent>
        </TabbedResultsPanel>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <MorphingCanvas
        onSearchSubmit={handleSearch}
        autoProgress={true}
      />
    </div>
  )
}
