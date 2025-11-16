'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AnimatedEyeBackground } from './AnimatedEyeBackground'
import { SearchInterface } from './SearchInterface'
import { BinaryLoadingPlaceholder } from './BinaryLoadingPlaceholder'

/**
 * MorphingCanvas
 * Orchestrates the morphing sequences:
 * 1. Landing → Eye Background
 * 2. Eye morphs → Search Interface
 * 3. User searches → Eye breathes (loading) → Binary placeholders
 * 4. Eye morphs out → Results/Content
 */

type MorphState =
  | 'eye-landing' // Initial eye animation
  | 'eye-to-search' // Eye morphing to search
  | 'search-active' // Search interface visible
  | 'search-to-loading' // User submitted, transitioning to loading
  | 'loading-eye' // Eye breathing with binary placeholders
  | 'eye-to-content' // Eye morphing to reveal content
  | 'content-visible' // Final content displayed

interface MorphingCanvasProps {
  onSearchSubmit?: (query: string) => void
  children?: React.ReactNode
  initialState?: MorphState
  autoProgress?: boolean
}

export function MorphingCanvas({
  onSearchSubmit,
  children,
  initialState = 'eye-landing',
  autoProgress = true
}: MorphingCanvasProps) {
  const [morphState, setMorphState] = useState<MorphState>(initialState)
  const [searchQuery, setSearchQuery] = useState('')
  const [showBinary, setShowBinary] = useState(false)

  // Auto-progress from eye-landing to search-active
  useEffect(() => {
    if (!autoProgress) return

    if (morphState === 'eye-landing') {
      const timer = setTimeout(() => {
        setMorphState('eye-to-search')
      }, 4000) // Let eye animation play for 4 seconds

      return () => clearTimeout(timer)
    }

    if (morphState === 'eye-to-search') {
      const timer = setTimeout(() => {
        setMorphState('search-active')
      }, 1000) // Transition duration

      return () => clearTimeout(timer)
    }
  }, [morphState, autoProgress])

  // Handle search submission
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setMorphState('search-to-loading')

      // Transition to loading state
      setTimeout(() => {
        setMorphState('loading-eye')
        setShowBinary(true)
      }, 500)

      // Call parent callback
      onSearchSubmit?.(query)

      // Simulate loading completion (in real app, this would be triggered by data load)
      setTimeout(() => {
        setShowBinary(false)
        setMorphState('eye-to-content')
      }, 3000)

      setTimeout(() => {
        setMorphState('content-visible')
      }, 4000)
    },
    [onSearchSubmit]
  )

  // Render eye with varying opacity and scale based on state
  const getEyeStyle = (): React.CSSProperties => {
    switch (morphState) {
      case 'eye-landing':
        return { opacity: 1, transform: 'scale(1)' }
      case 'eye-to-search':
        return { opacity: 0.3, transform: 'scale(0.8)' }
      case 'search-active':
        return { opacity: 0, transform: 'scale(0.6)' }
      case 'search-to-loading':
        return { opacity: 0.5, transform: 'scale(0.9)' }
      case 'loading-eye':
        return { opacity: 0.8, transform: 'scale(1.1)' }
      case 'eye-to-content':
        return { opacity: 0.2, transform: 'scale(1.5)' }
      case 'content-visible':
        return { opacity: 0, transform: 'scale(2)' }
      default:
        return { opacity: 1, transform: 'scale(1)' }
    }
  }

  const getSearchVisibility = () => {
    return morphState === 'search-active' || morphState === 'search-to-loading'
  }

  const getContentVisibility = () => {
    return morphState === 'content-visible'
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background">
      {/* Eye Background Layer */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none"
        style={getEyeStyle()}
      >
        <AnimatedEyeBackground />
      </div>

      {/* Search Interface Layer */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center p-8
          transition-all duration-700
          ${getSearchVisibility() ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <SearchInterface
          onSearch={handleSearch}
          isVisible={getSearchVisibility()}
        />
      </div>

      {/* Loading State with Binary Placeholders */}
      {morphState === 'loading-eye' && showBinary && (
        <div
          className="absolute inset-0 flex items-center justify-center p-8"
          style={{
            animation: 'fade-in 0.5s ease-out'
          }}
        >
          <div className="w-full max-w-4xl space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Processing your query...
              </h2>
              <p className="text-sm text-muted-foreground">
                Searching across all sources
              </p>
            </div>

            <BinaryLoadingPlaceholder lines={6} />

            {/* Pulsing indicator */}
            <div className="flex justify-center mt-8">
              <div
                className="neu-raised rounded-full p-4"
                style={{
                  animation: 'pulse-scale 2s ease-in-out infinite'
                }}
              >
                <div className="size-3 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Content Layer */}
      <div
        className={`
          absolute inset-0 transition-all duration-1000
          ${getContentVisibility() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
        `}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * useMorphingState
 * Hook to control morphing canvas from parent components
 */
export function useMorphingState() {
  const [state, setState] = useState<MorphState>('eye-landing')

  const triggerMorph = useCallback((newState: MorphState) => {
    setState(newState)
  }, [])

  const resetToEye = useCallback(() => {
    setState('eye-landing')
  }, [])

  const goToSearch = useCallback(() => {
    setState('search-active')
  }, [])

  const goToContent = useCallback(() => {
    setState('content-visible')
  }, [])

  return {
    morphState: state,
    triggerMorph,
    resetToEye,
    goToSearch,
    goToContent
  }
}
