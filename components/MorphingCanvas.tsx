'use client'

import React, { useState, useCallback } from 'react'
import { AnimatedEyeBackground } from './AnimatedEyeBackground'

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
  isListening?: boolean
}

export function MorphingCanvas({
  onSearchSubmit,
  children,
  initialState = 'eye-landing',
  autoProgress = true,
  isListening = false
}: MorphingCanvasProps) {
  const [morphState, setMorphState] = useState<MorphState>(initialState)
  const [searchQuery, setSearchQuery] = useState('')
  const [showBinary, setShowBinary] = useState(false)

  // Auto-progress disabled - search tab removed

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

  // Render eye - always visible, no morphing
  const getEyeStyle = (): React.CSSProperties => {
        return {
          opacity: 1,
          transform: 'scale(1)',
          filter: 'blur(0px)',
          pointerEvents: 'none'
    }
  }

  const getContentStyle = (): React.CSSProperties => {
    switch (morphState) {
      case 'content-growing':
        // Content fades in from canvas surface (no scaling, follows mould narrative)
        return {
          opacity: 0.3,
          transform: 'scale(1)',
          filter: 'blur(5px)'
        }
      case 'content-visible':
        // Content fully visible and sharp
        return {
          opacity: 1,
          transform: 'scale(1)',
          filter: 'blur(0px)'
        }
      default:
        return {
          opacity: 0,
          transform: 'scale(1)',
          filter: 'blur(10px)',
          pointerEvents: 'none'
        }
    }
  }

  const getContentVisibility = () => {
    return morphState === 'content-growing' || morphState === 'content-visible'
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background" style={{ overflow: 'hidden' }}>
      {/* Eye Background Layer - always visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...getEyeStyle(),
          zIndex: 2,
        }}
      >
        <AnimatedEyeBackground isListening={isListening} />
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
