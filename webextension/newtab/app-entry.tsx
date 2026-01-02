/**
 * Extension Entry Point for New Tab
 * This is a client-side entry point that loads the React app in the extension context
 */

'use client'

import { BrowserClientEnhanced } from '@/components/browser/browser-client-enhanced'
import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'
import { useEffect, useState } from 'react'

export default function ExtensionNewTab() {
  const [models, setModels] = useState<any[]>([])
  const [id, setId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize models and ID
    async function init() {
      try {
        // For extension, we'll use a simplified model list
        // In a real scenario, you'd fetch this from your config
        const defaultModels = [
          {
            id: 'gpt-4',
            name: 'GPT-4',
            provider: 'openai',
          },
        ]
        setModels(defaultModels)
        setId(generateId())
      } catch (error) {
        console.error('Failed to initialize extension:', error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Forkyy...</p>
        </div>
      </div>
    )
  }

  return <BrowserClientEnhanced id={id} models={models} initialUrl="/" />
}

