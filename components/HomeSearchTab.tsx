'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Mic, Building2 } from 'lucide-react'
import { ModeSelectionButtons } from './ModeSelectionButtons'
import { useTypewriterSuggestions } from '@/hooks/useTypewriterSuggestions'

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

interface HomeSearchTabProps {
  onSearch?: (query: string, mode: 'search' | 'ai') => void
  onModeSelect?: (mode: string) => void
  onAcknowledgement?: (message: string) => void
  onVoiceStateChange?: (isListening: boolean) => void
  onFinanceOverlay?: () => void
  onAutopilotDoubleClick?: () => void
}

export function HomeSearchTab({ onSearch, onModeSelect, onAcknowledgement, onVoiceStateChange, onFinanceOverlay, onAutopilotDoubleClick }: HomeSearchTabProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'search' | 'ai'>('ai')
  const [isListening, setIsListening] = useState(false)
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  
  const typewriterTextRef = useRef<HTMLSpanElement>(null)
  
  const searchSuggestions = [
    'Analyze Q4 revenue trends',
    'Create financial forecast model',
    'Review market competition analysis',
    'Generate business plan template',
    'Calculate ROI for expansion',
    'Compare pricing strategies',
    'Estimate customer acquisition cost',
    'Build cash flow projection',
    'Analyze profit margins',
    'Evaluate investment opportunities'
  ]
  
  useTypewriterSuggestions({
    suggestions: searchSuggestions,
    textRef: typewriterTextRef,
    speed: 80,
    deleteSpeed: 40,
    pauseTime: 1500,
    isPaused: isFocused || query.length > 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim(), selectedMode)
    }
  }

  const handleModeSelect = (mode: 'search' | 'ai') => {
    setSelectedMode(mode)
    // Placeholder - chat functionality removed
    console.log('Search mode selected:', mode, 'Query:', query)
  }

  const handleAutopilotClick = () => {
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: '/autopilot' }
    }))
  }

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not available')
      alert('Speech recognition is not available in this browser. Please use a browser that supports the Web Speech API (Chrome, Edge, Safari).')
      return
    }
    
    try {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        // Request microphone permission first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          // Stop the stream immediately - we just needed permission
          stream.getTracks().forEach(track => track.stop())
          
          // Now start speech recognition
          recognitionRef.current.start()
        } catch (permissionError: any) {
          console.error('Microphone permission error:', permissionError)
          if (permissionError.name === 'NotAllowedError' || permissionError.name === 'PermissionDeniedError') {
            const isElectron = navigator.userAgent.includes('Electron')
            if (isElectron) {
              alert('Microphone permission is required for voice input.\n\nIn development mode, the app appears as "Electron" in System Settings.\n\nSteps:\n1. Click the microphone button - a macOS permission dialog should appear\n2. Click "Allow" in the dialog\n3. If no dialog appears, go to System Settings > Privacy & Security > Microphone\n4. Look for "Electron" in the list (not "Forkyy" - that\'s only in production builds)\n5. Enable microphone access for Electron\n6. Restart the app and try again\n\nIf "Electron" is not in the list, reset permissions:\nRun in Terminal: tccutil reset Microphone com.github.Electron')
            } else {
              alert('Microphone permission is required for voice input. Please allow microphone access in your browser settings and try again.')
            }
          } else {
            alert('Could not access microphone. Please check your browser settings and try again.')
          }
        }
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error)
      alert('Error starting voice input. Please check your microphone permissions.')
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser')
      setIsSpeechAvailable(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        console.log('Speech recognition started')
        setIsListening(true)
        onVoiceStateChange?.(true)
      }
      
      recognition.onend = () => {
        console.log('Speech recognition ended')
        setIsListening(false)
        onVoiceStateChange?.(false)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        onVoiceStateChange?.(false)
        
        if (event.error === 'not-allowed') {
          // Don't show alert here since we already handle permission in toggleListening
          console.warn('Microphone permission denied')
        } else if (event.error === 'no-speech') {
          console.log('No speech detected')
        } else if (event.error === 'aborted') {
          console.log('Speech recognition aborted')
        } else {
          console.warn('Speech recognition error:', event.error)
        }
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.trim()
        console.log('Speech recognized:', transcript)
        if (transcript) {
          setQuery(transcript)
          onSearch?.(transcript, selectedMode)
        }
      }

      recognitionRef.current = recognition
      setIsSpeechAvailable(true)
    } catch (error) {
      console.error('Error initializing speech recognition:', error)
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
  }, [onSearch, selectedMode, onVoiceStateChange])

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-4">
      {/* Search Tab Container - transparent with dotted outline */}
      <div
        className="relative p-6"
        style={{
          borderRadius: '3rem',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        {/* Decorative Dotted Lines - Spaced out using SVG with stroke-dasharray */}
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

        {/* Search Form with Buttons to the Right */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-4">
          {/* Search Input */}
          <div
            className="bottom-search-input-container relative flex-1 flex items-center"
          >
            {/* Search Icon */}
            <div className="absolute left-4 flex items-center pointer-events-none">
              <Search className="search-icon size-5 transition-colors duration-300 text-[#374151]/80" />
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=""
              className="bottom-search-input w-full pl-12 pr-12 text-base"
            />
            {/* Typewriter Placeholder Overlay */}
            <div 
              className={`absolute left-12 right-12 pointer-events-none ${!isFocused && query.length === 0 ? 'opacity-100' : 'opacity-0'}`}
            >
              <span className="typewriter-placeholder" ref={typewriterTextRef}></span>
              <span className="typewriter-cursor">|</span>
            </div>

            {/* Voice Sensor Glow Indicator */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={!isSpeechAvailable}
              className="absolute right-4 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                !isSpeechAvailable 
                  ? 'Speech recognition not available' 
                  : isListening 
                    ? 'Stop listening' 
                    : 'Start voice input'
              }
            >
              <div className="relative">
                <Mic className={`mic-icon size-5 transition-colors ${isListening ? 'text-orange-500' : isSpeechAvailable ? 'text-[#374151]/80' : 'text-[#374151]/50'}`} />
                {isListening && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(251, 146, 60, 0.5) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                      animation: 'pulse-glow 2s ease-in-out infinite'
                    }}
                  />
                )}
              </div>
            </button>
          </div>

          {/* Three Circular Buttons to the Right */}
          <div className="flex items-center gap-3 relative">
            {/* Search Engine Mode Button */}
            <button
              type="button"
              onClick={() => handleModeSelect('search')}
              className={`
                w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center
                ${selectedMode === 'search'
                  ? 'neu-inset text-[#374151]'
                  : 'border-2 border-[#D1D5DB] bg-white text-[#6B7280] hover:border-[#9CA3AF]'
                }
              `}
              title="Search Engine Mode"
            >
              <Search className="size-5" />
            </button>

            {/* Mode Selection Button (Expanding) - Positioned in the middle */}
            <div className="w-12 h-12 flex items-center justify-center">
              <ModeSelectionButtons
                onModeSelect={onModeSelect || (() => {})}
                onAcknowledgement={onAcknowledgement}
                onAutopilotDoubleClick={onAutopilotDoubleClick}
              />
            </div>

            {/* Autopilot Button */}
            <button
              type="button"
              onClick={handleAutopilotClick}
              className="w-12 h-12 rounded-full border-2 border-[#D1D5DB] bg-white text-[#6B7280] hover:border-[#9CA3AF] transition-all duration-200 flex items-center justify-center"
              title="Autopilot"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </button>

            {/* Real Estate Button */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('browser:navigate', {
                  detail: { url: '/real-estate' }
                }))
              }}
              className="w-12 h-12 rounded-full border-2 border-[#D1D5DB] bg-white text-[#6B7280] hover:border-[#9CA3AF] transition-all duration-200 flex items-center justify-center"
              title="Real Estate"
            >
              <Building2 className="size-5" />
            </button>
          </div>

          {/* Submit Button (Curved Arrow) */}
          <button
            type="submit"
            className="w-12 h-12 rounded-full border-2 border-[#D1D5DB] bg-white text-[#6B7280] hover:border-[#9CA3AF] transition-all duration-200 flex items-center justify-center"
            title="Submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx global>{`
        /* Bottom Search Input Styles - Neumorphic Darker White */
        .bottom-search-input-container {
          border: none !important;
          outline: none !important;
          border-radius: 15px !important;
          padding: 1em !important;
          background-color: #f5f5f5 !important;
          box-shadow: inset 0.5px 1.25px 2.5px rgba(0,0,0,0.3) !important;
          transition: 300ms ease-in-out !important;
          position: relative;
        }
        
        .bottom-search-input-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: #f5f5f5 !important;
          border-radius: 15px;
          z-index: -1;
          box-shadow: inset 0.5px 1.25px 2.5px rgba(0,0,0,0.3) !important;
        }
        
        .bottom-search-input-container:focus-within {
          background-color: #f5f5f5 !important;
          box-shadow: none !important;
          transform: none !important;
        }
        
        .bottom-search-input-container:focus-within .bottom-search-input {
          color: #111827 !important;
        }
        
        .bottom-search-input-container:not(:focus-within) .search-icon,
        .bottom-search-input-container:not(:focus-within) .mic-icon:not(.text-orange-500) {
          animation: shine-icon 3s linear infinite;
        }
        
        .bottom-search-input-container:focus-within .search-icon {
          color: #111827 !important;
          animation: none !important;
        }
        
        .bottom-search-input-container:focus-within .mic-icon:not(.text-orange-500) {
          color: #111827 !important;
          animation: none !important;
        }
        
        .bottom-search-input {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          color: #374151 !important;
        }
        
        .bottom-search-input-container:not(:focus-within) .bottom-search-input {
          background-image: linear-gradient(
            120deg,
            rgba(55, 65, 81, 0.8) 0%,
            rgba(55, 65, 81, 0.8) 40%,
            rgba(55, 65, 81, 1) 50%,
            rgba(55, 65, 81, 0.8) 60%,
            rgba(55, 65, 81, 0.8) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine-bottom-input 3s linear infinite;
        }
        
        .bottom-search-input-container:not(:focus-within) .bottom-search-input::placeholder {
          color: rgba(55, 65, 81, 0.7) !important;
          -webkit-text-fill-color: rgba(55, 65, 81, 0.7) !important;
        }
        
        .bottom-search-input-container:focus-within .bottom-search-input {
          background-image: none !important;
          color: #111827 !important;
          -webkit-text-fill-color: #111827 !important;
          animation: none !important;
        }
        
        .bottom-search-input-container:focus-within .bottom-search-input::placeholder {
          color: rgba(17, 24, 39, 0.5) !important;
          -webkit-text-fill-color: rgba(17, 24, 39, 0.5) !important;
        }
        
        
        @keyframes shine-bottom-input {
          0% {
            background-position: 100%;
          }
          100% {
            background-position: -100%;
          }
        }
        
        @keyframes shine-icon {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.5);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        
        .typewriter-placeholder {
          color: rgba(55, 65, 81, 0.7);
          background-image: linear-gradient(
            120deg,
            rgba(55, 65, 81, 0.8) 0%,
            rgba(55, 65, 81, 0.8) 40%,
            rgba(55, 65, 81, 1) 50%,
            rgba(55, 65, 81, 0.8) 60%,
            rgba(55, 65, 81, 0.8) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine-bottom-input 3s linear infinite;
        }
        
        .typewriter-cursor {
          display: inline-block;
          margin-left: 2px;
          color: rgba(55, 65, 81, 0.7);
          -webkit-text-fill-color: rgba(55, 65, 81, 0.7);
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

