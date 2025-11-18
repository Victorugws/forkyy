'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Sparkles } from 'lucide-react'
import { generateId } from 'ai'

export function QuickSearch() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to the AI search page
      const chatId = generateId()
      router.push(`/search/${chatId}?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask AI anything or search the web..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-24 py-6 text-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 gap-2"
            disabled={!query.trim()}
          >
            <Sparkles className="h-4 w-4" />
            Search
          </Button>
        </div>
      </form>

      <div className="flex gap-2 mt-3 flex-wrap justify-center">
        {['Latest tech news', 'Weather forecast', 'Stock market'].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => setQuery(suggestion)}
            className="text-xs bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}
