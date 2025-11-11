

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import {
  Home,
  Compass,
  Folder,
  DollarSign,
  Image,
  Video,
  GraduationCap,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { ChatHistorySection } from './sidebar/chat-history-section'
import { ChatHistorySkeleton } from './sidebar/chat-history-skeleton'
import { IconLogo } from './ui/icons'
import { AppSidebarClient } from './app-sidebar-client'

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/spaces', label: 'Spaces', icon: Folder },
  { href: '/finance', label: 'Finance', icon: DollarSign },
  { href: '/images', label: 'Images', icon: Image },
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/academic', label: 'Academic', icon: GraduationCap }
]

export default function AppSidebar() {
  return (
    <AppSidebarClient>
      <Sidebar side="left" collapsible="offcanvas">
        <SidebarHeader className="flex flex-row justify-between items-center border-b">
          <Link href="/" className="flex items-center gap-2 px-4 py-4">
            <IconLogo className={cn('size-6')} />
            <span className="font-bold text-base">Perplexity</span>
          </Link>
          <SidebarTrigger className="mr-2" />
        </SidebarHeader>

        <SidebarContent className="flex flex-col h-full">
          {/* New Search Button */}
          <div className="px-3 py-3 border-b">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-4" />
              <span className="font-medium">New Search</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="px-3 py-4 border-b">
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Icon className="size-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="mb-2 px-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent
              </h3>
            </div>
            <Suspense fallback={<ChatHistorySkeleton />}>
              <ChatHistorySection />
            </Suspense>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </AppSidebarClient>
  )
}
