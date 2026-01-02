'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DottedBorderCard } from '@/components/ui/dotted-border-card'
import { SearchResultItem } from '@/lib/types'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export interface SearchResultsProps {
  results: SearchResultItem[]
  displayMode?: 'grid' | 'list'
}

export function SearchResults({
  results,
  displayMode = 'grid'
}: SearchResultsProps) {
  // State to manage whether to display the results
  const [showAllResults, setShowAllResults] = useState(false)

  // Inject CSS to force transparent background
  useEffect(() => {
    const styleId = 'search-results-transparent-override'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .search-results-container {
          background: transparent !important;
          background-color: transparent !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const handleViewMore = () => {
    setShowAllResults(true)
  }

  // Logic for grid mode
  const displayedGridResults = showAllResults ? results : results.slice(0, 3)
  const additionalResultsCount = results.length > 3 ? results.length - 3 : 0
  const displayUrlName = (url: string) => {
    const hostname = new URL(url).hostname
    const parts = hostname.split('.')
    return parts.length > 2 ? parts.slice(1, -1).join('.') : parts[0]
  }

  // --- List Mode Rendering ---
  if (displayMode === 'list') {
    return (
      <div className="search-results-container flex flex-col gap-2 -ml-2" style={{ backgroundColor: 'transparent', background: 'none' }}>
        {results.map((result, index) => (
          <Link
            href={result.url}
            key={index}
            passHref
            target="_blank"
            className="block"
          >
            <DottedBorderCard
              borderRadius="0.5rem"
              padding="p-2"
              background="bg-transparent hover:bg-white/10 transition-colors"
              className="w-full"
              noShadow={true}
            >
              <div className="flex items-start space-x-2">
                <Avatar className="h-4 w-4 mt-1 flex-shrink-0">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${
                      new URL(result.url).hostname
                    }`}
                    alt={new URL(result.url).hostname}
                  />
                  <AvatarFallback className="text-xs">
                    {new URL(result.url).hostname[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden space-y-0.5">
                  <p className="text-sm font-medium line-clamp-1">
                    {result.title || new URL(result.url).pathname}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {result.content}
                  </p>
                  <div className="text-xs text-muted-foreground/80 mt-1 truncate">
                    <span className="underline">
                      {new URL(result.url).hostname}
                    </span>{' '}
                    - {index + 1}
                  </div>
                </div>
              </div>
            </DottedBorderCard>
          </Link>
        ))}
      </div>
    )
  }

  // --- Grid Mode Rendering (Existing Logic) ---
  return (
    <div className="search-results-container flex flex-wrap -m-1 -ml-2" style={{ backgroundColor: 'transparent', background: 'none' }}>
      {displayedGridResults.map((result, index) => (
        <div className="w-1/2 md:w-1/4 p-1" key={index}>
          <Link href={result.url} passHref target="_blank">
            <DottedBorderCard
              borderRadius="0.5rem"
              padding="p-2"
              background="bg-transparent hover:bg-white/10 transition-colors"
              className="flex-1 h-full flex flex-col justify-between"
              noShadow={true}
            >
              <p className="text-xs line-clamp-2 min-h-[2rem]">
                {result.title || result.content}
              </p>
              <div className="mt-2 flex items-center space-x-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${
                      new URL(result.url).hostname
                    }`}
                    alt={new URL(result.url).hostname}
                  />
                  <AvatarFallback>
                    {new URL(result.url).hostname[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs opacity-60 truncate">
                  {`${displayUrlName(result.url)} - ${index + 1}`}
                </div>
              </div>
            </DottedBorderCard>
          </Link>
        </div>
      ))}
      {!showAllResults && additionalResultsCount > 0 && (
        <div className="w-1/2 md:w-1/4 p-1">
          <DottedBorderCard
            borderRadius="0.5rem"
            padding="p-2"
            background="bg-transparent"
            className="flex-1 flex h-full items-center justify-center"
            noShadow={true}
          >
            <Button
              variant={'link'}
              className="text-muted-foreground"
              onClick={handleViewMore}
            >
              View {additionalResultsCount} more
            </Button>
          </DottedBorderCard>
        </div>
      )}
    </div>
  )
}
