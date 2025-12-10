'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useCallback, useEffect, useState } from 'react'

interface CalibrationPoint {
  x: number
  y: number
  clicked: boolean
}

interface EyeTrackingCalibrationProps {
  onComplete: () => void
  onCancel: () => void
}

export function EyeTrackingCalibration({
  onComplete,
  onCancel,
}: EyeTrackingCalibrationProps) {
  const [currentPointIndex, setCurrentPointIndex] = useState(0)
  const [points, setPoints] = useState<CalibrationPoint[]>([])
  const [isComplete, setIsComplete] = useState(false)

  // Generate 9 calibration points in a 3x3 grid
  useEffect(() => {
    const generatePoints = () => {
      const margin = 0.15 // 15% margin from edges
      const cols = 3
      const rows = 3
      const newPoints: CalibrationPoint[] = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = margin + (col / (cols - 1)) * (1 - 2 * margin)
          const y = margin + (row / (rows - 1)) * (1 - 2 * margin)
          newPoints.push({
            x: x * window.innerWidth,
            y: y * window.innerHeight,
            clicked: false,
          })
        }
      }

      setPoints(newPoints)
    }

    generatePoints()

    // Regenerate on window resize
    const handleResize = () => generatePoints()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePointClick = useCallback(
    async (index: number) => {
      if (index !== currentPointIndex) return

      const point = points[index]
      
      // Record the click for WebGazer to learn from
      // WebGazer automatically learns from click events when tracking is active
      if (window.webgazer) {
        try {
          // The key: WebGazer learns from actual click events on the document
          // We need to create a real click event at the calibration point
          const element = document.elementFromPoint(point.x, point.y) || document.body
          
          // Create a proper click event with correct coordinates
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: point.x,
            clientY: point.y,
            screenX: point.x + window.screenX,
            screenY: point.y + window.screenY,
            button: 0,
            buttons: 1
          })
          
          // Dispatch on the element - WebGazer listens for clicks globally
          element.dispatchEvent(clickEvent)
          
          // Also try direct API methods if available
          if (typeof (window.webgazer as any).recordScreenPosition === 'function') {
            (window.webgazer as any).recordScreenPosition(point.x, point.y, 'click')
          }
          
          console.log(`[Calibration] Recorded point ${index + 1} at (${point.x}, ${point.y})`)
        } catch (err) {
          console.warn('[Calibration] Error recording point:', err)
        }
      }

      setPoints((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], clicked: true }
        return updated
      })

      // Wait longer to ensure WebGazer processes the calibration point
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Move to next point
      if (currentPointIndex < points.length - 1) {
        setCurrentPointIndex(currentPointIndex + 1)
      } else {
        // All points clicked - give WebGazer time to process all calibration data
        console.log('[Calibration] All points recorded, processing...')
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsComplete(true)
        setTimeout(() => {
          onComplete()
        }, 500)
      }
    },
    [currentPointIndex, points.length, onComplete, points]
  )

  const progress = ((currentPointIndex + 1) / points.length) * 100

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Eye Tracking Calibration</h2>
          <p className="text-sm text-gray-300">
            Click on each point as it appears. Keep your head still, only move your eyes, and ensure good lighting.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            ⚠️ Make sure your face is clearly visible to the camera. WebGazer learns from where you click.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-white">
            <span>Progress</span>
            <span>
              {currentPointIndex + 1} / {points.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Calibration points - positioned absolutely on screen */}
        {points.map((point, index) => {
          const isActive = index === currentPointIndex
          const isClicked = point.clicked
          const isPast = index < currentPointIndex

          if (!isActive && !isClicked && !isPast) {
            return null // Don't show future points
          }

          return (
            <div
              key={index}
              className={`fixed transition-all duration-300 z-[999999] ${
                isActive
                  ? 'scale-125 opacity-100'
                  : isClicked || isPast
                    ? 'scale-75 opacity-50'
                    : 'opacity-0'
              }`}
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`,
                transform: isActive
                  ? 'translate(-50%, -50%) scale(1.25)'
                  : isClicked || isPast
                    ? 'translate(-50%, -50%) scale(0.75)'
                    : 'translate(-50%, -50%)',
                cursor: isActive ? 'pointer' : 'default',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
              onClick={() => handlePointClick(index)}
            >
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-500 border-blue-300 animate-pulse shadow-lg shadow-blue-500/50'
                    : isClicked
                      ? 'bg-green-500 border-green-300'
                      : 'bg-gray-500 border-gray-300'
                }`}
              >
                {isClicked && (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          )
        })}

        {isComplete && (
          <div className="text-center space-y-4">
            <div className="text-green-400 text-lg font-semibold">
              ✓ Calibration Complete!
            </div>
            <p className="text-sm text-gray-300">
              WebGazer has learned from your clicks. Eye tracking should now be more accurate.
            </p>
          </div>
        )}

        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isComplete}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

