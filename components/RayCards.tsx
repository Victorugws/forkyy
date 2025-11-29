'use client'

import React, { useMemo } from 'react'
import { RayCard } from './RayCard'

interface CardData {
  title: string
  content: string
}

const sampleCards: CardData[] = [
  {
    title: "Latest Tech News",
    content: "Discover the latest breakthroughs in AI and machine learning technology."
  },
  {
    title: "Market Trends",
    content: "Stay updated with the latest market trends and financial insights."
  },
  {
    title: "Research Papers",
    content: "Explore cutting-edge research papers from leading institutions."
  },
  {
    title: "How-to Guides",
    content: "Learn new skills with our comprehensive step-by-step guides."
  }
]

export function RayCards() {
  const eyeCenter = { x: 50, y: 50 } // Center of the viewport

  // Generate random positions around the eye
  const cardPositions = useMemo(() => {
    const positions = []
    const angles = [30, 150, 210, 330] // Positions around the circle
    const radius = 35 // Distance from center in viewport percentage

    for (let i = 0; i < sampleCards.length; i++) {
      const angle = (angles[i] * Math.PI) / 180
      const x = eyeCenter.x + radius * Math.cos(angle)
      const y = eyeCenter.y + radius * Math.sin(angle)
      positions.push({ x, y })
    }

    return positions
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* SVG for light rays */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id="rayGradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.6)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.6)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {cardPositions.map((pos, i) => {
          // Calculate the four corners of each card
          const cardWidth = 16 // 16rem = 256px
          const cardHeight = 10 // 10rem = 160px
          const corners = [
            { dx: -cardWidth/2, dy: -cardHeight/2 }, // top-left
            { dx: cardWidth/2, dy: -cardHeight/2 },  // top-right
            { dx: -cardWidth/2, dy: cardHeight/2 },  // bottom-left
            { dx: cardWidth/2, dy: cardHeight/2 }    // bottom-right
          ]

          return corners.map((corner, j) => (
            <line
              key={`${i}-${j}`}
              x1={`${eyeCenter.x}%`}
              y1={`${eyeCenter.y}%`}
              x2={`${pos.x}%`}
              y2={`${pos.y}%`}
              stroke="url(#rayGradient)"
              strokeWidth="2"
              filter="url(#glow)"
              className="animate-pulse-ray"
              style={{
                animationDelay: `${i * 0.2 + j * 0.1}s`
              }}
            />
          ))
        })}
      </svg>

      {/* Ray Cards */}
      <div className="pointer-events-auto">
        {sampleCards.map((card, i) => (
          <RayCard
            key={i}
            title={card.title}
            content={card.content}
            position={cardPositions[i]}
            eyeCenter={eyeCenter}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes pulse-ray {
          0%, 100% {
            opacity: 0.6;
            stroke-width: 2;
          }
          50% {
            opacity: 1;
            stroke-width: 3;
          }
        }

        .animate-pulse-ray {
          animation: pulse-ray 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
