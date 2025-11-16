'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import {
  Home,
  Compass,
  Folder,
  TrendingUp,
  Image as ImageIcon,
  Video,
  GraduationCap,
  Pen,
  Plus,
  History
} from 'lucide-react'
import { IconLogo } from './ui/icons'
import UserMenu from './user-menu'
import GuestMenu from './guest-menu'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

/**
 * GlassmorphicHeader
 * Fixed header navbar with glassmorphic styling
 * Replaces the sidebar with horizontal navigation
 */

interface GlassmorphicHeaderProps {
  user: User | null
}

const navigationItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/spaces', icon: Folder, label: 'Spaces' },
  { href: '/finance', icon: TrendingUp, label: 'Finance' },
  { href: '/images', icon: ImageIcon, label: 'Images' },
  { href: '/videos', icon: Video, label: 'Videos' },
  { href: '/academic', icon: GraduationCap, label: 'Academic' },
  { href: '/writing', icon: Pen, label: 'Writing' }
]

export function GlassmorphicHeader({ user }: GlassmorphicHeaderProps) {
  const pathname = usePathname()
  const [showHistory, setShowHistory] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="max-w-[1800px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <IconLogo className="size-6" />
            <span className="font-semibold text-lg hidden sm:inline">Perplexity</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href ||
                              (item.href !== '/' && pathname?.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200',
                    'hover:bg-background/60 hover:shadow-neu-sm',
                    isActive
                      ? 'neu-raised text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <item.icon className="size-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Navigation - Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="neu-button rounded-xl"
              >
                <Compass className="size-4" />
                <span className="ml-2 text-sm">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 neu-card border-0"
            >
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navigationItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center gap-3 cursor-pointer">
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* New Thread Button */}
            <Link href="/">
              <Button
                size="sm"
                className="neu-button rounded-xl gap-2 hidden md:flex"
              >
                <Plus className="size-4" />
                <span className="text-sm">New Thread</span>
              </Button>
            </Link>

            {/* History Dropdown */}
            <DropdownMenu open={showHistory} onOpenChange={setShowHistory}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="neu-button rounded-xl hidden md:flex"
                >
                  <History className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 neu-card border-0 max-h-96 overflow-y-auto"
              >
                <DropdownMenuLabel>Recent Threads</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <History className="size-8 mx-auto mb-2 opacity-50" />
                  <p>Your recent conversations will appear here</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? <UserMenu user={user} /> : <GuestMenu />}
          </div>
        </div>
      </div>
    </header>
  )
}
