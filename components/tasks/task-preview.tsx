'use client'

import { useState, useEffect, useRef } from 'react'
import { Task, TaskStep, TaskPreview as TaskPreviewType } from '@/lib/types/tasks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Search,
  Code,
  FileText,
  Globe,
  AlertCircle,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils/index'

interface TaskPreviewProps {
  task: Task
  onClose?: () => void
  onTaskUpdate?: (task: Task) => void
}

const stepTypeIcons = {
  search: Search,
  browser_action: Globe,
  code_execution: Code,
  file_operation: FileText,
  reasoning: AlertCircle,
  decision: CheckCircle2,
  user_input: AlertCircle,
  api_call: Globe
}

const stepTypeColors = {
  search: 'text-blue-500',
  browser_action: 'text-green-500',
  code_execution: 'text-purple-500',
  file_operation: 'text-orange-500',
  reasoning: 'text-yellow-500',
  decision: 'text-indigo-500',
  user_input: 'text-pink-500',
  api_call: 'text-cyan-500'
}

export function TaskPreview({ task: initialTask, onClose, onTaskUpdate }: TaskPreviewProps) {
  const [task, setTask] = useState(initialTask)
  const [preview, setPreview] = useState<TaskPreviewType>({
    task: initialTask,
    currentStepIndex: -1,
    isPlaying: false,
    playbackSpeed: 1
  })
  const [isReplaying, setIsReplaying] = useState(false)
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update task if it changes (for real-time updates)
  useEffect(() => {
    if (initialTask.id !== task.id || initialTask.steps.length !== task.steps.length) {
      setTask(initialTask)
      setPreview(prev => ({ ...prev, task: initialTask }))
      if (onTaskUpdate) {
        onTaskUpdate(initialTask)
      }
    }
  }, [initialTask, task, onTaskUpdate])

  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current)
      }
    }
  }, [])

  const startReplay = () => {
    if (isReplaying) {
      pauseReplay()
      return
    }

    setIsReplaying(true)
    setPreview(prev => ({ ...prev, isPlaying: true, currentStepIndex: -1 }))

    // Calculate delay based on playback speed
    const baseDelay = 2000 // 2 seconds per step
    const delay = baseDelay / preview.playbackSpeed

    let currentIndex = -1

    const playNextStep = () => {
      currentIndex++
      
      if (currentIndex >= task.steps.length) {
        pauseReplay()
        return
      }

      setPreview(prev => ({ ...prev, currentStepIndex: currentIndex }))

      // Calculate delay for this step based on its duration
      const step = task.steps[currentIndex]
      const stepDelay = step.duration 
        ? Math.min(step.duration / preview.playbackSpeed, delay)
        : delay

      playbackIntervalRef.current = setTimeout(playNextStep, stepDelay)
    }

    playNextStep()
  }

  const pauseReplay = () => {
    setIsReplaying(false)
    setPreview(prev => ({ ...prev, isPlaying: false }))
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current)
      playbackIntervalRef.current = null
    }
  }

  const resetReplay = () => {
    pauseReplay()
    setPreview(prev => ({ ...prev, currentStepIndex: -1 }))
  }

  const goToStep = (index: number) => {
    pauseReplay()
    setPreview(prev => ({ ...prev, currentStepIndex: index }))
  }

  const nextStep = () => {
    if (preview.currentStepIndex < task.steps.length - 1) {
      setPreview(prev => ({ 
        ...prev, 
        currentStepIndex: prev.currentStepIndex + 1 
      }))
    }
  }

  const previousStep = () => {
    if (preview.currentStepIndex > -1) {
      setPreview(prev => ({ 
        ...prev, 
        currentStepIndex: prev.currentStepIndex - 1 
      }))
    }
  }

  const completedSteps = task.steps.filter(s => s.status === 'completed').length
  const progress = task.steps.length > 0 
    ? (completedSteps / task.steps.length) * 100 
    : 0

  const currentStep = preview.currentStepIndex >= 0 
    ? task.steps[preview.currentStepIndex] 
    : null

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{task.title}</h2>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3">{task.prompt}</p>
        
        {/* Status and Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Status: <span className="font-medium capitalize">{task.status}</span>
            </span>
            <span className="text-muted-foreground">
              {completedSteps} / {task.steps.length} steps
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Controls */}
      <div className="border-b p-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={resetReplay}
          disabled={preview.currentStepIndex === -1}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={previousStep}
          disabled={preview.currentStepIndex <= -1}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={startReplay}
        >
          {isReplaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextStep}
          disabled={preview.currentStepIndex >= task.steps.length - 1}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Speed:</span>
          <select
            value={preview.playbackSpeed}
            onChange={(e) => setPreview(prev => ({ 
              ...prev, 
              playbackSpeed: parseFloat(e.target.value) 
            }))}
            className="bg-background border rounded px-2 py-1"
            disabled={isReplaying}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Current Step Details */}
          {currentStep && (
            <Card className="p-4 mb-4 border-2 border-primary">
              <div className="flex items-start gap-3">
                {(() => {
                  const Icon = stepTypeIcons[currentStep.type] || AlertCircle
                  return (
                    <Icon className={cn(
                      "h-5 w-5 mt-0.5",
                      stepTypeColors[currentStep.type] || "text-gray-500"
                    )} />
                  )
                })()}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{currentStep.description}</h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      currentStep.status === 'completed' && "bg-green-100 text-green-700",
                      currentStep.status === 'running' && "bg-blue-100 text-blue-700",
                      currentStep.status === 'failed' && "bg-red-100 text-red-700",
                      currentStep.status === 'pending' && "bg-gray-100 text-gray-700"
                    )}>
                      {currentStep.status}
                    </span>
                  </div>
                  {currentStep.duration && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3" />
                      <span>{currentStep.duration}ms</span>
                    </div>
                  )}
                  {currentStep.input && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Input:</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(currentStep.input, null, 2)}
                      </pre>
                    </div>
                  )}
                  {currentStep.output && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Output:</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(currentStep.output, null, 2)}
                      </pre>
                    </div>
                  )}
                  {currentStep.error && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-red-600 mb-1">Error:</p>
                      <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        {currentStep.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Step Timeline */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Execution Timeline</h3>
            {task.steps.map((step, index) => {
              const Icon = stepTypeIcons[step.type] || AlertCircle
              const isActive = index === preview.currentStepIndex
              const isPast = index < preview.currentStepIndex
              const isFuture = index > preview.currentStepIndex

              return (
                <Card
                  key={step.id}
                  className={cn(
                    "p-3 cursor-pointer transition-all",
                    isActive && "border-2 border-primary bg-primary/5",
                    isPast && "opacity-60",
                    isFuture && "opacity-40"
                  )}
                  onClick={() => goToStep(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full",
                      isActive && "bg-primary text-primary-foreground",
                      isPast && step.status === 'completed' && "bg-green-100 text-green-700",
                      isPast && step.status === 'failed' && "bg-red-100 text-red-700",
                      isFuture && "bg-gray-100 text-gray-400"
                    )}>
                      {step.status === 'completed' && isPast ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : step.status === 'failed' ? (
                        <XCircle className="h-4 w-4" />
                      ) : step.status === 'running' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={cn(
                          "h-4 w-4",
                          stepTypeColors[step.type] || "text-gray-500"
                        )} />
                        <span className="text-sm font-medium">{step.description}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          step.status === 'completed' && "bg-green-100 text-green-700",
                          step.status === 'running' && "bg-blue-100 text-blue-700",
                          step.status === 'failed' && "bg-red-100 text-red-700",
                          step.status === 'pending' && "bg-gray-100 text-gray-700"
                        )}>
                          {step.type}
                        </span>
                      </div>
                      {step.duration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{step.duration}ms</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

