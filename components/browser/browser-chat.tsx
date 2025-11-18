'use client'

import { Model } from '@/lib/types/models'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, FileText, List, X } from 'lucide-react'
import Textarea from 'react-textarea-autosize'

interface BrowserChatProps {
  id: string
  models?: Model[]
  currentUrl: string
  pageTitle: string
  pageContent: string
}

export function BrowserChat({
  id,
  models,
  currentUrl,
  pageTitle,
  pageContent
}: BrowserChatProps) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // Call the chat API with browser context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: userMessage }
          ],
          id,
          browserContext: {
            url: currentUrl,
            title: pageTitle,
            content: pageContent.slice(0, 5000) // Limit content size
          }
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      // Add assistant response
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="font-semibold text-lg mb-1">AI Assistant</h2>
        <p className="text-sm text-muted-foreground">
          {currentUrl ? `Analyzing: ${pageTitle || 'Current page'}` : 'Ready to help you browse'}
        </p>
      </div>

      {/* Quick Actions */}
      {currentUrl && pageContent && (
        <div className="border-b p-3 flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction(`Summarize this page: ${pageTitle || currentUrl}`)}
            disabled={isLoading}
            className="text-xs"
          >
            <FileText className="h-3 w-3 mr-1" />
            Summarize
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction(`What are the key points from this page: ${pageTitle || currentUrl}`)}
            disabled={isLoading}
            className="text-xs"
          >
            <List className="h-3 w-3 mr-1" />
            Key Points
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction(`Explain the main concepts on this page: ${pageTitle || currentUrl}`)}
            disabled={isLoading}
            className="text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Explain
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Browser Assistant</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask me anything about the page you&apos;re viewing, or request a summary, explanation, or key points.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this page..."
            className="flex-1 resize-none min-h-[44px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
