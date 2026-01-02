import { Message } from 'ai'
import { Model } from '../types/models'

export interface BaseStreamConfig {
  messages: Message[]
  model: Model
  chatId: string
  searchMode: boolean
  userId: string
  taskId?: string // Optional task ID for task execution tracking
}
