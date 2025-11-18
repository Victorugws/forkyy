'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ChevronUp, ChevronDown } from 'lucide-react'

interface FindInPageProps {
  onClose: () => void
  onFind: (query: string, forward: boolean) => void
}

export function FindInPage({ onClose, onFind }: FindInPageProps) {
  const [query, setQuery] = useState('')
  const [matchCount, setMatchCount] = useState(0)
  const [currentMatch, setCurrentMatch] = useState(0)

  const handleFind = (forward: boolean) => {
    if (query) {
      onFind(query, forward)
      // In a real implementation, this would get the actual count from the iframe
      setMatchCount(5)
      setCurrentMatch(forward ? currentMatch + 1 : currentMatch - 1)
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Find in page..."
        className="h-8 max-w-xs"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleFind(!e.shiftKey)
          } else if (e.key === 'Escape') {
            onClose()
          }
        }}
        autoFocus
      />

      {matchCount > 0 && (
        <span className="text-xs text-muted-foreground">
          {currentMatch} of {matchCount}
        </span>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleFind(false)}
        disabled={!query}
      >
        <ChevronUp className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleFind(true)}
        disabled={!query}
      >
        <ChevronDown className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onClose}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
