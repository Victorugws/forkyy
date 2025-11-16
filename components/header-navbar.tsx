'use client'

import { cn } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import {
  Home,
  Compass,
  Folder,
  TrendingUp,
  Image as ImageIcon,
  Video,
  GraduationCap,
  Pen
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconLogo } from './ui/icons'
import GuestMenu from './guest-menu'
import UserMenu from './user-menu'

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

interface HeaderNavbarProps {
  user: User | null
}

export function HeaderNavbar({ user }: HeaderNavbarProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-8">
          <IconLogo className="size-6" />
          <span className="font-semibold text-lg hidden md:inline-block">Morphic</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 flex-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="size-4" />
                <span className="hidden lg:inline-block">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-2 ml-auto">
          {user ? <UserMenu user={user} /> : <GuestMenu />}
        </div>
      </div>
    </header>
  )
}

export default HeaderNavbar
