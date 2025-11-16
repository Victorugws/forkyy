'use client'

import { useState } from 'react'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { TabbedResultsPanel, TabbedResultsPanelContent, ResultCard } from '@/components/TabbedResultsPanel'

/**
 * Morphing Home Page
 * Replaces the traditional chat interface with the morphing experience:
 * Eye → Search → Loading → Tabbed Results
 *
 * Navigate to /morph-home to see this in action
 */

export default function MorphHomePage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // After morphing sequence completes, show results
    setTimeout(() => {
      setHasSearched(true)
    }, 4500)
  }

  if (hasSearched) {
    return (
      <div className="w-full min-h-screen bg-background">
        <TabbedResultsPanel
          searchQuery={searchQuery}
          isLoading={false}
        >
          <TabbedResultsPanelContent>
            <div className="grid gap-6">
              <ResultCard>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    Welcome to the Morphing Interface
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ve just experienced the complete morphing sequence: Eye animation → Search interface → Binary loading → Results panel.
                  </p>
                  <div className="flex gap-2 flex-wrap mt-4">
                    <span className="neu-inset px-3 py-1.5 rounded-lg text-xs text-foreground">
                      Neumorphic Design
                    </span>
                    <span className="neu-inset px-3 py-1.5 rounded-lg text-xs text-foreground">
                      Smooth Transitions
                    </span>
                    <span className="neu-inset px-3 py-1.5 rounded-lg text-xs text-foreground">
                      Unified Canvas
                    </span>
                  </div>
                </div>
              </ResultCard>

              <ResultCard>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Results for &quot;{searchQuery}&quot;
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This is where your search results would appear. The interface maintains the neumorphic white theme throughout all morphing states.
                  </p>
                </div>
              </ResultCard>

              <ResultCard>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Explore More Pages
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check out these other morphing demos:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { href: '/morph-showcase', label: 'Showcase' },
                      { href: '/images-morph', label: 'Images' },
                      { href: '/finance-morph', label: 'Finance' },
                      { href: '/morph-demo', label: 'Demo' }
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="neu-button rounded-xl p-3 text-center hover:shadow-neu-lg transition-all text-sm font-medium"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </ResultCard>
            </div>
          </TabbedResultsPanelContent>
        </TabbedResultsPanel>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background -mt-[72px]">
      <MorphingCanvas
        onSearchSubmit={handleSearch}
        autoProgress={true}
      />
    </div>
  )
}
