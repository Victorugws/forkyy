'use client'

import { useState } from 'react'
import { AnimatedEyeBackground } from '@/components/AnimatedEyeBackground'
import { SearchInterface } from '@/components/SearchInterface'
import { BinaryLoadingPlaceholder } from '@/components/BinaryLoadingPlaceholder'
import { TabbedResultsPanel, ResultCard, TabbedResultsPanelContent } from '@/components/TabbedResultsPanel'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { PageMorphWrapper } from '@/components/PageMorphWrapper'
import { Eye, Search, Binary, Layers, Sparkles, Layout, PlayCircle } from 'lucide-react'

/**
 * Morph Showcase Page
 * Comprehensive demo of all morphing components and animations
 * Allows testing different configurations and transitions
 */

type DemoMode =
  | 'eye-only'
  | 'search-only'
  | 'binary-only'
  | 'full-morph'
  | 'tabbed-results'
  | 'page-wrapper'

interface DemoConfig {
  id: DemoMode
  label: string
  description: string
  icon: React.ElementType
}

const demoModes: DemoConfig[] = [
  {
    id: 'eye-only',
    label: 'Eye Animation',
    description: 'Pure neumorphic eye with breathing animation',
    icon: Eye
  },
  {
    id: 'search-only',
    label: 'Search Interface',
    description: 'Codepen-inspired search with neumorphic styling',
    icon: Search
  },
  {
    id: 'binary-only',
    label: 'Binary Loading',
    description: 'Animated 0s and 1s placeholders',
    icon: Binary
  },
  {
    id: 'full-morph',
    label: 'Full Morphing',
    description: 'Complete Eye → Search → Loading → Content sequence',
    icon: Layers
  },
  {
    id: 'tabbed-results',
    label: 'Tabbed Results',
    description: 'Holistic panel with All/Images/Videos/Financials tabs',
    icon: Sparkles
  },
  {
    id: 'page-wrapper',
    label: 'Page Wrapper',
    description: 'Full page morphing integration example',
    icon: Layout
  }
]

