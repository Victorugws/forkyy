'use client'

import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { Pencil } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { CollapsibleMessage } from './collapsible-message'
import { DottedBorderCard } from './ui/dotted-border-card'

type UserMessageProps = {
  message: string
  messageId?: string
  onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
}

// Helper function to remove duplicated text patterns
const deduplicateText = (text: string): string => {
  if (!text) return text
  // Remove patterns where text is repeated consecutively
  // Handle both cases: "texttext" and "text text" (with spaces)
  // Use a more aggressive pattern that matches longer sequences
  let deduplicated = text
  
  // First, try to match exact duplicates without spaces
  deduplicated = deduplicated.replace(/(.{10,}?)\1+/g, '$1')
  
  // Then, try to match duplicates with whitespace between them
  deduplicated = deduplicated.replace(/(.{10,}?)\s+\1+/g, '$1')
  
  // Also handle shorter patterns (for things like "SourcesSources")
  deduplicated = deduplicated.replace(/(.{3,}?)\1+/g, '$1')
  
  return deduplicated.trim()
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  messageId,
  onUpdateMessage
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const deduplicatedMessage = deduplicateText(message)
  const [editedContent, setEditedContent] = useState(deduplicatedMessage)

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setEditedContent(deduplicatedMessage)
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
  }

  const handleSaveClick = async () => {
    if (!onUpdateMessage || !messageId) return

    setIsEditing(false)

    try {
      await onUpdateMessage(messageId, editedContent)
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  return (
    <CollapsibleMessage role="user" showBorder={false}>
      <DottedBorderCard
        borderRadius="1.5rem"
        padding="p-5"
        background="bg-white/95 backdrop-blur-md"
        className="flex-1 break-words w-full group outline-none relative"
      >
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <TextareaAutosize
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              autoFocus
              className="resize-none flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              minRows={2}
              maxRows={10}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleCancelClick}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveClick}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div className="flex-1">{deduplicatedMessage}</div>
            <div
              className={cn(
                'absolute top-1 right-1 transition-opacity ml-2',
                'opacity-0',
                'group-focus-within:opacity-100',
                'md:opacity-0',
                'md:group-hover:opacity-100'
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-7 w-7"
                onClick={handleEditClick}
              >
                <Pencil className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </DottedBorderCard>
    </CollapsibleMessage>
  )
}