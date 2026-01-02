import { Task, TaskStep, TaskStepType } from '../types/tasks'
import { updateTask } from '../actions/tasks'
import { generateId } from 'ai'
import { ExtendedCoreMessage } from '../types'
import { createToolCallingStreamResponse } from '../streaming/create-tool-calling-stream'
import { DataStreamWriter } from 'ai'
import { getModels } from '../config/models'

export interface TaskExecutionConfig {
  taskId: string
  userId: string
  model?: string
  searchMode?: boolean
}

export class TaskExecutor {
  private taskId: string
  private userId: string
  private model?: string
  private searchMode: boolean

  constructor(config: TaskExecutionConfig) {
    this.taskId = config.taskId
    this.userId = config.userId
    this.model = config.model
    this.searchMode = config.searchMode ?? true
  }

  async addStep(
    type: TaskStepType,
    description: string,
    input?: Record<string, any>,
    status: TaskStep['status'] = 'running'
  ): Promise<TaskStep> {
    const step: TaskStep = {
      id: generateId(),
      type,
      description,
      timestamp: Date.now(),
      input,
      status,
      metadata: {}
    }

    const task = await this.getTask()
    if (!task) {
      throw new Error('Task not found')
    }

    task.steps.push(step)
    await updateTask(this.taskId, { steps: task.steps })

    return step
  }

  async updateStep(
    stepId: string,
    updates: Partial<TaskStep>
  ): Promise<void> {
    const task = await this.getTask()
    if (!task) {
      throw new Error('Task not found')
    }

    const stepIndex = task.steps.findIndex(s => s.id === stepId)
    if (stepIndex === -1) {
      throw new Error('Step not found')
    }

    const step = task.steps[stepIndex]
    const duration = updates.status === 'completed' && step.timestamp
      ? Date.now() - step.timestamp
      : step.duration

    task.steps[stepIndex] = {
      ...step,
      ...updates,
      duration
    }

    await updateTask(this.taskId, { steps: task.steps })
  }

  async getTask(): Promise<Task | null> {
    const { getTask: getTaskAction } = await import('../actions/tasks')
    return getTaskAction(this.taskId)
  }

  async execute(): Promise<void> {
    const task = await this.getTask()
    if (!task) {
      throw new Error('Task not found')
    }

    // Mark task as running
    await updateTask(this.taskId, {
      status: 'running',
      startedAt: Date.now()
    })

    try {
      // Add initial reasoning step
      await this.addStep('reasoning', 'Analyzing task requirements', {
        prompt: task.prompt
      })

      // Execute the task using the streaming system
      const models = await getModels()
      const model = this.model
        ? models.find(m => `${m.providerId}:${m.id}` === this.model)
        : models.find(m => m.enabled && m.providerId === 'xai') || models.find(m => m.enabled) || models[0]

      if (!model) {
        throw new Error('No model available')
      }

      // Create messages from task prompt
      const messages = [
        {
          role: 'user' as const,
          content: task.prompt
        }
      ]

      // Mark reasoning step as completed
      const reasoningStep = task.steps.find(s => s.type === 'reasoning')
      if (reasoningStep) {
        await this.updateStep(reasoningStep.id, {
          status: 'completed',
          output: { message: 'Task execution started' }
        })
      }

      // Import the streaming logic directly to execute it
      const { researcher } = await import('../agents/researcher')
      const { convertToCoreMessages } = await import('ai')
      const { streamText } = await import('ai')
      const { getMaxAllowedTokens, truncateMessages } = await import('../utils/context-window')
      const { getModel } = await import('../utils/registry')
      
      const modelId = `${model.providerId}:${model.id}`
      const coreMessages = convertToCoreMessages(messages)
      const truncatedMessages = truncateMessages(
        coreMessages,
        getMaxAllowedTokens(model)
      )

      const researcherConfig = await researcher({
        messages: truncatedMessages,
        model: modelId,
        searchMode: this.searchMode
      })

      // Track task steps
      const stepTypeMap: Record<string, any> = {
        search: 'search',
        retrieve: 'browser_action',
        videoSearch: 'search',
        ask_question: 'user_input'
      }

      let finalResult = ''

      // Execute the stream with step tracking
      // Note: onToolCall and onToolResult are not available in current AI SDK version
      // Tool tracking is handled in create-tool-calling-stream.ts instead
      const result = await streamText({
        ...researcherConfig
        // Tool call tracking removed - handled in create-tool-calling-stream.ts
      })

      // Consume the stream to completion
      for await (const chunk of result.textStream) {
        finalResult += chunk
      }

      // Wait for the result to complete
      const completion = await result.response

      // Extract final content
      const lastMessage = completion.messages?.[completion.messages.length - 1]
      const finalContent = typeof lastMessage?.content === 'string'
        ? lastMessage.content
        : Array.isArray(lastMessage?.content)
          ? lastMessage.content
              .filter((c: any) => c.type === 'text')
              .map((c: any) => c.text)
              .join('')
          : finalResult

      // Add completion step
      await this.addStep('decision', 'Task execution completed', {
        completed: true
      }, 'completed')

      // Mark task as completed with result
      await updateTask(this.taskId, {
        status: 'completed',
        completedAt: Date.now(),
        result: finalContent.slice(0, 5000) // Limit result size
      })
    } catch (error: any) {
      await updateTask(this.taskId, {
        status: 'failed',
        completedAt: Date.now(),
        error: error.message || 'Task execution failed'
      })
      throw error
    }
  }
}

