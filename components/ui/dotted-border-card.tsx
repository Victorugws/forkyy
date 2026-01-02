'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface DottedBorderCardProps {
  children: React.ReactNode
  className?: string
  borderRadius?: string
  padding?: string
  background?: string
  noShadow?: boolean
}

export function DottedBorderCard({
  children,
  className,
  borderRadius = '3rem',
  padding = 'p-8',
  background = 'bg-white/95 backdrop-blur-md',
  noShadow = false,
  style
}: DottedBorderCardProps & { style?: React.CSSProperties }) {
  const isTransparent = background === 'bg-transparent' || background === 'transparent'
  
  return (
    <div 
      className={cn('relative', padding, background, className)}
      style={{
        borderRadius,
        border: 'none',
        boxShadow: noShadow ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backgroundColor: isTransparent ? 'transparent' : undefined,
        background: isTransparent ? 'none' : undefined,
        ...style
      }}
    >
      {/* Decorative Dotted Lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ borderRadius }}
      >
        <rect 
          x="0.5" 
          y="0.5" 
          width="calc(100% - 1px)" 
          height="calc(100% - 1px)" 
          fill="none" 
          stroke="#d1d5db" 
          strokeWidth="1" 
          strokeDasharray="2 6"
          rx={borderRadius}
        />
      </svg>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

