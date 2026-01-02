'use client'

import { CHAT_ID } from '@/lib/constants'
import { useChat } from 'ai/react'
import type { JSONValue } from 'ai'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { CollapsibleMessage } from './collapsible-message'
import { Section } from './section'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export interface RelatedQuestionsProps {
  annotations: JSONValue[]
  onQuerySelect: (query: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface RelatedQuestionsAnnotation extends Record<string, JSONValue> {
  type: 'related-questions'
  data: {
    items: Array<{ query: string }>
  }
}

// Helper function to remove duplicated text patterns
const deduplicateText = (text: string): string => {
  if (!text) return text
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

export const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({
  annotations,
  onQuerySelect,
  isOpen,
  onOpenChange
}) => {
  const { status } = useChat({
    id: CHAT_ID
  })
  const isLoading = status === 'submitted' || status === 'streaming'

  if (!annotations) {
    return null
  }

  const lastRelatedQuestionsAnnotation = annotations[
    annotations.length - 1
  ] as RelatedQuestionsAnnotation

  const relatedQuestions = lastRelatedQuestionsAnnotation?.data
  if ((!relatedQuestions || !relatedQuestions.items) && !isLoading) {
    return null
  }

  if (relatedQuestions.items.length === 0 && isLoading) {
    return (
      <CollapsibleMessage
        role="assistant"
        isCollapsible={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        showIcon={false}
      >
        <Skeleton className="w-full h-6" />
      </CollapsibleMessage>
    )
  }

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showIcon={false}
      showBorder={false}
    >
      <Section title="Related" className="pt-0 pb-4">
        <div className="flex flex-col">
          {Array.isArray(relatedQuestions.items) ? (
            relatedQuestions.items
              ?.filter(item => item?.query !== '')
              .map((item, index) => (
                <div className="flex items-start w-full" key={index}>
                  <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-accent-foreground/50" />
                  <Button
                    variant="link"
                    className="flex-1 justify-start px-0 py-1 h-fit font-semibold text-accent-foreground/50 whitespace-normal text-left cursor-pointer"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onQuerySelect(deduplicateText(item?.query || ''))
                    }}
                  >
                    {deduplicateText(item?.query || '')}
                  </Button>
                </div>
              ))
          ) : (
            <div>Not an array</div>
          )}
        </div>
      </Section>
    </CollapsibleMessage>
  )
}
export default RelatedQuestions
