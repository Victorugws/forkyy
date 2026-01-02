'use client'

import React from 'react'

interface GradualBlurProps {
  className?: string
  intensity?: 'light' | 'medium' | 'heavy'
}

export function GradualBlur({ className = '', intensity = 'medium' }: GradualBlurProps) {
  const blurLevels = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-lg'
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 pointer-events-none z-50 ${className}`}>
      <div className="relative h-[5.6rem] sm:h-[7rem] md:h-[8.4rem]">
        {/* Multiple blur layers for gradual effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-full"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.28) 25%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.08) 75%, transparent 100%)',
            backdropFilter: 'blur(0px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-3/4"
          style={{
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            background: 'linear-gradient(to top, rgba(255,255,255,0.12) 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            background: 'linear-gradient(to top, rgba(255,255,255,0.08) 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: 'linear-gradient(to top, rgba(255,255,255,0.04) 0%, transparent 100%)',
          }}
        />
      </div>

      <style jsx>{`
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          div[style*="rgba(255,255,255"] {
            background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 75%, transparent 100%) !important;
          }
        }
      `}</style>
    </div>
  )
}
