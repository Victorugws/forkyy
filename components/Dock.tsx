'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface DockItem {
  icon: React.ReactNode
  label: string
  href: string
}

const dockItems: DockItem[] = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Home',
    href: '/'
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    label: 'Discover',
    href: '/discover'
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    label: 'Finance',
    href: '/finance'
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Images',
    href: '/images'
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Videos',
    href: '/videos'
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    label: 'Spaces',
    href: '/spaces'
  },
]

export function Dock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mouseX, setMouseX] = useState<number>(0)
  const dockRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect()
      setMouseX(e.clientX - rect.left)
    }
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex items-end gap-2 px-3 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
      >
        {dockItems.map((item, index) => (
          <DockIcon
            key={item.label}
            item={item}
            index={index}
            hoveredIndex={hoveredIndex}
            mouseX={mouseX}
            onHover={setHoveredIndex}
            dockRef={dockRef}
          />
        ))}
      </div>
    </div>
  )
}

interface DockIconProps {
  item: DockItem
  index: number
  hoveredIndex: number | null
  mouseX: number
  onHover: (index: number | null) => void
  dockRef: React.RefObject<HTMLDivElement>
}

function DockIcon({ item, index, hoveredIndex, mouseX, onHover, dockRef }: DockIconProps) {
  const iconRef = useRef<HTMLAnchorElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!iconRef.current || !dockRef.current) return

    const iconRect = iconRef.current.getBoundingClientRect()
    const dockRect = dockRef.current.getBoundingClientRect()
    const iconCenterX = iconRect.left - dockRect.left + iconRect.width / 2
    const distance = Math.abs(mouseX - iconCenterX)
    const maxDistance = 150
    const scaleValue = hoveredIndex !== null
      ? Math.max(1, 1.8 - (distance / maxDistance) * 0.8)
      : 1

    setScale(scaleValue)
  }, [mouseX, hoveredIndex])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: item.href }
    }))
  }

  return (
    <div className="relative group">
      <a
        ref={iconRef}
        href={item.href}
        onClick={handleClick}
        onMouseEnter={() => onHover(index)}
        className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200 shadow-lg hover:shadow-xl"
        style={{
          transform: `scale(${scale}) translateY(-${(scale - 1) * 20}px)`,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {item.icon}
      </a>

      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        {item.label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45 -mt-1" />
      </div>
    </div>
  )
}
