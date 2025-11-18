'use client'

import React, { useState, useEffect } from 'react'
import { AnimatedEyeBackground } from './AnimatedEyeBackground'
import { BinaryLoadingPlaceholder } from './BinaryLoadingPlaceholder'

/**
 * PageMorphWrapper
 * Wraps page content with morphing eye animation on initial load
 * Eye morphs in → Page content morphs out
 * Can be used on any dedicated page (Finance, Images, Videos, etc.)
 */

interface PageMorphWrapperProps {
  children: React.ReactNode
  /** Skip morphing animation (useful for navigation within same section) */
  skipMorph?: boolean
  /** Duration of eye display in ms */
  eyeDuration?: number
  /** Show binary loading during transition */
  showBinaryLoading?: boolean
  className?: string
}

type MorphPhase = 'eye-display' | 'eye-fadeout' | 'binary-loading' | 'content-fadein' | 'content-visible'

export function PageMorphWrapper({
  children,
  skipMorph = false,
  eyeDuration = 2000,
  showBinaryLoading = true,
  className = ''
}: PageMorphWrapperProps) {
  const [phase, setPhase] = useState<MorphPhase>(skipMorph ? 'content-visible' : 'eye-display')
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => {
    // Only play animation on first mount
    if (!isFirstMount || skipMorph) return

    // Phase 1: Display eye
    const eyeTimer = setTimeout(() => {
      setPhase('eye-fadeout')
    }, eyeDuration)

    // Phase 2: Fade out eye
    const fadeoutTimer = setTimeout(() => {
      if (showBinaryLoading) {
        setPhase('binary-loading')
      } else {
        setPhase('content-fadein')
      }
    }, eyeDuration + 800)

    // Phase 3: Binary loading (if enabled)
    const binaryTimer = showBinaryLoading
      ? setTimeout(() => {
          setPhase('content-fadein')
        }, eyeDuration + 2300)
      : null

    // Phase 4: Fade in content
    const contentTimer = setTimeout(() => {
      setPhase('content-visible')
      setIsFirstMount(false)
    }, eyeDuration + (showBinaryLoading ? 3300 : 1800))

    return () => {
      clearTimeout(eyeTimer)
      clearTimeout(fadeoutTimer)
      if (binaryTimer) clearTimeout(binaryTimer)
      clearTimeout(contentTimer)
    }
  }, [eyeDuration, isFirstMount, showBinaryLoading, skipMorph])

  // If skip morph or not first mount, show content directly
  if (skipMorph || !isFirstMount) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative w-full min-h-screen ${className}`}>
      {/* Eye Background Layer */}
      {(phase === 'eye-display' || phase === 'eye-fadeout') && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000"
          style={{
            opacity: phase === 'eye-fadeout' ? 0 : 1,
            transform: phase === 'eye-fadeout' ? 'scale(0.8)' : 'scale(1)',
            pointerEvents: 'none'
          }}
        >
          <AnimatedEyeBackground />
        </div>
      )}

      {/* Binary Loading Layer */}
      {phase === 'binary-loading' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background px-8"
          style={{
            animation: 'fade-in 500ms ease-out'
          }}
        >
          <div className="w-full max-w-4xl">
            <BinaryLoadingPlaceholder lines={8} />
          </div>
        </div>
      )}

      {/* Content Layer */}
      <div
        className="w-full min-h-screen transition-all duration-1000"
        style={{
          opacity: phase === 'content-visible' ? 1 : phase === 'content-fadein' ? 0.5 : 0,
          transform:
            phase === 'content-visible'
              ? 'translateY(0)'
              : phase === 'content-fadein'
                ? 'translateY(10px)'
                : 'translateY(20px)',
          pointerEvents: phase === 'content-visible' ? 'auto' : 'none'
        }}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

/**
 * usePageMorph
 * Hook to control page morphing from within components
 */
export function usePageMorph() {
  const [shouldSkipMorph, setShouldSkipMorph] = useState(false)

  useEffect(() => {
    // Check if this is a navigation within the same session
    const hasSeenMorph = sessionStorage.getItem('morph-seen')
    if (hasSeenMorph) {
      setShouldSkipMorph(true)
    } else {
      sessionStorage.setItem('morph-seen', 'true')
    }
  }, [])

  return {
    shouldSkipMorph,
    resetMorph: () => {
      sessionStorage.removeItem('morph-seen')
      setShouldSkipMorph(false)
    }
  }
}
