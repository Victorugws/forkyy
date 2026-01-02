'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/lib/types/tasks'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ModeTasksDropdownProps {
  mode: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
}

export function ModeTasksDropdown({ mode, icon: Icon, label, href }: ModeTasksDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && tasks.length === 0) {
      loadTasks()
    }
  }, [isOpen])

  const loadTasks = async () => {
    setIsLoading(true)
    try {
      // Fetch tasks from API (API handles authentication)
      const response = await fetch(`/api/tasks?mode=${encodeURIComponent(mode)}`)
      
      if (!response.ok) {
        // If unauthorized or not found, just return empty array
        if (response.status === 401 || response.status === 404) {
          setTasks([])
          return
        }
        throw new Error('Failed to fetch tasks')
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // Response is not JSON, return empty array
        setTasks([])
        return
      }
      
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Failed to load tasks:', error)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-2 py-2"
        >
          <div className="flex items-center gap-3 flex-1">
            <Icon className="size-4" />
            <span>{label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {isOpen && (
        <div className="ml-6 space-y-1">
          {isLoading ? (
            <div className="px-2 py-1 text-xs text-muted-foreground">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="px-2 py-1 text-xs text-muted-foreground">No saved tasks</div>
          ) : (
            tasks.map((task) => (
              <SidebarMenuItem key={task.id}>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs"
                  >
                    <span className="truncate">{task.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </div>
      )}
    </>
  )
}

