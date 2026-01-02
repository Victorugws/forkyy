'use client'

import { useArtifact } from '@/components/artifact/artifact-context'
import { CHAT_ID } from '@/lib/constants'
import type { SearchResults as TypeSearchResults } from '@/lib/types'
import { useChat } from 'ai/react'
import type { ToolInvocation } from 'ai'
import { CollapsibleMessage } from './collapsible-message'
import { SearchSkeleton } from './default-skeleton'
import { SearchResults } from './search-results'
import { SearchResultsImageSection } from './search-results-image'
import { Section, ToolArgsSection } from './section'

interface SearchSectionProps {
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchSection({
  tool,
  isOpen,
  onOpenChange
}: SearchSectionProps) {
  const { status } = useChat({
    id: CHAT_ID
  })
  const isLoading = status === 'submitted' || status === 'streaming'

  const isToolLoading = tool.state === 'call'
  const searchResults: TypeSearchResults =
    tool.state === 'result' ? tool.result : undefined
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

  const query = tool.args?.query as string | undefined
  const deduplicatedQuery = deduplicateText(query)
  const includeDomains = tool.args?.includeDomains as string[] | undefined
  const includeDomainsString = includeDomains
    ? ` [${includeDomains.join(', ')}]`
    : ''

  const { open } = useArtifact()
  const header = (
    <button
      type="button"
      onClick={() => open({ type: 'tool-invocation', toolInvocation: tool })}
      className="flex items-center justify-between w-full text-left rounded-md p-1 -ml-1"
      title="Open details"
    >
      <ToolArgsSection
        tool="search"
        number={searchResults?.results?.length}
      >{`${deduplicatedQuery}${includeDomainsString}`}</ToolArgsSection>
    </button>
  )

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showIcon={false}
      transparentBackground={true}
      showBorder={false}
    >
      {searchResults &&
        searchResults.images &&
        searchResults.images.length > 0 && (
          <Section>
            <SearchResultsImageSection
              images={searchResults.images}
              query={deduplicatedQuery}
            />
          </Section>
        )}
      {isLoading && isToolLoading ? (
        <SearchSkeleton />
      ) : searchResults?.results ? (
        <Section title="Sources" transparentBackground={true}>
          <SearchResults results={searchResults.results} />
        </Section>
      ) : null}
    </CollapsibleMessage>
  )
}
