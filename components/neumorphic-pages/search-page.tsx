'use client'

import { useEffect, useState } from 'react'
import { Chat } from '@/components/chat'
import { generateId } from 'ai'

/**
 * Neumorphic Search Page Component
 * Uses the morphic Chat component for search
 */

interface NeumorphicSearchPageProps {
  url?: string
}

export function NeumorphicSearchPage({ url }: NeumorphicSearchPageProps = {}) {
  const [query, setQuery] = useState<string>('')
  const [chatId, setChatId] = useState<string>('')

  useEffect(() => {
    // Extract query and ID from URL
    if (typeof window !== 'undefined') {
      const searchUrl = url || window.location.href
      let params: URLSearchParams
      let pathId = ''

      try {
        // Try to parse as full URL first
        const urlObj = new URL(searchUrl, window.location.origin)
        params = new URLSearchParams(urlObj.search)

        // Extract ID from path like /search/[id]
        const pathMatch = urlObj.pathname.match(/\/search\/([^\/]+)/)
        pathId = pathMatch?.[1] || ''
      } catch {
        // If not a full URL, treat it as a path
        const searchPart = searchUrl.includes('?') ? searchUrl.split('?')[1] : ''
        params = new URLSearchParams(searchPart)

        // Extract ID from path
        const pathMatch = searchUrl.match(/\/search\/([^\/\?]+)/)
        pathId = pathMatch?.[1] || ''
      }

      const q = params.get('q') || ''
      setQuery(q)
      setChatId(pathId || generateId())
    }
  }, [url])

  if (!chatId) {
    return null
  }

  return (
    <div className="h-full w-full">
      <Chat id={chatId} savedMessages={[]} query={query} />
    </div>
  )
}
