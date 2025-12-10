'use client'

import React, { useState, useEffect } from 'react'

interface TypewriterAcknowledgementProps {
  message: string | null
}

export function TypewriterAcknowledgement({ message }: TypewriterAcknowledgementProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!message) {
      setIsVisible(false)
      setDisplayedText('')
      return
    }

    // Show full message immediately (no typewriter/encrypted animation)
    setDisplayedText(message)
    setIsVisible(true)

    const hideTimeout = setTimeout(() => {
      setIsVisible(false)
      setDisplayedText('')
    }, 2500)

    return () => clearTimeout(hideTimeout)
  }, [message])

  if (!isVisible) return null

  return (
    <>
      <div
        className="fixed z-50 pointer-events-none"
        style={{ top: '20%', left: '50%' }} // 20% down, shifted right to 50%
      >
        <p
          className="text-center"
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: '#bababa', // slightly lighter ash
            textShadow: '0 1px 4px rgba(0,0,0,0.08)',
            animation: 'fadeInOut 3s ease-in-out'
          }}
        >
          {displayedText}
        </p>
      </div>
      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translate(-50%, -10px); }
          10%, 90% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  )
}

