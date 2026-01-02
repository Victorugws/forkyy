import { ExtendedCoreMessage } from './index'

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export type TaskStepType = 
  | 'search' 
  | 'browser_action' 
  | 'code_execution' 
  | 'file_operation' 
  | 'api_call' 
  | 'reasoning' 
  | 'decision' 
  | 'user_input'

export interface TaskStep {
  id: string
  type: TaskStepType
  description: string
  timestamp: number
  duration?: number
  input?: Record<string, any>
  output?: Record<string, any>
  error?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  metadata?: Record<string, any>
}

export interface Task {
  id: string
  title: string
  prompt: string
  status: TaskStatus
  userId: string
  createdAt: number
  startedAt?: number
  completedAt?: number
  steps: TaskStep[]
  result?: string
  error?: string
  messages: ExtendedCoreMessage[]
  metadata?: Record<string, any>
}

export interface TaskPreview {
  task: Task
  currentStepIndex: number
  isPlaying: boolean
  playbackSpeed: number
}

