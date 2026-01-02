'use client'

import { useState, useEffect, useRef } from 'react'
import { Task, TaskStep } from '@/lib/types/tasks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  X, 
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
  Clock,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils/index'

interface TaskOverlayProps {
  initialPrompt?: string
  taskId?: string
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

export function TaskOverlay({ 
  initialPrompt = '', 
  taskId: initialTaskId,
  onClose,
  onTaskUpdate
}: TaskOverlayProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isReplaying, setIsReplaying] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Create task if prompt provided and no taskId
  useEffect(() => {
    if (initialPrompt && !initialTaskId && !task) {
      createTask(initialPrompt)
    } else if (initialTaskId && !task) {
      fetchTask(initialTaskId)
    }
  }, [initialPrompt, initialTaskId, task])

  // Poll for task updates when executing
  useEffect(() => {
    if (!task || !isExecuting) return

    const interval = setInterval(async () => {
      if (task.id) {
        const updated = await fetchTask(task.id)
        if (updated && updated.steps.length !== task.steps.length) {
          setTask(updated)
          if (onTaskUpdate) onTaskUpdate(updated)
        }
      }
    }, 1000)

    pollingIntervalRef.current = interval
    return () => clearInterval(interval)
  }, [task, isExecuting, onTaskUpdate])

  const createTask = async (prompt: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, title: prompt.slice(0, 100) })
      })
      if (response.ok) {
        const data = await response.json()
        setTask(data.task)
        // Auto-execute
        executeTask(data.task.id)
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const fetchTask = async (taskId: string): Promise<Task | null> => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`)
      if (response.ok) {
        const data = await response.json()
        setTask(data.task)
        return data.task
      }
    } catch (error) {
      console.error('Failed to fetch task:', error)
    }
    return null
  }

  const executeTask = async (taskId: string) => {
    setIsExecuting(true)
    try {
      const response = await fetch(`/api/tasks/${taskId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      if (!response.ok) {
        throw new Error('Failed to execute task')
      }
    } catch (error) {
      console.error('Failed to execute task:', error)
      setIsExecuting(false)
    }
  }

  const startReplay = () => {
    if (!task) return
    
    if (isReplaying) {
      pauseReplay()
      return
    }

    setIsReplaying(true)
    setIsPlaying(true)
    setCurrentStepIndex(-1)

    const baseDelay = 2000 / playbackSpeed
    let currentIndex = -1

    const playNextStep = () => {
      currentIndex++
      
      if (currentIndex >= task.steps.length) {
        pauseReplay()
        return
      }

      setCurrentStepIndex(currentIndex)

      const step = task.steps[currentIndex]
      const stepDelay = step.duration 
        ? Math.min(step.duration / playbackSpeed, baseDelay)
        : baseDelay

      playbackIntervalRef.current = setTimeout(playNextStep, stepDelay)
    }

    playNextStep()
  }

  const pauseReplay = () => {
    setIsReplaying(false)
    setIsPlaying(false)
    if (playbackIntervalRef.current) {
      clearTimeout(playbackIntervalRef.current)
      playbackIntervalRef.current = null
    }
  }

  const resetReplay = () => {
    pauseReplay()
    setCurrentStepIndex(-1)
  }

  const goToStep = (index: number) => {
    pauseReplay()
    setCurrentStepIndex(index)
  }

  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearTimeout(playbackIntervalRef.current)
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  if (!task) {
    return (
      <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Creating task...</p>
        </div>
      </div>
    )
  }

  const completedSteps = task.steps.filter(s => s.status === 'completed').length
  const progress = task.steps.length > 0 
    ? (completedSteps / task.steps.length) * 100 
    : 0

  const currentStep = currentStepIndex >= 0 
    ? task.steps[currentStepIndex] 
    : null

  return (
    <div 
      className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}
    >
      {/* Left Panel - Steps */}
      <div className="w-96 border-r bg-gray-50/50 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.prompt}</p>
          
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
        <div className="border-b p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={resetReplay}
              disabled={currentStepIndex === -1}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentStepIndex(Math.max(-1, currentStepIndex - 1))}
              disabled={currentStepIndex <= -1}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={startReplay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentStepIndex(Math.min(task.steps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex >= task.steps.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="bg-background border rounded px-2 py-1 text-xs"
              disabled={isReplaying}
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {task.steps.map((step, index) => {
            const Icon = stepTypeIcons[step.type] || AlertCircle
            const isActive = index === currentStepIndex
            const isPast = index < currentStepIndex
            const isFuture = index > currentStepIndex

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
                    "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
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
                        "h-4 w-4 flex-shrink-0",
                        stepTypeColors[step.type] || "text-gray-500"
                      )} />
                      <span className="text-sm font-medium truncate">{step.description}</span>
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

      {/* Right Panel - Visual Progression */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Visual Area */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          {currentStep ? (
            <div className="absolute inset-0 p-8 flex items-center justify-center">
              <div className="max-w-4xl w-full space-y-6">
                {/* Step Header */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 mb-4">
                    {(() => {
                      const Icon = stepTypeIcons[currentStep.type] || AlertCircle
                      return (
                        <Icon className={cn(
                          "h-8 w-8",
                          stepTypeColors[currentStep.type] || "text-gray-500"
                        )} />
                      )
                    })()}
                    <h3 className="text-2xl font-semibold">{currentStep.description}</h3>
                    <span className={cn(
                      "text-xs px-3 py-1 rounded-full",
                      currentStep.status === 'completed' && "bg-green-100 text-green-700",
                      currentStep.status === 'running' && "bg-blue-100 text-blue-700",
                      currentStep.status === 'failed' && "bg-red-100 text-red-700",
                      currentStep.status === 'pending' && "bg-gray-100 text-gray-700"
                    )}>
                      {currentStep.status}
                    </span>
                  </div>
                </div>

                {/* Step Content */}
                <Card className="p-6">
                  {currentStep.input && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Input:</p>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(currentStep.input, null, 2)}
                      </pre>
                    </div>
                  )}
                  {currentStep.output && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Output:</p>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-96">
                        {JSON.stringify(currentStep.output, null, 2)}
                      </pre>
                    </div>
                  )}
                  {currentStep.error && (
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2">Error:</p>
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                        {currentStep.error}
                      </p>
                    </div>
                  )}
                  {!currentStep.input && !currentStep.output && !currentStep.error && (
                    <p className="text-muted-foreground text-center py-8">
                      {currentStep.status === 'running' ? 'Executing...' : 'No details available'}
                    </p>
                  )}
                </Card>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Select a step to view details</p>
                {task.steps.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Task execution will begin shortly...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Task Result */}
        {task.status === 'completed' && task.result && (
          <div className="border-t p-6 bg-gray-50">
            <h4 className="font-semibold mb-2">Result:</h4>
            <div className="prose max-w-none">
              <p className="text-sm whitespace-pre-wrap">{task.result}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

