import React, { useEffect, useState } from 'react'

/**
 * BinaryLoadingPlaceholder
 * Displays animated binary (0s and 1s) as content placeholder during loading
 * Neumorphic styled with smooth fade transitions
 */

interface BinaryLoadingPlaceholderProps {
  lines?: number
  className?: string
}

export function BinaryLoadingPlaceholder({
  lines = 5,
  className = ''
}: BinaryLoadingPlaceholderProps) {
  const [binaryLines, setBinaryLines] = useState<string[]>([])

  useEffect(() => {
    // Generate initial binary strings
    const generateBinaryLine = () => {
      const length = Math.floor(Math.random() * 40) + 60 // 60-100 characters
      return Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('')
    }

    const initialLines = Array.from({ length: lines }, generateBinaryLine)
    setBinaryLines(initialLines)

    // Animate binary strings - change random characters
    const interval = setInterval(() => {
      setBinaryLines(prev => prev.map(line => {
        const chars = line.split('')
        // Change 3-5 random characters
        const numChanges = Math.floor(Math.random() * 3) + 3
        for (let i = 0; i < numChanges; i++) {
          const pos = Math.floor(Math.random() * chars.length)
          chars[pos] = chars[pos] === '0' ? '1' : '0'
        }
        return chars.join('')
      }))
    }, 100) // Update every 100ms

    return () => clearInterval(interval)
  }, [lines])

  return (
    <div className={`space-y-3 ${className}`}>
      {binaryLines.map((line, i) => (
        <div
          key={i}
          className="neu-inset px-6 py-4 rounded-xl overflow-hidden relative"
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        >
          <div
            className="font-mono text-sm text-muted-foreground/60 tracking-wider whitespace-nowrap overflow-hidden animate-pulse"
            style={{
              animation: `binary-flow ${4 + i}s linear infinite`
            }}
          >
            {line}
          </div>

          {/* Shimmer effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
            style={{
              animation: `shimmer ${2 + i * 0.5}s ease-in-out infinite`
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes binary-flow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-10%);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

/**
 * BinaryTextPlaceholder
 * Inline binary placeholder for smaller content areas
 */
export function BinaryTextPlaceholder({
  length = 20,
  className = ''
}: {
  length?: number
  className?: string
}) {
  const [binary, setBinary] = useState('')

  useEffect(() => {
    const generate = () =>
      Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('')

    setBinary(generate())

    const interval = setInterval(() => {
      setBinary(generate())
    }, 150)

    return () => clearInterval(interval)
  }, [length])

  return (
    <span className={`font-mono text-xs text-muted-foreground/50 tracking-wide animate-pulse ${className}`}>
      {binary}
    </span>
  )
}

/**
 * BinaryGrid
 * Matrix-style binary grid for full-page loading states
 */
export function BinaryGrid({
  rows = 8,
  cols = 12,
  className = ''
}: {
  rows?: number
  cols?: number
  className?: string
}) {
  const [grid, setGrid] = useState<string[][]>([])

  useEffect(() => {
    // Initialize grid
    const initialGrid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() > 0.5 ? '1' : '0')
    )
    setGrid(initialGrid)

    // Animate grid
    const interval = setInterval(() => {
      setGrid(prev => prev.map(row =>
        row.map(cell => Math.random() > 0.7 ? (cell === '0' ? '1' : '0') : cell)
      ))
    }, 80)

    return () => clearInterval(interval)
  }, [rows, cols])

  return (
    <div className={`grid gap-2 ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {grid.flat().map((binary, i) => (
        <div
          key={i}
          className="neu-raised rounded-lg p-3 flex items-center justify-center"
          style={{
            animationDelay: `${i * 0.02}s`,
            opacity: binary === '1' ? 0.8 : 0.4
          }}
        >
          <span className="font-mono text-lg font-bold text-foreground/70 transition-all duration-100">
            {binary}
          </span>
        </div>
      ))}
    </div>
  )
}
