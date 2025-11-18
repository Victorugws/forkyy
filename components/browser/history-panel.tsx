'use client'

import { BrowserHistory } from '@/lib/types/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Search, Clock, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface HistoryPanelProps {
  history: BrowserHistory[]
  onNavigate: (url: string) => void
  onClear: () => void
  onClose: () => void
}

export function HistoryPanel({
  history,
  onNavigate,
  onClear,
  onClose,
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredHistory = useMemo(() => {
    if (!searchQuery) return history

    const query = searchQuery.toLowerCase()
    return history.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query)
    )
  }, [history, searchQuery])

  // Group by date
  const groupedHistory = useMemo(() => {
    const groups: Record<string, BrowserHistory[]> = {}
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000

    filteredHistory.forEach(item => {
      const diff = now - item.visitedAt
      let key: string

      if (diff < oneDay) {
        key = 'Today'
      } else if (diff < 2 * oneDay) {
        key = 'Yesterday'
      } else if (diff < 7 * oneDay) {
        key = 'Last 7 Days'
      } else if (diff < 30 * oneDay) {
        key = 'Last Month'
      } else {
        key = 'Older'
      }

      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })

    return groups
  }, [filteredHistory])

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h2 className="font-semibold">History</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Clear Button */}
      <div className="px-4 py-2 border-b">
        <Button
          variant="destructive"
          size="sm"
          onClick={onClear}
          className="w-full"
        >
          <Trash2 className="h-3 w-3 mr-2" />
          Clear All History
        </Button>
      </div>

      {/* History Items */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedHistory).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {group}
              </h3>
              <div className="space-y-1">
                {items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(item.url)}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer group"
                  >
                    {item.favicon ? (
                      <img src={item.favicon} alt="" className="w-4 h-4 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 bg-muted-foreground/20 rounded flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.url}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.visitedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No history found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
