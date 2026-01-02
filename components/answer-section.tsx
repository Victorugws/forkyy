'use client'

import { ChatRequestOptions } from 'ai'
import { CollapsibleMessage } from './collapsible-message'
import { DefaultSkeleton } from './default-skeleton'
import { BotMessage } from './message'
import { MessageActions } from './message-actions'

export type AnswerSectionProps = {
  content: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  chatId?: string
  showActions?: boolean
  messageId: string
  reload?: (
    messageId: string,
    options?: ChatRequestOptions
  ) => Promise<string | null | undefined>
}

export function AnswerSection({
  content,
  isOpen,
  onOpenChange,
  chatId,
  showActions = true, // Default to true for backward compatibility
  messageId,
  reload
}: AnswerSectionProps) {
  const enableShare = process.env.NEXT_PUBLIC_ENABLE_SHARE === 'true'

  const handleReload = () => {
    if (reload) {
      return reload(messageId)
    }
    return Promise.resolve(undefined)
  }

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

  // Remove <has_function_call> tags from content and deduplicate
  // Use a more robust regex that handles multiline content
  const cleanedContent = deduplicateText(
    content?.replace(/<has_function_call>[\s\S]*?<\/has_function_call>/gi, '').trim() || ''
  )
  
  const message = cleanedContent ? (
    <div className="flex flex-col gap-1">
      <BotMessage message={cleanedContent} />
      {showActions && (
        <MessageActions
          message={cleanedContent} // Keep cleaned message content for copy
          messageId={messageId}
          chatId={chatId}
          enableShare={enableShare}
          reload={handleReload}
        />
      )}
    </div>
  ) : (
    <DefaultSkeleton />
  )
  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showBorder={false}
      showIcon={false}
    >
      {message}
    </CollapsibleMessage>
  )
}
