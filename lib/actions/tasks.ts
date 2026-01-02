import { getRedisClient } from '../redis/config'
import { Task, TaskStatus } from '../types/tasks'
import { generateId } from 'ai'

function getUserTasksKey(userId: string) {
  return `user:${userId}:tasks`
}

function getTaskKey(taskId: string) {
  return `task:${taskId}`
}

export async function createTask(
  prompt: string,
  userId: string,
  title?: string
): Promise<Task> {
  const redis = await getRedisClient()
  const taskId = generateId()
  
  const task: Task = {
    id: taskId,
    title: title || prompt.slice(0, 100),
    prompt,
    status: 'pending',
    userId,
    createdAt: Date.now(),
    steps: [],
    messages: []
  }

  const pipeline = redis.pipeline()
  pipeline.hmset(getTaskKey(taskId), {
    ...task,
    steps: JSON.stringify(task.steps),
    messages: JSON.stringify(task.messages),
    createdAt: task.createdAt.toString()
  })
  pipeline.zadd(getUserTasksKey(userId), task.createdAt, getTaskKey(taskId))

  await pipeline.exec()
  return task
}

export async function getTask(taskId: string): Promise<Task | null> {
  const redis = await getRedisClient()
  const task = await redis.hgetall<Record<string, unknown>>(getTaskKey(taskId)) as Task | null

  if (!task) {
    return null
  }

  // Parse JSON fields
  if (typeof task.steps === 'string') {
    try {
      task.steps = JSON.parse(task.steps)
    } catch (error) {
      task.steps = []
    }
  }

  if (typeof task.messages === 'string') {
    try {
      task.messages = JSON.parse(task.messages)
    } catch (error) {
      task.messages = []
    }
  }

  // Convert string dates to numbers
  if (typeof task.createdAt === 'string') {
    task.createdAt = parseInt(task.createdAt, 10)
  }
  if (task.startedAt && typeof task.startedAt === 'string') {
    task.startedAt = parseInt(task.startedAt, 10)
  }
  if (task.completedAt && typeof task.completedAt === 'string') {
    task.completedAt = parseInt(task.completedAt, 10)
  }

  return task
}

export async function getTasks(userId: string): Promise<Task[]> {
  const redis = await getRedisClient()
  const taskKeys = await redis.zrange(getUserTasksKey(userId), 0, -1, {
    rev: true
  })

  if (taskKeys.length === 0) {
    return []
  }

  const tasks = await Promise.all(
    taskKeys.map(async key => {
      const task = await redis.hgetall<Record<string, unknown>>(key) as Task | null
      if (!task || Object.keys(task).length === 0) {
        return null
      }

      // Parse JSON fields
      if (typeof task.steps === 'string') {
        try {
          task.steps = JSON.parse(task.steps)
        } catch (error) {
          task.steps = []
        }
      }

      if (typeof task.messages === 'string') {
        try {
          task.messages = JSON.parse(task.messages)
        } catch (error) {
          task.messages = []
        }
      }

      // Convert string dates to numbers
      if (typeof task.createdAt === 'string') {
        task.createdAt = parseInt(task.createdAt, 10)
      }
      if (task.startedAt && typeof task.startedAt === 'string') {
        task.startedAt = parseInt(task.startedAt, 10)
      }
      if (task.completedAt && typeof task.completedAt === 'string') {
        task.completedAt = parseInt(task.completedAt, 10)
      }

      return task
    })
  )

  return tasks.filter((task): task is Task => task !== null)
}

export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  const redis = await getRedisClient()
  const task = await getTask(taskId)

  if (!task) {
    throw new Error('Task not found')
  }

  const updatedTask = {
    ...task,
    ...updates,
    steps: updates.steps !== undefined ? updates.steps : task.steps,
    messages: updates.messages !== undefined ? updates.messages : task.messages
  }

  await redis.hmset(getTaskKey(taskId), {
    ...updatedTask,
    steps: JSON.stringify(updatedTask.steps),
    messages: JSON.stringify(updatedTask.messages),
    createdAt: updatedTask.createdAt.toString(),
    startedAt: updatedTask.startedAt?.toString() || '',
    completedAt: updatedTask.completedAt?.toString() || ''
  })
}

export async function deleteTask(taskId: string, userId: string): Promise<void> {
  const redis = await getRedisClient()
  const pipeline = redis.pipeline()
  
  pipeline.del(getTaskKey(taskId))
  pipeline.zrem(getUserTasksKey(userId), getTaskKey(taskId))
  
  await pipeline.exec()
}

