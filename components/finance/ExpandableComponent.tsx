'use client'

import { ReactNode } from 'react'

interface ExpandableComponentProps {
  id: string
  title: string
  type: string
  data: any
  children: ReactNode
  className?: string
  onExpand?: (query: string) => void
}

export function ExpandableComponent({
  id,
  title,
  type,
  data,
  children,
  className = '',
  onExpand
}: ExpandableComponentProps) {
  const handleExpand = () => {
    if (!onExpand) return

    // Create a clear description of the component data for the user message
    let dataDescription = ''
    if (typeof data === 'object' && data !== null) {
      // Format object data nicely
      if (Array.isArray(data)) {
        dataDescription = `Data (${data.length} items):\n${JSON.stringify(data.slice(0, 10), null, 2)}${data.length > 10 ? '\n...' : ''}`
      } else {
        dataDescription = `Data:\n${JSON.stringify(data, null, 2).slice(0, 2000)}`
      }
    } else {
      dataDescription = `Data: ${String(data).slice(0, 2000)}`
    }
    
    // Create the user message that represents the component
    const userMessage = `Finance Component: ${title}\nComponent Type: ${type}\n\n${dataDescription}`
    
    // Call the onExpand callback to show chat overlay
    onExpand(userMessage)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleExpand}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-[#e6ebf3] hover:bg-[#142536] hover:text-white hover:border-[#142536] text-foreground flex items-center justify-center text-xl font-bold transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110 shadow-sm"
        title="Open in chat for AI contextualization"
      >
        +
      </button>
      {children}
    </div>
  )
}

