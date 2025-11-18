'use client'

import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Suspense, lazy } from 'react'

interface ConditionalLayoutProps {
  children: React.ReactNode
  user: User | null
}

// Lazy load the chat layout to avoid importing AI SDK components on homepage
const ChatLayout = lazy(() => import('./chat-layout'))

export function ConditionalLayout({ children, user }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  if (isHomePage) {
    // Browser Home: No sidebar or header, full-screen layout
    return (
      <main className="flex flex-1 min-h-screen w-full">
        {children}
      </main>
    )
  }

  // Chat/Search pages: Lazy load the layout with sidebar and header
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    }>
      <ChatLayout user={user}>
        {children}
      </ChatLayout>
    </Suspense>
  )
}
