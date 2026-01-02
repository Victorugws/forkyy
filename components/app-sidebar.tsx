'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import {
  Plus,
  Heart,
  TrendingUp,
  Sprout,
  GraduationCap,
  Building2,
  ShoppingBag,
  Zap,
  UtensilsCrossed,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { ChatHistoryClient } from './sidebar/chat-history-client'
import { ModeTasksDropdown } from './sidebar/mode-tasks-dropdown'
import { IconLogo } from './ui/icons'

const organisationModes = [
  { mode: 'healthcare', icon: Heart, label: 'Health' },
  { mode: 'business', icon: Briefcase, label: 'Business' },
  { mode: 'agriculture', icon: Sprout, label: 'Agriculture' },
  { mode: 'education', icon: GraduationCap, label: 'Education' },
  { mode: 'realestate', icon: Building2, label: 'Real Estate' },
  { mode: 'ecommerce', icon: ShoppingBag, label: 'E-commerce' },
  { mode: 'energy', icon: Zap, label: 'Energy' },
  { mode: 'foodbeverage', icon: UtensilsCrossed, label: 'Food & Beverage' },
  { mode: 'finance', icon: TrendingUp, label: 'Finance' },
  { mode: 'strategy', icon: Briefcase, label: 'Strategy' }
]

export default function AppSidebar() {
  return (
    <Sidebar side="left" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <IconLogo className={cn('size-5')} />
          <span className="font-semibold text-sm">ORB AI</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-2 py-4 h-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>New Thread</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs text-muted-foreground px-2 mb-2">
            Organisations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {organisationModes.map((item) => (
                <ModeTasksDropdown
                  key={item.mode}
                  mode={item.mode}
                  icon={item.icon}
                  label={item.label}
                  href={`/?mode=${item.mode}`}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="flex-1 overflow-y-auto mt-4">
          <div className="bg-gray-500/20 backdrop-blur-xl rounded-lg border border-gray-300/30 p-3 shadow-lg">
          <SidebarGroupLabel className="text-xs text-muted-foreground px-2 mb-2">
              Recent conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ChatHistoryClient />
          </SidebarGroupContent>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
