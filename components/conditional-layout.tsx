'use client'

import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import components that depend on AI SDK (which has zod issues)
const AppSidebar = dynamic(() => import('@/components/app-sidebar'), {
  ssr: false,
})
const Header = dynamic(() => import('@/components/header'), {
  ssr: false,
})
const ArtifactRoot = dynamic(() => import('@/components/artifact/artifact-root'), {
  ssr: false,
})
const SidebarProvider = dynamic(
  () => import('@/components/ui/sidebar').then((mod) => ({ default: mod.SidebarProvider })),
  { ssr: false }
)

interface ConditionalLayoutProps {
  children: React.ReactNode
  user: User | null
}

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

  // Chat/Search pages: Show sidebar and header
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header user={user} />
          <main className="flex flex-1 min-h-0">
            <ArtifactRoot>{children}</ArtifactRoot>
          </main>
        </div>
      </SidebarProvider>
    </Suspense>
  )
}
