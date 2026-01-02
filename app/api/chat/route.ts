import { NextRequest } from 'next/server'
import { getModels } from '@/lib/config/models'
import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream'
import { generateId } from 'ai'

export const dynamic = 'force-static'
export const revalidate = false

// Use Node.js runtime instead of Edge because Redis client requires Node.js built-in modules

export async function POST(req: NextRequest) {
  try {
    const { messages, id: chatId, model: modelId } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Messages are required', { status: 400 })
    }

    const userId = await getCurrentUserId()
    const finalChatId = chatId || generateId()
    
    // Get models and find the specified one, or use default (prefer Grok)
    const models = await getModels()
    const model = modelId 
      ? models.find(m => `${m.providerId}:${m.id}` === modelId)
      : models.find(m => m.enabled && m.providerId === 'xai') || models.find(m => m.enabled) || models[0]

    if (!model) {
      return new Response('No model available', { status: 500 })
    }

    // Create streaming response
    // Enable search mode so Grok can use Tavily to get images, sources, etc.
    const streamResponse = createToolCallingStreamResponse({
      messages,
      model,
      chatId: finalChatId,
      searchMode: true, // Enable search mode to allow Grok to use Tavily for images and sources
      userId
    })

    return streamResponse
  } catch (error: any) {
    console.error('Chat API error:', error)
    return new Response(
      error.message || 'Internal server error',
      { status: 500 }
    )
  }
}

