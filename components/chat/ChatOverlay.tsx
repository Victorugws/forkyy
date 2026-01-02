'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { ChatMessages } from './ChatMessages'
import { SourcesPanel } from './SourcesPanel'
import { Mic, Send, FileStack, Menu, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateId } from 'ai'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/app-sidebar'
import { ModeSelectionButtons } from '@/components/ModeSelectionButtons'

// SpeechRecognition type declaration
interface SpeechRecognitionResult {
  transcript: string
  confidence: number
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResult[][]
  resultIndex: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}

interface ChatOverlayProps {
  initialQuery?: string
  onClose?: () => void
  chatId?: string
  models?: any[]
  onModeSelect?: (mode: string) => void
  onAutopilotDoubleClick?: () => void
}


export function ChatOverlay({ 
  initialQuery = '', 
  onClose, 
  chatId, 
  models,
  onModeSelect,
  onAutopilotDoubleClick
}: ChatOverlayProps) {
  const [input, setInput] = useState(initialQuery)
  const [sources, setSources] = useState<any[]>([])
  const [isListening, setIsListening] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'search' | 'ai'>('ai')
  const [showSourcesPanel, setShowSourcesPanel] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const hasSubmittedInitial = useRef(false)
  const [isLoadingChat, setIsLoadingChat] = useState(false)

  const finalChatId = chatId || generateId()

  const {
    messages: apiMessages,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    isLoading: isLoadingApi,
    setInput: setChatInput,
    setMessages,
    append
  } = useChat({
    id: finalChatId,
    api: '/api/chat',
    body: {
      model: models?.[0] ? `${models[0].providerId}:${models[0].id}` : undefined
    },
    onFinish: () => {
      // Auto-scroll when streaming finishes - only scroll the messages container
      setTimeout(() => {
        if (scrollableRef.current) {
          scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
        }
      }, 100)
    }
  })

  // Load chat messages when chatId is provided
  useEffect(() => {
    if (!chatId) return

    const loadChat = async () => {
      setIsLoadingChat(true)
      try {
        const response = await fetch(`/api/chat/${chatId}`)
        if (response.ok) {
          const chat = await response.json()
          if (chat.messages && Array.isArray(chat.messages)) {
            setMessages(chat.messages)
          }
        }
      } catch (error) {
        console.error('Failed to load chat:', error)
      } finally {
        setIsLoadingChat(false)
      }
    }

    loadChat()
  }, [chatId, setMessages])

  // Use API messages
  const messages = apiMessages
  const isLoading = isLoadingApi || isLoadingChat

  // Enable wheel scrolling on the scrollable area
  useEffect(() => {
    const scrollableElement = scrollableRef.current
    if (!scrollableElement) return

    const handleWheel = (e: WheelEvent) => {
      const element = scrollableElement
      const isAtTop = element.scrollTop <= 0
      const isAtBottom = element.scrollTop >= element.scrollHeight - element.clientHeight - 1
      
      // If at extremes and trying to scroll further, prevent default and stop propagation
      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      
      // Always stop propagation to prevent homepage from receiving the event
      e.stopPropagation()
      e.stopImmediatePropagation()
    }

    // Use capture phase and non-passive to ensure we can prevent default
    scrollableElement.addEventListener('wheel', handleWheel, { passive: false, capture: true })

    return () => {
      scrollableElement.removeEventListener('wheel', handleWheel, { capture: true } as any)
    }
  }, [])

  // Auto-scroll when messages change (works for both mock and API messages)
  useEffect(() => {
    if (!scrollableRef.current || messages.length === 0) return
    
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      if (scrollableRef.current) {
        // Directly set scrollTop to avoid smooth scrolling that might affect layout
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
      }
    }, 150)
    
    return () => clearTimeout(timeoutId)
  }, [messages.length, isLoading])

  // Sync local input with chat input
  useEffect(() => {
    setChatInput(input)
  }, [input, setChatInput])

  // Auto-submit initial query if no messages exist
  useEffect(() => {
    if (initialQuery && !hasSubmittedInitial.current && messages.length === 0 && !isLoadingChat) {
      hasSubmittedInitial.current = true
      setInput(initialQuery)
      setChatInput(initialQuery)
      // Submit after a short delay to ensure state is updated
      const timer = setTimeout(() => {
        const syntheticEvent = {
          preventDefault: () => {},
          stopPropagation: () => {}
        } as React.FormEvent
        handleChatSubmit(syntheticEvent)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [initialQuery, messages.length, setChatInput, handleChatSubmit, isLoadingChat])

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.trim()
        if (transcript) {
          setInput(transcript)
          inputRef.current?.focus()
        }
      }

      recognitionRef.current = recognition
    } catch (error) {
      console.error('Error initializing speech recognition:', error)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error('Error stopping recognition:', error)
        }
      }
    }
  }, [])

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not available in this browser.')
      return
    }

    try {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          stream.getTracks().forEach(track => track.stop())
          recognitionRef.current.start()
        } catch (permissionError: any) {
          console.error('Microphone permission error:', permissionError)
          alert('Microphone permission is required for voice input.')
        }
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setChatInput(userMessage)
    handleChatSubmit(e)
  }

  // Extract sources and images from messages (tool results contain sources and images from Tavily)
  useEffect(() => {
    const extractedSources: any[] = []
    const extractedImages: any[] = []
    
    apiMessages.forEach((message) => {
      if (message.toolInvocations) {
        message.toolInvocations.forEach((tool) => {
          if (tool.toolName === 'search' && 'result' in tool && tool.result) {
            try {
              const result = typeof tool.result === 'string' ? JSON.parse(tool.result) : tool.result
              
              // Extract search results (sources)
              if (result.results && Array.isArray(result.results)) {
                result.results.forEach((item: any, index: number) => {
                  extractedSources.push({
                    id: `${message.id}-source-${index}`,
                    title: item.title || item.url || 'Source',
                    url: item.url,
                    snippet: item.content || item.snippet
                  })
                })
              }
              
              // Extract images from Tavily search results
              if (result.images && Array.isArray(result.images)) {
                result.images.forEach((image: any, index: number) => {
                  if (typeof image === 'object' && image.url) {
                    extractedImages.push({
                      id: `${message.id}-image-${index}`,
                      url: image.url,
                      description: image.description || ''
                    })
                  } else if (typeof image === 'string') {
                    extractedImages.push({
                      id: `${message.id}-image-${index}`,
                      url: image,
                      description: ''
                    })
                  }
                })
              }
            } catch (e) {
              console.error('Error parsing search result:', e)
            }
          }
        })
      }
    })
    
    // Combine sources and images
    setSources([...extractedSources, ...extractedImages])
  }, [apiMessages])

  return (
    <SidebarProvider>
      <div 
        className="absolute inset-0 z-50 bg-transparent chat-overlay-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden', // Prevent any scrolling on the overlay container itself
          touchAction: 'none', // Prevent touch scrolling on the container
          pointerEvents: 'auto' // Ensure pointer events work
        }}
        onWheel={(e) => {
          // ALWAYS prevent wheel events from propagating to homepage
          e.preventDefault()
          e.stopPropagation()
          if ('stopImmediatePropagation' in e) {
            (e as any).stopImmediatePropagation()
          }
          
          // The scrollable area has its own handler for actual scrolling
          // This just prevents propagation to the homepage
        }}
        onTouchMove={(e) => {
          // Prevent touch scroll from propagating
          const target = e.target as HTMLElement
          if (!target.closest('.chat-messages-scrollable')) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        {/* Background - Keep the eye animation fully visible underneath */}
        <div className="absolute inset-0 pointer-events-none">
          {/* The eye background will be rendered by the parent */}
        </div>

        {/* Main Chat Interface */}
        <div 
          className="relative w-full h-full flex flex-col overflow-hidden"
          style={{
            position: 'relative',
            height: '100%',
            overflow: 'hidden' // Ensure no overflow on the main interface
          }}
        >
          {/* Sidebar */}
          <AppSidebar />
          
          {/* Header with menu and close button */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <SidebarTrigger className="p-2 bg-white/90 backdrop-blur-md rounded-lg border border-gray-200/80 hover:bg-white transition-colors shadow-lg">
              <Menu className="size-5 text-gray-700" />
            </SidebarTrigger>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg border border-gray-200/80 hover:bg-white transition-colors text-sm font-medium text-gray-700 shadow-lg"
            >
              Close
            </button>
          </div>

          {/* Chat Messages Area - Mind Map Layout - Scrollable */}
          <div 
            ref={scrollableRef}
            className="flex-1 relative overflow-y-scroll overflow-x-hidden chat-messages-scrollable" 
            style={{ 
              paddingBottom: '220px', // Space for input area at bottom-48
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.7) rgba(0, 0, 0, 0.1)',
              minHeight: 0, // Important for flex children to allow scrolling
              maxHeight: '100%',
              touchAction: 'pan-y', // Enable touch scrolling
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
              position: 'relative', // Ensure it's positioned relative to its container
              isolation: 'isolate' // Create a new stacking context
            }}
            onScroll={(e) => {
              // Prevent scroll events from bubbling to homepage
              e.stopPropagation()
            }}
          >
            <ChatMessages 
              messages={messages} 
              isLoading={isLoading}
              chatId={finalChatId}
              onQuerySelect={(query) => {
                const trimmedQuery = query.trim()
                if (!trimmedQuery || isLoading) return
                
                // Clear local input immediately
                setInput('')
                
                // Use append to directly add the message and trigger submission
                append({
                  role: 'user',
                  content: trimmedQuery
                })
              }}
            />
          </div>
          
          <style jsx global>{`
            /* Override homepage scrollbar hiding for chat messages area */
            .chat-messages-scrollable {
              scrollbar-width: thin !important;
              scrollbar-color: rgba(156, 163, 175, 0.7) rgba(0, 0, 0, 0.1) !important;
              -ms-overflow-style: auto !important;
            }
            .chat-messages-scrollable::-webkit-scrollbar {
              width: 10px !important;
              display: block !important;
              height: 10px !important;
              background: transparent !important;
            }
            .chat-messages-scrollable::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.05) !important;
              border-radius: 5px !important;
            }
            .chat-messages-scrollable::-webkit-scrollbar-thumb {
              background-color: rgba(156, 163, 175, 0.7) !important;
              border-radius: 5px !important;
              border: 2px solid transparent !important;
              background-clip: padding-box !important;
            }
            .chat-messages-scrollable::-webkit-scrollbar-thumb:hover {
              background-color: rgba(156, 163, 175, 0.9) !important;
            }
          `}</style>
          
          {/* Sources Panel - Fixed position, not affected by scroll - Only visible when toggled */}
          {showSourcesPanel && <SourcesPanel sources={sources} />}

          {/* Input Bar at Bottom - Dotted Border Style - Fixed position to match homepage search tab */}
          <div 
            className="absolute bottom-48 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-20 pointer-events-auto"
            style={{
              position: 'absolute',
              bottom: '12rem', // bottom-48 equivalent
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '56rem', // max-w-4xl
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              zIndex: 20,
              pointerEvents: 'auto',
              willChange: 'transform' // Optimize for fixed positioning
            }}
          >
            <form onSubmit={onSubmit} className="relative">
              {/* Dotted border container */}
              <div 
                className="relative p-6 rounded-[3rem]"
                style={{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
              >
                {/* Decorative Dotted Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ borderRadius: '3rem' }}>
                  <rect 
                    x="0.5" 
                    y="0.5" 
                    width="calc(100% - 1px)" 
                    height="calc(100% - 1px)" 
                    fill="none" 
                    stroke="#d1d5db" 
                    strokeWidth="1" 
                    strokeDasharray="2 6"
                    rx="3rem"
                  />
                </svg>
                
                {/* Input container inside dotted border */}
                <div className="relative flex items-center gap-4">
                  {/* Search Input */}
                  <div
                    className={`
                      relative flex-1 flex items-center bg-white rounded-xl border transition-all duration-300
                      border-gray-200
                    `}
                  >
                    {/* Search/Mic Icon */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={cn(
                        "absolute left-4 p-2 rounded-lg transition-colors",
                        isListening 
                          ? "bg-orange-100 text-orange-600" 
                          : "text-gray-400 hover:text-gray-600"
                      )}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      <Mic className="size-5" />
                    </button>

                    {/* Input Field */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything..."
                      className="w-full bg-transparent pl-12 pr-12 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Mode Buttons - Matching HomeSearchTab style */}
                  <div className="flex items-center gap-3 relative">
                    {/* Sources Button */}
                    <button
                      type="button"
                      onClick={() => setShowSourcesPanel(!showSourcesPanel)}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                        showSourcesPanel
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      )}
                      title="Toggle Sources"
                    >
                      <FileStack className="size-5" />
                    </button>

                    {/* Search Engine Mode Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMode('search')
                        onModeSelect?.('search')
                      }}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                        selectedMode === 'search'
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      )}
                      title="Search Engine Mode"
                    >
                      <Search className="size-5" />
                    </button>

                    {/* Mode Selection Button (Expanding) */}
                    <div className="w-12 h-12 flex items-center justify-center">
                      <ModeSelectionButtons
                        onModeSelect={(mode) => {
                          onModeSelect?.(mode)
                        }}
                        onAutopilotDoubleClick={onAutopilotDoubleClick}
                      />
                    </div>

                    {/* Autopilot Button */}
                    <button
                      type="button"
                      onClick={() => onAutopilotDoubleClick?.()}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white text-gray-600 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
                      title="Autopilot"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </button>
                  </div>

                  {/* Submit Button (Curved Arrow) */}
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                      input.trim() && !isLoading
                        ? "border-gray-900 bg-gray-900 text-white hover:border-gray-700"
                        : "border-gray-300 bg-white text-gray-400 cursor-not-allowed"
                    )}
                    title="Submit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

