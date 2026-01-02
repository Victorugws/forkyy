'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/lib/types/tasks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Play, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { TaskPreview } from './task-preview'
import { cn } from '@/lib/utils/index'

interface TaskListProps {
  userId?: string
}

const statusIcons = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  cancelled: AlertCircle
}

const statusColors = {
  pending: 'text-yellow-600',
  running: 'text-blue-600',
  completed: 'text-green-600',
  failed: 'text-red-600',
  cancelled: 'text-gray-600'
}

export function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTasks = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Auto-refresh when tasks are running
  useEffect(() => {
    const hasRunningTasks = tasks.some(t => t.status === 'running')
    if (!hasRunningTasks) return
    
    const interval = setInterval(fetchTasks, 2000)
    return () => clearInterval(interval)
  }, [tasks])

  const handleExecute = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Failed to execute task:', error)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTasks()
        if (selectedTask?.id === taskId) {
          setSelectedTask(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Update selected task if it changes in the list
  useEffect(() => {
    if (selectedTask) {
      const updatedTask = tasks.find(t => t.id === selectedTask.id)
      if (updatedTask && (updatedTask.steps.length !== selectedTask.steps.length || updatedTask.status !== selectedTask.status)) {
        setSelectedTask(updatedTask)
      }
    }
  }, [tasks, selectedTask])

  if (selectedTask) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b p-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTask(null)}
          >
            ← Back to Tasks
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <TaskPreview 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)}
            onTaskUpdate={(updatedTask) => {
              setSelectedTask(updatedTask)
              setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
            }}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchTasks}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-sm text-muted-foreground">
              Create a task to get started with autonomous execution
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const StatusIcon = statusIcons[task.status]
              const completedSteps = task.steps.filter(s => s.status === 'completed').length
              const progress = task.steps.length > 0 
                ? (completedSteps / task.steps.length) * 100 
                : 0

              return (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className={cn(
                          "h-4 w-4",
                          statusColors[task.status]
                        )} />
                        <h3 className="font-semibold truncate">{task.title}</h3>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full capitalize",
                          statusColors[task.status],
                          task.status === 'pending' && "bg-yellow-100",
                          task.status === 'running' && "bg-blue-100",
                          task.status === 'completed' && "bg-green-100",
                          task.status === 'failed' && "bg-red-100",
                          task.status === 'cancelled' && "bg-gray-100"
                        )}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {task.prompt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{task.steps.length} steps</span>
                        <span>•</span>
                        <span>{formatDate(task.createdAt)}</span>
                        {task.steps.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{Math.round(progress)}% complete</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedTask(task)}
                        title="Preview/Replay"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {task.status === 'pending' && (
                        <Button
                          variant="default"
                          size="icon"
                          onClick={() => handleExecute(task.id)}
                          title="Execute Task"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

