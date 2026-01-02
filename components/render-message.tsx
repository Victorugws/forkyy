import { ChatRequestOptions, JSONValue, Message, ToolInvocation } from 'ai'
import { useMemo } from 'react'
import { AnswerSection } from './answer-section'
import { ReasoningSection } from './reasoning-section'
import RelatedQuestions from './related-questions'
import { ToolSection } from './tool-section'
import { UserMessage } from './user-message'

interface RenderMessageProps {
  message: Message
  messageId: string
  getIsOpen: (id: string) => boolean
  onOpenChange: (id: string, open: boolean) => void
  onQuerySelect: (query: string) => void
  chatId?: string
  addToolResult?: (params: { toolCallId: string; result: any }) => void
  onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
  reload?: (
    messageId: string,
    options?: ChatRequestOptions
  ) => Promise<string | null | undefined>
}

export function RenderMessage({
  message,
  messageId,
  getIsOpen,
  onOpenChange,
  onQuerySelect,
  chatId,
  addToolResult,
  onUpdateMessage,
  reload
}: RenderMessageProps) {
  // Only get the last related questions annotation to avoid duplication
  const relatedQuestions = useMemo(() => {
    const allRelated = message.annotations?.filter(
      annotation => (annotation as any)?.type === 'related-questions'
    ) || []
    // Return only the last one to avoid duplication
    return allRelated.length > 0 ? [allRelated[allRelated.length - 1]] : []
  }, [message.annotations])

  // Render for manual tool call
  const toolData = useMemo(() => {
    const toolAnnotations =
      (message.annotations?.filter(
        annotation =>
          (annotation as unknown as { type: string }).type === 'tool_call'
      ) as unknown as Array<{
        data: {
          args: string
          toolCallId: string
          toolName: string
          result?: string
          state: 'call' | 'result'
        }
      }>) || []

    const toolDataMap = toolAnnotations.reduce((acc, annotation) => {
      const existing = acc.get(annotation.data.toolCallId)
      if (!existing || annotation.data.state === 'result') {
        acc.set(annotation.data.toolCallId, {
          ...annotation.data,
          args: annotation.data.args ? JSON.parse(annotation.data.args) : {},
          result:
            annotation.data.result && annotation.data.result !== 'undefined'
              ? JSON.parse(annotation.data.result)
              : undefined
        } as ToolInvocation)
      }
      return acc
    }, new Map<string, ToolInvocation>())

    return Array.from(toolDataMap.values())
  }, [message.annotations])

  // Extract the unified reasoning annotation directly.
  const reasoningAnnotation = useMemo(() => {
    const annotations = message.annotations as any[] | undefined
    if (!annotations) return null
    return (
      annotations.find(a => a.type === 'reasoning' && a.data !== undefined) ||
      null
    )
  }, [message.annotations])

  // Extract the reasoning time and reasoning content from the annotation.
  // If annotation.data is an object, use its fields. Otherwise, default to a time of 0.
  const reasoningTime = useMemo(() => {
    if (!reasoningAnnotation) return 0
    if (
      typeof reasoningAnnotation.data === 'object' &&
      reasoningAnnotation.data !== null
    ) {
      return reasoningAnnotation.data.time ?? 0
    }
    return 0
  }, [reasoningAnnotation])

  if (message.role === 'user') {
    // Remove <has_function_call> tags from user messages (shouldn't happen, but just in case)
    const cleanedUserContent = typeof message.content === 'string' 
      ? message.content.replace(/<has_function_call>[\s\S]*?<\/has_function_call>/gi, '').trim()
      : message.content
    
    return (
      <UserMessage
        message={cleanedUserContent}
        messageId={messageId}
        onUpdateMessage={onUpdateMessage}
      />
    )
  }

  // Track which tool call IDs we've already rendered to avoid duplication
  const renderedToolCallIds = useMemo(() => {
    const ids = new Set<string>()
    message.parts?.forEach(part => {
      if (part.type === 'tool-invocation') {
        ids.add(part.toolInvocation.toolCallId)
      }
    })
    return ids
  }, [message.parts])

  // New way: Use parts instead of toolInvocations
  return (
    <>
      {/* Only render toolData if it's not already in parts (for backward compatibility) */}
      {toolData.length > 0 && renderedToolCallIds.size === 0 && toolData.map(tool => (
        <ToolSection
          key={tool.toolCallId}
          tool={tool}
          isOpen={getIsOpen(tool.toolCallId)}
          onOpenChange={open => onOpenChange(tool.toolCallId, open)}
          addToolResult={addToolResult}
        />
      ))}
      {message.parts?.map((part, index) => {
        // Check if this is the last part in the array
        const isLastPart = index === (message.parts?.length ?? 0) - 1

        switch (part.type) {
          case 'tool-invocation':
            return (
              <ToolSection
                key={`${messageId}-tool-${index}`}
                tool={part.toolInvocation}
                isOpen={getIsOpen(part.toolInvocation.toolCallId)}
                onOpenChange={open =>
                  onOpenChange(part.toolInvocation.toolCallId, open)
                }
                addToolResult={addToolResult}
              />
            )
          case 'text':
            // Helper function to remove duplicated text patterns
            const deduplicateText = (text: string): string => {
              if (!text) return text
              let deduplicated = text
              
              // First, try to match exact duplicates without spaces
              deduplicated = deduplicated.replace(/(.{10,}?)\1+/g, '$1')
              
              // Then, try to match duplicates with whitespace between them
              deduplicated = deduplicated.replace(/(.{10,}?)\s+\1+/g, '$1')
              
              // Also handle shorter patterns
              deduplicated = deduplicated.replace(/(.{3,}?)\1+/g, '$1')
              
              return deduplicated.trim()
            }
            
            // Remove <has_function_call> tags from text content and deduplicate
            // Use a more robust regex that handles multiline content
            const cleanedText = deduplicateText(
              part.text?.replace(/<has_function_call>[\s\S]*?<\/has_function_call>/gi, '').trim() || ''
            )
            // Only show actions if this is the last part and it's a text part
            // Skip empty text parts after cleaning
            if (!cleanedText) return null
            return (
              <AnswerSection
                key={`${messageId}-text-${index}`}
                content={cleanedText}
                isOpen={getIsOpen(messageId)}
                onOpenChange={open => onOpenChange(messageId, open)}
                chatId={chatId}
                showActions={isLastPart}
                messageId={messageId}
                reload={reload}
              />
            )
          case 'reasoning':
            return (
              <ReasoningSection
                key={`${messageId}-reasoning-${index}`}
                content={{
                  reasoning: part.reasoning,
                  time: reasoningTime
                }}
                isOpen={getIsOpen(messageId)}
                onOpenChange={open => onOpenChange(messageId, open)}
              />
            )
          // Add other part types as needed
          default:
            return null
        }
      })}
      {/* Only render related questions once, at the end, if they exist */}
      {relatedQuestions && relatedQuestions.length > 0 && (
        <RelatedQuestions
          key={`${messageId}-related-questions`}
          annotations={relatedQuestions as JSONValue[]}
          onQuerySelect={onQuerySelect}
          isOpen={getIsOpen(`${messageId}-related`)}
          onOpenChange={open => onOpenChange(`${messageId}-related`, open)}
        />
      )}
    </>
  )
}
