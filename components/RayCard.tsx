'use client'

import React, { useRef, useState, useEffect } from 'react'

interface RayCardProps {
  title: string
  content: string
  position: { x: number; y: number }
  eyeCenter: { x: number; y: number }
}

export function RayCard({ title, content, position, eyeCenter }: RayCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        ref={cardRef}
        className="relative w-64 h-40 perspective-1000"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Electric Border Effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-sm animate-electric-border" />
          <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-2xl" />
        </div>

        {/* Card Content */}
        <div className="relative h-full p-6 flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{content}</p>
        </div>
      </div>
    </div>
  )
}

// CSS for electric border animation
export const electricBorderStyles = `
  @keyframes electric-border {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-electric-border {
    background-size: 200% 200%;
    animation: electric-border 3s ease infinite;
  }
`
