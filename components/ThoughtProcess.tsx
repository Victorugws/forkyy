'use client'

import { useState, useEffect } from 'react'
import { VscLoading } from 'react-icons/vsc'

interface ThoughtProcessProps {
  toolName?: string
  isSearching?: boolean
}

const thoughtStates = [
  { text: 'Working...', icon: '🔄' },
  { text: 'Searching...', icon: '🔍' },
  { text: 'Summarizing...', icon: '📝' },
  { text: 'Analyzing...', icon: '🧠' },
  { text: 'Reviewing sources...', icon: '📚' },
  { text: 'Formulating response...', icon: '💬' },
]

export function ThoughtProcess({ toolName, isSearching }: ThoughtProcessProps) {
  const [currentState, setCurrentState] = useState(0)

  useEffect(() => {
    // Cycle through thought states
    const interval = setInterval(() => {
      setCurrentState(prev => (prev + 1) % thoughtStates.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getCurrentThought = () => {
    if (toolName === 'retrieve') return { text: 'Searching...', icon: '🔍' }
    if (toolName === 'answer') return { text: 'Formulating response...', icon: '💬' }
    if (isSearching) return { text: 'Searching...', icon: '🔍' }
    return thoughtStates[currentState]
  }

  const thought = getCurrentThought()

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Animated thinking indicator */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <VscLoading className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        </div>
      </div>

      {/* Thought process text */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-base font-medium text-gray-700">
          <span className="text-2xl">{thought.icon}</span>
          <span className="animate-pulse">{thought.text}</span>
        </div>

        {/* Dots animation */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500"
              style={{
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  )
}
