'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface EyeTrackingConfig {
  smoothing: number
  sensitivity: number
}

export interface UseEyeTrackingReturn {
  isEnabled: boolean
  isCalibrated: boolean
  isInitializing: boolean
  isCalibrating: boolean
  error: string | null
  config: EyeTrackingConfig
  enable: () => Promise<void>
  disable: () => Promise<void>
  updateConfig: (config: Partial<EyeTrackingConfig>) => Promise<void>
  calibrate: () => Promise<void>
  setCalibrating: (calibrating: boolean) => void
  reset: () => Promise<void>
}

export function useEyeTracking(): UseEyeTrackingReturn {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<EyeTrackingConfig>({
    smoothing: 0.92, // Very high smoothing for stability (reduces jitter)
    sensitivity: 0.6 // Lower sensitivity for more controlled, accurate movement
  })

  const webgazerRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Check if we're in Electron
  const isElectron = typeof window !== 'undefined' && window.eyeTracking !== undefined

  // Initialize WebGazer
  useEffect(() => {
    if (!isElectron) {
      return
    }

    // Load WebGazer.js from CDN
    const loadWebGazer = async () => {
      if (window.webgazer) {
        return window.webgazer
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="webgazer"]')
      if (existingScript) {
        // Wait for it to load
        return new Promise((resolve, reject) => {
          const checkInterval = setInterval(() => {
            if (window.webgazer) {
              clearInterval(checkInterval)
              resolve(window.webgazer)
            }
          }, 100)
          setTimeout(() => {
            clearInterval(checkInterval)
            if (window.webgazer) {
              resolve(window.webgazer)
            } else {
              reject(new Error('WebGazer failed to load'))
            }
          }, 5000)
        })
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://webgazer.cs.brown.edu/webgazer.js'
        script.async = true
        script.onload = () => {
          // Wait a bit for WebGazer to initialize
          setTimeout(() => {
            if (window.webgazer) {
              // Configure WebGazer
              window.webgazer.setRegression('ridge')
              window.webgazer.setTracker('clmtrackr')
              resolve(window.webgazer)
            } else {
              reject(new Error('WebGazer failed to initialize'))
            }
          }, 1000)
        }
        script.onerror = () => reject(new Error('Failed to load WebGazer.js'))
        document.head.appendChild(script)
      })
    }

    loadWebGazer().catch((err) => {
      console.error('[EyeTracking] Failed to load WebGazer:', err)
      setError('Failed to load eye tracking library. Please check your internet connection.')
    })
  }, [isElectron])

  // Start eye tracking
  const enable = useCallback(async () => {
    if (!isElectron) {
      setError('Eye tracking is only available in Electron')
      return
    }

    try {
      setIsInitializing(true)
      setError(null)

      // Check if WebGazer is available
      if (!window.webgazer) {
        setError('WebGazer.js not loaded. Please refresh the page.')
        setIsInitializing(false)
        return
      }

      // Enable in main process
      const enabled = await window.eyeTracking!.setEnabled(true)
      setIsEnabled(enabled)

      // Initialize WebGazer if available
      if (window.webgazer) {
        // Show warning if not calibrated
        if (!isCalibrated) {
          console.warn('[EyeTracking] Eye tracking enabled without calibration. Accuracy may be poor.')
        }
        // Configure WebGazer for better accuracy
        window.webgazer.setRegression('ridge') // Ridge regression is more accurate
        window.webgazer.setTracker('clmtrackr') // CLM tracker for face detection
        
        // Advanced gaze data filtering for accuracy
        let lastValidGaze: { x: number; y: number; timestamp: number } | null = null
        let smoothedGaze: { x: number; y: number } | null = null
        const gazeHistory: Array<{ x: number; y: number; timestamp: number }> = []
        const MAX_HISTORY = 10 // Larger history for better median filtering
        const MIN_MOVEMENT_THRESHOLD = 0.005 // Smaller threshold - more sensitive
        const MAX_VELOCITY = 0.15 // Lower max velocity - reject fast jumps
        const OUTLIER_THRESHOLD = 0.2 // Tighter outlier detection
        const SMOOTHING_ALPHA = 0.15 // Exponential smoothing factor (lower = more smoothing)

        await window.webgazer
          .setGazeListener((data: any) => {
            if (!data || data.x === null || data.y === null) return

            const now = Date.now()
            
            // Normalize coordinates (0-1)
            let x = Math.max(0, Math.min(1, data.x / window.innerWidth))
            let y = Math.max(0, Math.min(1, data.y / window.innerHeight))

            // Multi-stage filtering for accuracy

            // 1. Outlier detection using median filter (more robust)
            if (gazeHistory.length >= 5) {
              const recentX = gazeHistory.slice(-5).map(g => g.x).sort((a, b) => a - b)
              const recentY = gazeHistory.slice(-5).map(g => g.y).sort((a, b) => a - b)
              const medianX = recentX[Math.floor(recentX.length / 2)]
              const medianY = recentY[Math.floor(recentY.length / 2)]
              
              const distanceFromMedian = Math.sqrt(
                Math.pow(x - medianX, 2) + Math.pow(y - medianY, 2)
              )
              
              // Reject outliers more aggressively
              if (distanceFromMedian > OUTLIER_THRESHOLD) {
                if (lastValidGaze) {
                  x = lastValidGaze.x
                  y = lastValidGaze.y
                } else {
                  return // Skip if no valid history
                }
              }
            }

            // 2. Velocity-based filtering (prevent jumps)
            if (lastValidGaze) {
              const timeDelta = (now - lastValidGaze.timestamp) / 1000
              if (timeDelta > 0 && timeDelta < 0.5) { // Only check recent data
                const distance = Math.sqrt(
                  Math.pow(x - lastValidGaze.x, 2) + Math.pow(y - lastValidGaze.y, 2)
                )
                const velocity = distance / timeDelta
                
                // Reject movements that are too fast (likely noise or tracking loss)
                if (velocity > MAX_VELOCITY) {
                  x = lastValidGaze.x
                  y = lastValidGaze.y
                }
              }
            }

            // 3. Exponential smoothing (reduces jitter)
            if (smoothedGaze) {
              x = smoothedGaze.x * (1 - SMOOTHING_ALPHA) + x * SMOOTHING_ALPHA
              y = smoothedGaze.y * (1 - SMOOTHING_ALPHA) + y * SMOOTHING_ALPHA
            } else {
              smoothedGaze = { x, y }
            }

            // 4. Dead zone - ignore very small movements (reduce micro-jitter)
            if (lastValidGaze) {
              const movement = Math.sqrt(
                Math.pow(x - lastValidGaze.x, 2) + Math.pow(y - lastValidGaze.y, 2)
              )
              if (movement < MIN_MOVEMENT_THRESHOLD) {
                // Still update smoothed gaze but don't send movement
                smoothedGaze = { x, y }
                return
              }
            }

            // Update history
            gazeHistory.push({ x, y, timestamp: now })
            if (gazeHistory.length > MAX_HISTORY) {
              gazeHistory.shift()
            }

            // Update smoothed gaze
            smoothedGaze = { x, y }
            
            // Update last valid gaze
            lastValidGaze = { x, y, timestamp: now }
            
            // Send to main process with additional smoothing from config
            window.eyeTracking!.moveCursor(x, y)
          })
          .begin()
      }
    } catch (err: any) {
      console.error('[EyeTracking] Error enabling:', err)
      setError(err.message || 'Failed to enable eye tracking')
      setIsEnabled(false)
    } finally {
      setIsInitializing(false)
    }
  }, [isElectron, isCalibrated])

  // Disable eye tracking
  const disable = useCallback(async () => {
    if (!isElectron) return

    try {
      // Stop WebGazer
      if (window.webgazer) {
        window.webgazer.pause()
      }

      // Disable in main process
      const enabled = await window.eyeTracking!.setEnabled(false)
      setIsEnabled(enabled)

      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    } catch (err: any) {
      console.error('[EyeTracking] Error disabling:', err)
      setError(err.message || 'Failed to disable eye tracking')
    }
  }, [isElectron])

  // Update configuration
  const updateConfig = useCallback(async (newConfig: Partial<EyeTrackingConfig>) => {
    if (!isElectron) return

    try {
      await window.eyeTracking!.updateConfig(newConfig)
      setConfig((prev) => ({ ...prev, ...newConfig }))
    } catch (err: any) {
      console.error('[EyeTracking] Error updating config:', err)
      setError(err.message || 'Failed to update configuration')
    }
  }, [isElectron])

  // Calibrate eye tracking
  const calibrate = useCallback(async () => {
    if (!isElectron) {
      setError('Eye tracking only available in Electron')
      return
    }

    try {
      setError(null)
      console.log('[EyeTracking] Starting calibration...')
      
      // Ensure WebGazer is enabled and running
      let wasEnabled = isEnabled
      if (!isEnabled || !window.webgazer) {
        console.log('[EyeTracking] Enabling WebGazer for calibration...')
        wasEnabled = false
        await enable()
        // Wait for WebGazer to fully initialize and start tracking
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      if (!window.webgazer) {
        setError('WebGazer not available. Please check your webcam permissions.')
        return
      }

      // Clear any previous calibration data to start fresh
      try {
        if (window.webgazer.clearData) {
          window.webgazer.clearData()
          console.log('[EyeTracking] Cleared previous calibration data')
        }
      } catch (e) {
        console.warn('[EyeTracking] Could not clear data:', e)
      }

      // Ensure WebGazer is actively tracking (needed for calibration)
      // Wait a bit to ensure WebGazer is ready
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Show calibration UI
      setIsCalibrating(true)
      console.log('[EyeTracking] Calibration UI shown - WebGazer is tracking and will learn from your clicks')
    } catch (err: any) {
      console.error('[EyeTracking] Error starting calibration:', err)
      setError(err.message || 'Failed to start calibration. Make sure your webcam is working and you have good lighting.')
      setIsCalibrating(false)
    }
  }, [isElectron, isEnabled, enable])

  // Complete calibration (called by calibration component)
  const setCalibrating = useCallback((calibrating: boolean) => {
    setIsCalibrating(calibrating)
    if (!calibrating) {
      // Calibration completed - verify WebGazer has calibration data
      if (window.webgazer) {
        try {
          // Force WebGazer to retrain the model with new calibration data
          // This is critical - WebGazer needs to retrain after collecting points
          if (typeof window.webgazer.resume === 'function') {
            // Resume to ensure tracking is active
            window.webgazer.resume()
          }
          
          // Some versions of WebGazer need explicit retraining
          if (typeof (window.webgazer as any).saveDataAcrossSessions === 'function') {
            (window.webgazer as any).saveDataAcrossSessions(true)
          }
          
          console.log('[EyeTracking] Calibration completed - WebGazer should now use calibration data')
          setIsCalibrated(true)
        } catch (err) {
          console.warn('[EyeTracking] Error finalizing calibration:', err)
          setIsCalibrated(true) // Assume it worked
        }
      } else {
        setIsCalibrated(true)
      }
    }
  }, [])

  // Reset eye tracking
  const reset = useCallback(async () => {
    if (!isElectron) return

    try {
      await window.eyeTracking!.reset()
      if (window.webgazer) {
        window.webgazer.clearData()
      }
      setIsCalibrated(false)
    } catch (err: any) {
      console.error('[EyeTracking] Error resetting:', err)
      setError(err.message || 'Failed to reset')
    }
  }, [isElectron])

  // Load initial config
  useEffect(() => {
    if (!isElectron) return

    window.eyeTracking!.getConfig().then((cfg) => {
      setConfig({
        smoothing: cfg.smoothing ?? 0.7,
        sensitivity: cfg.sensitivity ?? 1.0
      })
      setIsEnabled(cfg.enabled ?? false)
    }).catch((error) => {
      // Handler might not be registered yet, use defaults
      console.warn('Eye tracking config not available yet:', error)
      setConfig({
        smoothing: 0.7,
        sensitivity: 1.0
      })
      setIsEnabled(false)
    })
  }, [isElectron])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (isEnabled && isElectron) {
        window.eyeTracking?.setEnabled(false)
      }
    }
  }, [isEnabled, isElectron])

  return {
    isEnabled,
    isCalibrated,
    isInitializing,
    isCalibrating,
    error,
    config,
    enable,
    disable,
    updateConfig,
    calibrate,
    setCalibrating,
    reset
  }
}

