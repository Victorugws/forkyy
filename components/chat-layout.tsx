'use client'

import AppSidebar from '@/components/app-sidebar'
import ArtifactRoot from '@/components/artifact/artifact-root'
import Header from '@/components/header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { User } from '@supabase/supabase-js'

interface ChatLayoutProps {
  children: React.ReactNode
  user: User | null
}

export default function ChatLayout({ children, user }: ChatLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <Header user={user} />
        <main className="flex flex-1 min-h-0">
          <ArtifactRoot>{children}</ArtifactRoot>
        </main>
      </div>
    </SidebarProvider>
  )
}
