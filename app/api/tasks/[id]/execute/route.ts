import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { getTask } from '@/lib/actions/tasks'
import { TaskExecutor } from '@/lib/agents/task-executor'

export const dynamic = 'force-static'
export const revalidate = false

// Required for static export with dynamic routes
export function generateStaticParams() {
  return []
}


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const task = await getTask(id)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { model, searchMode } = await req.json()

    const executor = new TaskExecutor({
      taskId: id,
      userId,
      model,
      searchMode
    })

    // Execute task asynchronously
    executor.execute().catch(error => {
      console.error('Task execution error:', error)
    })

    return NextResponse.json({ 
      success: true,
      message: 'Task execution started'
    })
  } catch (error: any) {
    console.error('Execute task error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

