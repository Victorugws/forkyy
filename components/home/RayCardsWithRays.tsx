'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import TiltedCard from '@/components/reactbits/components/TiltedCard'
import ElectricBorder from '@/components/reactbits/animations/ElectricBorder'

const sampleCards = [
  {
    title: "Latest Tech News",
    content: "Discover breakthroughs in AI",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=300&fit=crop"
  },
  {
    title: "Market Trends",
    content: "Financial insights & analytics",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=300&fit=crop"
  },
  {
    title: "Research Papers",
    content: "Cutting-edge research",
    image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=300&h=300&fit=crop"
  },
  {
    title: "How-to Guides",
    content: "Step-by-step tutorials",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop"
  }
]

export function RayCardsWithRays() {
  const eyeCenter = { x: 50, y: 50 } // Center of viewport in percentage
  const [cardsVisible, setCardsVisible] = useState(true)
  const [raysExtended, setRaysExtended] = useState(true)
  const [currentPositions, setCurrentPositions] = useState<{ x: number; y: number }[]>([])
  const [glitchActive, setGlitchActive] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cardRotations, setCardRotations] = useState<{ x: number; y: number }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 100)
    }, 4000 + Math.random() * 3000)
    return () => clearInterval(glitchInterval)
  }, [])

  // Generate random positions around the eye
  const generateRandomPositions = () => {
    const positions = []
    const rotations = []
    const radius = 40 // Distance from center in viewport percentage
    const numCards = sampleCards.length

    for (let i = 0; i < numCards; i++) {
      // Random angle for each card
      const angle = (Math.random() * 360 * Math.PI) / 180
      const x = eyeCenter.x + radius * Math.cos(angle)
      const y = eyeCenter.y + radius * Math.sin(angle)
      positions.push({ x, y })
      rotations.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15
      })
    }

    setCardRotations(rotations)
    return positions
  }

  // Initialize positions
  useEffect(() => {
    setCurrentPositions(generateRandomPositions())
  }, [])

  // Hologram animation cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      // 1. Cards disappear (1s)
      setCardsVisible(false)

      setTimeout(() => {
        // 2. Rays retract (1s)
        setRaysExtended(false)

        setTimeout(() => {
          // 3. Generate new positions while rays are at center
          setCurrentPositions(generateRandomPositions())

          setTimeout(() => {
            // 4. Rays extend to new positions (1s)
            setRaysExtended(true)

            setTimeout(() => {
              // 5. Cards appear at new positions (1s)
              setCardsVisible(true)
            }, 1000)
          }, 100)
        }, 1000)
      }, 1000)
    }, 10000) // Repeat every 10 seconds

    return () => clearInterval(cycle)
  }, [])

  const cardPositions = currentPositions

  // Calculate corner positions for each card
  const getCornerPositions = (cardPos: { x: number; y: number }) => {
    const cardWidth = 16 // rem (256px)
    const cardHeight = 10 // rem (160px)

    return [
      { x: cardPos.x - cardWidth/2, y: cardPos.y - cardHeight/2 }, // top-left
      { x: cardPos.x + cardWidth/2, y: cardPos.y - cardHeight/2 }, // top-right
      { x: cardPos.x + cardWidth/2, y: cardPos.y + cardHeight/2 }, // bottom-right
      { x: cardPos.x - cardWidth/2, y: cardPos.y + cardHeight/2 }, // bottom-left
    ]
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ perspective: '1000px' }}>
      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Projection Beams - Eye projecting the holographic cards */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
        <defs>
          {/* Black projection gradient */}
          <linearGradient id="projectionGradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0.6)" />
            <stop offset="50%" stopColor="rgba(0, 0, 0, 0.35)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.15)" />
          </linearGradient>

          {/* Radial gradient for beam core */}
          <radialGradient id="beamCore">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0.8)" />
            <stop offset="50%" stopColor="rgba(0, 0, 0, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>

          {/* Glow filter for projection beams */}
          <filter id="projectionGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur2"/>
              <feMergeNode in="blur1"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Draw projection cones from eye to each card */}
        {raysExtended && cardPositions.length > 0 && cardPositions.map((pos, cardIndex) => {
          const cardWidth = 16
          const cardHeight = 10

          // Calculate the four corners of the card
          const topLeft = { x: pos.x - cardWidth/2, y: pos.y - cardHeight/2 }
          const topRight = { x: pos.x + cardWidth/2, y: pos.y - cardHeight/2 }
          const bottomLeft = { x: pos.x - cardWidth/2, y: pos.y + cardHeight/2 }
          const bottomRight = { x: pos.x + cardWidth/2, y: pos.y + cardHeight/2 }

          return (
            <g key={cardIndex} className="projection-beam-group" style={{ animationDelay: `${cardIndex * 0.15}s` }}>
              {/* Main projection cone (trapezoid from eye to card) */}
              <polygon
                points={`
                  ${eyeCenter.x}%,${eyeCenter.y}%
                  ${topLeft.x}%,${topLeft.y}%
                  ${topRight.x}%,${topRight.y}%
                  ${bottomRight.x}%,${bottomRight.y}%
                  ${bottomLeft.x}%,${bottomLeft.y}%
                `}
                fill="url(#projectionGradient)"
                opacity="0.6"
                filter="url(#projectionGlow)"
                className="projection-cone"
              />

              {/* Edge beams to card corners (for definition) */}
              <line
                x1={`${eyeCenter.x}%`}
                y1={`${eyeCenter.y}%`}
                x2={`${topLeft.x}%`}
                y2={`${topLeft.y}%`}
                stroke="rgba(0, 0, 0, 0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#projectionGlow)"
                className="projection-edge"
              />
              <line
                x1={`${eyeCenter.x}%`}
                y1={`${eyeCenter.y}%`}
                x2={`${topRight.x}%`}
                y2={`${topRight.y}%`}
                stroke="rgba(0, 0, 0, 0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#projectionGlow)"
                className="projection-edge"
              />
              <line
                x1={`${eyeCenter.x}%`}
                y1={`${eyeCenter.y}%`}
                x2={`${bottomLeft.x}%`}
                y2={`${bottomLeft.y}%`}
                stroke="rgba(0, 0, 0, 0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#projectionGlow)"
                className="projection-edge"
              />
              <line
                x1={`${eyeCenter.x}%`}
                y1={`${eyeCenter.y}%`}
                x2={`${bottomRight.x}%`}
                y2={`${bottomRight.y}%`}
                stroke="rgba(0, 0, 0, 0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#projectionGlow)"
                className="projection-edge"
              />

              {/* Center beam (brightest) */}
              <line
                x1={`${eyeCenter.x}%`}
                y1={`${eyeCenter.y}%`}
                x2={`${pos.x}%`}
                y2={`${pos.y}%`}
                stroke="rgba(0, 0, 0, 0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#projectionGlow)"
                className="projection-center"
              />
            </g>
          )
        })}
      </svg>

      {/* Ray Cards with ALL hologram effects */}
      <div className="pointer-events-auto" style={{ position: 'relative', zIndex: 10 }}>
        {cardPositions.length > 0 && sampleCards.map((card, i) => {
          // Calculate distance from mouse for interactive effects
          const cardPos = cardPositions[i] || { x: eyeCenter.x, y: eyeCenter.y }
          const distFromMouse = Math.sqrt(
            Math.pow(mousePos.x - cardPos.x, 2) + Math.pow(mousePos.y - cardPos.y, 2)
          )
          const hoverIntensity = Math.max(0, 1 - distFromMouse / 30)

          // Interactive tilt based on mouse position
          const tiltX = (mousePos.y - cardPos.y) * hoverIntensity * 0.5
          const tiltY = (cardPos.x - mousePos.x) * hoverIntensity * 0.5

          const rotation = cardRotations[i] || { x: 0, y: 0 }

          return (
            <div
              key={i}
              className="hologram-card absolute transition-all duration-1000"
              style={{
                left: `${cardPos.x}%`,
                top: `${cardPos.y}%`,
                transform: `
                  translate(-50%, -50%)
                  ${glitchActive ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` : ''}
                `,
                zIndex: 10,
                opacity: cardsVisible ? (glitchActive ? 0.85 : 1) : 0,
                pointerEvents: cardsVisible ? 'auto' : 'none',
                filter: glitchActive ? 'hue-rotate(10deg)' : 'none',
              }}
            >
              <div
                className="hologram-card-inner"
                style={{
                  transform: `
                    rotateX(${rotation.x + tiltX}deg)
                    rotateY(${rotation.y + tiltY}deg)
                    scale(${1 + hoverIntensity * 0.05})
                  `,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Fresnel glow ring */}
                <div className="fresnel-glow" />

                {/* Static noise overlay */}
                <div className="noise-overlay" />

                {/* Iridescent shimmer overlay */}
                <div className="iridescent-shimmer" />

                {/* Chromatic aberration effect */}
                <div className="chromatic-aberration" />

                <ElectricBorder
                  color="#7df9ff"
                  speed={1.5}
                  chaos={0.6}
                  thickness={2}
                  style={{ borderRadius: 16 }}
                >
                  <TiltedCard
                    imageSrc={card.image}
                    altText={card.title}
                    captionText={card.title}
                    containerHeight="160px"
                    containerWidth="256px"
                    imageHeight="160px"
                    imageWidth="256px"
                    rotateAmplitude={8}
                    scaleOnHover={1.05}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="p-4 bg-black/70 backdrop-blur-md rounded-lg shadow-2xl" style={{
                        boxShadow: '0 20px 60px rgba(128, 128, 128, 0.3), 0 10px 30px rgba(100, 100, 100, 0.2)'
                      }}>
                        <h3 className="text-white font-bold text-sm mb-1">{card.title}</h3>
                        <p className="text-white/80 text-xs">{card.content}</p>
                      </div>
                    }
                  />
                </ElectricBorder>

                {/* Scan line materialization effect */}
                {!cardsVisible && <div className="scan-line" />}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx global>{`
        /* ===== SCANLINE OVERLAY ===== */
        .scanline-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(125, 249, 255, 0.03) 50%,
            transparent 100%
          );
          background-size: 100% 4px;
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 100;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        /* ===== PROJECTION BEAMS ===== */
        .projection-beam-group {
          animation: projection-fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes projection-fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .projection-cone {
          animation: projection-pulse 3s ease-in-out infinite;
        }

        @keyframes projection-pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }

        .projection-edge {
          animation: edge-shimmer 2.5s ease-in-out infinite;
        }

        @keyframes edge-shimmer {
          0%, 100% {
            opacity: 0.3;
            stroke-width: 1;
          }
          50% {
            opacity: 0.6;
            stroke-width: 1.5;
          }
        }

        .projection-center {
          animation: center-beam-pulse 2s ease-in-out infinite;
        }

        @keyframes center-beam-pulse {
          0%, 100% {
            opacity: 0.5;
            stroke-width: 1.5;
          }
          50% {
            opacity: 0.9;
            stroke-width: 2.5;
          }
        }

        /* ===== HOLOGRAM CARD ===== */
        .hologram-card {
          animation: card-breathe 4s ease-in-out infinite, card-float 6s ease-in-out infinite;
        }

        @keyframes card-breathe {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.1); }
        }

        @keyframes card-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-3px); }
        }

        .hologram-card-inner {
          position: relative;
          transition: transform 0.3s ease-out;
        }

        /* ===== FRESNEL GLOW ===== */
        .fresnel-glow {
          position: absolute;
          inset: -4px;
          border-radius: 16px;
          background: radial-gradient(
            circle at 50% 0%,
            rgba(128, 128, 128, 0.4) 0%,
            rgba(100, 100, 100, 0.2) 50%,
            transparent 100%
          );
          animation: fresnel-pulse 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes fresnel-pulse {
          0%, 100% {
            opacity: 0.6;
            box-shadow:
              0 0 20px rgba(128, 128, 128, 0.3),
              inset 0 0 20px rgba(128, 128, 128, 0.2);
          }
          50% {
            opacity: 1;
            box-shadow:
              0 0 40px rgba(128, 128, 128, 0.6),
              inset 0 0 30px rgba(128, 128, 128, 0.4);
          }
        }

        /* ===== NOISE OVERLAY ===== */
        .noise-overlay {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            );
          opacity: 0.15;
          animation: noise-shift 0.5s steps(4) infinite;
          pointer-events: none;
          z-index: 2;
        }

        @keyframes noise-shift {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        /* ===== IRIDESCENT SHIMMER ===== */
        .iridescent-shimmer {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(
            45deg,
            rgba(125, 249, 255, 0.1) 0%,
            rgba(255, 105, 180, 0.1) 25%,
            rgba(255, 255, 0, 0.1) 50%,
            rgba(125, 249, 255, 0.1) 75%,
            rgba(125, 249, 255, 0.1) 100%
          );
          background-size: 200% 200%;
          animation: iridescent-flow 8s linear infinite;
          opacity: 0.4;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 3;
        }

        @keyframes iridescent-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ===== CHROMATIC ABERRATION ===== */
        .chromatic-aberration {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          box-shadow:
            -2px 0 0 rgba(255, 0, 0, 0.2),
            2px 0 0 rgba(0, 255, 255, 0.2);
          animation: chromatic-shift 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 4;
        }

        @keyframes chromatic-shift {
          0%, 100% {
            box-shadow:
              -1px 0 0 rgba(255, 0, 0, 0.15),
              1px 0 0 rgba(0, 255, 255, 0.15);
          }
          50% {
            box-shadow:
              -3px 0 0 rgba(255, 0, 0, 0.3),
              3px 0 0 rgba(0, 255, 255, 0.3);
          }
        }

        /* ===== SCAN LINE MATERIALIZATION ===== */
        .scan-line {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(125, 249, 255, 0.8) 50%,
            transparent 100%
          );
          background-size: 100% 20px;
          animation: scan-reveal 2s linear;
          pointer-events: none;
          z-index: 10;
        }

        @keyframes scan-reveal {
          0% {
            transform: translateY(-100%);
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
