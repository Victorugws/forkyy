'use client'

import React from 'react'
import { BinaryLoadingPlaceholder } from './BinaryLoadingPlaceholder'

/**
 * BinaryLoadingOverlay
 * Overlays binary placeholders ON component surfaces during loading
 * Like image placeholders - appears on the actual component, not as a separate layer
 */

interface BinaryLoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  lines?: number
  className?: string
}

export function BinaryLoadingOverlay({
  isLoading,
  children,
  lines = 3,
  className = ''
}: BinaryLoadingOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center neu-inset rounded-2xl overflow-hidden backdrop-blur-sm bg-background/80 z-10">
          <div className="w-full px-6">
            <BinaryLoadingPlaceholder lines={lines} />
          </div>
        </div>
      ) : null}
      <div className={isLoading ? 'opacity-30 pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  )
}

/**
 * BinaryCardPlaceholder
 * Standalone card with binary loading - for when card hasn't loaded yet
 */
export function BinaryCardPlaceholder({
  lines = 4,
  className = '',
  style
}: {
  lines?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`neu-card rounded-2xl p-6 ${className}`} style={style}>
      <BinaryLoadingPlaceholder lines={lines} />
    </div>
  )
}
