'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Sparkles } from 'lucide-react'

/**
 * SearchInterface
 * Clean, minimal search interface inspired by https://codepen.io/tdtrung17693/pen/BaozOzQ
 * With neumorphic design that morphs in/out with eye animations
 */

interface SearchInterfaceProps {
  onSearch: (query: string) => void
  onFocus?: () => void
  onBlur?: () => void
  isVisible?: boolean
  className?: string
}

export function SearchInterface({
  onSearch,
  onFocus,
  onBlur,
  isVisible = true,
  className = ''
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible && inputRef.current) {
      // Auto-focus when visible
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isVisible])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  return (
    <div
      className={`
        w-full max-w-3xl mx-auto
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        ${className}
      `}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
      }}
    >
      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        {/* Neumorphic Search Container */}
        <div
          className={`
            neu-raised
            rounded-[2rem]
            p-2
            transition-all duration-300
            ${isFocused ? 'shadow-neu-lg scale-[1.02]' : 'shadow-neu'}
          `}
        >
          <div className="relative flex items-center">
            {/* Search Icon */}
            <div className="absolute left-6 flex items-center pointer-events-none">
              <Search
                className={`size-6 transition-colors duration-300 ${
                  isFocused ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Ask anything..."
              className="w-full bg-transparent pl-16 pr-16 py-5 text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-300"
              style={{
                fontWeight: isFocused ? 500 : 400
              }}
            />

            {/* AI Sparkle Icon */}
            {query && (
              <div className="absolute right-6 flex items-center">
                <button
                  type="submit"
                  className="neu-button rounded-full p-3 hover:scale-110 active:scale-95 transition-transform duration-200"
                  aria-label="Search"
                >
                  <Sparkles className="size-5 text-primary" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Focus Indicator */}
        {isFocused && (
          <div
            className="absolute -inset-1 rounded-[2.2rem] border-2 border-primary/30 pointer-events-none"
            style={{
              animation: 'pulse-border 2s ease-in-out infinite'
            }}
          />
        )}
      </form>

      {/* Suggested Prompts */}
      {!query && (
        <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Try asking about...
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Latest tech news',
              'Market trends',
              'Research papers',
              'How to...'
            ].map((suggestion, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(suggestion)
                  inputRef.current?.focus()
                }}
                className="neu-button px-4 py-2 rounded-full text-sm text-foreground/80 hover:text-foreground transition-all duration-200 hover:scale-105"
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.01);
          }
        }
      `}</style>
    </div>
  )
}

/**
 * MinimalSearchInterface
 * Compact version for post-search state
 */
export function MinimalSearchInterface({
  initialQuery = '',
  onSearch,
  className = ''
}: {
  initialQuery?: string
  onSearch: (query: string) => void
  className?: string
}) {
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="neu-inset rounded-xl p-1">
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-transparent pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </div>
      </div>
    </form>
  )
}
