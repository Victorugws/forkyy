import { useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  text: string
  textRef: React.RefObject<HTMLElement>
  speed?: number // ms per character
  deleteSpeed?: number // ms per character when deleting
  pauseTime?: number // ms to pause after typing/deleting
  isPaused?: boolean // pause the animation
  loop?: boolean // loop the animation
}

export function useTypewriter({
  text,
  textRef,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  isPaused = false,
  loop = true
}: UseTypewriterOptions) {
  const stateRef = useRef({ isDeleting: false, currentIndex: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    
    // Reset when paused
    if (isPaused) {
      if (textRef.current && mountedRef.current) {
        textRef.current.textContent = ''
      }
      stateRef.current = { isDeleting: false, currentIndex: 0 }
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

      const { isDeleting, currentIndex } = stateRef.current

      if (!isDeleting) {
        // Typing
        if (currentIndex < text.length) {
          const newIndex = currentIndex + 1
          stateRef.current.currentIndex = newIndex
          if (textRef.current && mountedRef.current) {
            textRef.current.textContent = text.slice(0, newIndex)
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
            textRef.current.textContent = text.slice(0, newIndex)
          }
          timeoutRef.current = setTimeout(typeChar, deleteSpeed)
        } else {
          // Finished deleting, pause then start typing again (if looping)
          if (loop) {
            timeoutRef.current = setTimeout(() => {
              if (mountedRef.current) {
                stateRef.current.isDeleting = false
                typeChar()
              }
            }, pauseTime)
          }
        }
      }
    }

    // Reset and start when text changes or component mounts
    stateRef.current = { isDeleting: false, currentIndex: 0 }
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
  }, [text, speed, deleteSpeed, pauseTime, isPaused, loop, textRef])

  return null // No return value needed since we update DOM directly
}

