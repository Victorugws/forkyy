import { NextRequest, NextResponse } from 'next/server'
import { getChatsPage } from '@/lib/actions/chat'
import { getCurrentUserId } from '@/lib/auth/get-current-user'

export const dynamic = 'force-static'
export const revalidate = false


export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    
    if (!userId) {
      return NextResponse.json({ chats: [], nextOffset: null })
    }

    const searchParams = req.nextUrl.searchParams
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const { chats, nextOffset } = await getChatsPage(userId, limit, offset)

    return NextResponse.json({ chats, nextOffset })
  } catch (error: any) {
    console.error('Error fetching chats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch chats' },
      { status: 500 }
    )
  }
}

