'use client'

import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
// import Link from 'next/link' // No longer needed directly here for Sign In button
import React from 'react'
// import { Button } from './ui/button' // No longer needed directly here for Sign In button
import GuestMenu from './guest-menu' // Import the new GuestMenu component
import UserMenu from './user-menu'
import { usePrePrompt } from './chat'

interface HeaderProps {
  user: User | null
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { open } = useSidebar()
  const isPrePrompt = usePrePrompt()

  return (
    <header
      className={cn(
        'absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-[1001] backdrop-blur lg:backdrop-blur-none bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear',
        open ? 'md:w-[calc(100%-var(--sidebar-width))] md:left-[var(--sidebar-width)]' : 'md:w-full md:left-0',
        'w-full'
      )}
    >
      {/* Sidebar trigger button */}
      <div className="flex items-center">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-2">
        {!isPrePrompt && (user ? <UserMenu user={user} /> : <GuestMenu />)}
      </div>
    </header>
  )
}

export default Header
