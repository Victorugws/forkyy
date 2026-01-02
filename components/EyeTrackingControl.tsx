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
        <style jsx global>{`
          /* Eye Tracking Button Styles - From Uiverse.io by FColombati */
          .eye-tracking-button {
            all: unset;
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            position: relative;
            border-radius: 100em;
            background-color: rgba(0, 0, 0, 0.75);
            box-shadow:
              -0.15em -0.15em 0.15em -0.075em rgba(5, 5, 5, 0.25),
              0.0375em 0.0375em 0.0675em 0 rgba(5, 5, 5, 0.1);
            display: inline-block;
          }

          .eye-tracking-button::after {
            content: "";
            position: absolute;
            z-index: 0;
            width: calc(100% + 0.3em);
            height: calc(100% + 0.3em);
            top: -0.15em;
            left: -0.15em;
            border-radius: inherit;
            background: linear-gradient(
              -135deg,
              rgba(5, 5, 5, 0.5),
              transparent 20%,
              transparent 100%
            );
            filter: blur(0.0125em);
            opacity: 0.25;
            mix-blend-mode: multiply;
          }

          .eye-tracking-button .button-outer {
            position: relative;
            z-index: 1;
            border-radius: inherit;
            transition: box-shadow 300ms ease;
            will-change: box-shadow;
            box-shadow:
              0 0.05em 0.05em -0.01em rgba(5, 5, 5, 1),
              0 0.01em 0.01em -0.01em rgba(5, 5, 5, 0.5),
              0.15em 0.3em 0.1em -0.01em rgba(5, 5, 5, 0.25);
          }

          .eye-tracking-button:hover .button-outer {
            box-shadow:
              0 0 0 0 rgba(5, 5, 5, 1),
              0 0 0 0 rgba(5, 5, 5, 0.5),
              0 0 0 0 rgba(5, 5, 5, 0.25);
          }

          .eye-tracking-button .button-inner {
            --inset: 0.035em;
            position: relative;
            z-index: 1;
            border-radius: inherit;
            padding: 1em 1.5em;
            background-image: linear-gradient(
              135deg,
              rgba(230, 230, 230, 1),
              rgba(180, 180, 180, 1)
            );
            transition:
              box-shadow 300ms ease,
              clip-path 250ms ease,
              background-image 250ms ease,
              transform 250ms ease;
            will-change: box-shadow, clip-path, background-image, transform;
            overflow: clip;
            clip-path: inset(0 0 0 0 round 100em);
            box-shadow:
                  /* 1 */
              0 0 0 0 inset rgba(5, 5, 5, 0.1),
              /* 2 */ -0.05em -0.05em 0.05em 0 inset rgba(5, 5, 5, 0.25),
              /* 3 */ 0 0 0 0 inset rgba(5, 5, 5, 0.1),
              /* 4 */ 0 0 0.05em 0.2em inset rgba(255, 255, 255, 0.25),
              /* 5 */ 0.025em 0.05em 0.1em 0 inset rgba(255, 255, 255, 1),
              /* 6 */ 0.12em 0.12em 0.12em inset rgba(255, 255, 255, 0.25),
              /* 7 */ -0.075em -0.25em 0.25em 0.1em inset rgba(5, 5, 5, 0.25);
            display: flex;
            align-items: center;
            gap: 0.5em;
          }

          .eye-tracking-button:hover .button-inner {
            clip-path: inset(
              clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px)
                clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) round 100em
            );
            box-shadow:
                  /* 1 */
              0.1em 0.15em 0.05em 0 inset rgba(5, 5, 5, 0.75),
              /* 2 */ -0.025em -0.03em 0.05em 0.025em inset rgba(5, 5, 5, 0.5),
              /* 3 */ 0.25em 0.25em 0.2em 0 inset rgba(5, 5, 5, 0.5),
              /* 4 */ 0 0 0.05em 0.5em inset rgba(255, 255, 255, 0.15),
              /* 5 */ 0 0 0 0 inset rgba(255, 255, 255, 1),
              /* 6 */ 0.12em 0.12em 0.12em inset rgba(255, 255, 255, 0.25),
              /* 7 */ -0.075em -0.12em 0.2em 0.1em inset rgba(5, 5, 5, 0.25);
          }

          .eye-tracking-button .button-inner span {
            position: relative;
            z-index: 4;
            font-family: "Inter", sans-serif;
            letter-spacing: -0.05em;
            font-weight: 500;
            color: rgba(0, 0, 0, 0);
            background-image: linear-gradient(
              135deg,
              rgba(25, 25, 25, 1),
              rgba(75, 75, 75, 1)
            );
            -webkit-background-clip: text;
            background-clip: text;
            transition: transform 250ms ease;
            display: block;
            will-change: transform;
            text-shadow: rgba(0, 0, 0, 0.1) 0 0 0.1em;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          .eye-tracking-button .button-inner svg {
            position: relative;
            z-index: 4;
            width: 1em;
            height: 1em;
            color: rgba(25, 25, 25, 1);
          }

          .eye-tracking-button:hover .button-inner span {
            transform: scale(0.975);
          }

          .eye-tracking-button:active .button-inner {
            transform: scale(0.975);
          }

          .eye-tracking-button:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
          }
          
          /* Eye Tracking Settings Button Styles - From Uiverse.io by FColombati */
          .eye-tracking-settings-button {
            all: unset;
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            position: relative;
            border-radius: 100em;
            background-color: rgba(0, 0, 0, 0.75);
            box-shadow:
              -0.15em -0.15em 0.15em -0.075em rgba(5, 5, 5, 0.25),
              0.0375em 0.0375em 0.0675em 0 rgba(5, 5, 5, 0.1);
            display: inline-block;
          }

          .eye-tracking-settings-button::after {
            content: "";
            position: absolute;
            z-index: 0;
            width: calc(100% + 0.3em);
            height: calc(100% + 0.3em);
            top: -0.15em;
            left: -0.15em;
            border-radius: inherit;
            background: linear-gradient(
              -135deg,
              rgba(5, 5, 5, 0.5),
              transparent 20%,
              transparent 100%
            );
            filter: blur(0.0125em);
            opacity: 0.25;
            mix-blend-mode: multiply;
          }

          .eye-tracking-settings-button .button-outer {
            position: relative;
            z-index: 1;
            border-radius: inherit;
            transition: box-shadow 300ms ease;
            will-change: box-shadow;
            box-shadow:
              0 0.05em 0.05em -0.01em rgba(5, 5, 5, 1),
              0 0.01em 0.01em -0.01em rgba(5, 5, 5, 0.5),
              0.15em 0.3em 0.1em -0.01em rgba(5, 5, 5, 0.25);
          }

          .eye-tracking-settings-button:hover .button-outer {
            box-shadow:
              0 0 0 0 rgba(5, 5, 5, 1),
              0 0 0 0 rgba(5, 5, 5, 0.5),
              0 0 0 0 rgba(5, 5, 5, 0.25);
          }

          .eye-tracking-settings-button .button-inner {
            --inset: 0.035em;
            position: relative;
            z-index: 1;
            border-radius: inherit;
            padding: 1em;
            background-image: linear-gradient(
              135deg,
              rgba(230, 230, 230, 1),
              rgba(180, 180, 180, 1)
            );
            transition:
              box-shadow 300ms ease,
              clip-path 250ms ease,
              background-image 250ms ease,
              transform 250ms ease;
            will-change: box-shadow, clip-path, background-image, transform;
            overflow: clip;
            clip-path: inset(0 0 0 0 round 100em);
            box-shadow:
                  /* 1 */
              0 0 0 0 inset rgba(5, 5, 5, 0.1),
              /* 2 */ -0.05em -0.05em 0.05em 0 inset rgba(5, 5, 5, 0.25),
              /* 3 */ 0 0 0 0 inset rgba(5, 5, 5, 0.1),
              /* 4 */ 0 0 0.05em 0.2em inset rgba(255, 255, 255, 0.25),
              /* 5 */ 0.025em 0.05em 0.1em 0 inset rgba(255, 255, 255, 1),
              /* 6 */ 0.12em 0.12em 0.12em inset rgba(255, 255, 255, 0.25),
              /* 7 */ -0.075em -0.25em 0.25em 0.1em inset rgba(5, 5, 5, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .eye-tracking-settings-button:hover .button-inner {
            clip-path: inset(
              clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px)
                clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) round 100em
            );
            box-shadow:
                  /* 1 */
              0.1em 0.15em 0.05em 0 inset rgba(5, 5, 5, 0.75),
              /* 2 */ -0.025em -0.03em 0.05em 0.025em inset rgba(5, 5, 5, 0.5),
              /* 3 */ 0.25em 0.25em 0.2em 0 inset rgba(5, 5, 5, 0.5),
              /* 4 */ 0 0 0.05em 0.5em inset rgba(255, 255, 255, 0.15),
              /* 5 */ 0 0 0 0 inset rgba(255, 255, 255, 1),
              /* 6 */ 0.12em 0.12em 0.12em inset rgba(255, 255, 255, 0.25),
              /* 7 */ -0.075em -0.12em 0.2em 0.1em inset rgba(5, 5, 5, 0.25);
          }

          .eye-tracking-settings-button .button-inner svg {
            position: relative;
            z-index: 4;
            width: 1em;
            height: 1em;
            color: rgba(25, 25, 25, 1);
          }

          .eye-tracking-settings-button:hover .button-inner svg {
            transform: scale(0.975);
          }

          .eye-tracking-settings-button:active .button-inner {
            transform: scale(0.975);
          }
        `}</style>
        <button
          onClick={handleToggle}
          disabled={isInitializing}
          className="eye-tracking-button"
        >
          <div className="button-outer">
            <div className="button-inner">
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
            </div>
          </div>
        </button>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <button className="eye-tracking-settings-button">
            <div className="button-outer">
              <div className="button-inner">
                <Settings className="h-4 w-4" />
              </div>
            </div>
          </button>
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

