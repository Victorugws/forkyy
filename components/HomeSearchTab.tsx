'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Mic } from 'lucide-react'
import { generateId } from 'ai'
import { ModeSelectionButtons } from './ModeSelectionButtons'

interface HomeSearchTabProps {
  onSearch?: (query: string, mode: 'search' | 'ai') => void
  onModeSelect?: (mode: string) => void
  onAcknowledgement?: (message: string) => void
  onVoiceStateChange?: (isListening: boolean) => void
  onFinanceOverlay?: () => void
}

export function HomeSearchTab({ onSearch, onModeSelect, onAcknowledgement, onVoiceStateChange, onFinanceOverlay }: HomeSearchTabProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'search' | 'ai'>('ai')
  const [isListening, setIsListening] = useState(false)
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim(), selectedMode)
    }
  }

  const handleModeSelect = (mode: 'search' | 'ai') => {
    setSelectedMode(mode)
    if (mode === 'search') {
      // Navigate to choice search engine response page
      const newChatId = generateId()
      window.dispatchEvent(new CustomEvent('browser:navigate', {
        detail: { url: `/search/${newChatId}?q=${encodeURIComponent(query || '')}&mode=search` }
      }))
    } else {
      // Navigate to post prompt morphic page
      const newChatId = generateId()
      window.dispatchEvent(new CustomEvent('browser:navigate', {
        detail: { url: `/search/${newChatId}?q=${encodeURIComponent(query || '')}&mode=ai` }
      }))
    }
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
    <div className="relative w-full max-w-4xl mx-auto mt-8">
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
            className={`
              relative flex-1 flex items-center bg-white rounded-xl border transition-all duration-300
              ${isFocused ? 'border-gray-400 shadow-md' : 'border-gray-200'}
            `}
          >
            {/* Search Icon */}
            <div className="absolute left-4 flex items-center pointer-events-none">
              <Search
                className={`size-5 transition-colors duration-300 ${
                  isFocused ? 'text-gray-900' : 'text-gray-400'
                }`}
              />
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask me anything"
              className="w-full bg-transparent pl-12 pr-12 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />

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
                <Mic className={`size-5 transition-colors ${isListening ? 'text-orange-500' : isSpeechAvailable ? 'text-gray-400' : 'text-gray-300'}`} />
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
                w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                ${selectedMode === 'search'
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
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
                onFinanceOverlay={onFinanceOverlay}
              />
            </div>

            {/* Autopilot Button */}
            <button
              type="button"
              onClick={handleAutopilotClick}
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
            className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white text-gray-600 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
            title="Submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

