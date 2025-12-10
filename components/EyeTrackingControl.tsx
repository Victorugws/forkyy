'use client'

import React, { useState } from 'react'
import { useEyeTracking } from '@/hooks/useEyeTracking'
import { EyeTrackingCalibration } from '@/components/EyeTrackingCalibration'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Eye, EyeOff, Settings, AlertCircle } from 'lucide-react'

export function EyeTrackingControl() {
  const {
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
  } = useEyeTracking()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleToggle = async () => {
    if (isEnabled) {
      await disable()
    } else {
      await enable()
    }
  }

  return (
    <>
      {isCalibrating && (
        <EyeTrackingCalibration
          onComplete={() => {
            setCalibrating(false)
            setIsSettingsOpen(false)
          }}
          onCancel={() => {
            setCalibrating(false)
          }}
        />
      )}
      <div className="flex items-center gap-2">
        <Button
          variant={isEnabled ? 'default' : 'outline'}
          size="sm"
          onClick={handleToggle}
          disabled={isInitializing}
          className="flex items-center gap-2"
        >
          {isEnabled ? (
            <>
              <Eye className="h-4 w-4" />
              <span>Eye Tracking On</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Eye Tracking Off</span>
            </>
          )}
        </Button>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Eye Tracking Settings</DialogTitle>
            <DialogDescription>
              Configure eye tracking sensitivity and smoothing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="smoothing">Smoothing</Label>
                  <span className="text-sm text-muted-foreground">
                    {config.smoothing.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="smoothing"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[config.smoothing]}
                  onValueChange={([value]) =>
                    updateConfig({ smoothing: value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Higher values make cursor movement smoother but less responsive
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sensitivity">Sensitivity</Label>
                  <span className="text-sm text-muted-foreground">
                    {config.sensitivity.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="sensitivity"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={[config.sensitivity]}
                  onValueChange={([value]) =>
                    updateConfig({ sensitivity: value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Higher values make the cursor move faster with eye movement
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="calibration">Calibration Status</Label>
                  <p className="text-xs text-muted-foreground">
                    {isCalibrated
                      ? 'Eye tracking is calibrated'
                      : 'Calibration required for accurate tracking'}
                  </p>
                </div>
                <span
                  className={`h-2 w-2 rounded-full ${
                    isCalibrated ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isCalibrated ? "outline" : "default"}
                  size="sm"
                  onClick={calibrate}
                  className="flex-1"
                >
                  {isCalibrated ? 'Recalibrate' : 'Calibrate Now'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reset}
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
              
              {!isCalibrated && isEnabled && (
                <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    ⚠️ Calibration recommended for accurate tracking. Click &quot;Calibrate Now&quot; to start.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Calibration Process:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>1. Click &quot;Calibrate Now&quot; button above</li>
                  <li>2. A calibration UI will appear with points on your screen</li>
                  <li>3. <strong>Click on each point</strong> as it appears (don&apos;t just look at it)</li>
                  <li>4. Keep your head still and only move your eyes</li>
                  <li>5. Ensure good lighting and your face is clearly visible to the camera</li>
                  <li>6. Complete all calibration points (usually 9 points)</li>
                  <li>7. Once done, your eye movements will control the cursor</li>
                </ul>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <strong>Important:</strong> You must <strong>click</strong> on each calibration point, not just look at it. This teaches the system how your eyes move.
                </p>
              </div>
              <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Tip:</strong> For best accuracy, recalibrate if you change your position, lighting, or distance from the screen. Higher smoothing values reduce jitter but may feel less responsive.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  )
}

