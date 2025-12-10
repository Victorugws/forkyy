declare global {
  interface Window {
    eyeTracking?: {
      setEnabled: (enabled: boolean) => Promise<boolean>
      isEnabled: () => Promise<boolean>
      updateConfig: (config: { smoothing?: number; sensitivity?: number }) => Promise<{
        enabled: boolean
        smoothing: number
        sensitivity: number
      }>
      getConfig: () => Promise<{
        enabled: boolean
        smoothing: number
        sensitivity: number
      }>
      moveCursor: (x: number, y: number) => void
      moveCursorTo: (x: number, y: number) => void
      getCursorPosition: () => Promise<{ x: number; y: number }>
      click: () => void
      doubleClick: () => void
      reset: () => Promise<void>
    }
    webgazer?: {
      begin: () => Promise<void>
      pause: () => void
      resume: () => void
      setGazeListener: (callback: (data: { x: number; y: number } | null) => void) => any
      calibrate: () => Promise<void>
      getCalibrationPoints: () => Promise<Array<{ x: number; y: number }>>
      clearData: () => void
      setRegression: (type: string) => void
      setTracker: (tracker: string) => void
    }
  }
}

export {}

