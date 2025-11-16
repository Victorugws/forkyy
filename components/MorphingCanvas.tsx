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
      }, 6000) // Let eye animation breathe for 6 seconds

      return () => clearTimeout(timer)
    }

    if (morphState === 'eye-to-search') {
      const timer = setTimeout(() => {
        setMorphState('search-active')
      }, 4500) // 4.5 seconds for eye to FULLY vanish into canvas (no skipped frames)

      return () => clearTimeout(timer)
    }
  }, [morphState, autoProgress])

  // Handle search submission
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setMorphState('search-to-loading')

      // Call parent callback
      onSearchSubmit?.(query)

      // Transition directly to content after search vanishes (skip binary loading)
      setTimeout(() => {
        setMorphState('eye-to-content')
      }, 4500) // 4.5 seconds for search to FULLY vanish back into canvas

      // Content morphs out slowly after search is fully gone
      setTimeout(() => {
        setMorphState('content-visible')
      }, 9000) // 4.5 seconds for content to morph out from canvas (no skipped frames)
    },
    [onSearchSubmit]
  )

  // Render eye with varying opacity and scale based on state
  // Concentric absorption/expulsion like mass being absorbed into skin
  const getEyeStyle = (): React.CSSProperties => {
    switch (morphState) {
      case 'eye-landing':
        return {
          opacity: 1,
          transform: 'scale(1)',
          filter: 'blur(0px)'
        }
      case 'eye-to-search':
        // Eye concentrically absorbs into canvas
        return {
          opacity: 0.2,
          transform: 'scale(0.3)',
          filter: 'blur(8px)'
        }
      case 'search-active':
        return {
          opacity: 0,
          transform: 'scale(0.1)',
          filter: 'blur(12px)',
          pointerEvents: 'none'
        }
      case 'search-to-loading':
        // Search morphs back, eye begins to re-emerge
        return {
          opacity: 0.3,
          transform: 'scale(0.5)',
          filter: 'blur(6px)'
        }
      case 'loading-eye':
        // Eye fully visible during loading
        return {
          opacity: 0.9,
          transform: 'scale(0.9)',
          filter: 'blur(2px)'
        }
      case 'eye-to-content':
        // Eye expands and dissolves as content emerges
        return {
          opacity: 0.1,
          transform: 'scale(2)',
          filter: 'blur(20px)'
        }
      case 'content-visible':
        return {
          opacity: 0,
          transform: 'scale(3)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }
      default:
        return { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }
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
        className="absolute inset-0 pointer-events-none"
        style={{
          ...getEyeStyle(),
          transition: 'all 4500ms cubic-bezier(0.25, 0.1, 0.25, 1)' // 4.5 second smooth transition, no skipped frames
        }}
      >
        <AnimatedEyeBackground />
      </div>

      {/* Search Interface Layer */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center p-8
          ${getSearchVisibility() ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        style={{
          transition: 'all 4500ms cubic-bezier(0.25, 0.1, 0.25, 1)' // 4.5 second smooth transition
        }}
      >
        <SearchInterface
          onSearch={handleSearch}
          isVisible={getSearchVisibility()}
        />
      </div>

      {/* Final Content Layer */}
      <div
        className={`
          absolute inset-0
          ${getContentVisibility() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
        `}
        style={{
          transition: 'all 4500ms cubic-bezier(0.25, 0.1, 0.25, 1)' // 4.5 second smooth emergence from canvas
        }}
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
