'use client'

import { useState, useEffect } from 'react'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { HomeSearchTab } from '@/components/HomeSearchTab'
import { ModeSelectionButtons } from '@/components/ModeSelectionButtons'
import { TypewriterAcknowledgement } from '@/components/TypewriterAcknowledgement'
import { ModeSuggestions } from '@/components/ModeSuggestions'
import { generateId } from 'ai'

/**
 * Neumorphic Home Page Component
 * Displays the main homepage with animated eye morphing canvas and all content sections
 * Now using EXACT reactbits.dev components
 */

export function NeumorphicHomePage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [acknowledgement, setAcknowledgement] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showFinanceOverlay, setShowFinanceOverlay] = useState(false)

  // Prevent all scrolling on homepage
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const preventWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const preventTouch = (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const preventKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
      if (scrollKeys.includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Prevent all scroll events
    window.addEventListener('scroll', preventScroll, { passive: false, capture: true })
    window.addEventListener('wheel', preventWheel, { passive: false, capture: true })
    window.addEventListener('touchmove', preventTouch, { passive: false, capture: true })
    window.addEventListener('touchstart', preventTouch, { passive: false, capture: true })
    window.addEventListener('keydown', preventKeyScroll, { passive: false, capture: true })

    // Lock scroll position
    const lockScroll = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Lock scroll on any attempt
    const scrollInterval = setInterval(lockScroll, 10)

    return () => {
      window.removeEventListener('scroll', preventScroll, { capture: true } as any)
      window.removeEventListener('wheel', preventWheel, { capture: true } as any)
      window.removeEventListener('touchmove', preventTouch, { capture: true } as any)
      window.removeEventListener('touchstart', preventTouch, { capture: true } as any)
      window.removeEventListener('keydown', preventKeyScroll, { capture: true } as any)
      clearInterval(scrollInterval)
    }
  }, [])

  const handleSearch = (query: string, mode: 'search' | 'ai') => {
    setSearchQuery(query)
    // Generate a new chat ID and navigate to chat page with query
    const newChatId = generateId()
    const modeParam = mode === 'search' ? '&mode=search' : '&mode=ai'
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search/${newChatId}?q=${encodeURIComponent(query)}${modeParam}` }
    }))
  }

  const handleModeSelect = (mode: string) => {
    // Handle mode selection from share buttons
    setSelectedMode(mode)
    // Show suggestions after a short delay (when acknowledgement appears)
    setTimeout(() => {
      setShowSuggestions(true)
    }, 500)
  }

  // Hide suggestions when acknowledgement disappears
  useEffect(() => {
    if (!acknowledgement) {
      setShowSuggestions(false)
      setSelectedMode(null)
    }
  }, [acknowledgement])

  if (hasSearched) {
    // Redirect to search page handled above
    return null
  }

  return (
    <>
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari, Opera, and Electron */
        * {
          scrollbar-width: none;  /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
        }
        
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
        }
        
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        div::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        
        /* Disable scrolling */
        html, body {
          overflow: hidden !important;
          height: 100% !important;
          position: fixed !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      <div className="w-full bg-background relative" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* Target Cursor is rendered at browser-client-enhanced level */}

        {/* Typewriter Acknowledgement Message Above Eye */}
        <TypewriterAcknowledgement message={acknowledgement} />

        {/* Mode Suggestions - Appear after mode selection */}
        <ModeSuggestions mode={selectedMode} visible={showSuggestions} />

        {/* Morphing Canvas with Eye Animation */}
        <div className="relative h-screen" style={{ overflow: 'hidden' }}>
          <MorphingCanvas
            onSearchSubmit={(query) => handleSearch(query, 'ai')}
            autoProgress={false}
            isListening={isListening}
          />
        </div>

        {/* Finance Overlay */}
        {showFinanceOverlay && (
          <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
              <button
                onClick={() => setShowFinanceOverlay(false)}
                className="absolute top-4 right-4 z-10 rounded-full bg-white/80 hover:bg-white text-gray-700 px-3 py-1 shadow-sm border border-gray-200"
              >
                Close
              </button>
              <iframe
                src="/finance"
                title="Finance"
                className="w-full h-full border-0"
                style={{
                  background: 'transparent',
                  opacity: 0.82, // Let the eye remain visible underneath
                }}
              />
            </div>
          </div>
        )}

        {/* Search Tab and Mode Selection - Positioned below eye */}
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-6">
          {/* Search Tab - Below Eye */}
          <HomeSearchTab
            onSearch={handleSearch}
            onModeSelect={(mode) => {
              handleModeSelect(mode)
              // Set acknowledgement based on mode
              const modeMessages: Record<string, string> = {
                legality: 'Ready to legalize...',
                business: 'Ready to businessize...',
                finance: 'Ready to financialize...',
                taskability: 'Ready to taskify...',
                socials: 'Ready to socialize...',
              }
              setAcknowledgement(modeMessages[mode] || 'Ready...')
            }}
            onAcknowledgement={setAcknowledgement}
            onVoiceStateChange={setIsListening}
            onFinanceOverlay={() => setShowFinanceOverlay(true)}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translate(-50%, -10px); }
          10%, 90% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  )
}
