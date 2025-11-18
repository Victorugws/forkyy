'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Define opacity values for different pages
const PAGE_OPACITIES: Record<string, number> = {
  '/': 0.15,
  '/search': 0.1,
  '/discover': 0.12,
  '/morph-home': 0.15,
  '/morph-demo': 0.15,
  '/morph-showcase': 0.15,
  '/images': 0.08,
  '/images-morph': 0.08,
  '/videos': 0.12,
  '/finance': 0.1,
  '/finance-morph': 0.1,
  '/academic': 0.08,
  '/writing': 0.08,
  '/spaces': 0.12,
  '/templates': 0.12,
  '/auth/login': 0.2,
  '/auth/sign-up': 0.2,
  '/auth/forgot-password': 0.2,
  '/auth/update-password': 0.2,
}

// Default opacity for pages not explicitly defined
const DEFAULT_OPACITY = 0.1

export function VideoBackground() {
  const pathname = usePathname()
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY)

  useEffect(() => {
    // Find matching opacity for current path
    let matchedOpacity = DEFAULT_OPACITY

    // Check for exact match first
    if (pathname && PAGE_OPACITIES[pathname]) {
      matchedOpacity = PAGE_OPACITIES[pathname]
    } else if (pathname) {
      // Check for partial matches (e.g., /search/123 matches /search)
      const matchingPath = Object.keys(PAGE_OPACITIES).find(path =>
        pathname.startsWith(path) && path !== '/'
      )
      if (matchingPath) {
        matchedOpacity = PAGE_OPACITIES[matchingPath]
      }
    }

    setOpacity(matchedOpacity)
  }, [pathname])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          filter: 'blur(0px)',
        }}
      >
        <source
          src="https://assets.awwwards.com/awards/element/2022/10/6357b7d0e105b635112333.mp4"
          type="video/mp4"
        />
      </video>
      {/* Subtle overlay to help with text contrast */}
      <div
        className="absolute inset-0 bg-background/10"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  )
}
