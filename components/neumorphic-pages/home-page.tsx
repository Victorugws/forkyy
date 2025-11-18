'use client'

import { useState } from 'react'
import { TabbedResultsPanel, TabbedResultsPanelContent, ResultCard, type TabType } from '@/components/TabbedResultsPanel'
import { GoogleStyleResults } from '@/components/GoogleStyleResults'

/**
 * Neumorphic Home Page Component
 * Displays the main ORB AI interface with navbar, templates, and orb blocks
 */

export function NeumorphicHomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery] = useState('AI Solutions')

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

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
              aiCommentary="Welcome to ORB AI - Your comprehensive AI solutions platform. Explore our services, discover innovative AI tools, and manage your projects with cutting-edge artificial intelligence technology."
            />
          )}

          {/* Chat tab content */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <ResultCard>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    AI Chat Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation with our AI assistant. Ask questions, get insights, and explore possibilities with advanced AI technology.
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
                    <h3 className="text-lg font-semibold text-foreground">Video Tutorial {i}</h3>
                    <p className="text-sm text-muted-foreground">Learn about AI solutions and tools</p>
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
                    <p className="text-sm text-muted-foreground">Market insights and AI industry trends</p>
                  </div>
                </ResultCard>
              ))}
            </div>
          )}

          {/* Demo Info Card */}
          <ResultCard className="mt-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Explore ORB AI
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Navigate through our platform:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: '/discover', label: 'Discover' },
                  { href: '/finance', label: 'Finance' },
                  { href: '/images', label: 'Images' },
                  { href: '/videos', label: 'Videos' },
                  { href: '/academic', label: 'Academic' },
                  { href: '/spaces', label: 'Spaces' }
                ].map((link) => (
                  <button
                    key={link.href}
                    onClick={() => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: link.href } }))}
                    className="neu-button rounded-xl p-3 text-center hover:shadow-neu-lg transition-all text-sm font-medium"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </ResultCard>
        </TabbedResultsPanelContent>
      </TabbedResultsPanel>
    </div>
  )
}
