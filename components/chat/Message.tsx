'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MessageProps {
  content: string
  role: 'user' | 'assistant'
  className?: string
}

export function Message({ content, role, className }: MessageProps) {
  return (
    <div
      className={cn(
        'w-full p-6 bg-white/95 backdrop-blur-md rounded-2xl',
        'border-2 border-dashed border-gray-300/80',
        'shadow-xl',
        className
      )}
      style={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}

