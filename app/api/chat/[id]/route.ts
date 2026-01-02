import { NextRequest, NextResponse } from 'next/server'
import { getChat, deleteChat } from '@/lib/actions/chat'
import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { convertToUIMessages } from '@/lib/utils'

export const dynamic = 'force-static'
export const revalidate = false

// Required for static export with dynamic routes
export function generateStaticParams() {
  return []
}


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId()
    const { id: chatId } = await params

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    const chat = await getChat(chatId, userId || 'anonymous')

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // Convert ExtendedCoreMessage[] to UI Message format
    const uiMessages = convertToUIMessages(chat.messages || [])

    return NextResponse.json({
      ...chat,
      messages: uiMessages
    })
  } catch (error: any) {
    console.error('Error fetching chat:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch chat' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId()
    const { id: chatId } = await params

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    const result = await deleteChat(chatId, userId || 'anonymous')

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting chat:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete chat' },
      { status: 500 }
    )
  }
}

