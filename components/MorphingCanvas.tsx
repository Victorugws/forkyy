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
  | 'blank-canvas' // Blank white canvas after eye vanishes
  | 'search-growing' // Search interface physically growing from canvas
  | 'search-active' // Search interface visible
  | 'search-to-loading' // User submitted, transitioning to loading
  | 'loading-eye' // Eye breathing with binary placeholders
  | 'eye-to-content' // Eye morphing to reveal content
  | 'content-growing' // Content physically growing from canvas
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

  // Auto-progress through states
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
        setMorphState('blank-canvas')
      }, 4500) // 4.5 seconds for eye to FULLY vanish into canvas (no skipped frames)

      return () => clearTimeout(timer)
    }

    if (morphState === 'blank-canvas') {
      const timer = setTimeout(() => {
        setMorphState('search-growing')
      }, 2000) // 2 seconds of blank canvas visibility

      return () => clearTimeout(timer)
    }

    if (morphState === 'search-growing') {
      const timer = setTimeout(() => {
        setMorphState('search-active')
      }, 3000) // 3 seconds for search to physically grow from canvas

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

      // Transition to content growth after search vanishes (skip binary loading)
      setTimeout(() => {
        setMorphState('content-growing')
      }, 4500) // 4.5 seconds for search to FULLY vanish back into canvas

      // Content finishes growing and becomes fully visible
      setTimeout(() => {
        setMorphState('content-visible')
      }, 7500) // 3 seconds for content to physically grow from canvas (4500 + 3000)
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
          opacity: 0,
          transform: 'scale(0.1)',
          filter: 'blur(15px)'
        }
      case 'blank-canvas':
      case 'search-growing':
      case 'search-active':
        // Eye completely absorbed into blank canvas
        return {
          opacity: 0,
          transform: 'scale(0)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }
      case 'search-to-loading':
        // Search shrinks back into canvas
        return {
          opacity: 0,
          transform: 'scale(0)',
          filter: 'blur(15px)'
        }
      case 'loading-eye':
        // Eye fully visible during loading
        return {
          opacity: 0.9,
          transform: 'scale(0.9)',
          filter: 'blur(2px)'
        }
      case 'eye-to-content':
      case 'content-growing':
      case 'content-visible':
        // Eye stays absorbed as content grows
        return {
          opacity: 0,
          transform: 'scale(0)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }
      default:
        return { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }
    }
  }

  const getSearchStyle = (): React.CSSProperties => {
    switch (morphState) {
      case 'search-growing':
        // Search physically grows from tiny point
        return {
          opacity: 1,
          transform: 'scale(0.1)',
          filter: 'blur(2px)'
        }
      case 'search-active':
        // Search fully grown and visible
        return {
          opacity: 1,
          transform: 'scale(1)',
          filter: 'blur(0px)'
        }
      case 'search-to-loading':
        // Search shrinks back into canvas
        return {
          opacity: 0.5,
          transform: 'scale(0.1)',
          filter: 'blur(8px)'
        }
      default:
        return {
          opacity: 0,
          transform: 'scale(0)',
          filter: 'blur(10px)',
          pointerEvents: 'none'
        }
    }
  }

  const getContentStyle = (): React.CSSProperties => {
    switch (morphState) {
      case 'content-growing':
        // Content physically grows from canvas
        return {
          opacity: 1,
          transform: 'scale(0.1)',
          filter: 'blur(3px)'
        }
      case 'content-visible':
        // Content fully grown and visible
        return {
          opacity: 1,
          transform: 'scale(1)',
          filter: 'blur(0px)'
        }
      default:
        return {
          opacity: 0,
          transform: 'scale(0)',
          filter: 'blur(10px)',
          pointerEvents: 'none'
        }
    }
  }

  const getSearchVisibility = () => {
    return morphState === 'search-growing' || morphState === 'search-active' || morphState === 'search-to-loading'
  }

  const getContentVisibility = () => {
    return morphState === 'content-growing' || morphState === 'content-visible'
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
          ${getSearchVisibility() ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
        style={{
          ...getSearchStyle(),
          transition: 'all 3000ms cubic-bezier(0.25, 0.1, 0.25, 1)' // 3 second growth/shrink transition
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
          ${getContentVisibility() ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
        style={{
          ...getContentStyle(),
          transition: 'all 3000ms cubic-bezier(0.25, 0.1, 0.25, 1)' // 3 second growth transition
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
