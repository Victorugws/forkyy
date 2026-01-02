'use client'

import { Home, Grid3x3, Bookmark, Settings, MessageCircle, Power } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function RealEstateSidebar() {
  const [activeItem, setActiveItem] = useState('home')

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'grid', icon: Grid3x3, label: 'Grid' },
    { id: 'bookmark', icon: Bookmark, label: 'Bookmarks' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'message', icon: MessageCircle, label: 'Messages' },
  ]

  return (
    <aside className="w-20 h-screen bg-white border-r border-[#E5E7EB] flex flex-col items-center py-6 flex-shrink-0">
      <nav className="flex flex-col items-center gap-8 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-lg transition-all',
                isActive
                  ? 'neu-raised text-[#111827]'
                  : 'text-[#6B7280] hover:bg-[#F3F4F6]'
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          )
        })}
      </nav>

      <div className="flex-1" />

      {/* Logout button */}
      <button
        className="w-12 h-12 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
        title="Logout"
      >
        <Power className="w-5 h-5" />
      </button>
    </aside>
  )
}
