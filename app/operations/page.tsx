'use client'

import { useState, useMemo } from 'react'
import { generateId } from 'ai'
import { OperationsPageContent } from '@/components/operations/OperationsPageContent'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { GradualBlur } from '@/components/GradualBlur'
import { HomeSearchTab } from '@/components/HomeSearchTab'
import { ModeSuggestions } from '@/components/ModeSuggestions'
import { PromptSuggestionsTicker } from '@/components/PromptSuggestionsTicker'
import BankingSidebar from '@/components/banking/Sidebar'
import { TabBar } from '@/components/browser/tab-bar'
import { BrowserBar } from '@/components/browser/browser-bar'
import { BrowserToolbar } from '@/components/browser/browser-toolbar'
import { BrowserTab } from '@/lib/types/browser'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function OperationsPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const currentTabId = useMemo(() => generateId(), [])
  const tabs: BrowserTab[] = useMemo(() => [{
    id: currentTabId,
    url: '/operations',
    title: 'Operations',
    isLoading: false,
    canGoBack: false,
    canGoForward: false,
    history: [],
    historyIndex: -1,
    pageContent: '',
    zoomLevel: 1,
    isPinned: false,
    isMuted: false,
  }], [currentTabId])

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode)
    setTimeout(() => {
      setShowSuggestions(true)
    }, 500)
  }

  const handleOptionClick = () => {}

  const handleNewTab = () => {
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: '/' }
    }))
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Tab Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <TabBar
          tabs={tabs}
          activeTabId={currentTabId}
          onTabSelect={() => {}}
          onTabClose={() => {
            window.dispatchEvent(new CustomEvent('browser:navigate', {
              detail: { url: '/' }
            }))
          }}
          onNewTab={handleNewTab}
          onTabPin={() => {}}
          onTabMute={() => {}}
        />
      </div>

      {/* Browser Bar + Toolbar */}
      <div className="fixed top-[40px] left-0 right-0 z-50 flex flex-col flex-shrink-0">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="bg-background/80 backdrop-blur-sm">
              <BrowserBar
                currentUrl=""
                onUrlChange={(url) => {
                  window.dispatchEvent(new CustomEvent('browser:navigate', {
                    detail: { url }
                  }))
                }}
                canGoBack={false}
                canGoForward={false}
                isLoading={false}
                pageTitle="Operations"
              />
            </div>
          </div>
          <div className="bg-background/80 backdrop-blur-sm">
            <BrowserToolbar
              isBookmarked={false}
              onToggleBookmark={() => {}}
              onZoomIn={() => {}}
              onZoomOut={() => {}}
              onZoomReset={() => {}}
              onPrint={() => {}}
              onSaveAsPDF={() => {}}
              onFind={() => {}}
              onOpenDownloads={() => {}}
              onOpenHistory={() => {}}
              onOpenCookies={() => {}}
              onOpenBookmarks={() => {}}
              onOpenDevTools={() => {}}
              onOpenSettings={() => {}}
              isSecure={false}
              zoom={1}
            />
          </div>
        </div>
        {/* Prompt Suggestions Ticker */}
        <div className="px-4 py-1 bg-background/80 backdrop-blur-sm border-b border-border/40">
          <PromptSuggestionsTicker />
        </div>
      </div>

      {/* Eye Animation BG Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MorphingCanvas initialState="eye-landing" autoProgress={false} />
      </div>

      {/* Home Button - Top Right */}
      <Link 
        href="/"
        className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#e6ebf3] hover:bg-[#192534] hover:text-white hover:border-[#192534] text-[#192534] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <Home className="w-5 h-5" />
      </Link>

      <div className="flex flex-row min-h-screen relative z-10 mt-[140px] h-[calc(100vh-140px)]">
        <BankingSidebar />
        <main className="flex-1 relative ml-24 h-full overflow-y-auto">
          <div className="max-w-[1600px] mx-auto w-full min-h-full bg-white/30 backdrop-blur-lg rounded-t-2xl border border-[#e6ebf3] p-6 pb-8">
            <OperationsPageContent />
          </div>
        </main>
      </div>

      {/* Mode Suggestions */}
      <ModeSuggestions
        mode={selectedMode}
        visible={showSuggestions}
        onOptionClick={handleOptionClick}
      />

      {/* Search Tab */}
      {!showSuggestions && (
        <div
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-6 pointer-events-none"
          style={{
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="pointer-events-auto">
            <HomeSearchTab
              onModeSelect={handleModeSelect}
              onVoiceStateChange={setIsListening}
            />
          </div>
        </div>
      )}

      <GradualBlur intensity="medium" />
    </div>
  )
}

