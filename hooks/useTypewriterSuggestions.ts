import { useEffect, useRef } from 'react'

interface UseTypewriterSuggestionsOptions {
  suggestions: string[]
  textRef: React.RefObject<HTMLElement>
  speed?: number // ms per character
  deleteSpeed?: number // ms per character when deleting
  pauseTime?: number // ms to pause after typing/deleting
  isPaused?: boolean // pause the animation
}

export function useTypewriterSuggestions({
  suggestions,
  textRef,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 1500,
  isPaused = false
}: UseTypewriterSuggestionsOptions) {
  const stateRef = useRef({ 
    currentSuggestionIndex: 0,
    isDeleting: false, 
    currentIndex: 0 
  })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    
    if (suggestions.length === 0) return
    
    // Reset when paused
    if (isPaused) {
      if (textRef.current && mountedRef.current) {
        textRef.current.textContent = ''
      }
      stateRef.current = { currentSuggestionIndex: 0, isDeleting: false, currentIndex: 0 }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    const typeChar = () => {
      // Check if component is still mounted and element exists
      if (!mountedRef.current || !textRef.current) {
        return
      }

      const { currentSuggestionIndex, isDeleting, currentIndex } = stateRef.current
      const currentText = suggestions[currentSuggestionIndex] || ''

      if (!isDeleting) {
        // Typing
        if (currentIndex < currentText.length) {
          const newIndex = currentIndex + 1
          stateRef.current.currentIndex = newIndex
          if (textRef.current && mountedRef.current) {
            textRef.current.textContent = currentText.slice(0, newIndex)
          }
          timeoutRef.current = setTimeout(typeChar, speed)
        } else {
          // Finished typing, pause then start deleting
          timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              stateRef.current.isDeleting = true
              typeChar()
            }
          }, pauseTime)
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          const newIndex = currentIndex - 1
          stateRef.current.currentIndex = newIndex
          if (textRef.current && mountedRef.current) {
            textRef.current.textContent = currentText.slice(0, newIndex)
          }
          timeoutRef.current = setTimeout(typeChar, deleteSpeed)
        } else {
          // Finished deleting, move to next suggestion
          const nextIndex = (currentSuggestionIndex + 1) % suggestions.length
          timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              stateRef.current.currentSuggestionIndex = nextIndex
              stateRef.current.isDeleting = false
              stateRef.current.currentIndex = 0
              typeChar()
            }
          }, 300) // Short pause before next suggestion
        }
      }
    }

    // Reset and start
    stateRef.current = { currentSuggestionIndex: 0, isDeleting: false, currentIndex: 0 }
    if (textRef.current && mountedRef.current) {
      textRef.current.textContent = ''
    }
    typeChar()

    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [suggestions, speed, deleteSpeed, pauseTime, isPaused, textRef])

  return null
}

