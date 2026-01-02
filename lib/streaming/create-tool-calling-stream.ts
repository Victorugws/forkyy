import { researcher } from '@/lib/agents/researcher'
import {
  convertToCoreMessages,
  CoreMessage,
  createDataStreamResponse,
  DataStreamWriter,
  streamText
} from 'ai'
import { getMaxAllowedTokens, truncateMessages } from '../utils/context-window'
import { isReasoningModel } from '../utils/registry'
import { handleStreamFinish } from './handle-stream-finish'
import { BaseStreamConfig } from './types'
import { updateTask } from '../actions/tasks'

// Function to check if a message contains ask_question tool invocation
function containsAskQuestionTool(message: CoreMessage) {
  // For CoreMessage format, we check the content array
  if (message.role !== 'assistant' || !Array.isArray(message.content)) {
    return false
  }

  // Check if any content item is a tool-call with ask_question tool
  return message.content.some(
    item => item.type === 'tool-call' && item.toolName === 'ask_question'
  )
}

export function createToolCallingStreamResponse(config: BaseStreamConfig) {
  return createDataStreamResponse({
    execute: async (dataStream: DataStreamWriter) => {
      const { messages, model, chatId, searchMode, userId } = config
      const modelId = `${model.providerId}:${model.id}`

      try {
        const coreMessages = convertToCoreMessages(messages)
        const truncatedMessages = truncateMessages(
          coreMessages,
          getMaxAllowedTokens(model)
        )

        let researcherConfig = await researcher({
          messages: truncatedMessages,
          model: modelId,
          searchMode
        })

        // Track task steps if taskId is provided
        let taskExecutor: any = null
        if (config.taskId) {
          try {
            const { TaskExecutor } = await import('../agents/task-executor')
            taskExecutor = new TaskExecutor({
              taskId: config.taskId,
              userId,
              searchMode
            })
          } catch (error) {
            console.error('Failed to initialize task executor:', error)
          }
        }

        // Note: onToolCall and onToolResult are not available in current AI SDK version
        // Tool tracking is handled separately if needed
        const result = streamText({
          ...researcherConfig,
          // onToolCall and onToolResult removed - not available in current AI SDK
          onFinish: async result => {
            // Update task with final result if taskId is provided
            if (config.taskId && taskExecutor) {
              try {
                const lastMessage = result.response.messages[result.response.messages.length - 1]
                const finalContent = typeof lastMessage?.content === 'string'
                  ? lastMessage.content
                  : Array.isArray(lastMessage?.content)
                    ? lastMessage.content
                        .filter((c: any) => c.type === 'text')
                        .map((c: any) => c.text)
                        .join('')
                    : ''
                
                await updateTask(config.taskId, {
                  result: finalContent.slice(0, 5000) // Limit result size
                })
              } catch (error) {
                console.error('Failed to update task result:', error)
              }
            }
            // Check if the last message contains an ask_question tool invocation
            const shouldSkipRelatedQuestions =
              isReasoningModel(modelId) ||
              (result.response.messages.length > 0 &&
                containsAskQuestionTool(
                  result.response.messages[
                    result.response.messages.length - 1
                  ] as CoreMessage
                ))

            await handleStreamFinish({
              responseMessages: result.response.messages,
              originalMessages: messages,
              model: modelId,
              chatId,
              dataStream,
              userId,
              skipRelatedQuestions: shouldSkipRelatedQuestions
            })
          }
        })

        result.mergeIntoDataStream(dataStream)
      } catch (error) {
        console.error('Stream execution error:', error)
        throw error
      }
    },
    onError: error => {
      // console.error('Stream error:', error)
      return error instanceof Error ? error.message : String(error)
    }
  })
}
