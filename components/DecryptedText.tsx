'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  characters?: string
  className?: string
  parentClassName?: string
  encryptedClassName?: string
  animateOn?: 'hover' | 'view' | 'auto'
  revealDirection?: 'left' | 'right' | 'center'
  autoInterval?: number // Interval in milliseconds for auto animation
}

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 15,
  characters = DEFAULT_CHARACTERS,
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  revealDirection = 'left',
  autoInterval = 4000, // 4 seconds default
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<HTMLSpanElement>(null)

  const getRandomChar = () => {
    return characters[Math.floor(Math.random() * characters.length)]
  }

  const animateDecryption = useCallback(() => {
    setIsAnimating(true)
    setDisplayText(text)

    let iteration = 0
    const textLength = text.length

    const animate = () => {
      if (iteration >= maxIterations) {
        setDisplayText(text)
        setIsAnimating(false)
        return
      }

      const newText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' '
          
          // Calculate reveal based on direction
          let shouldReveal = false
          if (revealDirection === 'left') {
            shouldReveal = index < (iteration / maxIterations) * textLength
          } else if (revealDirection === 'right') {
            shouldReveal = index >= textLength - (iteration / maxIterations) * textLength
          } else if (revealDirection === 'center') {
            const center = textLength / 2
            const distance = Math.abs(index - center)
            const maxDistance = (iteration / maxIterations) * (textLength / 2)
            shouldReveal = distance <= maxDistance
          }

          if (shouldReveal) {
            return char
          }
          
          return getRandomChar()
        })
        .join('')

      setDisplayText(newText)
      iteration++
      animationRef.current = setTimeout(animate, speed)
    }

    animate()
  }, [text, maxIterations, revealDirection, speed, characters])

  // Auto-animation every 4 seconds
  useEffect(() => {
    if (animateOn === 'auto') {
      // Initial animation
      const initialTimer = setTimeout(() => {
        animateDecryption()
      }, 100)

      // Set up interval for auto-animation
      intervalRef.current = setInterval(() => {
        animateDecryption()
      }, autoInterval)

      return () => {
        clearTimeout(initialTimer)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        if (animationRef.current) {
          clearTimeout(animationRef.current)
        }
      }
    }
  }, [animateOn, autoInterval, animateDecryption])

  // Hover animation
  useEffect(() => {
    if (animateOn === 'hover' && isHovered && !isAnimating) {
      animateDecryption()
    }
  }, [isHovered, animateOn])

  // View animation (runs once)
  useEffect(() => {
    if (animateOn === 'view' && !hasAnimated && elementRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              animateDecryption()
              setHasAnimated(true)
              if (observerRef.current) {
                observerRef.current.disconnect()
              }
            }
          })
        },
        { threshold: 0.1 }
      )

      observerRef.current.observe(elementRef.current)

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }
  }, [animateOn, hasAnimated])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <span
      ref={elementRef}
      className={`${parentClassName} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={isAnimating ? encryptedClassName : ''}>
        {displayText}
      </span>
    </span>
  )
}

