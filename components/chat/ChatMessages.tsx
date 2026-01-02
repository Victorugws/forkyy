'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Message as MessageType, ChatRequestOptions } from 'ai'
import { cn } from '@/lib/utils'
import { RenderMessage } from '@/components/render-message'
import { useChat } from 'ai/react'
import { DottedBorderCard } from '@/components/ui/dotted-border-card'

interface ChatMessagesProps {
  messages: MessageType[]
  isLoading?: boolean
  chatId?: string
  onQuerySelect?: (query: string) => void
}

export function ChatMessages({ 
  messages, 
  isLoading,
  chatId,
  onQuerySelect
}: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [openStates, setOpenStates] = useState<Map<string, boolean>>(new Map())
  
  const { reload } = useChat({
    id: chatId,
    api: '/api/chat'
  })

  // Auto-scroll to bottom when new messages arrive or when loading state changes
  useEffect(() => {
    const scrollToBottom = () => {
      // Find the scrollable parent container (chat-messages-scrollable)
      const scrollableParent = containerRef.current?.closest('.chat-messages-scrollable') as HTMLElement
      
      if (scrollableParent) {
        // Scroll only the messages container, not the page
        requestAnimationFrame(() => {
          scrollableParent.scrollTop = scrollableParent.scrollHeight
        })
      }
    }

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100)
    
    return () => clearTimeout(timeoutId)
  }, [messages, isLoading])

  // Sequential layout - messages flow in order with consistent spacing
  const getMessageAlignment = (index: number, role: 'user' | 'assistant') => {
    if (role === 'user') {
      // User messages align to the right, positioned more prominently
      return 'ml-auto mr-8'
    } else {
      // Assistant messages align to the left, positioned more prominently (10% further from center)
      return 'mr-auto'
    }
  }
  
  // Get left margin for assistant messages (pushed further left from center)
  const getAssistantMargin = () => {
    // Push messages further left - using ml-16 (4rem/64px) for more distance from center
    return { marginLeft: '4rem' } // Significantly more left margin
  }

  const getIsOpen = useCallback((id: string) => {
    return openStates.get(id) ?? true // Default to open
  }, [openStates])

  const handleOpenChange = useCallback((id: string, open: boolean) => {
    setOpenStates(prev => {
      const next = new Map(prev)
      next.set(id, open)
      return next
    })
  }, [])

  const handleQuerySelect = useCallback((query: string) => {
    if (onQuerySelect) {
      onQuerySelect(query)
    }
  }, [onQuerySelect])

  const handleReload = useCallback(async (
    messageId: string,
    options?: ChatRequestOptions
  ) => {
    if (reload) {
      return reload(options)
    }
    return Promise.resolve(undefined)
  }, [reload])

  const handleAddToolResult = useCallback((params: { toolCallId: string; result: any }) => {
    // Tool results are handled automatically by the useChat hook
    // This is a placeholder for compatibility
    console.log('Tool result added:', params)
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="relative w-full flex flex-col gap-10" 
      style={{ 
        padding: '60px 80px',
        paddingBottom: '300px', // Extra space at bottom for input area
        minHeight: 'calc(100vh - 300px)' // Ensure container is tall enough
      }}
    >
      {messages.map((message, index) => {
        const role = message.role
        const messageId = message.id || `msg-${index}`
        
        if (role === 'user' || role === 'assistant') {
          const alignment = getMessageAlignment(index, role)
          const assistantStyle = role === 'assistant' ? getAssistantMargin() : {}
          
          return (
            <div
              key={messageId}
              className={cn('flex-shrink-0', alignment)}
              style={{
                maxWidth: role === 'assistant' ? '800px' : '600px', // Wider bot messages, keep user messages at 600px
                width: 'fit-content',
                ...assistantStyle
              }}
            >
              <RenderMessage
                message={message}
                messageId={messageId}
                getIsOpen={getIsOpen}
                onOpenChange={handleOpenChange}
                onQuerySelect={handleQuerySelect}
                chatId={chatId}
                reload={handleReload}
                addToolResult={handleAddToolResult}
              />
            </div>
          )
        }
        return null
      })}
      
      {isLoading && (
        <div 
          className="flex-shrink-0 mr-auto"
          style={{
            maxWidth: '600px',
            width: 'fit-content',
            marginLeft: '4rem' // Pushed further left (same as assistant messages)
          }}
        >
          <DottedBorderCard
            borderRadius="1.5rem"
            padding="p-8"
            className="shadow-xl"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </DottedBorderCard>
        </div>
      )}
      
      {/* Invisible element at the end to help with scrolling */}
      <div ref={messagesEndRef} style={{ height: '1px', width: '100%' }} />
    </div>
  )
}