export default function MorphShowcasePage() {
  const [selectedMode, setSelectedMode] = useState<DemoMode>('full-morph')
  const [isPlaying, setIsPlaying] = useState(false)

  const handleReplay = () => {
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 100)
  }

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-[72px] z-40 glass border-b border-border/40 px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Morphing Showcase
              </h1>
              <p className="text-sm text-muted-foreground">
                Test and explore all neumorphic morphing components and animations
              </p>
            </div>
            <button
              onClick={handleReplay}
              className="neu-button rounded-xl px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <PlayCircle className="size-5" />
              <span className="font-medium">Replay</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {demoModes.map((mode) => {
              const Icon = mode.icon
              const isActive = selectedMode === mode.id

              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`neu-card rounded-xl p-4 text-left transition-all hover:shadow-neu-lg ${
                    isActive ? 'shadow-neu-lg' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`neu-inset rounded-lg p-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      <Icon className="size-4" />
                    </div>
                    <h3 className={`text-sm font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {mode.label}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {mode.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Demo Area */}
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="neu-card rounded-3xl p-8 min-h-[600px] relative overflow-hidden">
          {/* Eye Only */}
          {selectedMode === 'eye-only' && (
            <div className="flex items-center justify-center h-[600px]">
              <AnimatedEyeBackground />
            </div>
          )}

          {/* Search Only */}
          {selectedMode === 'search-only' && (
            <div className="flex items-center justify-center h-[600px]">
              <div className="w-full max-w-3xl">
                <SearchInterface
                  onSearch={handleSearch}
                  isVisible={true}
                />
              </div>
            </div>
          )}

          {/* Binary Only */}
          {selectedMode === 'binary-only' && (
            <div className="flex items-center justify-center h-[600px]">
              <div className="w-full max-w-4xl space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Binary Loading Animation
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Animated 0s and 1s to mask latency
                  </p>
                </div>
                <BinaryLoadingPlaceholder lines={8} />
              </div>
            </div>
          )}

          {/* Full Morph */}
          {selectedMode === 'full-morph' && (
            <div className="h-[600px]">
              {isPlaying ? (
                <MorphingCanvas
                  onSearchSubmit={handleSearch}
                  autoProgress={true}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="neu-raised rounded-3xl p-12 max-w-2xl">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                          Morphing Complete!
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          The eye animation successfully morphed through search and loading states to reveal this content.
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          {['Eye', 'Search', 'Loading', 'Content'].map((step, i) => (
                            <div key={i} className="neu-inset rounded-xl p-4">
                              <div className="text-2xl font-bold text-primary mb-1">{i + 1}</div>
                              <div className="text-xs text-muted-foreground">{step}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </MorphingCanvas>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="neu-button rounded-2xl px-8 py-4 flex items-center gap-3 hover:scale-105 transition-transform"
                  >
                    <PlayCircle className="size-6" />
                    <span className="text-lg font-semibold">Start Morphing Sequence</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tabbed Results */}
          {selectedMode === 'tabbed-results' && (
            <div className="h-[600px] -m-8">
              <TabbedResultsPanel
                searchQuery="Sample Search Query"
                isLoading={false}
              >
                <TabbedResultsPanelContent>
                  <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                      <ResultCard key={i}>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Sample Result {i}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This is a sample result card with neumorphic styling. The tabbed results panel creates a unified canvas that feels like it&apos;s changing shape.
                        </p>
                        <div className="flex gap-2">
                          {['Tag 1', 'Tag 2', 'Tag 3'].map((tag, j) => (
                            <span
                              key={j}
                              className="neu-inset px-3 py-1 rounded-lg text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </ResultCard>
                    ))}
                  </div>
                </TabbedResultsPanelContent>
              </TabbedResultsPanel>
            </div>
          )}

          {/* Page Wrapper */}
          {selectedMode === 'page-wrapper' && (
            <div className="h-[600px]">
              {isPlaying ? (
                <PageMorphWrapper
                  skipMorph={false}
                  eyeDuration={2000}
                  showBinaryLoading={true}
                >
                  <div className="flex items-center justify-center min-h-[600px]">
                    <div className="text-center">
                      <div className="neu-raised rounded-3xl p-12 max-w-2xl">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                          Page Content Loaded!
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          The PageMorphWrapper component adds morphing to any page. Perfect for dedicated pages like Finance, Images, Videos, etc.
                        </p>
                        <div className="neu-inset rounded-xl p-6">
                          <p className="text-sm text-muted-foreground">
                            This wrapper automatically handles the eye animation, binary loading, and content reveal sequence.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </PageMorphWrapper>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="neu-button rounded-2xl px-8 py-4 flex items-center gap-3 hover:scale-105 transition-transform"
                  >
                    <PlayCircle className="size-6" />
                    <span className="text-lg font-semibold">Load Page with Morphing</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Component Documentation */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="neu-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Neumorphic Styles</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><code className="neu-inset px-2 py-1 rounded text-xs">neu-raised</code> - Raised elements (buttons, active states)</p>
              <p><code className="neu-inset px-2 py-1 rounded text-xs">neu-inset</code> - Inset elements (inputs, containers)</p>
              <p><code className="neu-inset px-2 py-1 rounded text-xs">neu-button</code> - Interactive buttons</p>
              <p><code className="neu-inset px-2 py-1 rounded text-xs">neu-card</code> - Card containers</p>
              <p><code className="neu-inset px-2 py-1 rounded text-xs">shadow-neu</code> - Soft neumorphic shadows</p>
            </div>
          </div>

          <div className="neu-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Morphing Flow</h3>
            <div className="space-y-3">
              {[
                { step: 1, label: 'Eye Animation', duration: '2-3s' },
                { step: 2, label: 'Morph to Search', duration: '1s' },
                { step: 3, label: 'Binary Loading', duration: '1.5s' },
                { step: 4, label: 'Content Reveal', duration: '1s' }
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="neu-inset rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
