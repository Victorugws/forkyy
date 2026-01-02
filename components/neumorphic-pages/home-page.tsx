'use client'

import { useState, useEffect } from 'react'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { HomeSearchTab } from '@/components/HomeSearchTab'
import { ModeSelectionButtons } from '@/components/ModeSelectionButtons'
import { TypewriterAcknowledgement } from '@/components/TypewriterAcknowledgement'
import { ModeSuggestions } from '@/components/ModeSuggestions'
import { MorphedSearchTab } from '@/components/MorphedSearchTab'
import { ChatOverlay } from '@/components/chat/ChatOverlay'
import { TaskOverlay } from '@/components/tasks/TaskOverlay'
import { FinancePageContent } from '@/components/finance/FinancePageContent'
import { isTaskLikePrompt } from '@/lib/utils/prompt-detection'
import { generateId } from 'ai'

/**
 * Neumorphic Home Page Component
 * Displays the main homepage with animated eye morphing canvas and all content sections
 * Now using EXACT reactbits.dev components
 */

interface Suggestion {
  title: string
  description: string
}

export function NeumorphicHomePage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [acknowledgement, setAcknowledgement] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showFinanceOverlay, setShowFinanceOverlay] = useState(false)
  const [showChatOverlay, setShowChatOverlay] = useState(false)
  const [showTaskOverlay, setShowTaskOverlay] = useState(false)
  const [chatQuery, setChatQuery] = useState('')
  const [taskPrompt, setTaskPrompt] = useState('')
  const [chatId, setChatId] = useState<string | undefined>(undefined)
  const [taskId, setTaskId] = useState<string | undefined>(undefined)
  
  // New flow state
  const [selectedOption, setSelectedOption] = useState<Suggestion | null>(null)
  const [isMorphed, setIsMorphed] = useState(false)
  const [morphPosition, setMorphPosition] = useState<'left' | 'right'>('right')
  const [templatePrompt, setTemplatePrompt] = useState('')
  const [variations, setVariations] = useState<Suggestion[]>([])
  const [showLegalityButton, setShowLegalityButton] = useState(false)

  // Check for finance hash in URL and show overlay
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#finance') {
        setShowFinanceOverlay(true)
        // Remove hash from URL after showing overlay
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [])

  // Prevent all scrolling on homepage, but allow scrolling in chat overlay
  useEffect(() => {
    const preventScroll = (e: Event) => {
      // Allow scrolling if the event originated from the chat overlay
      const target = e.target as HTMLElement
      if (target.closest('.chat-messages-scrollable')) {
        return true // Allow the event
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const preventWheel = (e: WheelEvent) => {
      // Check if event is from chat overlay - if so, ALWAYS prevent homepage scroll
      const target = e.target as HTMLElement
      const chatOverlay = target?.closest('.chat-overlay-container')
      const scrollableArea = target?.closest('.chat-messages-scrollable')
      
      // If event originates from anywhere in the chat overlay, prevent it from affecting homepage
      if (chatOverlay) {
        // Always prevent homepage scroll for events from chat overlay
        // The scrollable area handles its own scrolling internally
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        
        // If it's in the scrollable area, manually handle the scroll
        if (scrollableArea) {
          const element = scrollableArea as HTMLElement
          const isAtTop = element.scrollTop <= 0
          const isAtBottom = element.scrollTop >= element.scrollHeight - element.clientHeight - 1
          
          // Only allow scrolling if not at extremes
          if (!((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom))) {
            // Manually scroll the element
            element.scrollTop += e.deltaY
          }
        }
        
        return false
      }
      
      // Prevent ALL scrolling on homepage (when not in chat overlay)
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      return false
    }

    const preventTouch = (e: TouchEvent) => {
      // Allow touch events if they're in the chat overlay
      const target = e.target as HTMLElement
      if (target.closest('.chat-messages-scrollable')) {
        return true // Allow the event
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const preventKeyScroll = (e: KeyboardEvent) => {
      // Allow key scrolling if focus is in the chat overlay
      const target = e.target as HTMLElement
      if (target.closest('.chat-messages-scrollable')) {
        return true // Allow the event
      }
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
      if (scrollKeys.includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Prevent all scroll events, but allow them in chat overlay
    window.addEventListener('scroll', preventScroll, { passive: false, capture: true })
    window.addEventListener('wheel', preventWheel, { passive: false, capture: true })
    window.addEventListener('touchmove', preventTouch, { passive: false, capture: true })
    window.addEventListener('touchstart', preventTouch, { passive: false, capture: true })
    window.addEventListener('keydown', preventKeyScroll, { passive: false, capture: true })

    // Lock scroll position - more aggressive locking
    const lockScroll = () => {
      // Prevent any scroll on the document/body
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.position = 'fixed'
      document.documentElement.style.width = '100%'
      document.documentElement.style.height = '100%'
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      document.body.style.top = '0'
      document.body.style.left = '0'
      
      // Force scroll to top
      window.scrollTo(0, 0)
      window.scroll(0, 0)
      document.documentElement.scrollTop = 0
      document.documentElement.scrollLeft = 0
      document.body.scrollTop = 0
      document.body.scrollLeft = 0
    }

    // Lock scroll immediately and on any attempt
    lockScroll()
    const scrollInterval = setInterval(lockScroll, 10)

    return () => {
      window.removeEventListener('scroll', preventScroll, { capture: true } as any)
      window.removeEventListener('wheel', preventWheel, { capture: true } as any)
      window.removeEventListener('touchmove', preventTouch, { capture: true } as any)
      window.removeEventListener('touchstart', preventTouch, { capture: true } as any)
      window.removeEventListener('keydown', preventKeyScroll, { capture: true } as any)
      clearInterval(scrollInterval)
      
      // Restore scroll when component unmounts
      document.documentElement.style.overflow = ''
      document.documentElement.style.position = ''
      document.documentElement.style.width = ''
      document.documentElement.style.height = ''
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.top = ''
      document.body.style.left = ''
    }
  }, [])

  const handleSearch = (query: string, mode: 'search' | 'ai') => {
    setSearchQuery(query)
    
    // Detect if prompt is task-like or chat-like
    const isTaskLike = isTaskLikePrompt(query)
    
    if (isTaskLike) {
      // Show task overlay for task-like prompts
      setTaskPrompt(query)
      setShowTaskOverlay(true)
      setShowChatOverlay(false)
    } else if (mode === 'ai') {
      // Show chat overlay for chat-like prompts
      const newChatId = generateId()
      setChatId(newChatId)
      setChatQuery(query)
      setShowChatOverlay(true)
      setShowTaskOverlay(false)
    } else {
      // For search mode, handle differently (existing search flow)
      console.log('Search submitted:', query, 'Mode:', mode)
    }
  }

  const handleModeSelect = (mode: string) => {
    // Handle mode selection from share buttons
    setSelectedMode(mode)
    // Reset flow state
    setSelectedOption(null)
    setIsMorphed(false)
    setVariations([])
    setShowLegalityButton(false)
    // Show suggestions after a short delay (when acknowledgement appears)
    setTimeout(() => {
      setShowSuggestions(true)
    }, 500)
  }

  const handleOptionClick = (option: Suggestion, position: { top: string; left?: string; right?: string }) => {
    // Hide original suggestions
    setSelectedOption(option)
    
    // Determine morph position (opposite side of clicked option)
    const isLeft = position.left !== undefined
    setMorphPosition(isLeft ? 'right' : 'left')
    
    // Create template prompt
    const prompt = `Create ${option.title.replace('...', '').toLowerCase()}`
    setTemplatePrompt(prompt)
    
    // Generate variations
    const optionVariations = generateVariations(option, selectedMode || '')
    setVariations(optionVariations)
    
    // Trigger morph animation
    setTimeout(() => {
      setIsMorphed(true)
      setShowSuggestions(false) // Hide original suggestions
      // Show variations after a short delay on the OPPOSITE side
      setTimeout(() => {
        setShowSuggestions(true)
      }, 300)
    }, 100)
    
    // Show legality button after morph completes
    setTimeout(() => {
      setShowLegalityButton(true)
    }, 800)
  }

  const generateVariations = (option: Suggestion, mode: string): Suggestion[] => {
    const baseTitle = option.title.replace('...', '')
    const variations: Suggestion[] = []
    
    // Generate 3-4 variations based on mode and option
    if (mode === 'healthcare') {
      variations.push(
        { title: `${baseTitle} with HIPAA compliance...`, description: 'Full HIPAA-compliant infrastructure and security' },
        { title: `${baseTitle} with insurance integration...`, description: 'Connect with major insurance providers' },
        { title: `${baseTitle} with telemedicine features...`, description: 'Video consultations and remote monitoring' },
        { title: `${baseTitle} with patient portal...`, description: 'Secure patient access and records management' },
      )
    } else if (mode === 'agriculture') {
      variations.push(
        { title: `${baseTitle} with IoT sensor integration...`, description: 'Connect with soil, weather, and crop sensors' },
        { title: `${baseTitle} with market pricing data...`, description: 'Real-time commodity prices and market trends' },
        { title: `${baseTitle} with supply chain tracking...`, description: 'End-to-end farm-to-table traceability' },
        { title: `${baseTitle} with sustainability metrics...`, description: 'Carbon footprint and environmental impact tracking' },
      )
    } else if (mode === 'education') {
      variations.push(
        { title: `${baseTitle} with certification system...`, description: 'Issue verifiable certificates and credentials' },
        { title: `${baseTitle} with live video classes...`, description: 'Interactive virtual classroom with breakout rooms' },
        { title: `${baseTitle} with AI tutoring...`, description: 'Personalized learning assistant and adaptive content' },
        { title: `${baseTitle} with parent portal...`, description: 'Parent access to grades, attendance, and progress' },
      )
    } else if (mode === 'realestate') {
      variations.push(
        { title: `${baseTitle} with virtual tour integration...`, description: '360° tours and immersive property viewing' },
        { title: `${baseTitle} with mortgage calculator...`, description: 'Loan comparison and affordability analysis' },
        { title: `${baseTitle} with lead management...`, description: 'CRM for tracking prospects and conversions' },
        { title: `${baseTitle} with document management...`, description: 'Secure contract and document storage' },
      )
    } else if (mode === 'ecommerce') {
      variations.push(
        { title: `${baseTitle} with payment processing...`, description: 'Stripe, PayPal, and multiple payment gateways' },
        { title: `${baseTitle} with inventory management...`, description: 'Real-time stock tracking and automated reordering' },
        { title: `${baseTitle} with shipping integration...`, description: 'Connect with major shipping carriers' },
        { title: `${baseTitle} with customer reviews...`, description: 'Review system and rating management' },
      )
    } else if (mode === 'energy') {
      variations.push(
        { title: `${baseTitle} with smart meter integration...`, description: 'Real-time energy consumption monitoring' },
        { title: `${baseTitle} with carbon offset marketplace...`, description: 'Buy and sell carbon credits' },
        { title: `${baseTitle} with renewable energy tracking...`, description: 'Solar/wind generation and grid integration' },
        { title: `${baseTitle} with cost optimization...`, description: 'Energy usage optimization and savings recommendations' },
      )
    } else if (mode === 'foodbeverage') {
      variations.push(
        { title: `${baseTitle} with delivery integration...`, description: 'Uber Eats, DoorDash, and Grubhub integration' },
        { title: `${baseTitle} with POS system...`, description: 'Point-of-sale with payment and inventory sync' },
        { title: `${baseTitle} with kitchen display system...`, description: 'Order management and kitchen workflow' },
        { title: `${baseTitle} with loyalty program...`, description: 'Rewards, points, and customer retention' },
      )
    } else if (mode === 'finance') {
      variations.push(
        { title: `${baseTitle} with portfolio tracking...`, description: 'Track investments and performance' },
        { title: `${baseTitle} with risk analysis...`, description: 'Include risk assessment tools' },
        { title: `${baseTitle} with tax optimization...`, description: 'Help with tax planning' },
      )
    } else if (mode === 'strategy') {
      variations.push(
        { title: `${baseTitle} with market research...`, description: 'Industry analysis and competitor intelligence' },
        { title: `${baseTitle} with financial projections...`, description: 'Revenue forecasting and financial modeling' },
        { title: `${baseTitle} with implementation roadmap...`, description: 'Step-by-step execution plan' },
      )
    } else {
      // Generic variations
      variations.push(
        { title: `${baseTitle} with advanced features...`, description: 'Enhanced functionality' },
        { title: `${baseTitle} with custom branding...`, description: 'Personalized design' },
        { title: `${baseTitle} with integration support...`, description: 'Connect with other tools' },
      )
    }
    
    return variations
  }

  const handleSpecificitySelect = (value: string) => {
    // Add specificity to template prompt
    setTemplatePrompt(prev => `${prev} with ${value}`)
  }

  const handleVariationClick = (variation: Suggestion) => {
    // Update template prompt with variation
    const newPrompt = `Create ${variation.title.replace('...', '').toLowerCase()}`
    setTemplatePrompt(newPrompt)
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
        
        /* Go to Button Styles - From Uiverse.io by adamgiebl */
        .go-to-button {
          background-color: #ffffff;
          border-radius: 50px;
          box-shadow: inset 2px 2px 5px #bcbcbc, inset -2px -2px 5px #ffffff, 2px 2px 5px #bcbcbc, -2px -2px 5px #ffffff;
          color: #4d4d4d;
          cursor: pointer;
          font-size: 0.875rem;
          padding: 1em 1.5em;
          transition: all 0.2s ease-in-out;
          border: 2px solid #f5f5f5;
          text-decoration: none;
          display: inline-block;
          font-weight: 500;
        }

        .go-to-button:hover {
          box-shadow: inset 4px 4px 10px #bcbcbc, inset -4px -4px 10px #ffffff;
        }

        .go-to-button:focus {
          outline: none;
          box-shadow: inset 4px 4px 10px #bcbcbc, inset -4px -4px 10px #ffffff;
        }
      `}</style>
      <div className="w-full bg-background relative" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* Go to Pages Buttons - Top Center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 justify-center whitespace-nowrap">
          <a href="/banking" className="go-to-button">Go to Banking</a>
          <a href="/finance" className="go-to-button">Go to Finance</a>
          <a href="/operations" className="go-to-button">Go to Operations</a>
          <a href="/legality" className="go-to-button">Go to Legality</a>
          <a href="/social" className="go-to-button">Go to Social</a>
          <a href="/hostility" className="go-to-button">Go to Hostility</a>
        </div>
        {/* Typewriter Acknowledgement Message Above Eye */}
        <TypewriterAcknowledgement message={acknowledgement} />

        {/* Mode Suggestions - Appear after mode selection */}
        <ModeSuggestions 
          mode={selectedMode} 
          visible={showSuggestions}
          onOptionClick={isMorphed ? handleVariationClick : handleOptionClick}
          onTaskClick={(prompt) => {
            setTaskPrompt(prompt)
            setShowTaskOverlay(true)
            setShowChatOverlay(false)
          }}
          selectedOption={selectedOption?.title || null}
          variations={isMorphed ? variations : []}
          morphPosition={isMorphed ? morphPosition : undefined}
        />

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white/30 backdrop-blur-lg rounded-3xl border border-[#e6ebf3] overflow-hidden flex flex-col">
              <button
                onClick={() => setShowFinanceOverlay(false)}
                className="absolute top-4 right-4 z-[100] rounded-full bg-white/90 hover:bg-white text-gray-700 px-4 py-2 shadow-sm border border-gray-200 font-medium"
              >
                Close
              </button>
              <div 
                className="flex-1 overflow-y-auto p-6 min-h-0" 
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(156, 163, 175, 0.7) rgba(0, 0, 0, 0.1)',
                  WebkitOverflowScrolling: 'touch',
                  maxHeight: '100%'
                }}
              >
                <FinancePageContent />
              </div>
            </div>
          </div>
        )}

        {/* Chat Overlay */}
        {showChatOverlay && (
          <ChatOverlay
            initialQuery={chatQuery}
            chatId={chatId}
            onClose={() => {
              setShowChatOverlay(false)
              setChatQuery('')
              setChatId(undefined)
            }}
            onModeSelect={(mode) => {
              handleModeSelect(mode)
              const modeMessages: Record<string, string> = {
                healthcare: 'Ready to healthify...',
                agriculture: 'Ready to cultivate...',
                education: 'Ready to educate...',
                realestate: 'Ready to propertyfy...',
                ecommerce: 'Ready to commercialize...',
                energy: 'Ready to energize...',
                foodbeverage: 'Ready to serve...',
                finance: 'Ready to financialize...',
                strategy: 'Ready to strategize...',
              }
              setAcknowledgement(modeMessages[mode] || 'Ready...')
            }}
            onFinanceOverlay={() => setShowFinanceOverlay(true)}
            onAutopilotDoubleClick={() => {
              window.dispatchEvent(new CustomEvent('browser:navigate', {
                detail: { url: '/autopilot' }
              }))
            }}
          />
        )}

        {/* Task Overlay */}
        {showTaskOverlay && (
          <TaskOverlay
            initialPrompt={taskPrompt}
            taskId={taskId}
            onClose={() => {
              setShowTaskOverlay(false)
              setTaskPrompt('')
              setTaskId(undefined)
            }}
            onTaskUpdate={(task) => {
              setTaskId(task.id)
            }}
          />
        )}

        {/* Search Tab and Mode Selection - Positioned below eye */}
        {/* Hide search tab when overlays are open */}
        {!showChatOverlay && !showTaskOverlay && (
          <>
            {!isMorphed ? (
              <div 
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-6"
                style={{
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translate(-50%, -120px)',
                }}
              >
                {/* Search Tab - Below Eye */}
                <HomeSearchTab
                  onSearch={handleSearch}
                  onModeSelect={(mode) => {
                    handleModeSelect(mode)
                    // Set acknowledgement based on mode
                    const modeMessages: Record<string, string> = {
                      webapp: 'Ready to webify...',
                      finance: 'Ready to financialize...',
                      slides: 'Ready to slideify...',
                      service: 'Ready to servicize...',
                      news: 'Ready to newsify...',
                      research: 'Ready to researchify...',
                      strategy: 'Ready to strategize...',
                    }
                    setAcknowledgement(modeMessages[mode] || 'Ready...')
                  }}
                  onAcknowledgement={setAcknowledgement}
                  onVoiceStateChange={setIsListening}
                  onFinanceOverlay={() => setShowFinanceOverlay(true)}
                  onAutopilotDoubleClick={() => {
                    window.dispatchEvent(new CustomEvent('browser:navigate', {
                      detail: { url: '/autopilot' }
                    }))
                  }}
                />
              </div>
            ) : (
              <MorphedSearchTab
                templatePrompt={templatePrompt}
                onPromptChange={setTemplatePrompt}
                onSearch={(query) => {
                  // Morphed search tab queries are always task-like
                  setTaskPrompt(query)
                  setShowTaskOverlay(true)
                  setShowChatOverlay(false)
                }}
                onVoiceStateChange={setIsListening}
                position={morphPosition}
                specificityOptions={[
                  { label: 'User Auth', value: 'user authentication' },
                  { label: 'Real-time', value: 'real-time updates' },
                  { label: 'Mobile', value: 'mobile responsive' },
                  { label: 'Analytics', value: 'analytics dashboard' },
                  { label: 'API Integration', value: 'API integration' },
                ]}
                onSpecificitySelect={handleSpecificitySelect}
                onLegalityClick={() => {
                  console.log('Legality button clicked')
                }}
                showLegalityButton={showLegalityButton}
                onFinanceOverlay={() => setShowFinanceOverlay(true)}
              />
            )}
          </>
        )}
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
