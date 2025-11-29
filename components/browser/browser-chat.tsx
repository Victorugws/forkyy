'use client'

import { Model } from '@/lib/types/models'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, FileText, List, X } from 'lucide-react'
import Textarea from 'react-textarea-autosize'
import { ThoughtProcess } from '@/components/ThoughtProcess'

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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b p-6">
        <h2 className="font-semibold text-base mb-1.5">AI Assistant</h2>
        <p className="text-xs text-gray-600">
          {currentUrl ? `Analyzing: ${pageTitle || 'Current page'}` : 'Ready to help you browse'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="mb-6">
              <Sparkles className="h-16 w-16 text-gray-800 mx-auto" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Browser Assistant</h3>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-6 py-4 w-full">
                  <ThoughtProcess isSearching={false} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-6">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this page..."
            className="w-full resize-none min-h-[48px] max-h-[200px] pr-12 py-3 px-4 rounded-xl border border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 bg-gray-50"
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
            className="absolute right-2 bottom-2 h-8 w-8 rounded-lg"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
