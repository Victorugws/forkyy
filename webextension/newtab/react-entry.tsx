/**
 * React Entry Point for Extension
 * Loads BrowserClientEnhanced component in extension context
 */

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserClientEnhanced } from '@/components/browser/browser-client-enhanced'
import { Providers } from '@/app/providers'
import { ThemeProvider } from '@/components/theme-provider'
import '@/app/globals.css'
// Import TargetCursor CSS
import '@/components/reactbits/animations/TargetCursor.css'

// Extension-specific initialization
function ExtensionApp() {
  const [mounted, setMounted] = React.useState(false)
  const [models, setModels] = React.useState<any[]>([])
  const [id, setId] = React.useState<string>('')

  React.useEffect(() => {
    // Initialize on mount
    setMounted(true)
    
    // Generate ID
    const generateId = () => {
      return Math.random().toString(36).substring(2) + Date.now().toString(36)
    }
    setId(generateId())

    // Load models (simplified for extension)
    // In a real scenario, you'd fetch from your config
    setModels([
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
      },
    ])
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Forkyy...</p>
        </div>
      </div>
    )
  }

  return (
    <Providers>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <BrowserClientEnhanced 
          id={id} 
          models={models} 
          initialUrl="/" 
        />
      </ThemeProvider>
    </Providers>
  )
}

// Initialize React app with error handling
try {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    const root = createRoot(rootElement)
    root.render(<ExtensionApp />)
    console.log('✅ Forkyy React app initialized')
  } else {
    console.error('❌ Root element not found')
    document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>Error</h1><p>Root element not found</p></div>'
  }
} catch (error) {
  console.error('❌ Failed to initialize React app:', error)
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui;">
        <h1>Error Loading App</h1>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
          Check the browser console (F12) for details.
        </p>
      </div>
    `
  }
}

