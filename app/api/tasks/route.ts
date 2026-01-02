import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { createTask, getTasks } from '@/lib/actions/tasks'

export const dynamic = 'force-static'
export const revalidate = false


export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const mode = searchParams.get('mode')

    const tasks = await getTasks(userId)
    
    // Filter by mode if provided
    let filteredTasks = tasks
    if (mode) {
      const modeLower = mode.toLowerCase()
      filteredTasks = tasks.filter(task => {
        const lowerTitle = task.title.toLowerCase()
        const lowerPrompt = task.prompt.toLowerCase()
        
        // Check if task title or prompt contains mode keywords
        return lowerTitle.includes(modeLower) || 
               lowerPrompt.includes(modeLower) ||
               task.metadata?.mode?.toLowerCase() === modeLower
      })
    }

    // Limit to 10 most recent
    filteredTasks = filteredTasks.slice(0, 10)

    return NextResponse.json({ tasks: filteredTasks })
  } catch (error: any) {
    console.error('Get tasks error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, title } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const task = await createTask(prompt, userId, title)
    return NextResponse.json({ task })
  } catch (error: any) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

