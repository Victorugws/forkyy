'use client'

import React, { useState, useRef, useEffect } from 'react'

// SpeechRecognition type declaration
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

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResult[][]
  resultIndex: number
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
import { Search, Mic, Scale, X } from 'lucide-react'

interface MorphedSearchTabProps {
  templatePrompt: string
  onPromptChange: (prompt: string) => void
  onSearch: (query: string) => void
  onVoiceStateChange?: (isListening: boolean) => void
  onFinanceOverlay?: () => void
  position: 'left' | 'right'
  specificityOptions: Array<{ label: string; value: string }>
  onSpecificitySelect?: (value: string) => void
  onLegalityClick?: () => void
  showLegalityButton: boolean
}

export function MorphedSearchTab({
  templatePrompt,
  onPromptChange,
  onSearch,
  onVoiceStateChange,
  position,
  specificityOptions,
  onSpecificitySelect,
  onLegalityClick,
  showLegalityButton,
}: MorphedSearchTabProps) {
  const [query, setQuery] = useState(templatePrompt)
  const [isFocused, setIsFocused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false)
  const [showCompliancePopover, setShowCompliancePopover] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    setQuery(templatePrompt)
  }, [templatePrompt])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not available')
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
        }
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error)
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSpeechAvailable(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        onVoiceStateChange?.(true)
      }

      recognition.onend = () => {
        setIsListening(false)
        onVoiceStateChange?.(false)
      }

      recognition.onerror = (event: any) => {
        setIsListening(false)
        onVoiceStateChange?.(false)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.trim()
        if (transcript) {
          setQuery(transcript)
          onPromptChange(transcript)
        }
      }

      recognitionRef.current = recognition
      setIsSpeechAvailable(true)
    } catch (error) {
      setIsSpeechAvailable(false)
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
  }, [onPromptChange, onVoiceStateChange])

  const compliancePersonalities = [
    { name: 'Harvey', description: 'Textbook lawyer - stays far from the line', color: '#6366f1' },
    { name: 'Crane', description: 'Conservative approach with safety margins', color: '#3b82f6' },
    { name: 'Bach', description: 'Balanced compliance with calculated risks', color: '#8b5cf6' },
    { name: 'Shore', description: 'Innovative - keeps safe but closer to the line', color: '#ec4899' },
  ]

  return (
    <>
      <div
        className="morphed-search-tab"
        style={{
          position: 'absolute',
          [position]: '10%',
          bottom: '30%', // Moved up 10% (from 20% to 30%)
          width: '80%', // Occupies 80% of the side it morphs to
          maxWidth: position === 'left' ? 'calc(50% - 5%)' : 'calc(50% - 5%)', // 80% of half the screen minus margins
          zIndex: 40,
          overflow: 'visible', // Ensure popover isn't clipped
        }}
      >
        {/* Vertical Rectangle with Dotted Border */}
        <div
          className="relative p-6"
          style={{
            borderRadius: '2rem',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            minHeight: '400px',
          }}
        >
          {/* Dotted Border SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ borderRadius: '2rem' }}>
            <rect
              x="0.5"
              y="0.5"
              width="calc(100% - 1px)"
              height="calc(100% - 1px)"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1"
              strokeDasharray="2 6"
              rx="2rem"
            />
          </svg>

          {/* Content */}
          <div className="flex flex-col gap-4 h-full">
            {/* Search Input - Vertical */}
            <div className="flex-1 flex flex-col gap-3">
              <div
                className={`
                  relative flex items-center bg-white rounded-xl border transition-all duration-300
                  ${isFocused ? 'border-gray-400 shadow-md' : 'border-gray-200'}
                `}
              >
                <div className="absolute left-3 flex items-center pointer-events-none">
                  <Search className={`size-4 transition-colors ${isFocused ? 'text-gray-900' : 'text-gray-400'}`} />
                </div>
                <textarea
                  ref={inputRef as any}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    onPromptChange(e.target.value)
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Add specifications..."
                  className="w-full bg-transparent pl-10 pr-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none"
                  rows={8}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={!isSpeechAvailable}
                  className="absolute bottom-3 right-3 flex items-center cursor-pointer"
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  <Mic className={`size-4 transition-colors ${isListening ? 'text-orange-500' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Specificity Controls */}
              <div className="flex flex-col gap-2">
                <div className="text-xs text-gray-500 mb-1">Features:</div>
                <div className="flex flex-wrap gap-2">
                  {specificityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSpecificitySelect?.(option.value)}
                      className="specificity-button"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        border: '2px dotted #999',
                        background: 'transparent',
                        color: '#666',
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Legality Button - Bouncing */}
        {showLegalityButton && (
          <button
            onClick={() => {
              setShowCompliancePopover(true)
              onLegalityClick?.()
            }}
            className="legality-button-bouncing"
            style={{
              position: 'absolute',
              bottom: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#e8e8e8',
              border: 'none',
              boxShadow: '5px 5px 12px #cacaca, -5px -5px 12px #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              animation: 'bounce-continuous 1s ease-in-out infinite',
            }}
          >
            <Scale className="size-5 text-gray-700" />
          </button>
        )}

        {/* Compliance Popover */}
        {showCompliancePopover && (
          <div
            className="compliance-popover"
            style={{
              position: 'absolute', // Position relative to parent (morphed search tab)
              bottom: '-120px', // Raised a bit higher (from -150px to -120px)
              left: '50%',
              transform: 'translateX(-50%)',
              width: '240px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              border: '2px dotted #999',
              zIndex: 50,
              maxHeight: '400px', // Limit height
              overflowY: 'auto', // Allow scrolling if needed
            }}
          >
            <button
              onClick={() => setShowCompliancePopover(false)}
              className="absolute top-2 right-2"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X className="size-4 text-gray-500" />
            </button>
            <div className="text-xs font-semibold text-gray-700 mb-3">Choose Compliance Personality:</div>
            <div className="flex flex-col gap-2">
              {compliancePersonalities.map((personality) => (
                <button
                  key={personality.name}
                  onClick={() => {
                    setShowCompliancePopover(false)
                    // Handle personality selection
                    console.log('Selected personality:', personality.name)
                  }}
                  className="personality-button"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div className="font-medium text-sm" style={{ color: personality.color }}>
                    {personality.name}
                  </div>
                  <div className="text-xs text-gray-600">{personality.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-continuous {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-8px);
          }
        }
        .specificity-button:hover {
          background: #f3f4f6;
          border-color: #666;
        }
        .personality-button:hover {
          background: #f9fafb;
          border-color: ${compliancePersonalities[0].color};
        }
      `}</style>
    </>
  )
}

