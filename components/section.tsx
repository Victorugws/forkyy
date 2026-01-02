'use client'

import { cn } from '@/lib/utils'
import {
  BookCheck,
  Check,
  File,
  Film,
  Image,
  MessageCircleMore,
  Newspaper,
  Repeat2,
  Search
} from 'lucide-react'
import React from 'react'
import { ToolBadge } from './tool-badge'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { StatusIndicator } from './ui/status-indicator'

type SectionProps = {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  title?: string
  separator?: boolean
  transparentBackground?: boolean
}

// Helper function to remove duplicated text patterns
const deduplicateText = (text: string | undefined): string => {
  if (!text) return ''
  // Remove patterns where text is repeated consecutively
  // Handle both cases: "texttext" and "text text" (with spaces)
  let deduplicated = text
  
  // First, try to match exact duplicates without spaces
  deduplicated = deduplicated.replace(/(.{10,}?)\1+/g, '$1')
  
  // Then, try to match duplicates with whitespace between them
  deduplicated = deduplicated.replace(/(.{10,}?)\s+\1+/g, '$1')
  
  // Also handle shorter patterns (for things like "SourcesSources")
  deduplicated = deduplicated.replace(/(.{3,}?)\1+/g, '$1')
  
  return deduplicated.trim()
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  size = 'md',
  title,
  separator = false,
  transparentBackground = false
}) => {
  const deduplicatedTitle = title ? deduplicateText(title) : undefined
  const iconSize = 16
  const iconClassName = 'mr-1.5 text-muted-foreground'
  let icon: React.ReactNode
  let type: 'text' | 'badge' = 'text'
  switch (title) {
    case 'Images':
      // eslint-disable-next-line jsx-a11y/alt-text
      icon = <Image size={iconSize} className={iconClassName} />
      break
    case 'Videos':
      icon = <Film size={iconSize} className={iconClassName} />
      type = 'badge'
      break
    case 'Sources':
      icon = <Newspaper size={iconSize} className={iconClassName} />
      type = 'badge'
      break
    case 'Answer':
      icon = <BookCheck size={iconSize} className={iconClassName} />
      break
    case 'Related':
      icon = <Repeat2 size={iconSize} className={iconClassName} />
      break
    case 'Follow-up':
      icon = <MessageCircleMore size={iconSize} className={iconClassName} />
      break
    case 'Content':
      icon = <File size={iconSize} className={iconClassName} />
      type = 'badge'
      break
    default:
      icon = <Search size={iconSize} className={iconClassName} />
  }

  return (
    <>
      {separator && <Separator className="my-2 bg-primary/10" />}
      <section
        className={cn(
          ` ${size === 'sm' ? 'py-1' : size === 'lg' ? 'py-4' : 'py-2'}`,
          transparentBackground && 'bg-transparent',
          className
        )}
        style={transparentBackground ? { backgroundColor: 'transparent', background: 'none' } : undefined}
      >
        {deduplicatedTitle && type === 'text' && (
          <h2 className="flex items-center leading-none py-2">
            {icon}
            {deduplicatedTitle}
          </h2>
        )}
        {deduplicatedTitle && type === 'badge' && (
          <Badge variant="secondary" className="mb-2">
            {icon}
            {deduplicatedTitle}
          </Badge>
        )}
        {children}
      </section>
    </>
  )
}

export function ToolArgsSection({
  children,
  tool,
  number
}: {
  children: React.ReactNode
  tool: string
  number?: number
}) {
  return (
    <Section
      size="sm"
      className="py-0 flex items-center justify-between w-full"
    >
      <ToolBadge tool={tool}>{children}</ToolBadge>
      {number && (
        <StatusIndicator icon={Check} iconClassName="text-green-500">
          {number} results
        </StatusIndicator>
      )}
    </Section>
  )
}
